# サイト設定情報

このファイルはサイト全体で使用する設定値を定義します。

## 基本情報

| 項目 | 値 |
|------|-----|
| サイト名 | いっぴきこあらの大冒険 |
| 著者名 | いっぴきこあら |
| 説明 | 鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログ |
| 言語 | ja (日本語) |

## プロフィール

```typescript
const profile = {
  name: "いっぴきこあら",
  icon: "🐨",
  bio: "鄙びた集落・旅館を巡るブログ。温泉、廃線、炭鉱、離島などを訪ねています。",
  aboutText: `
    鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログです。
    写真を主体としたコンテンツで、日本各地の魅力的なスポットを紹介しています。

    当ブログでは、観光地化されていない素朴な風景や、
    地方の温泉旅館、廃線跡、炭鉱跡、離島などを訪ねた記録を公開しています。

    ひねくれ夫婦で日本各地をドライブ旅行しています。
    有名な観光地よりも、人があまり訪れない場所に惹かれます。
  `,
};
```

## SNS

| サービス | ユーザー名 | URL |
|---------|-----------|-----|
| Twitter/X | ippiki_koala | https://twitter.com/ippiki_koala |

## ナビゲーション

### ヘッダーナビゲーション

```typescript
const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Categories", href: "/categories" },
  { name: "タグ", href: "/tags" },
];
```

### フッターリンク

```typescript
const footerLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Categories", href: "/categories" },
  { name: "タグ", href: "/tags" },
  { name: "RSS Feed", href: "/feed.xml" },
];
```

## ページ設定

| 項目 | 値 |
|------|-----|
| 記事一覧の表示件数/ページ | 9件 |
| サイドバー - カテゴリ表示数 | 上位10件 |
| サイドバー - タグ表示数 | 上位15件 |
| サイドバー - 最新記事数 | 5件 |
| 関連記事表示数 | 最大4件 |

## ドメイン

| 項目 | 値 |
|------|-----|
| 本番ドメイン | 未定（後で設定） |
| 開発環境 | http://localhost:3000 |

## 画像ホスティング

| 項目 | 値 |
|------|-----|
| サービス | Cloudflare R2 |
| バケット名 | （後で設定） |
| 公開URL | （後で設定） |

### 必要な環境変数

```bash
# .env.local
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=blog-images
```

## アクセス解析

| 項目 | 値 |
|------|-----|
| サービス | Vercel Analytics |
| 設定 | Vercelダッシュボードで有効化 |

## ファビコン

| 項目 | 値 |
|------|-----|
| ファイルパス | `/public/favicon.ico` |
| ステータス | 後で追加 |
| 推奨サイズ | 32x32, 192x192, 512x512 |

## OGP画像

| 項目 | 値 |
|------|-----|
| デフォルト画像 | `/public/og-image.png` |
| サイズ | 1200x630px |
| ステータス | 後で追加 |

## RSS設定

```typescript
const rssConfig = {
  title: "いっぴきこあらの大冒険",
  description: "鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログ",
  feed_url: "https://example.com/feed.xml", // 本番ドメイン決定後に更新
  site_url: "https://example.com", // 本番ドメイン決定後に更新
  language: "ja",
  pubDate: new Date().toUTCString(),
};
```

## コピーライト

```
© 2025 いっぴきこあらの大冒険. All rights reserved.
```

## TODO

- [ ] Cloudflare R2のセットアップ
- [ ] 本番ドメインの決定・設定
- [ ] ファビコン画像の作成・追加
- [ ] OGP画像の作成・追加
- [ ] Vercel Analyticsの有効化
- [ ] はてなブログからのコンテンツ移行
