# インフラ・デプロイ

## 現在のステータス ✅ 稼働中

| サービス | ステータス | URL/情報 |
|---------|----------|----------|
| **本番サイト** | ✅ 稼働中 | https://ippikikoala.com |
| **Vercel** | ✅ 稼働中 | https://ippikikoala-blog.vercel.app |
| **GitHub** | ✅ 連携済み | https://github.com/ippikikoala/blog-template |
| **Cloudflare R2** | ✅ 稼働中 | https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev |
| **独自ドメイン** | ✅ 設定済み | ippikikoala.com（お名前.com） |

---

## ホスティング構成

| サービス | 用途 | 費用 |
|---------|------|------|
| Vercel | サイトホスティング | 無料 |
| Cloudflare R2 | 画像ストレージ | 無料〜 |
| お名前.com | ドメイン（ippikikoala.com） | 約1,500円/年 |

**現在の月額**: 約125円（ドメイン費用のみ）

---

## Vercel設定

### 本番環境

- **本番URL**: https://ippikikoala.com
- **Vercel URL**: https://ippikikoala-blog.vercel.app
- **GitHub連携**: ippikikoala/blog-template
- **自動デプロイ**: ✅ 有効（mainブランチへのpush時）

### デプロイ方法

1. GitHubリポジトリと連携 ✅ 完了
2. 自動デプロイ（mainブランチへのpush時） ✅ 動作確認済み

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

## ドメイン設定 ✅ 設定済み

### 現在の設定

- **ドメイン**: ippikikoala.com
- **レジストラ**: お名前.com
- **DNS**: お名前.com DNS (01.dnsv.jp / 02.dnsv.jp / 03.dnsv.jp / 04.dnsv.jp)
- **SSL**: Vercel自動発行 ✅

### DNS設定内容

| タイプ | ホスト名 | VALUE | TTL |
|--------|---------|-------|-----|
| A | @ | 216.198.79.1 | 3600 |
| CNAME | www | e78c804622777ab1.vercel-dns-017.com. | 3600 |

### 設定手順（記録用）

1. お名前.comでドメイン取得（Whois情報公開代行を有効化）
2. Vercelダッシュボード → Settings → Domains → Add Domain
3. お名前.com Navi → DNS設定/転送設定 → DNSレコード設定
4. 上記のAレコード・CNAMEレコードを追加
5. DNS反映待ち（15分〜1時間）
6. SSL証明書自動発行確認

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

### Phase 3: 本番公開 ✅ 完了（2026年1月8日）
- [x] GitHubにプッシュ
- [x] Vercelデプロイ
- [x] サイト動作確認
- [x] 独自ドメイン設定（ippikikoala.com）
- [ ] 旧URLリダイレクト設定（オプション）

### Phase 4: 運用開始 ⏳ 進行中
- [ ] Vercel Analytics有効化（オプション）
- [ ] 旧ブログからの誘導
- [x] 新規記事投稿可能
