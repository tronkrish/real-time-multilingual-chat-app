import { useState } from 'react';
import { getLangName, getAvatarGradient, formatTimeAgo } from '../utils/languages';

export default function UserList({
  users,
  selectedUser,
  onSelectUser,
  typingUsers = {},
  unreadCounts = {},
  lastMessages = {},
  currentUserId,
}) {
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort: users with unread messages first, then by last message time
  const sorted = [...filtered].sort((a, b) => {
    const unreadA = unreadCounts[a.id] || 0;
    const unreadB = unreadCounts[b.id] || 0;
    if (unreadA !== unreadB) return unreadB - unreadA;

    const lastA = lastMessages[a.id]?.timestamp || '';
    const lastB = lastMessages[b.id]?.timestamp || '';
    return lastB.localeCompare(lastA);
  });

  return (
    <>
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍  Search or start new chat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="user-list">
        {sorted.length === 0 && (
          <div className="loading-container" style={{ padding: '2rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              {users.length === 0 ? 'No other users yet' : 'No results found'}
            </span>
          </div>
        )}
        {sorted.map((u) => {
          const unread = unreadCounts[u.id] || 0;
          const lastMsg = lastMessages[u.id];
          const isTyping = typingUsers[u.id];
          const avatarGradient = getAvatarGradient(u.id);

          let lastMsgPreview = '';
          if (lastMsg) {
            const isMyMsg = lastMsg.senderId === currentUserId;
            const text = isMyMsg
              ? lastMsg.originalMessage
              : lastMsg.translatedMessage || lastMsg.originalMessage;
            lastMsgPreview = (isMyMsg ? 'You: ' : '') + (text || '').substring(0, 40);
          }

          return (
            <div
              key={u.id}
              className={`user-item ${selectedUser?.id === u.id ? 'active' : ''}`}
              onClick={() => onSelectUser(u)}
            >
              <div className={`user-avatar ${avatarGradient}`}>
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <div className="user-details-top">
                  <div className="name">{u.name}</div>
                  <div className={`last-time ${unread > 0 ? 'has-unread' : ''}`}>
                    {lastMsg && formatTimeAgo(lastMsg.timestamp)}
                  </div>
                </div>
                <div className="user-details-bottom">
                  <div className="last-message">
                    {isTyping ? (
                      <span style={{ color: 'var(--accent-primary)', fontStyle: 'italic' }}>
                        typing...
                      </span>
                    ) : lastMsgPreview ? (
                      lastMsgPreview
                    ) : (
                      <span className="language-badge">
                        {getLangName(u.preferredLanguage)}
                      </span>
                    )}
                  </div>
                  {unread > 0 && (
                    <div className="unread-badge">
                      {unread > 99 ? '99+' : unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
