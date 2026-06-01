import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi, messageApi } from '../api/api';
import { connectWebSocket, disconnectWebSocket, sendMarkAsRead, setConnectionStatusCallback } from '../utils/websocket';
import { getLangName, getAvatarGradient } from '../utils/languages';
import ProfileDrawer from './ProfileDrawer';
import UserList from './UserList';
import ChatWindow from './ChatWindow';

export default function ChatLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [typingUsers, setTypingUsers] = useState({}); // { senderId: timeout }
  const [unreadCounts, setUnreadCounts] = useState({}); // { otherId: count }
  const [lastMessages, setLastMessages] = useState({}); // { otherId: message }
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // ... (keep the rest the same until render) ...
  const selectedUserRef = useRef(selectedUser);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const typingTimeoutsRef = useRef({});

  // Load users & unread counts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await userApi.getAll();
        setUsers(res.data);

        // Load unread counts for each user
        const counts = {};
        const lastMsgs = {};
        for (const u of res.data) {
          try {
            const [unread, history] = await Promise.all([
              messageApi.getUnreadCount(u.id, user.userId),
              messageApi.getHistory(user.userId, u.id),
            ]);
            counts[u.id] = unread.data.count;
            if (history.data.length > 0) {
              lastMsgs[u.id] = history.data[history.data.length - 1];
            }
          } catch {
            // Ignore individual failures
          }
        }
        setUnreadCounts(counts);
        setLastMessages(lastMsgs);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [user.userId]);

  // Handle WebSocket messages
  const handleMessageReceived = useCallback((msg) => {
    const currentSelectedUser = selectedUserRef.current;

    // Handle typing indicator
    if (msg.type === 'typing') {
      setTypingUsers((prev) => {
        const existing = typingTimeoutsRef.current[msg.senderId];
        if (existing) clearTimeout(existing);

        const timeout = setTimeout(() => {
          setTypingUsers((p) => {
            const next = { ...p };
            delete next[msg.senderId];
            return next;
          });
          delete typingTimeoutsRef.current[msg.senderId];
        }, 2500);

        typingTimeoutsRef.current[msg.senderId] = timeout;
        return { ...prev, [msg.senderId]: true };
      });
      return;
    }

    // Handle read receipt
    if (msg.type === 'read') {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === user.userId && m.receiverId === msg.senderId
            ? { ...m, status: 'read' }
            : m
        )
      );
      return;
    }

    // Handle regular message
    const otherUserId = msg.senderId === user.userId ? msg.receiverId : msg.senderId;

    // Update last message for sidebar
    setLastMessages((prev) => ({ ...prev, [otherUserId]: msg }));

    const isCurrentChat =
      currentSelectedUser &&
      ((msg.senderId === currentSelectedUser.id && msg.receiverId === user.userId) ||
        (msg.senderId === user.userId && msg.receiverId === currentSelectedUser.id));

    if (isCurrentChat) {
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) =>
            m.timestamp === msg.timestamp &&
            m.senderId === msg.senderId &&
            m.originalMessage === msg.originalMessage
        );
        if (isDuplicate) return prev;
        return [...prev, msg];
      });

      // Auto mark as read if the message is from the selected user
      if (msg.senderId === currentSelectedUser.id) {
        sendMarkAsRead(msg.senderId, user.userId);
      }
    } else {
      // Not current chat — increment unread count
      if (msg.senderId !== user.userId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1,
        }));
      }
    }
  }, [user?.userId]);

  // Connect WebSocket
  useEffect(() => {
    if (!user?.userId) return;

    setConnectionStatusCallback(setConnectionStatus);
    connectWebSocket(user.userId, handleMessageReceived);

    return () => {
      disconnectWebSocket();
    };
  }, [user?.userId]);

  const handleLogout = () => {
    disconnectWebSocket();
    logout();
    navigate('/login');
  };

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setMessages([]);
    // Clear unread count
    setUnreadCounts((prev) => ({ ...prev, [u.id]: 0 }));
    // Mark messages as read
    messageApi.markAsRead(u.id, user.userId).catch(() => {});
  };

  if (loading) {
    return (
      <div className="chat-layout">
        <div className="loading-container" style={{ width: '100%' }}>
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className="sidebar" style={{ position: 'relative', overflow: 'hidden' }}>
        <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        <div className="sidebar-header">
          <div 
            className="current-user-profile" 
            onClick={() => setIsProfileOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
            title="Profile"
          >
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="user-avatar" style={{ objectFit: 'cover' }} />
            ) : (
              <div className={`user-avatar ${getAvatarGradient(user.userId)}`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 style={{ fontSize: '1.05rem', margin: 0, padding: 0 }}>{user.name}</h2>
          </div>
          <div className="header-actions">
            <span className="user-lang-badge" title="Translation target language">
              {getLangName(user.preferredLanguage)}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <UserList
          users={users}
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
          typingUsers={typingUsers}
          unreadCounts={unreadCounts}
          lastMessages={lastMessages}
          currentUserId={user.userId}
        />
      </div>

      {/* Connection Status */}
      {connectionStatus && connectionStatus !== 'connected' && (
        <div className={`connection-bar ${connectionStatus}`} style={{
          position: 'absolute', top: 0, left: 380, right: 0, zIndex: 100
        }}>
          {connectionStatus === 'connecting' && (
            <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></div> Connecting...</>
          )}
          {connectionStatus === 'disconnected' && (
            <><span>⚠</span> Connection lost. Reconnecting...</>
          )}
        </div>
      )}

      {/* Chat Area */}
      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        setMessages={setMessages}
        typingUsers={typingUsers}
      />
    </div>
  );
}
