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
/search                     # 検索ページ
/archive/[year]/[month]     # 月別アーカイブ
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

### 検索ページ `/search`

**目的**: 記事の全文検索

**構成**:
- 検索フォーム
- 検索結果一覧（記事カードグリッド）
- 検索結果件数表示
- サイドバー

**機能**:
- クライアントサイド検索（Client Component）
- タイトル、説明、本文を対象に検索
- クエリパラメータ対応（`/search?q=温泉`）

**データ取得**:
```typescript
// 静的に全記事データを生成し、クライアントで検索
const allPosts = getAllPosts();
const results = allPosts.filter(post =>
  post.title.includes(query) ||
  post.description.includes(query) ||
  post.content?.includes(query)
);
```

---

### 月別アーカイブ `/archive/[year]/[month]`

**目的**: 特定月の記事一覧

**構成**:
- 見出し「{年}年{月}月の記事一覧」
- 件数表示
- 記事カードグリッド
- サイドバー

**パラメータ**:
- `year`: 年（4桁の数字）
- `month`: 月（1-2桁の数字）

**静的生成**:
```typescript
export async function generateStaticParams() {
  const posts = getAllPosts();
  const yearMonths = new Set<string>();

  posts.forEach(post => {
    const date = new Date(post.date);
    yearMonths.add(`${date.getFullYear()}-${date.getMonth() + 1}`);
  });

  return Array.from(yearMonths).map(ym => {
    const [year, month] = ym.split('-');
    return { year, month };
  });
}
```

**データ取得**:
```typescript
const posts = getAllPosts().filter(post => {
  const date = new Date(post.date);
  return date.getFullYear() === parseInt(year) &&
         date.getMonth() + 1 === parseInt(month);
});
```

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
├── archive/
│   └── [year]/
│       └── [month]/
│           └── page.tsx    # 月別アーカイブ
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
├── search/
│   └── page.tsx            # 検索ページ
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

---

## レイアウト幅のカスタマイズ

ページのコンテナ幅を変更することで、カード画像のサイズを調整できます。

### コンテナ幅の設定

各ページのコンテナは Tailwind CSS のクラスで制御されています：

| クラス | 最大幅 | 用途 |
|--------|--------|------|
| `max-w-6xl` | 1152px | 標準（以前のデフォルト） |
| `max-w-7xl` | 1280px | 現在のデフォルト |
| `max-w-screen-xl` | 1280px | 同等 |
| `max-w-screen-2xl` | 1536px | より広いレイアウト |

### 変更方法

1. 対象のページファイルを開く
2. `className="max-w-7xl mx-auto ..."` のクラスを変更

**例**: すべてのページを広くする場合

```tsx
// 変更前
<div className="max-w-7xl mx-auto px-4 py-12">

// 変更後（より広く）
<div className="max-w-screen-2xl mx-auto px-4 py-12">
```

### 対象ファイル一覧

レイアウト幅を統一したい場合、以下のすべてのファイルを変更します：

| ファイル | 説明 |
|----------|------|
| `src/app/page.tsx` | トップページ |
| `src/app/page/[page]/page.tsx` | ページネーション |
| `src/app/posts/[slug]/page.tsx` | 記事詳細 |
| `src/app/categories/page.tsx` | カテゴリ一覧 |
| `src/app/categories/[category]/page.tsx` | カテゴリ別記事 |
| `src/app/tags/page.tsx` | タグ一覧 |
| `src/app/tags/[tag]/page.tsx` | タグ別記事 |
| `src/app/search/page.tsx` | 検索結果 |
| `src/app/archive/[year]/[month]/page.tsx` | 月別アーカイブ |
| `src/app/about/page.tsx` | Aboutページ |

### サイドバー幅の調整

サイドバーの幅を変更することでもカード領域を広げられます：

```tsx
// 変更前（320px）
<div className="lg:w-80 shrink-0">

// 変更後（256px）
<div className="lg:w-64 shrink-0">
```

| クラス | 幅 |
|--------|-----|
| `w-64` | 256px |
| `w-72` | 288px |
| `w-80` | 320px |

---

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
