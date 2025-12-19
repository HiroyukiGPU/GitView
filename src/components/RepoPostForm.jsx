import { useState } from 'react';
import { createRepoPost } from '../utils/repoPosts';
import { useAuth } from '../contexts/AuthContext';
import './RepoPostForm.css';

function RepoPostForm({ repoOwner, repoName, onPostCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const MAX_LENGTH = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('投稿内容を入力してください');
      return;
    }

    if (text.length > MAX_LENGTH) {
      setError(`投稿は${MAX_LENGTH}文字以内で入力してください`);
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = user ? user.uid : 'anonymous';
      await createRepoPost(text, repoOwner, repoName, userId, user);
      setText('');
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      setError(err.message || '投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="repo-post-form" onSubmit={handleSubmit}>
      <div className="repo-post-form__body">
        <div className="repo-post-form__content">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || user.email}
              className="repo-post-form__avatar"
            />
          ) : (
            <div className="repo-post-form__avatar">
              {user?.displayName?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || 'AN'}
            </div>
          )}
          <div className="repo-post-form__input-wrapper">
            <textarea
              className="repo-post-form__textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="いまどうしてる？"
              rows={3}
              maxLength={MAX_LENGTH}
              disabled={isSubmitting}
            />
            <div className="repo-post-form__footer">
              <span className="repo-post-form__counter">
                {text.length > MAX_LENGTH * 0.9 && (
                  <span className={text.length >= MAX_LENGTH ? 'repo-post-form__counter--warning' : ''}>
                    {MAX_LENGTH - text.length}
                  </span>
                )}
              </span>
              <button
                type="submit"
                className="repo-post-form__submit"
                disabled={isSubmitting || !text.trim()}
              >
                {isSubmitting ? '投稿中...' : '投稿'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="repo-post-form__error">{error}</div>}
    </form>
  );
}

export default RepoPostForm;

