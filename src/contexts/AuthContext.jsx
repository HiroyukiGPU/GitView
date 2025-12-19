import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn('Firebase Authが初期化されていません。環境変数を確認してください。');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Googleでログイン
  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error('Firebase Authが初期化されていません。環境変数を確認してください。');
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Googleログインエラー:', error);
      
      // アカウントが別の認証方法で既に存在する場合
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData?.email;
        if (email) {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          let providerName = '別の方法';
          if (methods.includes('github.com')) {
            providerName = 'GitHub';
          } else if (methods.includes('google.com')) {
            providerName = 'Google';
          }
          throw new Error(`このメールアドレスは既に${providerName}で登録されています。${providerName}でログインしてください。`);
        }
        throw new Error('このメールアドレスは既に別の方法で登録されています。');
      }
      
      throw error;
    }
  };

  // GitHubでログイン
  const signInWithGitHub = async () => {
    if (!auth) {
      throw new Error('Firebase Authが初期化されていません。環境変数を確認してください。');
    }
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('GitHubログインエラー:', error);
      
      // アカウントが別の認証方法で既に存在する場合
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData?.email;
        if (email) {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          let providerName = '別の方法';
          if (methods.includes('github.com')) {
            providerName = 'GitHub';
          } else if (methods.includes('google.com')) {
            providerName = 'Google';
          }
          throw new Error(`このメールアドレスは既に${providerName}で登録されています。${providerName}でログインしてください。`);
        }
        throw new Error('このメールアドレスは既に別の方法で登録されています。');
      }
      
      throw error;
    }
  };

  // ログアウト
  const logout = async () => {
    if (!auth) {
      return;
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error('ログアウトエラー:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

