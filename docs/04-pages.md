# ページ構成

## ルーティング

```
/                           # トップページ（記事一覧）
/page/[page]                # 記事一覧（ページネーション）
/posts/[slug]               # 記事詳細
/categories                 # カテゴリ一覧
/categories/[category]      # カテゴリ別記事一覧
/tags                       # タグ一覧
/tags/[tag]                 # タグ別記事一覧
/about                      # Aboutページ
/feed.xml                   # RSSフィード
```

## 各ページ仕様

### トップページ `/`

**目的**: 最新記事の一覧表示

**構成**:
- 見出し「Latest Posts」
- 記事カードグリッド（3列 / 2列 / 1列）
- ページネーション
- サイドバー

**表示件数**: 9件/ページ

**データ取得**:
```typescript
const posts = getAllPosts().slice(0, POSTS_PER_PAGE);
```

---

### 記事一覧（ページネーション） `/page/[page]`

**目的**: 2ページ目以降の記事一覧

**構成**: トップページと同じ

**パラメータ**:
- `page`: ページ番号（2以上の整数）

**静的生成**:
```typescript
export async function generateStaticParams() {
  const posts = getAllPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}
```

---

### 記事詳細 `/posts/[slug]`

**目的**: 記事の全文表示

**構成**:
- ヘッダー
  - カテゴリバッジ
  - タイトル
  - 投稿日
  - タグ
- アイキャッチ画像（あれば）
- 目次
- 本文（MDX）
- シェアボタン
- 前後記事ナビ
- 関連記事（最大4件）
- サイドバー

**メタデータ**:
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = getPostBySlug(slug);
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: post.image ? [post.image] : undefined,
    },
  };
}
```

**関連記事ロジック**:
- 同じカテゴリ: +2点
- 同じタグ: +1点/タグ
- スコア順で最大4件

---

### カテゴリ一覧 `/categories`

**目的**: 全カテゴリの一覧表示

**構成**:
- 見出し「カテゴリ一覧」
- カテゴリカードグリッド（4列 / 3列 / 2列）
  - カテゴリ名
  - 記事件数
- サイドバー

**データ取得**:
```typescript
const categories = getAllCategories(); // { name, count }[]
```

---

### カテゴリ別記事一覧 `/categories/[category]`

**目的**: 特定カテゴリの記事一覧

**構成**:
- カテゴリバッジ
- 見出し「{カテゴリ名}の記事一覧」
- 件数表示
- 記事カードグリッド
- サイドバー

**パラメータ**:
- `category`: カテゴリ名（URLエンコード）

**データ取得**:
```typescript
const posts = getPostsByCategory(decodedCategory);
```

---

### タグ一覧 `/tags`

**目的**: 全タグの一覧表示

**構成**:
- 見出し「タグ一覧」
- タグクラウド（件数付き）
- サイドバー

**データ取得**:
```typescript
const tags = getAllTags(); // { name, count }[]
```

---

### タグ別記事一覧 `/tags/[tag]`

**目的**: 特定タグの記事一覧

**構成**:
- タグバッジ
- 見出し「{タグ名}の記事一覧」
- 件数表示
- 記事カードグリッド
- サイドバー

**パラメータ**:
- `tag`: タグ名（URLエンコード）

**データ取得**:
```typescript
const posts = getPostsByTag(decodedTag);
```

---

### Aboutページ `/about`

**目的**: サイトと著者の紹介

**構成**:
- プロフィールアイコン
- サイト説明
- 著者紹介
- お問い合わせ方法
- サイドバー

**コンテンツ**: 静的（ハードコード）

---

### RSSフィード `/feed.xml`

**目的**: RSS配信

**形式**: RSS 2.0

**含む情報**:
- タイトル
- 説明
- リンク
- 投稿日
- カテゴリ

## ディレクトリ構造

```
src/app/
├── layout.tsx              # ルートレイアウト
├── page.tsx                # トップページ
├── globals.css             # グローバルスタイル
├── about/
│   └── page.tsx            # Aboutページ
├── categories/
│   ├── page.tsx            # カテゴリ一覧
│   └── [category]/
│       └── page.tsx        # カテゴリ別一覧
├── tags/
│   ├── page.tsx            # タグ一覧
│   └── [tag]/
│       └── page.tsx        # タグ別一覧
├── posts/
│   └── [slug]/
│       └── page.tsx        # 記事詳細
├── page/
│   └── [page]/
│       └── page.tsx        # ページネーション
└── feed.xml/
    └── route.ts            # RSSフィード
```

## 共通レイアウト

```tsx
// layout.tsx
<html lang="ja">
  <body>
    <Header />
    <div className="flex-1">{children}</div>
    <Footer />
    <ScrollToTop />
    <Lightbox />
  </body>
</html>
```

## SEO対応

### グローバルメタデータ

```typescript
export const metadata: Metadata = {
  title: {
    default: "いっぴきこあらの大冒険",
    template: "%s | いっぴきこあらの大冒険",
  },
  description: "鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログ",
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
