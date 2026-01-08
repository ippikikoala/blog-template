# インフラ・デプロイ

## ホスティング構成

| サービス | 用途 | 費用 |
|---------|------|------|
| Vercel | サイトホスティング | 無料 |
| Cloudflare R2 | 画像ストレージ | 無料〜 |
| 独自ドメイン | ドメイン | 約100円/月 |

**想定月額**: 100〜300円

## Vercel設定

### デプロイ方法

1. GitHubリポジトリと連携
2. 自動デプロイ（mainブランチへのpush時）

### 環境変数

現時点では不要。将来的に必要になった場合に追加。

### ビルド設定

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

## 画像ホスティング

### 選択肢

1. **Cloudflare R2**（推奨）
   - 無料枠: 10GB/月ストレージ、読み取り無制限
   - S3互換API
   - 自動最適化なし（Next.js Imageで対応）

2. **Cloudflare Images**
   - 画像の自動最適化
   - 月額$5〜

3. **GitHubリポジトリ内**（暫定）
   - 容量制限あり（推奨1GB以下）
   - 手軽だが大量の画像には不向き

### 画像最適化

Next.js Image コンポーネントで最適化：

```tsx
<Image
  src={post.image}
  alt={post.title}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 外部画像の許可設定

```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
    ],
  },
};
```

## ドメイン設定

### Vercel + 独自ドメイン

1. ドメインを取得（お名前.com、Cloudflare等）
2. VercelダッシュボードでドメインをAdd
3. DNSレコードを設定（A or CNAME）
4. SSL自動発行

### DNS設定例

```
タイプ: CNAME
名前: @（または www）
値: cname.vercel-dns.com
```

## CI/CD

### 自動デプロイ

- mainブランチへのpush → 本番デプロイ
- PRの作成 → プレビューデプロイ

### ビルドコマンド

```bash
npm run build
```

### チェック項目

- TypeScript型チェック
- ESLint
- 静的ページ生成

## パフォーマンス

### Next.js最適化

- 静的サイト生成（SSG）
- 画像最適化（next/image）
- フォント最適化（next/font）
- コード分割

### Vercel Edge Network

- グローバルCDN
- 自動キャッシュ
- Brotli圧縮

## 監視・分析

### Vercel Analytics（オプション）

- Core Web Vitals
- ページビュー
- 無料枠あり

### Google Analytics（オプション）

- 詳細なアクセス解析
- 無料

## バックアップ

### コンテンツ

- GitHubリポジトリ（content/posts/）
- ローカルバックアップ

### 画像

- Cloudflare R2（冗長化あり）
- ローカルバックアップ推奨

## 移行計画

### Phase 1: 基盤構築 ✅ 完了
- [x] Next.jsプロジェクトセットアップ
- [x] 基本レイアウト実装
- [x] 記事機能実装

### Phase 2: コンテンツ移行 ✅ 完了
- [x] はてなブログからエクスポート
- [x] MDX形式へ変換（139記事）
- [x] 画像をCloudflare R2にアップロード（3,238枚）

### Phase 3: 本番公開 ⏳ 進行中
- [ ] GitHubにプッシュ
- [ ] Vercelデプロイ
- [ ] 独自ドメイン設定（オプション）
- [ ] 旧URLリダイレクト設定（オプション）

### Phase 4: 運用開始
- [ ] 旧ブログからの誘導
- [ ] 新規記事投稿
