import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from './LoginButton';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar__content">
        <Link to="/" className="sidebar__logo">
          <span className="sidebar__logo-icon">📚</span>
          <span className="sidebar__logo-text">GitView</span>
        </Link>

        <nav className="sidebar__nav">
          <Link
            to="/"
            className={`sidebar__nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"/>
            </svg>
            <span>ホーム</span>
          </Link>
          <Link
            to="/explore"
            className={`sidebar__nav-item ${location.pathname === '/explore' ? 'active' : ''}`}
          >
            <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"/>
            </svg>
            <span>検索</span>
          </Link>
          <Link
            to="/messages"
            className={`sidebar__nav-item ${location.pathname === '/messages' || location.pathname.startsWith('/messages/') ? 'active' : ''}`}
          >
            <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.464l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.036z"/>
            </svg>
            <span>メッセージ</span>
          </Link>
          {user && (
            <Link
              to={`/user/${user.uid}`}
              className={`sidebar__nav-item ${location.pathname.startsWith('/user/') ? 'active' : ''}`}
            >
              <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.318.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"/>
              </svg>
              <span>プロフィール</span>
            </Link>
          )}
        </nav>

        {user ? (
          <div className="sidebar__user">
            <div className="sidebar__user-info">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                  className="sidebar__user-avatar"
                />
              ) : (
                <div className="sidebar__user-avatar">
                  {user.displayName?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase() || 'U'}
                </div>
              )}
              <div className="sidebar__user-details">
                <div className="sidebar__user-name">
                  {user.displayName || user.email?.split('@')[0] || 'ユーザー'}
                </div>
                <div className="sidebar__user-handle">
                  @{user.email?.split('@')[0] || 'user'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="sidebar__auth">
            <LoginButton />
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;

