import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { translateToJapanese } from '../utils/translate';
import './RepoCard.css';

function RepoCard({ repo }) {
  const navigate = useNavigate();
  const [translatedDescription, setTranslatedDescription] = useState(repo?.description || '');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (repo?.description) {
      // 説明文が英語かどうかを簡易判定（日本語文字が含まれていない場合）
      const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(repo.description);
      
      if (!hasJapanese && repo.description.trim().length > 0) {
        setIsTranslating(true);
        translateToJapanese(repo.description)
          .then(translated => {
            setTranslatedDescription(translated);
            setIsTranslating(false);
          })
          .catch(error => {
            console.error('Translation error:', error);
            setTranslatedDescription(repo.description);
            setIsTranslating(false);
          });
      } else {
        setTranslatedDescription(repo.description);
      }
    }
  }, [repo?.description]);

  if (!repo) return null;

  const handleClick = () => {
    navigate(`/repo/${repo.owner}/${repo.name}`);
  };

  return (
    <div className="repo-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="repo-card__header">
        <div className="repo-card__owner">
          <img
            src={repo.ownerAvatar}
            alt={repo.owner}
            className="repo-card__owner-avatar"
          />
          <div className="repo-card__owner-info">
            <span className="repo-card__owner-name">{repo.owner}</span>
            <span className="repo-card__repo-name">{repo.name}</span>
          </div>
        </div>
        <div className="repo-card__stars">
          <span className="repo-card__star-icon">★</span>
          <span className="repo-card__star-count">{repo.stars.toLocaleString()}</span>
        </div>
      </div>

      {translatedDescription && (
        <p className="repo-card__description">
          {isTranslating ? (
            <span className="repo-card__translating">
              {repo.description}
              <span className="repo-card__translating-indicator"> (翻訳中...)</span>
            </span>
          ) : (
            translatedDescription
          )}
        </p>
      )}

      <div className="repo-card__footer">
        {repo.language && (
          <span className="repo-card__language">{repo.language}</span>
        )}
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="repo-card__link"
        >
          GitHubで見る →
        </a>
      </div>
    </div>
  );
}

export default RepoCard;

