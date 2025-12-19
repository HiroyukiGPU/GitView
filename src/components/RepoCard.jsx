import './RepoCard.css';

function RepoCard({ repo }) {
  if (!repo) return null;

  return (
    <div className="repo-card">
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

      {repo.description && (
        <p className="repo-card__description">{repo.description}</p>
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

