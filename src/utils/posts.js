import { collection, addDoc, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const POSTS_COLLECTION = 'posts';
const MAX_TEXT_LENGTH = 500;

// 投稿を追加
export async function createPost(text, userId, user = null) {
  if (!text || text.trim().length === 0) {
    throw new Error('投稿内容が空です');
  }

  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`投稿は${MAX_TEXT_LENGTH}文字以内で入力してください`);
  }

  const postData = {
    text: text.trim(),
    userId,
    createdAt: new Date(),
    bookmarks: [],
    // 認証ユーザーの情報を追加
    ...(user && {
      userName: user.displayName || user.email?.split('@')[0] || 'ユーザー',
      userPhotoURL: user.photoURL || null,
      userEmail: user.email || null,
      isAuthenticated: true,
    }),
  };

  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), postData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// 投稿を取得（ページネーション対応）
export async function fetchPosts(lastDoc = null, pageSize = 10) {
  try {
    let q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        collection(db, POSTS_COLLECTION),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const posts = [];
    let newLastDoc = null;

    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      });
      newLastDoc = doc;
    });

    return { posts, lastDoc: newLastDoc };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], lastDoc: null };
  }
}

// ブックマークを追加/削除
export async function toggleBookmark(postId, userId) {
  // MVPでは実装しないが、将来拡張用の関数
  // 現在はローカルストレージで管理
  const bookmarks = JSON.parse(localStorage.getItem('gitview_bookmarks') || '[]');
  const index = bookmarks.indexOf(postId);
  
  if (index > -1) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(postId);
  }
  
  localStorage.setItem('gitview_bookmarks', JSON.stringify(bookmarks));
  return bookmarks.includes(postId);
}

// ブックマーク状態を取得
export function isBookmarked(postId) {
  const bookmarks = JSON.parse(localStorage.getItem('gitview_bookmarks') || '[]');
  return bookmarks.includes(postId);
}

