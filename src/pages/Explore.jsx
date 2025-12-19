import { useState, useEffect } from 'react';
import { fetchTrendingRepos } from '../utils/github';
import RepoCard from '../components/RepoCard';
import './Explore.css';

const POPULAR_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'Go',
  'Rust',
  'C++',
  'Ruby',
  'PHP',
  'Swift',
];

function Explore() {
  const [repos, setRepos] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTrendingRepos();
  }, [selectedLanguage]);

  const loadTrendingRepos = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchTrendingRepos(selectedLanguage);
      setRepos(data);
    } catch (err) {
      setError('トレンドリポジトリの読み込みに失敗しました');
      console.error('Error loading trending repos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="explore">
      <div className="explore__header">
        <h1 className="explore__title">Explore</h1>
        <p className="explore__subtitle">人気のリポジトリを発見</p>
      </div>

      <div className="explore__filters">
        <button
          className={`explore__filter ${selectedLanguage === null ? 'active' : ''}`}
          onClick={() => setSelectedLanguage(null)}
        >
          すべて
        </button>
        {POPULAR_LANGUAGES.map((lang) => (
          <button
            key={lang}
            className={`explore__filter ${selectedLanguage === lang ? 'active' : ''}`}
            onClick={() => setSelectedLanguage(lang)}
          >
            {lang}
          </button>
        ))}
      </div>

      {error && <div className="explore__error">{error}</div>}

      {loading ? (
        <div className="explore__loading">読み込み中...</div>
      ) : (
        <div className="explore__repos">
          {repos.length === 0 ? (
            <div className="explore__empty">リポジトリが見つかりませんでした</div>
          ) : (
            repos.map((repo, index) => (
              <RepoCard key={`${repo.fullName}-${index}`} repo={repo} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Explore;

