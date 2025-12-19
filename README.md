# GitView

OSSを見る・読む・出会うプラットフォーム

## クイックスタート

```bash
npm install
npm run dev
```

## 詳細なセットアップ

Firebase Databaseの設定や環境変数の設定方法については、[SETUP.md](./SETUP.md) を参照してください。

## Vercelへのデプロイ

Vercelへのデプロイ手順については、[DEPLOY.md](./DEPLOY.md) を参照してください。

## 開発

```bash
npm run dev
```

## ビルド

```bash
npm run build
```

## 環境変数

`.env.local` ファイルを作成し、以下を設定してください：

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

