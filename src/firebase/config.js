import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 環境変数の検証
const requiredEnvVars = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 環境変数のチェック
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  const errorMessage = `
⚠️ Firebase環境変数が設定されていません: ${missingVars.join(', ')}

ローカル開発の場合:
  .env.localファイルを作成して環境変数を設定してください。

Vercelデプロイの場合:
  1. Vercelダッシュボード → プロジェクト → Settings → Environment Variables
  2. 以下の環境変数を追加してください:
     - VITE_FIREBASE_API_KEY
     - VITE_FIREBASE_AUTH_DOMAIN
     - VITE_FIREBASE_PROJECT_ID
     - VITE_FIREBASE_STORAGE_BUCKET
     - VITE_FIREBASE_MESSAGING_SENDER_ID
     - VITE_FIREBASE_APP_ID
  3. 環境変数を追加した後、再デプロイしてください。
  `;
  console.warn(errorMessage);
}

const firebaseConfig = {
  apiKey: requiredEnvVars.VITE_FIREBASE_API_KEY || '',
  authDomain: requiredEnvVars.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: requiredEnvVars.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: requiredEnvVars.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: requiredEnvVars.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: requiredEnvVars.VITE_FIREBASE_APP_ID || '',
};

// Firebase初期化（環境変数が設定されていなくてもエラーをスローしない）
let app;
let db;
let auth;

// 環境変数がすべて設定されている場合のみ初期化
const hasAllEnvVars = Object.values(requiredEnvVars).every(value => value && value.trim() !== '');

if (hasAllEnvVars) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.error('Firebase初期化エラー:', error);
    console.error('環境変数が正しく設定されているか確認してください。');
    app = null;
    db = null;
    auth = null;
  }
} else {
  console.warn('Firebase環境変数が不完全なため、Firebase機能は使用できません。');
  console.warn('Vercelで環境変数を設定して再デプロイしてください。');
  app = null;
  db = null;
  auth = null;
}

export { db, auth };

