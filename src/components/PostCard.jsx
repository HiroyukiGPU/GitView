import { useState, useEffect } from 'react';
import { extractGitHubUrls } from '../utils/github';
import { fetchRepoInfo } from '../utils/github';
import RepoCard from './RepoCard';
import { isBookmarked, toggleBookmark } from '../utils/posts';
import './PostCard.css';

function PostCard({ post }) {
  const [repoUrls, setRepoUrls] = useState([]);
  const [repoInfos, setRepoInfos] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 投稿テキストからGitHub URLを抽出
    const urls = extractGitHubUrls(post.text);
    setRepoUrls(urls);
    setBookmarked(isBookmarked(post.id));

    // 各URLからリポジトリ情報を取得
    const fetchRepos = async () => {
      setLoading(true);
      const infos = await Promise.all(
        urls.map(url => fetchRepoInfo(url))
      );
      setRepoInfos(infos.filter(info => info !== null));
      setLoading(false);
    };

    if (urls.length > 0) {
      fetchRepos();
    } else {
      setLoading(false);
    }
  }, [post.text, post.id]);

  const handleBookmark = () => {
    const newBookmarked = toggleBookmark(post.id, post.userId);
    setBookmarked(newBookmarked);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    if (days < 7) return `${days}日前`;
    return date.toLocaleDateString('ja-JP');
  };

  return (
    <article className="post-card">
      <div className="post-card__header">
        <div className="post-card__user">
          <div className="post-card__avatar">
            {post.userId ? post.userId.substring(0, 2).toUpperCase() : 'AN'}
          </div>
          <div className="post-card__user-info">
            <span className="post-card__username">匿名ユーザー</span>
            <span className="post-card__timestamp">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        <button
          className={`post-card__bookmark ${bookmarked ? 'active' : ''}`}
          onClick={handleBookmark}
          aria-label="ブックマーク"
        >
          {bookmarked ? '★' : '☆'}
        </button>
      </div>

      <div className="post-card__content">
        <p className="post-card__text">{post.text}</p>
      </div>

      {loading && repoUrls.length > 0 && (
        <div className="post-card__repos-loading">リポジトリ情報を読み込み中...</div>
      )}

      {!loading && repoInfos.length > 0 && (
        <div className="post-card__repos">
          {repoInfos.map((repo, index) => (
            <RepoCard key={index} repo={repo} />
          ))}
        </div>
      )}
    </article>
  );
}

export default PostCard;

