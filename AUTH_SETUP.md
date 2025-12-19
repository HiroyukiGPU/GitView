# 認証機能のセットアップガイド

GitHubとGoogleでのログイン機能を有効にするための手順です。

## Firebase Consoleでの設定

### 1. Authenticationの有効化

1. Firebase Console（https://console.firebase.google.com/）にアクセス
2. プロジェクトを選択
3. 左メニューから「Authentication」を選択
4. 「始める」をクリックしてAuthenticationを有効化

### 2. Google認証プロバイダーの設定

1. Authentication → 「Sign-in method」タブ
2. 「Google」をクリック
3. 「有効にする」をトグル
4. プロジェクトのサポートメールを選択（既存のメールアドレスを選択）
5. 「保存」をクリック

### 3. GitHub認証プロバイダーの設定

1. Authentication → 「Sign-in method」タブ
2. 「GitHub」をクリック
3. 「有効にする」をトグル

#### GitHub OAuth Appの作成

GitHubでOAuth Appを作成する必要があります：

1. GitHubにログイン
2. Settings → Developer settings → OAuth Apps
3. 「New OAuth App」をクリック
4. 以下の情報を入力：
   - **Application name**: `GitView`（任意）
   - **Homepage URL**: `https://gitview-5377d.firebaseapp.com`（またはVercelのURL）
   - **Authorization callback URL**: `https://gitview-5377d.firebaseapp.com/__/auth/handler`（Firebase Consoleに表示されるURLを使用）
5. 「Register application」をクリック
6. **Client ID**と**Client secret**をコピー

#### Firebase ConsoleにGitHub認証情報を設定

1. Firebase Console → Authentication → Sign-in method → GitHub
2. コピーした**Client ID**と**Client secret**を貼り付け
3. 「保存」をクリック

### 4. 承認済みドメインの設定

1. Authentication → 「Settings」タブ
2. 「承認済みドメイン」セクションを確認
3. デプロイ先のドメイン（例: `your-app.vercel.app`）が含まれているか確認
4. 含まれていない場合は「ドメインを追加」で追加

## 動作確認

1. アプリを起動
2. ナビゲーションバーのログインボタンをクリック
3. 「Googleでログイン」または「GitHubでログイン」をクリック
4. 認証フローが正常に完了するか確認

## トラブルシューティング

### Googleログインが動作しない

- Firebase ConsoleでGoogle認証プロバイダーが有効になっているか確認
- プロジェクトのサポートメールが設定されているか確認

### GitHubログインが動作しない

- GitHub OAuth AppのCallback URLが正しいか確認
- Firebase ConsoleのGitHub認証設定でClient IDとClient secretが正しく設定されているか確認
- GitHub OAuth Appの設定でCallback URLが正しいか確認

### 承認済みドメインエラー

- Firebase Console → Authentication → Settings → 承認済みドメインで、使用しているドメインが追加されているか確認
- ローカル開発の場合は `localhost` が自動的に追加されています

## 注意事項

- 本番環境では、必ず承認済みドメインを設定してください
- GitHub OAuth AppのCallback URLは、Firebase Consoleに表示される正確なURLを使用してください
- セキュリティのため、Client secretは絶対に公開しないでください

