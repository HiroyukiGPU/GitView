import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRepoInfo } from '../utils/github';
import { fetchRepoPosts, createRepoPost } from '../utils/repoPosts';
import { useAuth } from '../contexts/AuthContext';
import RepoPostCard from '../components/RepoPostCard';
import RepoPostForm from '../components/RepoPostForm';
import './RepoDetail.css';

function RepoDetail() {
  const { owner, repo } = useParams();
  const { user } = useAuth();
  const [repoInfo, setRepoInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRepoData();
  }, [owner, repo]);

  const loadRepoData = async () => {
    setLoading(true);
    setError('');

    try {
      const [info, repoPosts] = await Promise.all([
        fetchRepoInfo(`https://github.com/${owner}/${repo}`),
        fetchRepoPosts(owner, repo),
      ]);

      setRepoInfo(info);
      setPosts(repoPosts);
    } catch (err) {
      setError('リポジトリ情報の読み込みに失敗しました');
      console.error('Error loading repo data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    loadRepoData();
  };

  if (loading) {
    return <div className="repo-detail__loading">読み込み中...</div>;
  }

  if (error || !repoInfo) {
    return <div className="repo-detail__error">{error || 'リポジトリが見つかりませんでした'}</div>;
  }

  return (
    <div className="repo-detail">
      <div className="repo-detail__header">
        <div className="repo-detail__info">
          <img
            src={repoInfo.ownerAvatar}
            alt={repoInfo.owner}
            className="repo-detail__avatar"
          />
          <div className="repo-detail__title">
            <h1 className="repo-detail__name">{repoInfo.name}</h1>
            <p className="repo-detail__owner">by {repoInfo.owner}</p>
          </div>
        </div>
        <div className="repo-detail__stats">
          <div className="repo-detail__stat">
            <span className="repo-detail__stat-icon">★</span>
            <span className="repo-detail__stat-value">{repoInfo.stars.toLocaleString()}</span>
          </div>
          {repoInfo.language && (
            <div className="repo-detail__stat">
              <span className="repo-detail__stat-label">言語:</span>
              <span className="repo-detail__stat-value">{repoInfo.language}</span>
            </div>
          )}
        </div>
      </div>

      {repoInfo.description && (
        <p className="repo-detail__description">{repoInfo.description}</p>
      )}

      <div className="repo-detail__actions">
        <a
          href={repoInfo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="repo-detail__github-link"
        >
          GitHubで見る →
        </a>
      </div>

      <div className="repo-detail__feed">
        <h2 className="repo-detail__feed-title">このリポジトリについて</h2>
        
        {user && (
          <RepoPostForm
            repoOwner={owner}
            repoName={repo}
            onPostCreated={handlePostCreated}
          />
        )}

        <div className="repo-detail__posts">
          {posts.length === 0 ? (
            <div className="repo-detail__empty">
              まだ投稿がありません。最初の投稿をしてみましょう！
            </div>
          ) : (
            posts.map((post) => (
              <RepoPostCard key={post.id} post={post} onUpdate={loadRepoData} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RepoDetail;

