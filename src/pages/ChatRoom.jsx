import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchChatMessages, sendMessage, fetchUserInfo } from '../utils/messages';
import './ChatRoom.css';

function ChatRoom() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user && userId) {
      loadChatData();
      const unsubscribe = subscribeToMessages();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [user, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatData = async () => {
    setLoading(true);
    try {
      const [userInfo, chatMessages] = await Promise.all([
        fetchUserInfo(userId),
        fetchChatMessages(user.uid, userId),
      ]);
      setOtherUser(userInfo);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    // リアルタイム更新は後で実装
    return null;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await sendMessage(user.uid, userId, messageText, user);
      setMessageText('');
      loadChatData();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('メッセージの送信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="chat-room">
        <div className="chat-room__empty">ログインが必要です</div>
      </div>
    );
  }

  if (loading) {
    return <div className="chat-room__loading">読み込み中...</div>;
  }

  return (
    <div className="chat-room">
      <div className="chat-room__header">
        {otherUser ? (
          <>
            {otherUser.photoURL ? (
              <img
                src={otherUser.photoURL}
                alt={otherUser.displayName || 'ユーザー'}
                className="chat-room__avatar"
              />
            ) : (
              <div className="chat-room__avatar">
                {otherUser.displayName?.substring(0, 2).toUpperCase() || 'U'}
              </div>
            )}
            <div className="chat-room__user-info">
              <div className="chat-room__user-name">
                {otherUser.displayName || otherUser.email?.split('@')[0] || 'ユーザー'}
              </div>
            </div>
          </>
        ) : (
          <div className="chat-room__user-name">ユーザー</div>
        )}
      </div>

      <div className="chat-room__messages">
        {messages.length === 0 ? (
          <div className="chat-room__empty">
            <p>まだメッセージがありません</p>
            <p className="chat-room__empty-sub">メッセージを送って会話を始めましょう</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === user.uid;
            return (
              <div
                key={message.id}
                className={`chat-room__message ${isOwn ? 'own' : ''}`}
              >
                <div className="chat-room__message-content">
                  <p className="chat-room__message-text">{message.text}</p>
                  <span className="chat-room__message-time">
                    {new Date(message.createdAt?.toDate?.() || message.createdAt).toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-room__input-form" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-room__input"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="メッセージを入力..."
          maxLength={500}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="chat-room__send-button"
          disabled={isSubmitting || !messageText.trim()}
        >
          送信
        </button>
      </form>
    </div>
  );
}

export default ChatRoom;

