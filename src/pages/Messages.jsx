import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserChats } from '../utils/messages';
import { useNavigate } from 'react-router-dom';
import './Messages.css';

function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadChats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadChats = async () => {
    setLoading(true);
    try {
      const userChats = await fetchUserChats(user.uid);
      setChats(userChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="messages">
        <div className="messages__empty">
          <p>メッセージを送るにはログインが必要です</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="messages__loading">読み込み中...</div>;
  }

  return (
    <div className="messages">
      <div className="messages__header">
        <h1 className="messages__title">メッセージ</h1>
      </div>

      <div className="messages__list">
        {chats.length === 0 ? (
          <div className="messages__empty">
            <p>まだメッセージがありません</p>
            <p className="messages__empty-sub">他のユーザーと会話を始めましょう</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.userId}
              className="messages__chat-item"
              onClick={() => navigate(`/messages/${chat.userId}`)}
            >
              {chat.userPhotoURL ? (
                <img
                  src={chat.userPhotoURL}
                  alt={chat.userName}
                  className="messages__avatar"
                />
              ) : (
                <div className="messages__avatar">
                  {chat.userName?.substring(0, 2).toUpperCase() || 'U'}
                </div>
              )}
              <div className="messages__chat-info">
                <div className="messages__chat-name">{chat.userName || 'ユーザー'}</div>
                {chat.lastMessage && (
                  <div className="messages__chat-preview">{chat.lastMessage}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Messages;

