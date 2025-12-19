import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrendingRepos } from '../utils/github';
import SearchBar from './SearchBar';
import './RightSidebar.css';

function RightSidebar() {
  const navigate = useNavigate();
  const [trendingRepos, setTrendingRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingRepos();
  }, []);

  const loadTrendingRepos = async () => {
    try {
      const repos = await fetchTrendingRepos(null, 5);
      setTrendingRepos(repos);
    } catch (error) {
      console.error('Error loading trending repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRepoClick = (owner, name) => {
    navigate(`/repo/${owner}/${name}`);
  };

  return (
    <aside className="right-sidebar">
      <div className="right-sidebar__content">
        <div className="right-sidebar__search">
          <SearchBar />
        </div>

        <div className="right-sidebar__section">
          <h2 className="right-sidebar__title">トレンド</h2>
          {loading ? (
            <div className="right-sidebar__loading">読み込み中...</div>
          ) : (
            <div className="right-sidebar__trending">
              {trendingRepos.map((repo, index) => (
                <div
                  key={`${repo.fullName}-${index}`}
                  className="right-sidebar__trend-item"
                  onClick={() => handleRepoClick(repo.owner, repo.name)}
                >
                  <div className="right-sidebar__trend-header">
                    <span className="right-sidebar__trend-category">プログラミング · トレンド</span>
                    <span className="right-sidebar__trend-more">⋯</span>
                  </div>
                  <div className="right-sidebar__trend-name">#{repo.name}</div>
                  <div className="right-sidebar__trend-count">{repo.stars.toLocaleString()} Stars</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="right-sidebar__footer">
          <a href="#" className="right-sidebar__link">利用規約</a>
          <a href="#" className="right-sidebar__link">プライバシーポリシー</a>
          <a href="#" className="right-sidebar__link">クッキー</a>
          <div className="right-sidebar__copyright">© 2024 GitView</div>
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;

