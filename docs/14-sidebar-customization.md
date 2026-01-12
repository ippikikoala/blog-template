# サイドバーカスタマイズガイド

このドキュメントでは、ブログのサイドバーに追加された機能と、カスタマイズ方法について説明します。

---

## サイドバーの機能

現在、サイドバーには以下の6つのセクションがあります：

| セクション | 説明 | デフォルト |
|-----------|------|-----------|
| **Profile** | プロフィール画像とSNSリンク | 有効 |
| **Search** | 記事検索ボックス | 有効 |
| **Archive** | 月別アーカイブ（年ごとのアコーディオン表示） | 有効 |
| **Categories** | カテゴリ一覧（地方別・テーマ別） | 有効 |
| **Tags** | タグ一覧（上位15件） | 有効 |
| **Recent Posts** | 最新記事5件 | 無効 |

---

## サイドバーの並び順を変更する

### 設定ファイルの場所

```
src/config/sidebar.ts
```

### 設定内容

```typescript
export const sidebarConfig: SidebarItemConfig[] = [
  { type: 'profile', enabled: true, order: 1 },
  { type: 'search', enabled: true, order: 2 },
  { type: 'archive', enabled: true, order: 3 },
  { type: 'categories', enabled: true, order: 4 },
  { type: 'tags', enabled: true, order: 5 },
  { type: 'recentPosts', enabled: false, order: 6 },
];
```

### パラメータ説明

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| `type` | string | セクションの種類（変更不可） |
| `enabled` | boolean | `true`: 表示、`false`: 非表示 |
| `order` | number | 表示順序（小さい数字が上に表示） |

---

## カスタマイズ例

### 例1: 検索を一番上に移動

```typescript
{ type: 'search', enabled: true, order: 1 },    // 最上部
{ type: 'profile', enabled: true, order: 2 },
{ type: 'archive', enabled: true, order: 3 },
{ type: 'categories', enabled: true, order: 4 },
{ type: 'tags', enabled: true, order: 5 },
{ type: 'recentPosts', enabled: false, order: 6 },
```

### 例2: 最新記事を表示し、アーカイブを非表示

```typescript
{ type: 'profile', enabled: true, order: 1 },
{ type: 'search', enabled: true, order: 2 },
{ type: 'archive', enabled: false, order: 3 },   // 非表示に
{ type: 'categories', enabled: true, order: 4 },
{ type: 'tags', enabled: true, order: 5 },
{ type: 'recentPosts', enabled: true, order: 6 }, // 表示に
```

### 例3: カテゴリとタグを入れ替え

```typescript
{ type: 'profile', enabled: true, order: 1 },
{ type: 'search', enabled: true, order: 2 },
{ type: 'archive', enabled: true, order: 3 },
{ type: 'tags', enabled: true, order: 4 },       // タグを先に
{ type: 'categories', enabled: true, order: 5 }, // カテゴリを後に
{ type: 'recentPosts', enabled: false, order: 6 },
```

---

## 検索機能について

### 概要

サイドバーの検索ボックスにキーワードを入力すると、記事を検索できます。

### 検索対象

- 記事タイトル
- 記事の説明文（description）
- タグ

### URL形式

```
/search?q=キーワード
```

### 関連ファイル

| ファイル | 説明 |
|---------|------|
| `src/components/SearchBox.tsx` | 検索ボックスコンポーネント |
| `src/app/search/page.tsx` | 検索結果ページ |
| `src/lib/posts.ts` → `searchPosts()` | 検索ロジック |

---

## 月別アーカイブについて

### 概要

年ごとにアコーディオン形式で月一覧を表示します。月をクリックすると、その月の記事一覧ページに遷移します。

### URL形式

```
/archive/{年}/{月}
例: /archive/2026/1  → 2026年1月の記事一覧
```

### 関連ファイル

| ファイル | 説明 |
|---------|------|
| `src/components/MonthlyArchive.tsx` | 月別アーカイブコンポーネント |
| `src/app/archive/[year]/[month]/page.tsx` | 月別アーカイブページ |
| `src/lib/posts.ts` → `getMonthlyArchive()` | アーカイブデータ取得 |
| `src/lib/posts.ts` → `getPostsByMonth()` | 月別記事取得 |

---

## サイドバーコンポーネント構成

### ファイル構成

```
src/
├── config/
│   └── sidebar.ts          # サイドバー設定
├── components/
│   ├── Sidebar.tsx         # サイドバー本体
│   ├── SearchBox.tsx       # 検索ボックス
│   ├── MonthlyArchive.tsx  # 月別アーカイブ
│   └── CategoryAccordion.tsx # カテゴリアコーディオン
└── app/
    ├── search/
    │   └── page.tsx        # 検索結果ページ
    └── archive/
        └── [year]/
            └── [month]/
                └── page.tsx # 月別アーカイブページ
```

### Sidebar.tsx の仕組み

`Sidebar.tsx` は設定ファイルを読み込み、`enabled: true` かつ `order` 順にセクションをレンダリングします。

```typescript
// 有効な項目を order 順に取得
const enabledItems = getEnabledSidebarItems();

// 動的にレンダリング
{enabledItems.map((item) => {
  const Component = sectionComponents[item.type];
  return <Component key={item.type} />;
})}
```

---

## 新しいセクションを追加する場合

1. `src/config/sidebar.ts` の `SidebarItemType` に新しい型を追加
2. `sidebarConfig` に新しい項目を追加
3. `src/components/Sidebar.tsx` に新しいセクションコンポーネントを作成
4. `sectionComponents` マップに追加

例：「おすすめ記事」セクションを追加する場合

```typescript
// sidebar.ts
export type SidebarItemType =
  | 'profile'
  | 'search'
  | 'archive'
  | 'categories'
  | 'tags'
  | 'recentPosts'
  | 'featured';  // 追加

export const sidebarConfig: SidebarItemConfig[] = [
  // ...
  { type: 'featured', enabled: true, order: 7 },
];
```

```typescript
// Sidebar.tsx
function FeaturedSection() {
  // おすすめ記事の表示ロジック
  return (
    <div className="card p-6">
      <h3>Featured</h3>
      {/* ... */}
    </div>
  );
}

const sectionComponents: Record<SidebarItemType, React.FC> = {
  // ...
  featured: FeaturedSection,
};
```

---

## 変更履歴

| 日付 | 内容 |
|------|------|
| 2026-01-12 | 検索機能、月別アーカイブ機能を追加。サイドバー設定ファイルによる並び順管理を実装。 |
