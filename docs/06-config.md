# サイト設定情報

このファイルはサイト全体で使用する設定値を定義します。

## 基本情報

実装箇所: [src/app/layout.tsx](../src/app/layout.tsx:20-45)

| 項目 | 値 |
|------|-----|
| サイト名 | いっぴきこあらの大冒険 |
| サイト名（英語） | Ippiki Koala's Great Adventure |
| 著者名 | いっぴきこあら |
| 説明 | 鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログ |
| 言語 | ja (日本語) |
| ロケール | ja_JP |

### metadata設定（layout.tsx）

```typescript
export const metadata: Metadata = {
  title: {
    default: "いっぴきこあらの大冒険",
    template: "%s | いっぴきこあらの大冒険",
  },
  description: "鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログ",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "いっぴきこあらの大冒険",
    description: "鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログ",
    type: "website",
    locale: "ja_JP",
    siteName: "いっぴきこあらの大冒険",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};
```

## プロフィール

実装箇所: [src/components/Sidebar.tsx](../src/components/Sidebar.tsx:16-59)

```typescript
const profile = {
  name: "いっぴきこあら",
  image: "/ippikikoala_profile.png",
  bio: "鄙びた集落・旅館を巡るブログ。カメラを持って温泉、廃線、炭鉱、離島などを訪ねています。α6400 / SEL1670Z",
  camera: "α6400 / SEL1670Z", // カメラ情報
};
```

### Aboutページのテキスト

実装箇所: `src/app/about/page.tsx`（[docs/13-about-page-editing.md](13-about-page-editing.md) 参照）

```typescript
const aboutText = `
  鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログです。
  写真を主体としたコンテンツで、日本各地の魅力的なスポットを紹介しています。

  当ブログでは、観光地化されていない素朴な風景や、
  地方の温泉旅館、廃線跡、炭鉱跡、離島などを訪ねた記録を公開しています。

  ひねくれ夫婦で日本各地をドライブ旅行しています。
  有名な観光地よりも、人があまり訪れない場所に惹かれます。
`;
```

## SNS

実装箇所: [src/components/Footer.tsx](../src/components/Footer.tsx:75-91), [src/components/Sidebar.tsx](../src/components/Sidebar.tsx:39-57)

| サービス | ユーザー名 | URL |
|---------|-----------|-----|
| Twitter/X | @ippiki_koala | https://twitter.com/ippiki_koala |

## ナビゲーション

### ヘッダーナビゲーション

実装箇所: [src/components/Header.tsx](../src/components/Header.tsx:5-10)

```typescript
const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Categories", href: "/categories" },
  { name: "Tags", href: "/tags" },
];
```

### フッターリンク

実装箇所: [src/components/Footer.tsx](../src/components/Footer.tsx:20-66)

```typescript
const footerLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Categories", href: "/categories" },
  { name: "Tags", href: "/tags" },
  { name: "RSS Feed", href: "/feed.xml" },
];
```

## ページ設定

| 項目 | 値 | 実装箇所 |
|------|-----|---------|
| 記事一覧の表示件数/ページ | 9件 | [src/app/page.tsx:6](../src/app/page.tsx#L6) |
| サイドバー - タグ表示数 | 上位15件 | [src/components/Sidebar.tsx:135](../src/components/Sidebar.tsx#L135) |
| サイドバー - 最新記事数 | 5件 | [src/components/Sidebar.tsx:160](../src/components/Sidebar.tsx#L160) |
| サイドバー - 表示項目 | カスタマイズ可能 | [src/config/sidebar.ts](../src/config/sidebar.ts) |
| 関連記事表示数 | 最大4件 | `src/lib/posts.ts` getRelatedPosts() |

### サイドバー表示順序

[docs/14-sidebar-customization.md](14-sidebar-customization.md) を参照して `src/config/sidebar.ts` で設定可能：

- Profile（プロフィール）
- Search（検索ボックス）
- Archive（月別アーカイブ）
- Categories（カテゴリアコーディオン）
- Tags（タグクラウド）
- Recent Posts（最新記事）

## ドメイン

| 項目 | 値 |
|------|-----|
| 本番ドメイン | https://www.ippikikoala.com |
| 開発環境 | http://localhost:3000 |

## 画像ホスティング

実装箇所: [next.config.ts](../next.config.ts:6-14), `.env.local`

| 項目 | 値 | ステータス |
|------|-----|---------|
| サービス | Cloudflare R2 | ✅ 設定済み |
| バケット名 | ippikikoala-blog | ✅ 設定済み |
| 公開URL | https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev | ✅ 設定済み |
| アカウントID | 55296aaa46403434c1e94eca7e640b1a | ✅ 設定済み |

### 環境変数（.env.local）

```bash
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=55296aaa46403434c1e94eca7e640b1a
R2_ACCESS_KEY_ID=c40e122536159b85771375781c870880
R2_SECRET_ACCESS_KEY=b52bea221aff0fa43a054256c613f90a515c3af031ed341f1ab384322397109a
R2_BUCKET_NAME=ippikikoala-blog
R2_PUBLIC_URL=https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev

# Next.js Image Optimization
NEXT_PUBLIC_IMAGE_DOMAIN=pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev

# Site URL (for RSS feed, OGP, etc.)
SITE_URL=https://www.ippikikoala.com
```

### next.config.ts設定

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev',
        pathname: '/**',
      },
    ],
  },
};
```

## アクセス解析

実装箇所: [src/app/layout.tsx:62](../src/app/layout.tsx#L62), [package.json:16](../package.json#L16)

| 項目 | 値 | ステータス |
|------|-----|---------|
| サービス | Vercel Analytics | ✅ 設定済み |
| パッケージ | @vercel/analytics@^1.6.1 | ✅ インストール済み |
| コンポーネント | `<Analytics />` | ✅ layout.tsxに追加済み |

## ファビコン・アイコン

実装箇所: [src/app/layout.tsx:26-29](../src/app/layout.tsx#L26-L29)

| 項目 | 値 | ステータス |
|------|-----|---------|
| アイコン（通常） | `src/app/icon.png` | ✅ 設定済み（58KB） |
| アイコン（Apple） | `src/app/apple-icon.png` | ✅ 設定済み（58KB） |
| プロフィール画像 | `/ippikikoala_profile.png` | ✅ 設定済み |
| 推奨サイズ | 180x180 (apple-icon), 32x32/192x192 (icon) | - |

**Note**: Next.js App Routerでは `src/app/icon.png` と `src/app/apple-icon.png` を自動認識してファビコンとして使用します。

## OGP画像

| 項目 | 値 | ステータス |
|------|-----|---------|
| デフォルト画像 | `public/og-image.png` | ✅ 設定済み（ippikikoala_profile.pngをコピー） |
| 記事ごとのOGP | frontmatterのimage | ✅ 実装済み |
| サイズ | 1200x630px推奨（現在は正方形画像を使用） | ⏳ 最適化推奨 |

各記事のOGP画像は `content/posts/*.mdx` のfrontmatter `image` フィールドで指定。

## RSS設定

実装箇所: [src/app/feed.xml/route.ts](../src/app/feed.xml/route.ts)

```typescript
const feed = new RSS({
  title: "いっぴきこあらの大冒険",
  description: "鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログ",
  site_url: siteUrl,  // 環境変数 SITE_URL から取得（未設定時はlocalhost:3000）
  feed_url: `${siteUrl}/feed.xml`,
  language: "ja",
});
```

RSS feedは `/feed.xml` で自動生成されます。

**ドメイン設定**:
`.env.local` に本番ドメインを設定済み：
```bash
SITE_URL=https://www.ippikikoala.com
```

## コピーライト

実装箇所: [src/components/Footer.tsx:112-114](../src/components/Footer.tsx#L112-L114)

```typescript
© {currentYear} いっぴきこあらの大冒険. All rights reserved.
```

動的に年を取得し表示（`currentYear = new Date().getFullYear()`）

## フォント

実装箇所: [src/app/layout.tsx:10-18](../src/app/layout.tsx#L10-L18)

| 項目 | 値 |
|------|-----|
| サンセリフ | Geist（Google Fonts） |
| モノスペース | Geist Mono（Google Fonts） |

## 依存パッケージ（主要なもの）

実装箇所: [package.json](../package.json)

| パッケージ | バージョン | 用途 |
|-----------|----------|------|
| next | 16.1.1 | フレームワーク |
| react | 19.2.3 | UIライブラリ |
| @next/mdx | ^16.1.1 | MDXサポート |
| @vercel/analytics | ^1.6.1 | アクセス解析 |
| tailwindcss | ^4 | CSSフレームワーク |
| gray-matter | ^4.0.3 | frontmatter解析 |
| date-fns | ^4.1.0 | 日付フォーマット |
| rss | ^1.2.2 | RSS生成 |

## TODO

- [x] Cloudflare R2のセットアップ
- [x] Vercel Analyticsの有効化
- [x] はてなブログからのコンテンツ移行（131記事完了）
- [x] アイコン画像の設定（src/app/icon.png, apple-icon.png）
- [x] デフォルトOGP画像の追加（public/og-image.png）
- [x] RSS feedのタイトル・説明を更新
- [x] 本番ドメインの設定（https://www.ippikikoala.com）
- [ ] OGP画像を1200x630pxの推奨サイズに最適化（任意）
