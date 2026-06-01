import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/api';

export default function ProfileDrawer({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();
  
  // State for form fields
  const [name, setName] = useState(user?.name || '');
  const [about, setAbout] = useState(user?.about || 'Hey there! I am using MultiChat.');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
  
  // Editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null);
  
  // Update local state if user context changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAbout(user.about || 'Hey there! I am using MultiChat.');
      setProfilePicture(user.profilePicture || null);
    }
  }, [user]);

  const handleSaveProfile = async (updates) => {
    setLoading(true);
    try {
      const res = await userApi.updateProfile(updates);
      updateUser(res.data);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const saveName = () => {
    if (name.trim() && name !== user?.name) {
      handleSaveProfile({ name });
    }
    setIsEditingName(false);
  };

  const saveAbout = () => {
    if (about.trim() && about !== user?.about) {
      handleSaveProfile({ about });
    }
    setIsEditingAbout(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Must be an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress the image to a max size (e.g., 200x200) to save DB space
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setProfilePicture(dataUrl);
        handleSaveProfile({ profilePicture: dataUrl });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`profile-drawer ${isOpen ? 'open' : ''}`}>
      <div className="profile-drawer-header">
        <button className="back-btn" onClick={onClose}>
          ←
        </button>
        <h2>Profile</h2>
      </div>

      <div className="profile-drawer-content">
        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <div 
            className="profile-picture-container" 
            onClick={() => fileInputRef.current.click()}
          >
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="profile-picture" />
            ) : (
              <div className="profile-picture-placeholder">
                <span className="icon">📷</span>
                <span className="text">ADD PHOTO</span>
              </div>
            )}
            <div className="profile-picture-overlay">
              <span className="icon">📷</span>
              <span className="text">CHANGE</span>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/jpeg, image/png, image/webp"
            onChange={handleImageUpload}
          />
        </div>

        {/* Name Section */}
        <div className="profile-field-section">
          <div className="field-label">Your Name</div>
          {isEditingName ? (
            <div className="field-edit-mode">
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                autoFocus
                maxLength={25}
              />
              <button className="save-btn" onClick={saveName} disabled={loading}>✓</button>
            </div>
          ) : (
            <div className="field-view-mode">
              <div className="field-value">{name}</div>
              <button className="edit-btn" onClick={() => setIsEditingName(true)}>✏️</button>
            </div>
          )}
          <div className="field-hint">
            This is not your username or pin. This name will be visible to your MultiChat contacts.
          </div>
        </div>

        {/* About Section */}
        <div className="profile-field-section">
          <div className="field-label">About</div>
          {isEditingAbout ? (
            <div className="field-edit-mode">
              <input 
                type="text" 
                value={about} 
                onChange={(e) => setAbout(e.target.value)}
                autoFocus
                maxLength={100}
              />
              <button className="save-btn" onClick={saveAbout} disabled={loading}>✓</button>
            </div>
          ) : (
            <div className="field-view-mode">
              <div className="field-value">{about}</div>
              <button className="edit-btn" onClick={() => setIsEditingAbout(true)}>✏️</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
