import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/api';
import { useAuth } from '../context/AuthContext';

const LANGUAGES = [
  { code: 'en', name: '🇮🇳 English' },
  { code: 'hi', name: '🇮🇳 Hindi (हिन्दी)' },
  { code: 'ta', name: '🇮🇳 Tamil (தமிழ்)' },
  { code: 'te', name: '🇮🇳 Telugu (తెలుగు)' },
  { code: 'ml', name: '🇮🇳 Malayalam (മലയാളം)' },
  { code: 'kn', name: '🇮🇳 Kannada (ಕನ್ನಡ)' },
  { code: 'mr', name: '🇮🇳 Marathi (मराठी)' },
  { code: 'gu', name: '🇮🇳 Gujarati (ગુજરાતી)' },
  { code: 'bn', name: '🇮🇳 Bengali (বাংলা)' },
  { code: 'pa', name: '🇮🇳 Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'or', name: '🇮🇳 Odia (ଓଡ଼ିଆ)' },
  { code: 'as', name: '🇮🇳 Assamese (অসমীয়া)' },
  { code: 'ur', name: '🇮🇳 Urdu (اردو)' },
  { code: 'ne', name: '🇮🇳 Nepali (नेपाली)' },
];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.register({ name, email, password, preferredLanguage });
      login(res.data);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-icon">
          <span>🌐</span>
        </div>
        <h1>Create Account</h1>
        <p className="subtitle">Join and chat in any language, seamlessly</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="language">Preferred Language</label>
            <select
              id="language"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
