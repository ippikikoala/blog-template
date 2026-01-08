# Cloudflare R2セットアップ

## 概要

Cloudflare R2を使用して、ブログ画像を無料でホスティングする。

### R2を使う理由
- ✅ **無料枠**: 10GB/月ストレージ、読み取り無制限
- ✅ **高速**: グローバルCDN
- ✅ **低コスト**: 無料枠超過後も格安
- ✅ **S3互換**: 移行が容易

---

## セットアップ手順

### 1. Cloudflareアカウント作成

1. https://dash.cloudflare.com/sign-up にアクセス
2. メールアドレス、パスワードを入力
3. メール認証を完了

### 2. R2バケット作成

1. **Cloudflareダッシュボード**にログイン
2. 左メニュー **「R2」** をクリック
3. **「Create bucket」** をクリック
4. **Bucket name**: `blog-images`（任意）
5. **Location**: Automatic（自動）
6. **Create bucket** をクリック

### 3. 公開URL設定

#### 方法1: R2.devドメイン（簡単）

1. バケットの **「Settings」** タブ
2. **「Public access」** セクション
3. **「Allow Access」** をクリック
4. **R2.dev URLが生成される**: `https://pub-xxxxx.r2.dev`

#### 方法2: カスタムドメイン（独自ドメイン必要）

1. 独自ドメイン取得後に設定
2. バケット → Settings → Custom Domains
3. ドメイン追加（例: `images.ippikikoala.com`）

### 4. APIトークン作成

1. Cloudflareダッシュボード → **「R2」**
2. 右上 **「Manage R2 API Tokens」**
3. **「Create API Token」** をクリック
4. **Token name**: `blog-upload`
5. **Permissions**:
   - Object Read & Write
6. **Create API Token**
7. **重要**: 表示された情報を保存
   - Access Key ID
   - Secret Access Key
   - Endpoint (例: `https://xxxxx.r2.cloudflarestorage.com`)

---

## Next.js設定

### 1. 環境変数設定

`.env.local` ファイルを作成（プロジェクトルート）:

```bash
# Cloudflare R2
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=blog-images
R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com
```

### 2. next.config.ts更新

外部画像を許可：

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-*.r2.dev',
      },
    ],
  },
};

export default nextConfig;
```

---

## 画像アップロード方法

### 方法1: PCからアップロード

#### A. Cloudflareダッシュボード経由（簡単）

1. Cloudflareダッシュボード → R2 → バケット選択
2. **「Upload」** ボタン
3. ファイルをドラッグ&ドロップ
4. アップロード完了

#### B. AWS CLIツール経由（一括）

```bash
# AWS CLI インストール
brew install awscli

# 認証設定
aws configure --profile r2
# Access Key ID: (R2のAccess Key ID)
# Secret Access Key: (R2のSecret Access Key)
# Region: auto

# アップロード
aws s3 cp image.jpg s3://blog-images/posts/2025-01/image.jpg \
  --profile r2 \
  --endpoint-url https://xxxxx.r2.cloudflarestorage.com
```

### 方法2: スマホからアップロード

#### A. Cloudflareダッシュボード（モバイル）

1. スマホブラウザでCloudflareダッシュボードにアクセス
2. R2 → バケット → Upload
3. 写真選択してアップロード

**制限**:
- UI操作がやや不便
- 1枚ずつアップロード

#### B. 専用アプリ（推奨）

**「Files by Cloudflare」**（公式アプリ、今後リリース予定）

現時点では、**スマホからはGitHub経由**が最も手軽：
- GitHub Mobile → public/images/posts/ にアップロード
- 後でPCでR2に移行

---

## 記事での画像参照

### R2の画像を使う場合

```markdown
![温泉の写真](https://pub-xxxxx.r2.dev/posts/2025-01/onsen.jpg)
```

### Next.js Imageコンポーネント

```tsx
<Image
  src="https://pub-xxxxx.r2.dev/posts/2025-01/onsen.jpg"
  alt="温泉の写真"
  width={800}
  height={600}
/>
```

---

## フォルダ構成（R2バケット内）

```
blog-images/
├── posts/
│   ├── 2025-01/
│   │   ├── hokkaido-trip-01.jpg
│   │   ├── hokkaido-trip-02.jpg
│   │   └── ...
│   ├── 2025-02/
│   │   └── ...
│   └── ...
├── thumbnails/
│   └── ...
└── og-images/
    └── default.png
```

### 命名規則

```
posts/YYYY-MM/記事スラッグ-連番.jpg

例:
posts/2025-01/hokkaido-onsen-01.jpg
posts/2025-01/hokkaido-onsen-02.jpg
```

---

## 画像最適化

### 1. アップロード前の圧縮

**Mac/PC**:
- ImageOptim（無料）
- Squoosh（Web、無料）

**スマホ**:
- 「写真」アプリで「サイズ調整」
- TinyPNG（アプリ）

### 2. WebP形式に変換

```bash
# ImageMagick使用
brew install imagemagick
magick convert input.jpg -quality 85 output.webp
```

### 3. 推奨サイズ

| 用途 | 推奨サイズ | 備考 |
|------|-----------|------|
| アイキャッチ | 1200x630px | OGP推奨 |
| 記事内画像 | 幅1200px以下 | 長辺1200px |
| サムネイル | 600x400px | カード用 |

---

## 料金

### 無料枠（月額）

| 項目 | 無料枠 |
|------|--------|
| ストレージ | 10GB |
| Class A操作（書き込み） | 100万回 |
| Class B操作（読み取り） | 1,000万回 |

### 無料枠超過後（従量課金）

| 項目 | 料金 |
|------|------|
| ストレージ | $0.015/GB/月 |
| Class A操作 | $4.50/100万回 |
| Class B操作 | $0.36/100万回 |

### 実質コスト試算

個人ブログ（月10記事、各10枚の画像）:
- 画像サイズ: 平均1MB
- 月間アップロード: 100MB
- 累計1年: 1.2GB → **無料枠内**

---

## セキュリティ

### 1. APIトークン管理

- ❌ GitHubにpushしない
- ✅ `.env.local` はgitignore済み
- ✅ Vercelの環境変数に設定

### 2. バケットアクセス制御

- **Public access**: 画像読み取りのみ許可
- **Write access**: APIトークンのみ

---

## トラブルシューティング

### 画像が表示されない

**確認項目**:
1. R2バケットがPublic accessか
2. 画像URLが正しいか
3. next.config.tsでremotePatternsが設定されているか

### アップロードできない

**確認項目**:
1. APIトークンの権限（Object Write）
2. バケット名が正しいか
3. ファイルサイズ制限（5GB以下）

### CORS エラー

R2バケット設定でCORSを許可:

```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"]
  }
]
```

---

## Vercel環境変数設定

1. Vercelダッシュボード → プロジェクト選択
2. **Settings** → **Environment Variables**
3. 以下を追加:

```
NEXT_PUBLIC_R2_PUBLIC_URL = https://pub-xxxxx.r2.dev
R2_ACCOUNT_ID = your-account-id
R2_ACCESS_KEY_ID = your-access-key-id
R2_SECRET_ACCESS_KEY = your-secret-access-key
R2_BUCKET_NAME = blog-images
```

4. **Save**
5. **Redeploy** が必要

---

## まとめ

### セットアップ手順（再掲）

1. ✅ Cloudflareアカウント作成
2. ✅ R2バケット作成
3. ✅ 公開URL設定
4. ✅ APIトークン作成
5. ✅ .env.local設定
6. ✅ next.config.ts更新
7. ✅ Vercel環境変数設定

### 次のステップ

- テスト画像をアップロード
- 記事に画像を埋め込み
- デプロイして表示確認
