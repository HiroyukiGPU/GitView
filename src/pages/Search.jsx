import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchRepositories } from '../utils/search';
import RepoCard from '../components/RepoCard';
import './Search.css';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setRepos([]);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    setError('');

    try {
      const results = await searchRepositories(searchQuery);
      setRepos(results);
    } catch (err) {
      setError('検索に失敗しました');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search">
      <div className="search__header">
        <h1 className="search__title">検索結果</h1>
        {query && (
          <p className="search__query">「{query}」の検索結果</p>
        )}
      </div>

      {error && <div className="search__error">{error}</div>}

      {loading ? (
        <div className="search__loading">検索中...</div>
      ) : (
        <div className="search__results">
          {repos.length === 0 && query ? (
            <div className="search__empty">検索結果が見つかりませんでした</div>
          ) : repos.length === 0 ? (
            <div className="search__empty">検索キーワードを入力してください</div>
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

export default Search;

