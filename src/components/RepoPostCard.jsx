import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toggleLike, addReply, updatePost, deletePost } from '../utils/repoPosts';
import { useNavigate } from 'react-router-dom';
import './RepoPostCard.css';

function RepoPostCard({ post, onUpdate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.uid) || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [error, setError] = useState('');

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

  const handleLike = async () => {
    if (!user) {
      alert('いいねするにはログインが必要です');
      return;
    }

    try {
      const newLiked = await toggleLike(post.id, user.uid);
      setIsLiked(newLiked);
      setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
    } catch (err) {
      setError('いいねに失敗しました');
      console.error('Like error:', err);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('返信するにはログインが必要です');
      return;
    }

    if (!replyText.trim()) {
      setError('返信内容を入力してください');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addReply(post.id, replyText, user.uid, user);
      setReplyText('');
      setShowReplyForm(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setError(err.message || '返信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editText.trim()) {
      setError('投稿内容を入力してください');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await updatePost(post.id, editText, user.uid);
      setIsEditing(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setError(err.message || '編集に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('この投稿を削除しますか？')) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await deletePost(post.id, user.uid);
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setError(err.message || '削除に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDM = () => {
    if (!user) {
      alert('DMを送るにはログインが必要です');
      return;
    }

    if (post.userId === user.uid) {
      alert('自分自身にはDMを送れません');
      return;
    }

    navigate(`/messages/${post.userId}`);
  };

  const isOwner = user && post.userId === user.uid;
  const canDM = user && post.userId && post.userId !== user.uid && post.isAuthenticated;

  return (
    <article className="repo-post-card">
      <div className="repo-post-card__header">
        <div className="repo-post-card__user">
          {post.userPhotoURL ? (
            <img
              src={post.userPhotoURL}
              alt={post.userName || 'ユーザー'}
              className="repo-post-card__avatar-img"
            />
          ) : (
            <div className="repo-post-card__avatar">
              {post.userName
                ? post.userName.substring(0, 2).toUpperCase()
                : post.userId
                ? post.userId.substring(0, 2).toUpperCase()
                : 'AN'}
            </div>
          )}
          <div className="repo-post-card__user-info">
            <span className="repo-post-card__username">
              {post.userName || '匿名ユーザー'}
            </span>
            <span className="repo-post-card__timestamp">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        {isOwner && (
          <div className="repo-post-card__actions">
            <button
              className="repo-post-card__action-btn"
              onClick={() => setIsEditing(!isEditing)}
              disabled={isSubmitting}
            >
              編集
            </button>
            <button
              className="repo-post-card__action-btn repo-post-card__action-btn--danger"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              削除
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="repo-post-card__edit">
          <textarea
            className="repo-post-card__edit-textarea"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
            maxLength={500}
          />
          <div className="repo-post-card__edit-actions">
            <button
              className="repo-post-card__edit-cancel"
              onClick={() => {
                setIsEditing(false);
                setEditText(post.text);
                setError('');
              }}
            >
              キャンセル
            </button>
            <button
              className="repo-post-card__edit-save"
              onClick={handleEdit}
              disabled={isSubmitting}
            >
              保存
            </button>
          </div>
        </div>
      ) : (
        <div className="repo-post-card__content">
          <p className="repo-post-card__text">{post.text}</p>
        </div>
      )}

      <div className="repo-post-card__footer">
        <button
          className={`repo-post-card__action ${isLiked ? 'active' : ''}`}
          onClick={handleLike}
          disabled={!user || isSubmitting}
        >
          <span className="repo-post-card__action-icon">❤️</span>
          <span className="repo-post-card__action-count">{likesCount}</span>
        </button>
        <button
          className="repo-post-card__action"
          onClick={() => setShowReplyForm(!showReplyForm)}
          disabled={!user || isSubmitting}
        >
          <span className="repo-post-card__action-icon">💬</span>
          <span className="repo-post-card__action-count">{post.repliesCount || 0}</span>
        </button>
        {canDM && (
          <button
            className="repo-post-card__action"
            onClick={handleDM}
          >
            <span className="repo-post-card__action-icon">✉️</span>
            <span>DM</span>
          </button>
        )}
      </div>

      {showReplyForm && (
        <form className="repo-post-card__reply-form" onSubmit={handleReply}>
          <textarea
            className="repo-post-card__reply-textarea"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="返信を入力..."
            rows={2}
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className="repo-post-card__reply-actions">
            <button
              type="button"
              className="repo-post-card__reply-cancel"
              onClick={() => {
                setShowReplyForm(false);
                setReplyText('');
                setError('');
              }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="repo-post-card__reply-submit"
              disabled={isSubmitting || !replyText.trim()}
            >
              {isSubmitting ? '送信中...' : '返信'}
            </button>
          </div>
        </form>
      )}

      {post.replies && post.replies.length > 0 && (
        <div className="repo-post-card__replies">
          {post.replies.map((reply) => (
            <div key={reply.id} className="repo-post-card__reply">
              <div className="repo-post-card__reply-user">
                {reply.userPhotoURL ? (
                  <img
                    src={reply.userPhotoURL}
                    alt={reply.userName || 'ユーザー'}
                    className="repo-post-card__reply-avatar"
                  />
                ) : (
                  <div className="repo-post-card__reply-avatar">
                    {reply.userName?.substring(0, 2).toUpperCase() || 'AN'}
                  </div>
                )}
                <span className="repo-post-card__reply-name">
                  {reply.userName || '匿名ユーザー'}
                </span>
              </div>
              <p className="repo-post-card__reply-text">{reply.text}</p>
              <span className="repo-post-card__reply-time">
                {formatDate(reply.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}

      {error && <div className="repo-post-card__error">{error}</div>}
    </article>
  );
}

export default RepoPostCard;

