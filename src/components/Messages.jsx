import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getMessages, sendMessage } from '../services/api';
import './Messages.css';

const Messages = ({ orderId, hasTechnician = false }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://nails-api.kendall-kelly.com/',
        },
      });
      const data = await getMessages(accessToken, orderId);
      setMessages(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchMessages();
    }
  }, [orderId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      return;
    }

    try {
      setSending(true);
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://nails-api.kendall-kelly.com/',
        },
      });

      const message = await sendMessage(accessToken, orderId, newMessage.trim());
      setMessages([...messages, message]);
      setNewMessage('');
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else if (diffInHours < 48) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  if (loading) {
    return <div className="messages-loading">Loading messages...</div>;
  }

  if (error) {
    return (
      <div className="messages-error">
        <p>Error loading messages: {error}</p>
        <button onClick={fetchMessages}>Retry</button>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h3>Conversation</h3>
        <button onClick={fetchMessages} className="refresh-button" title="Refresh messages">
          ↻
        </button>
      </div>

      {!hasTechnician && (
        <div className="technician-notice">
          <p>
            <strong>⚠️ No technician assigned yet</strong>
          </p>
          <p>
            Your messages will be visible to the technician once they're assigned to your order.
            Feel free to leave any questions or details about your design!
          </p>
        </div>
      )}

      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = user?.email === message.sender.email;
            const isCustomer = message.sender.role === 'customer';

            return (
              <div
                key={message.id}
                className={`message ${isCurrentUser ? 'message-sent' : 'message-received'} ${isCustomer ? 'message-customer' : 'message-technician'}`}
              >
                <div className="message-bubble">
                  <div className="message-header">
                    <span className="message-sender">
                      {message.sender.name}
                    </span>
                    <span className="message-time">{formatTimestamp(message.created_at)}</span>
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={hasTechnician ? "Type your message..." : "Leave a message for the technician..."}
          disabled={sending}
          className="message-input"
        />
        <button type="submit" disabled={sending || !newMessage.trim()} className="send-button">
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Messages;
