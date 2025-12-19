# GitView セットアップガイド

## 1. Firebase設定情報の取得

Firebase Console（https://console.firebase.google.com/）で以下を確認してください：

1. プロジェクトの設定（⚙️アイコン）を開く
2. 「全般」タブの「マイアプリ」セクションで、Webアプリ（</>）を選択
3. 設定情報をコピー

または、既存のWebアプリがある場合は：
- プロジェクト設定 → 全般 → マイアプリ → Webアプリの設定を表示

## 2. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下を設定してください：

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**重要**: `.env.local` は `.gitignore` に含まれているため、Gitにコミットされません。

## 3. Firestore Databaseの設定

### 3.1 Firestore Databaseの作成

Firebase Consoleで：
1. 「Firestore Database」を選択
2. 「データベースを作成」をクリック
3. 本番環境モードで開始（後でルールを設定します）
4. ロケーションを選択（例: asia-northeast1）

### 3.2 セキュリティルールのデプロイ

#### 方法1: Firebase CLIを使用（推奨）

```bash
# Firebase CLIをインストール（未インストールの場合）
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# プロジェクトを初期化
firebase init firestore

# ルールファイルをデプロイ
firebase deploy --only firestore:rules
```

#### 方法2: Firebase Consoleから直接設定

1. Firebase Console → Firestore Database → 「ルール」タブ
2. `firestore.rules` の内容をコピー＆ペースト
3. 「公開」をクリック

## 4. 依存関係のインストール

```bash
npm install
```

## 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いて動作確認してください。

## 6. Vercelへのデプロイ

### 6.1 Vercelにプロジェクトを接続

1. Vercel（https://vercel.com/）にログイン
2. 「Add New Project」をクリック
3. Gitリポジトリを接続（GitHub/GitLab/Bitbucket）

### 6.2 環境変数の設定

Vercelのプロジェクト設定で、以下の環境変数を追加：

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### 6.3 デプロイ

Vercelが自動的にデプロイします。または：

```bash
npm install -g vercel
vercel
```

## トラブルシューティング

### 環境変数が読み込まれない

- `.env.local` ファイルがプロジェクトルートにあるか確認
- 開発サーバーを再起動
- 変数名が `VITE_` で始まっているか確認

### Firestoreの読み書きエラー

- Firestore Databaseが作成されているか確認
- セキュリティルールが正しくデプロイされているか確認
- Firebase Consoleの「ルール」タブでルールを確認

### GitHub APIのレート制限

- 認証なしのAPIは60リクエスト/時間の制限があります
- 本番環境では、GitHub Personal Access Tokenの使用を検討してください

