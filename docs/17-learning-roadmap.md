# 技術スタック学習ロードマップ

このドキュメントでは、このブログプロジェクトの技術スタックを効率的に学習するための段階的なプランを提供します。

## 対象者

- React/Next.js初心者
- このブログの全体的なアーキテクチャを理解したい方
- MDXコンテンツ管理、UI/デザインシステムを学びたい方
- 実際に手を動かして改善したい方

---

## 📚 学習ロードマップ

### **Phase 1: コードを読む前の基礎理解**（推奨: 1-2週間）

まずはReact/Next.jsの基本概念を理解しましょう。

#### 学習リソース

1. **React公式チュートリアル**
   - コンポーネント、Props、Stateの基本
   - URL: https://react.dev/learn

2. **Next.js公式ドキュメント**
   - App Router、Server Components、ファイルベースルーティング
   - URL: https://nextjs.org/docs/app

#### このブログで使われている主要概念

- **Server Components**（デフォルトでサーバー側で実行）
- **Client Components**（`'use client'`で明示的に宣言）
- **動的ルーティング**（`[slug]`、`[category]`など）
- **Static Site Generation (SSG)** - ビルド時にページを生成

---

### **Phase 2: プロジェクト全体像の把握**（推奨: 2-3日）

#### Step 1: ドキュメントを読む順序

以下の順番でドキュメントを読むことを推奨します：

1. [00-overview.md](00-overview.md) - 技術スタック全体像
2. [01-design.md](01-design.md) - デザインシステム（カラー、タイポグラフィ）
3. [02-components.md](02-components.md) - コンポーネント一覧と役割
4. [03-content.md](03-content.md) - MDXフロントマター仕様
5. [04-pages.md](04-pages.md) - ページ構成とルーティング

#### Step 2: 実際にローカルで動かす

```bash
cd /Users/ippiki_koala/Desktop/Claude/blog
npm install
npm run dev
```

→ http://localhost:3000 を開いて、実際の動作を確認

**確認ポイント:**
- トップページの記事一覧表示
- 記事詳細ページの表示
- カテゴリ・タグページの動作
- レスポンシブデザイン（ブラウザのデベロッパーツールでモバイル表示）

---

### **Phase 3: コードリーディング**（推奨: 1週間）

重要なファイルを以下の順序で読むことをおすすめします。

#### 3-1. データフロー理解（MDXコンテンツ管理）

| ファイル | 役割 | 学べること |
|---------|------|-----------|
| `src/lib/posts.ts` | 記事データの読み込み・処理 | gray-matter、ファイルシステム操作、データ集計 |
| `content/posts/` | MDXファイル（サンプル1-2個読む） | フロントマター構造、Markdown + JSX |

**重要な関数:**

- `getAllPosts()` - 全記事取得・ソート
- `getPostBySlug(slug)` - 個別記事取得
- `getPostsByCategory(category)` - カテゴリフィルタリング
- `getPostsByTag(tag)` - タグフィルタリング
- `getRelatedPosts(currentPost)` - 関連記事アルゴリズム（カテゴリ+2pt、タグ+1pt/個）
- `getAllCategories()` - カテゴリ集計
- `getAllTags()` - タグ集計

**学習のコツ:**
1. まず`getAllPosts()`の処理フローを追う
2. `fs`（ファイルシステム）と`gray-matter`の使い方を理解
3. `getRelatedPosts()`のスコアリングロジックを読む

---

#### 3-2. ルーティング理解（Next.js App Router）

| ファイル | 役割 | 学べること |
|---------|------|-----------|
| `src/app/layout.tsx` | ルートレイアウト | フォント設定、メタデータ、共通レイアウト |
| `src/app/page.tsx` | トップページ | ページネーション、記事一覧表示 |
| `src/app/posts/[slug]/page.tsx` | 記事詳細ページ | 動的ルーティング、`generateStaticParams` |
| `src/app/categories/[category]/page.tsx` | カテゴリページ | フィルタリング処理、動的ページ生成 |
| `src/app/tags/[tag]/page.tsx` | タグページ | フィルタリング処理、動的ページ生成 |

**学習のポイント:**

- **動的ルーティング**: `[slug]`、`[category]`などのディレクトリ名でパラメータを受け取る
- **generateStaticParams()**: ビルド時に生成するページのパラメータリストを返す
- **generateMetadata()**: 各ページのSEOメタデータを動的生成
- **Server Components**: デフォルトでサーバーサイド実行（データフェッチが効率的）

---

#### 3-3. UI/コンポーネント理解

| ファイル | 役割 | 学べること |
|---------|------|-----------|
| `src/components/Header.tsx` | ヘッダー | ナビゲーション、モバイルメニュー |
| `src/components/Footer.tsx` | フッター | リンク、コピーライト |
| `src/components/Sidebar.tsx` | サイドバー | カテゴリ・タグ表示、レスポンシブ |
| `src/components/PostCard.tsx` | 記事カード | レスポンシブデザイン、画像最適化 |
| `src/components/PostContent.tsx` | 記事本文 | MDXレンダリング、typography |
| `src/components/TableOfContents.tsx` | 目次 | Client Component、スクロール連動 |
| `src/components/Lightbox.tsx` | 画像拡大表示 | Client Component、モーダル |
| `src/components/Pagination.tsx` | ページネーション | ナビゲーション、アクティブ状態 |
| `src/app/globals.css` | グローバルCSS | CSS変数、Tailwind設定、typography |

**コンポーネント設計の特徴:**

- **Server Componentsがデフォルト** - データフェッチが必要なコンポーネント
- **Client Components** - インタラクティブ機能（`'use client'`宣言）
  - TableOfContents（スクロール連動）
  - Lightbox（画像拡大）
  - MobileMenu（メニュー開閉）
  - ScrollToTop（スクロールボタン）

**学習のコツ:**

1. まず`PostCard.tsx`を読んで、基本的なコンポーネント構造を理解
2. `Sidebar.tsx`でデータの集計・表示方法を学ぶ
3. `TableOfContents.tsx`でClient Componentの書き方を学ぶ
4. `globals.css`でデザインシステム（CSS変数、Tailwind）を理解

---

### **Phase 4: 実践演習**（推奨: 2-3週間）

コードを読むだけでなく、実際に手を動かして改善してみましょう。

#### **初級タスク**

##### 1. 新規記事を追加する

[12-new-post-guide.md](12-new-post-guide.md) を参考に、`content/posts/` に新しいMDXファイルを作成。

**手順:**
1. `content/posts/2025-01-15-test-post.mdx` を作成
2. フロントマター（title, date, category, tags）を書く
3. 本文をMarkdownで書く
4. `npm run dev` で確認

**学べること:**
- MDXファイルの構造
- フロントマターの書き方
- ホットリロードの動作

---

##### 2. CSS変数を変更してカラーを変える

`src/app/globals.css` の `--color-accent` を変更して、アクセントカラーを変更。

**手順:**
1. `src/app/globals.css` を開く
2. `--color-accent: #4a8cb7;` を別の色（例: `#e74c3c`）に変更
3. 開発サーバーでリアルタイム確認

**学べること:**
- CSS変数の仕組み
- Tailwind CSSとの連携
- グローバルスタイルの管理

---

##### 3. Sidebarのカテゴリ表示数を変更

`src/components/Sidebar.tsx` の `topCategories.slice(0, 10)` を `slice(0, 5)` に変更。

**手順:**
1. `src/components/Sidebar.tsx` を開く
2. `slice(0, 10)` を `slice(0, 5)` に変更
3. サイドバーに表示されるカテゴリが5件になることを確認

**学べること:**
- JavaScriptの配列操作
- コンポーネントの表示ロジック

---

#### **中級タスク**

##### 4. 新しいコンポーネントを作る

`src/components/Badge.tsx` を作成して、タグをバッジ表示。

**手順:**
1. `src/components/Badge.tsx` を新規作成
2. Tailwind CSSでスタイリング
3. `PostCard.tsx` や `Sidebar.tsx` で使ってみる

**サンプルコード:**
```tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function Badge({ children, variant = 'primary' }: BadgeProps) {
  return (
    <span className={`
      inline-block px-3 py-1 rounded-full text-sm
      ${variant === 'primary' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
    `}>
      {children}
    </span>
  );
}
```

**学べること:**
- コンポーネントの作成方法
- TypeScript型定義
- Tailwind CSSのユーティリティクラス

---

##### 5. 関連記事アルゴリズムを改善

`src/lib/posts.ts` の `getRelatedPosts()` を読んで、スコアリングロジックを調整。

**手順:**
1. `src/lib/posts.ts` の `getRelatedPosts()` を読む
2. スコアリングロジックを変更（例: カテゴリ+3pt、タグ+2pt）
3. 記事詳細ページで関連記事の表示が変わることを確認

**学べること:**
- アルゴリズムの理解と改善
- データフィルタリングとソート

---

##### 6. 新しいページを追加

`src/app/about/page.tsx` を作成して自己紹介ページを追加。

**手順:**
1. `src/app/about/page.tsx` を新規作成
2. メタデータとコンテンツを記述
3. `src/components/Header.tsx` にリンク追加

**サンプルコード:**
```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - いっぴきこあらの大冒険',
  description: 'このブログについて',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About</h1>
      <p>ブログの説明...</p>
    </div>
  );
}
```

**学べること:**
- 新規ページの作成
- メタデータの設定
- ナビゲーションの更新

---

#### **上級タスク**

##### 7. 検索機能を追加

Client Componentで検索入力フォームを作成し、全記事をフィルタリング。

**手順:**
1. `src/components/SearchBox.tsx` をClient Componentとして作成
2. `useState`で検索クエリを管理
3. `getAllPosts()` で全記事取得してフィルタリング
4. トップページやヘッダーに配置

**学べること:**
- Client Componentの実装
- React Hooks（useState, useEffect）
- クライアントサイドフィルタリング

---

##### 8. 画像最適化の実装

Next.js Imageコンポーネントを使って画像最適化。

**手順:**
1. `next/image` をインポート
2. `PostCard.tsx` や `PostContent.tsx` で `<img>` を `<Image>` に置き換え
3. `width`、`height`、`alt` を設定

**学べること:**
- Next.js Image最適化
- レスポンシブ画像
- パフォーマンス改善

---

### **Phase 5: デプロイ・運用**

#### 学習項目

1. **Vercelへのデプロイ**
   - GitHubリポジトリ連携
   - 自動デプロイの設定
   - 環境変数の管理

2. **パフォーマンス最適化**
   - Lighthouse監査
   - Core Web Vitals改善
   - 画像最適化

3. **SEO対策**
   - [15-seo-guide.md](15-seo-guide.md) を参照
   - sitemap.xml、robots.txt
   - OGP画像設定

---

## 🎯 おすすめの学習フロー

```
1. React/Next.js基礎学習（公式チュートリアル）
   ↓
2. docs/00-overview.md から順に読む
   ↓
3. npm run dev でローカル起動
   ↓
4. src/lib/posts.ts を読んでデータフローを理解
   ↓
5. src/app/page.tsx を読んでルーティングを理解
   ↓
6. src/components/PostCard.tsx を読んでコンポーネントを理解
   ↓
7. 新規記事を追加してビルド確認
   ↓
8. 小さな改善タスクに挑戦（CSS変更、表示数変更など）
   ↓
9. 中級タスクで新機能追加
   ↓
10. 上級タスクでインタラクティブ機能追加
```

---

## 📖 学習時に参考になるリソース

### 公式ドキュメント

- **Next.js App Router**: https://nextjs.org/docs/app
- **React公式**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **MDX**: https://mdxjs.com/
- **TypeScript**: https://www.typescriptlang.org/docs/

### このプロジェクトのドキュメント

- `docs/` フォルダ全体
- `CLAUDE.md` - プロジェクト概要
- `REQUIREMENTS.md` - 詳細要件
- `TODO.md` - 改善項目リスト

---

## 💡 学習のコツ

### 1. 小さく始める

最初から全てを理解しようとせず、1つのコンポーネントや機能に集中しましょう。

### 2. 実際に動かす

コードを読むだけでなく、必ずローカル環境で動作確認しましょう。

### 3. 変更してみる

小さな変更（色、テキスト、表示件数など）から始めて、徐々に大きな機能追加に挑戦しましょう。

### 4. エラーを恐れない

エラーメッセージは学習のチャンス。エラーを読んで理解することで成長します。

### 5. ドキュメントを活用

わからないことがあれば、まず公式ドキュメントや `docs/` フォルダを確認しましょう。

### 6. 質問する

詰まったら遠慮なく質問しましょう。具体的なファイル名や行番号を示すと回答しやすくなります。

---

## 🚀 次のステップ

このロードマップを終えたら、以下のような発展的な学習に進めます：

- **パフォーマンス最適化**: Lighthouse、Core Web Vitals
- **アクセシビリティ**: ARIA、キーボードナビゲーション
- **テスト**: Jest、React Testing Library
- **CI/CD**: GitHub Actions、自動テスト
- **高度な機能**: 全文検索、コメント機能、SNS連携

---

質問や詰まった箇所があれば、いつでも聞いてください！
