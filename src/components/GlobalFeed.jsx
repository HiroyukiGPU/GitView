import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPosts } from '../utils/posts';
import PostCard from './PostCard';
import PostForm from './PostForm';
import './GlobalFeed.css';

function GlobalFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [error, setError] = useState('');
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  const loadPosts = useCallback(async (isInitial = false) => {
    if (loading && !isInitial) return;

    setLoading(true);
    setError('');

    try {
      const { posts: newPosts, lastDoc: newLastDoc } = await fetchPosts(lastDoc, 10);
      
      if (isInitial) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setLastDoc(newLastDoc);
      setHasMore(newPosts.length === 10);
    } catch (err) {
      setError('投稿の読み込みに失敗しました');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  }, [lastDoc, loading]);

  useEffect(() => {
    loadPosts(true);
  }, []);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadPosts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadPosts]);

  const handlePostCreated = () => {
    // 新しい投稿が作成されたら、最初から再読み込み
    setLastDoc(null);
    setHasMore(true);
    loadPosts(true);
  };

  return (
    <div className="global-feed">
      <div className="global-feed__header">
        <h1 className="global-feed__title">ホーム</h1>
      </div>
      <PostForm onPostCreated={handlePostCreated} />

      {error && <div className="global-feed__error">{error}</div>}

      <div className="global-feed__posts">
        {posts.length === 0 && !loading && (
          <div className="global-feed__empty">
            <p>まだ投稿がありません</p>
            <p className="global-feed__empty-sub">最初の投稿をしてみましょう！</p>
          </div>
        )}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {loading && posts.length > 0 && (
        <div className="global-feed__loading">読み込み中...</div>
      )}

      {hasMore && !loading && (
        <div ref={loadingRef} className="global-feed__load-more">
          <div className="global-feed__load-more-spinner"></div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="global-feed__end">
          <p>すべての投稿を読み込みました</p>
        </div>
      )}
    </div>
  );
}

export default GlobalFeed;

