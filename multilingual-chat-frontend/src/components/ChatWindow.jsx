import { useState, useEffect, useRef } from 'react';
import { messageApi } from '../api/api';
import { sendMessage, emitTyping, sendMarkAsRead } from '../utils/websocket';
import { useAuth } from '../context/AuthContext';
import { getLangName, getLangFlag, getAvatarGradient, formatDateSeparator } from '../utils/languages';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ selectedUser, messages, setMessages, typingUsers }) {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const isTyping = selectedUser && typingUsers[selectedUser.id];

  // Load chat history when user is selected
  useEffect(() => {
    if (!selectedUser) return;

    const loadHistory = async () => {
      setLoading(true);
      try {
        const res = await messageApi.getHistory(user.userId, selectedUser.id);
        setMessages(res.data);
        // Mark messages as read
        sendMarkAsRead(selectedUser.id, user.userId);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [selectedUser?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedUser) return;

    sendMessage({
      senderId: user.userId,
      receiverId: selectedUser.id,
      content: inputValue.trim(),
    });

    setInputValue('');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (selectedUser && e.target.value.trim()) {
      emitTyping(user.userId, selectedUser.id);
    }
  };

  // Build date-separated message groups
  const getDateFromTimestamp = (ts) => {
    if (!ts) return '';
    return ts.split(' ')[0] || '';
  };

  // Placeholder when no user is selected
  if (!selectedUser) {
    return (
      <div className="chat-window">
        <div className="chat-placeholder">
          <div className="icon">💬</div>
          <h3>MultiChat — Multilingual Messaging</h3>
          <p>Select a contact from the sidebar to start chatting. Messages are automatically translated in real time.</p>
          <div className="feature-badges">
            <span className="feature-badge">🌐 130+ Languages</span>
            <span className="feature-badge">⚡ Real-Time Translation</span>
            <span className="feature-badge">🔒 End-to-End Secure</span>
          </div>
        </div>
      </div>
    );
  }

  const avatarGradient = getAvatarGradient(selectedUser.id);

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-header">
        <div className={`user-avatar ${avatarGradient}`}>
          {selectedUser.name.charAt(0).toUpperCase()}
        </div>
        <div className="chat-user-info">
          <h3>{selectedUser.name}</h3>
          {isTyping ? (
            <span className="typing-text">typing...</span>
          ) : (
            <span>
              {getLangFlag(selectedUser.preferredLanguage)}{' '}
              {getLangName(selectedUser.preferredLanguage)}
            </span>
          )}
        </div>
        <div className="translation-info">
          🔄 {getLangName(selectedUser.preferredLanguage)} → {getLangName(user.preferredLanguage)}
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <span>Loading messages...</span>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="chat-placeholder" style={{ padding: '2rem 0' }}>
                <div className="icon" style={{ fontSize: '2.5rem' }}>👋</div>
                <p>Send a message to start the conversation!</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  Messages will be auto-translated between{' '}
                  {getLangName(user.preferredLanguage)} and{' '}
                  {getLangName(selectedUser.preferredLanguage)}
                </p>
              </div>
            )}
            {messages.map((msg, index) => {
              // Date separator
              const prevDate = index > 0 ? getDateFromTimestamp(messages[index - 1].timestamp) : '';
              const currDate = getDateFromTimestamp(msg.timestamp);
              const showDateSep = currDate !== prevDate;

              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                  {showDateSep && (
                    <div className="date-separator">
                      <span>{formatDateSeparator(msg.timestamp)}</span>
                    </div>
                  )}
                  <MessageBubble
                    message={msg}
                    currentUserId={user.userId}
                  />
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="typing-indicator-container">
                <div className="typing-indicator">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        <form onSubmit={handleSend} className="message-input-wrapper">
          <input
            type="text"
            placeholder={`Type a message in ${getLangName(user.preferredLanguage)}...`}
            value={inputValue}
            onChange={handleInputChange}
            autoFocus
          />
          <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
