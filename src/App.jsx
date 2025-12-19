import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import GlobalFeed from './components/GlobalFeed';
import Explore from './pages/Explore';
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
        <div className="navigation__links">
          <Link
            to="/"
            className={`navigation__link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Feed
          </Link>
          <Link
            to="/explore"
            className={`navigation__link ${location.pathname === '/explore' ? 'active' : ''}`}
          >
            Explore
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="app__main">
          <Routes>
            <Route path="/" element={<GlobalFeed />} />
            <Route path="/explore" element={<Explore />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

