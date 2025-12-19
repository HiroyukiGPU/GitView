import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import GlobalFeed from './components/GlobalFeed';
import Explore from './pages/Explore';
import RepoDetail from './pages/RepoDetail';
import Messages from './pages/Messages';
import ChatRoom from './pages/ChatRoom';
import Search from './pages/Search';
import LoginButton from './components/LoginButton';
import SearchBar from './components/SearchBar';
import './App.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <Link to="/" className="navigation__logo">
          <span className="navigation__logo-icon">📚</span>
          <span className="navigation__logo-text">GitView</span>
        </Link>
        <div className="navigation__content">
          <div className="navigation__links">
            <Link
              to="/"
              className={`navigation__link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Explore
            </Link>
            <Link
              to="/feed"
              className={`navigation__link ${location.pathname === '/feed' ? 'active' : ''}`}
            >
              Feed
            </Link>
            <Link
              to="/messages"
              className={`navigation__link ${location.pathname === '/messages' || location.pathname.startsWith('/messages/') ? 'active' : ''}`}
            >
              Messages
            </Link>
          </div>
          <div className="navigation__search">
            <SearchBar />
          </div>
          <div className="navigation__auth">
            <LoginButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="app__main">
            <Routes>
              <Route path="/" element={<Explore />} />
              <Route path="/feed" element={<GlobalFeed />} />
              <Route path="/repo/:owner/:repo" element={<RepoDetail />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/:userId" element={<ChatRoom />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

