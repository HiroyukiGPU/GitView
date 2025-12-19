import { collection, addDoc, query, where, orderBy, limit, getDocs, doc, getDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';

const REPO_POSTS_COLLECTION = 'repoPosts';
const MAX_TEXT_LENGTH = 500;

// リポジトリへの投稿を作成
export async function createRepoPost(text, repoOwner, repoName, userId, user = null) {
  if (!text || text.trim().length === 0) {
    throw new Error('投稿内容が空です');
  }

  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`投稿は${MAX_TEXT_LENGTH}文字以内で入力してください`);
  }

  const postData = {
    text: text.trim(),
    repoOwner,
    repoName,
    repoFullName: `${repoOwner}/${repoName}`,
    userId,
    createdAt: new Date(),
    likes: [],
    likesCount: 0,
    replies: [],
    repliesCount: 0,
    ...(user && {
      userName: user.displayName || user.email?.split('@')[0] || 'ユーザー',
      userPhotoURL: user.photoURL || null,
      userEmail: user.email || null,
      isAuthenticated: true,
    }),
  };

  try {
    const docRef = await addDoc(collection(db, REPO_POSTS_COLLECTION), postData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating repo post:', error);
    throw error;
  }
}

// リポジトリの投稿を取得
export async function fetchRepoPosts(repoOwner, repoName, pageSize = 20) {
  try {
    const q = query(
      collection(db, REPO_POSTS_COLLECTION),
      where('repoFullName', '==', `${repoOwner}/${repoName}`),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    const querySnapshot = await getDocs(q);
    const posts = [];

    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return posts;
  } catch (error) {
    console.error('Error fetching repo posts:', error);
    return [];
  }
}

// いいねを追加/削除
export async function toggleLike(postId, userId) {
  try {
    const postRef = doc(db, REPO_POSTS_COLLECTION, postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('投稿が見つかりません');
    }

    const postData = postDoc.data();
    const likes = postData.likes || [];
    const isLiked = likes.includes(userId);

    if (isLiked) {
      // いいねを削除
      await updateDoc(postRef, {
        likes: likes.filter(id => id !== userId),
        likesCount: increment(-1),
      });
      return false;
    } else {
      // いいねを追加
      await updateDoc(postRef, {
        likes: [...likes, userId],
        likesCount: increment(1),
      });
      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}

// 返信を追加
export async function addReply(postId, text, userId, user = null) {
  if (!text || text.trim().length === 0) {
    throw new Error('返信内容が空です');
  }

  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`返信は${MAX_TEXT_LENGTH}文字以内で入力してください`);
  }

  try {
    const postRef = doc(db, REPO_POSTS_COLLECTION, postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('投稿が見つかりません');
    }

    const postData = postDoc.data();
    const replies = postData.replies || [];

    const reply = {
      id: Date.now().toString(),
      text: text.trim(),
      userId,
      createdAt: new Date(),
      ...(user && {
        userName: user.displayName || user.email?.split('@')[0] || 'ユーザー',
        userPhotoURL: user.photoURL || null,
        userEmail: user.email || null,
      }),
    };

    await updateDoc(postRef, {
      replies: [...replies, reply],
      repliesCount: increment(1),
    });

    return reply;
  } catch (error) {
    console.error('Error adding reply:', error);
    throw error;
  }
}

// 投稿を更新
export async function updatePost(postId, text, userId) {
  if (!text || text.trim().length === 0) {
    throw new Error('投稿内容が空です');
  }

  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`投稿は${MAX_TEXT_LENGTH}文字以内で入力してください`);
  }

  try {
    const postRef = doc(db, REPO_POSTS_COLLECTION, postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('投稿が見つかりません');
    }

    const postData = postDoc.data();
    
    if (postData.userId !== userId) {
      throw new Error('この投稿を編集する権限がありません');
    }

    await updateDoc(postRef, {
      text: text.trim(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

// 投稿を削除
export async function deletePost(postId, userId) {
  try {
    const postRef = doc(db, REPO_POSTS_COLLECTION, postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('投稿が見つかりません');
    }

    const postData = postDoc.data();
    
    if (postData.userId !== userId) {
      throw new Error('この投稿を削除する権限がありません');
    }

    await deleteDoc(postRef);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

