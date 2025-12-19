import { collection, addDoc, query, where, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const MESSAGES_COLLECTION = 'messages';
const MAX_MESSAGE_LENGTH = 500;

// メッセージを送信
export async function sendMessage(senderId, receiverId, text, user = null) {
  if (!text || text.trim().length === 0) {
    throw new Error('メッセージ内容が空です');
  }

  if (text.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`メッセージは${MAX_MESSAGE_LENGTH}文字以内で入力してください`);
  }

  const messageData = {
    senderId,
    receiverId,
    text: text.trim(),
    createdAt: new Date(),
    read: false,
    ...(user && {
      senderName: user.displayName || user.email?.split('@')[0] || 'ユーザー',
      senderPhotoURL: user.photoURL || null,
    }),
  };

  try {
    const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), messageData);
    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// チャットメッセージを取得
export async function fetchChatMessages(userId1, userId2) {
  try {
    // 両方向のメッセージを取得
    const q1 = query(
      collection(db, MESSAGES_COLLECTION),
      where('senderId', '==', userId1),
      where('receiverId', '==', userId2),
      orderBy('createdAt', 'asc')
    );

    const q2 = query(
      collection(db, MESSAGES_COLLECTION),
      where('senderId', '==', userId2),
      where('receiverId', '==', userId1),
      orderBy('createdAt', 'asc')
    );

    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2),
    ]);

    const messages = [];

    snapshot1.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    snapshot2.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // 時系列でソート
    messages.sort((a, b) => {
      const timeA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const timeB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return timeA - timeB;
    });

    return messages;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
}

// ユーザーのチャット一覧を取得
export async function fetchUserChats(userId) {
  try {
    // 送信したメッセージと受信したメッセージを取得
    const sentQuery = query(
      collection(db, MESSAGES_COLLECTION),
      where('senderId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const receivedQuery = query(
      collection(db, MESSAGES_COLLECTION),
      where('receiverId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const [sentSnapshot, receivedSnapshot] = await Promise.all([
      getDocs(sentQuery),
      getDocs(receivedQuery),
    ]);

    const chatMap = new Map();

    // 送信したメッセージ
    sentSnapshot.forEach((doc) => {
      const data = doc.data();
      const otherUserId = data.receiverId;
      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, {
          userId: otherUserId,
          userName: data.receiverName || 'ユーザー',
          userPhotoURL: data.receiverPhotoURL || null,
          lastMessage: data.text,
          lastMessageTime: data.createdAt,
        });
      }
    });

    // 受信したメッセージ
    receivedSnapshot.forEach((doc) => {
      const data = doc.data();
      const otherUserId = data.senderId;
      const existing = chatMap.get(otherUserId);
      if (!existing || (data.createdAt?.toDate?.() || new Date(data.createdAt)) > (existing.lastMessageTime?.toDate?.() || new Date(existing.lastMessageTime))) {
        chatMap.set(otherUserId, {
          userId: otherUserId,
          userName: data.senderName || 'ユーザー',
          userPhotoURL: data.senderPhotoURL || null,
          lastMessage: data.text,
          lastMessageTime: data.createdAt,
        });
      }
    });

    // ユーザー情報を取得
    const chats = Array.from(chatMap.values());
    const userInfos = await Promise.all(
      chats.map(chat => fetchUserInfo(chat.userId).catch(() => null))
    );

    return chats.map((chat, index) => ({
      ...chat,
      userName: userInfos[index]?.displayName || chat.userName,
      userPhotoURL: userInfos[index]?.photoURL || chat.userPhotoURL,
    }));
  } catch (error) {
    console.error('Error fetching user chats:', error);
    return [];
  }
}

// ユーザー情報を取得（Firestoreから）
export async function fetchUserInfo(userId) {
  try {
    // ユーザー情報はFirestoreのusersコレクションに保存されていると仮定
    // 実際の実装では、認証ユーザーの情報をFirestoreに保存する必要があります
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}

