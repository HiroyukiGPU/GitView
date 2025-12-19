import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import GlobalFeed from './components/GlobalFeed';
import Explore from './pages/Explore';
import RepoDetail from './pages/RepoDetail';
import Messages from './pages/Messages';
import ChatRoom from './pages/ChatRoom';
import Search from './pages/Search';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Sidebar />
          <main className="app__main">
            <Routes>
              <Route path="/" element={<GlobalFeed />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/repo/:owner/:repo" element={<RepoDetail />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/:userId" element={<ChatRoom />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </main>
          <RightSidebar />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

