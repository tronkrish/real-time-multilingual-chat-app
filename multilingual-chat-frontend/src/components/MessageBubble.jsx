import { useState } from 'react';
import { formatTime } from '../utils/languages';

export default function MessageBubble({ message, currentUserId }) {
  const isSent = message.senderId === currentUserId;
  const [showOriginal, setShowOriginal] = useState(false);

  // For received messages: show translated by default, toggle to original
  // For sent messages: show original always
  const displayContent = isSent
    ? message.originalMessage
    : message.translatedMessage;

  const hasTranslation =
    !isSent &&
    message.originalMessage &&
    message.translatedMessage &&
    message.originalMessage !== message.translatedMessage;

  const statusIcon = () => {
    if (!isSent) return null;
    switch (message.status) {
      case 'read':
        return <span className="message-status read">✓✓</span>;
      case 'delivered':
        return <span className="message-status">✓✓</span>;
      case 'sent':
      default:
        return <span className="message-status">✓</span>;
    }
  };

  return (
    <div className={`message-wrapper ${isSent ? 'sent' : 'received'}`}>
      <div className="message-bubble">
        <div className="message-content">
          {displayContent || message.content}
        </div>

        {/* Translation Toggle */}
        {hasTranslation && (
          <>
            <div className={`message-translation-section ${showOriginal ? 'expanded' : 'collapsed'}`}>
              <div className="message-translation">
                <div className="translation-label">
                  Original
                </div>
                {message.originalMessage}
              </div>
            </div>
            <button
              className="translation-toggle"
              onClick={() => setShowOriginal(!showOriginal)}
            >
              🌐 {showOriginal ? 'Hide original' : 'Show original'}
            </button>
          </>
        )}

        <div className="message-meta">
          <span className="message-time">{formatTime(message.timestamp)}</span>
          {statusIcon()}
        </div>
      </div>
    </div>
  );
}
