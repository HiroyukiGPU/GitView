# Vercelデプロイガイド

GitViewをVercelにデプロイする手順を説明します。

## 前提条件

- [ ] Firebaseプロジェクトが作成済み
- [ ] Firestore Databaseが公開済み
- [ ] セキュリティルールが適用済み
- [ ] Gitリポジトリ（GitHub/GitLab/Bitbucket）にコードがプッシュ済み

## 方法1: Vercel Web UIからデプロイ（推奨）

### ステップ1: Vercelアカウントの作成

1. [Vercel](https://vercel.com/) にアクセス
2. 「Sign Up」をクリック
3. GitHub/GitLab/Bitbucketアカウントでログイン（推奨）

### ステップ2: プロジェクトのインポート

1. Vercelダッシュボードで「Add New Project」をクリック
2. Gitリポジトリを選択（GitViewのリポジトリ）
3. 「Import」をクリック

### ステップ3: プロジェクト設定

Vercelが自動的に以下を検出します：
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

設定を確認し、そのまま「Deploy」をクリックしても問題ありません。

### ステップ4: 環境変数の設定（重要）

デプロイ前に環境変数を設定します：

1. プロジェクト設定画面で「Environment Variables」セクションを開く
2. 以下の環境変数を追加：

| 変数名 | 値 |
|--------|-----|
| `VITE_FIREBASE_API_KEY` | `AIzaSyB1HqV6l-4FKBmEfQO1bEhEryZcVWRTOxw` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `gitview-5377d.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `gitview-5377d` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `gitview-5377d.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `1082007243080` |
| `VITE_FIREBASE_APP_ID` | `1:1082007243080:web:926ecbe5129dd944910b7d` |

3. 各環境（Production, Preview, Development）に適用するよう設定
4. 「Save」をクリック

### ステップ5: デプロイ実行

1. 「Deploy」ボタンをクリック
2. ビルドが完了するまで待機（通常1-3分）
3. デプロイ完了後、URLが表示されます（例: `https://gitview.vercel.app`）

## 方法2: Vercel CLIからデプロイ

### ステップ1: Vercel CLIのインストール

```bash
npm install -g vercel
```

### ステップ2: Vercelにログイン

```bash
vercel login
```

ブラウザが開き、ログインを求められます。

### ステップ3: プロジェクトのデプロイ

```bash
# プロジェクトディレクトリに移動
cd /Users/miyaderahiroyuki/Desktop/web/GitView

# デプロイ実行
vercel
```

初回デプロイ時は、以下の質問に答えます：

- **Set up and deploy?** → `Y`
- **Which scope?** → アカウントを選択
- **Link to existing project?** → `N`（新規プロジェクトの場合）
- **Project name?** → `gitview`（任意）
- **Directory?** → `./`（そのままEnter）
- **Override settings?** → `N`（そのままEnter）

### ステップ4: 環境変数の設定

CLIから環境変数を設定：

```bash
vercel env add VITE_FIREBASE_API_KEY
# 値を入力: AIzaSyB1HqV6l-4FKBmEfQO1bEhEryZcVWRTOxw

vercel env add VITE_FIREBASE_AUTH_DOMAIN
# 値を入力: gitview-5377d.firebaseapp.com

vercel env add VITE_FIREBASE_PROJECT_ID
# 値を入力: gitview-5377d

vercel env add VITE_FIREBASE_STORAGE_BUCKET
# 値を入力: gitview-5377d.firebasestorage.app

vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
# 値を入力: 1082007243080

vercel env add VITE_FIREBASE_APP_ID
# 値を入力: 1:1082007243080:web:926ecbe5129dd944910b7d
```

各環境変数に対して、適用環境を選択：
- Production
- Preview
- Development

### ステップ5: 再デプロイ

環境変数を追加した後、再デプロイが必要です：

```bash
vercel --prod
```

## デプロイ後の確認

### 1. 動作確認

デプロイされたURLにアクセスして以下を確認：

- [ ] ページが正常に表示される
- [ ] Global Feedが表示される
- [ ] 投稿フォームが動作する
- [ ] 投稿がFirestoreに保存される
- [ ] GitHub URLを含む投稿でRepoカードが表示される
- [ ] Exploreページが動作する

### 2. エラーの確認

Vercelダッシュボードの「Functions」タブでエラーログを確認できます。

### 3. カスタムドメインの設定（オプション）

1. Vercelダッシュボード → プロジェクト → Settings → Domains
2. ドメインを追加
3. DNS設定を更新

## 自動デプロイの設定

Gitリポジトリと連携している場合、以下のタイミングで自動デプロイされます：

- **Production**: `main` ブランチへのプッシュ
- **Preview**: その他のブランチへのプッシュやPull Request

## トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドをテスト
npm run build
```

エラーが発生する場合は、ローカルで修正してから再デプロイ。

### 環境変数が読み込まれない

- Vercelダッシュボードで環境変数が正しく設定されているか確認
- 変数名が `VITE_` で始まっているか確認
- 再デプロイを実行

### Firestore接続エラー

- Firebase Consoleでセキュリティルールが正しく設定されているか確認
- ブラウザのコンソールでエラーメッセージを確認
- CORS設定を確認（通常は問題ありません）

### GitHub APIレート制限

本番環境でGitHub APIのレート制限に達する場合：

1. GitHub Personal Access Tokenを取得
2. 環境変数 `VITE_GITHUB_TOKEN` を追加（実装が必要）

## 参考リンク

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Vite + Vercel](https://vercel.com/guides/deploying-vite)
- [環境変数の設定](https://vercel.com/docs/concepts/projects/environment-variables)

