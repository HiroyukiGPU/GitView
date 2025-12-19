import { useState } from 'react';
import { createPost } from '../utils/posts';
import { getOrCreateUUID } from '../utils/uuid';
import './PostForm.css';

function PostForm({ onPostCreated }) {
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
      const userId = getOrCreateUUID();
      await createPost(text, userId);
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
    <form className="post-form" onSubmit={handleSubmit}>
      <div className="post-form__header">
        <h2 className="post-form__title">投稿する</h2>
      </div>

      <div className="post-form__body">
        <textarea
          className="post-form__textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="OSSについて思ったこと、見つけたリポジトリのURLを共有..."
          rows={4}
          maxLength={MAX_LENGTH}
          disabled={isSubmitting}
        />
        <div className="post-form__footer">
          <span className="post-form__counter">
            {text.length} / {MAX_LENGTH}
          </span>
          <button
            type="submit"
            className="post-form__submit"
            disabled={isSubmitting || !text.trim()}
          >
            {isSubmitting ? '投稿中...' : '投稿'}
          </button>
        </div>
      </div>

      {error && <div className="post-form__error">{error}</div>}
    </form>
  );
}

export default PostForm;

