# カテゴリ階層構造仕様

## 概要

カテゴリ（都道府県）を地方別に階層表示する機能。設定ファイルベースで管理し、複数カテゴリにも対応。

## 実装日

2026-01-10

## 主な機能

### 1. 階層構造（2階層）

- **第1階層**: 地方（北海道、東北、関東、中部、近畿、中国、四国、九州・沖縄）
- **第2階層**: 都道府県

### 2. 複数カテゴリ対応

記事は複数の都道府県カテゴリを持つことができる。

```yaml
# 単一カテゴリ
category: "青森県"

# 複数カテゴリ
category: ["熊本県", "宮崎県"]
```

### 3. 重複カウント

1記事が複数カテゴリに属する場合、各カテゴリで1件ずつカウントされる。

**例**:
- 記事A: `category: ["熊本県", "宮崎県"]`
- 結果: 熊本県 +1, 宮崎県 +1

## ファイル構成

### 新規作成

1. **src/config/categories.ts** - カテゴリ設定ファイル
   - 8地方区分の定義
   - 47都道府県の定義
   - 表示順序の管理

2. **src/lib/categoryUtils.ts** - ユーティリティ関数
   - 都道府県→地方の逆引き
   - カテゴリ正規化（文字列/配列変換）
   - 順序取得

### 修正

3. **src/lib/posts.ts**
   - `PostMeta.category`: `string | string[]` に型変更
   - `getAllCategories()`: 設定順ソート、重複カウント
   - `getCategoriesByRegion()`: 地方別集計（新規）
   - `getPostsByCategory()`: 配列対応
   - `getRelatedPosts()`: 複数カテゴリのスコア計算

4. **src/components/Sidebar.tsx**
   - 階層表示UI
   - 地方名を見出しに、都道府県を左ボーダー付きでインデント

5. **src/app/posts/[slug]/page.tsx**
   - 複数カテゴリを並べて表示

6. **src/components/PostCard.tsx**
   - 複数カテゴリタグを横並び表示

## UI表示

### サイドバー

```
Categories
━━━━━━━━━━━━━━
北海道
  └ 北海道 (25)

東北
  ├ 青森県 (8)
  ├ 秋田県 (5)
  └ 岩手県 (3)

九州・沖縄
  ├ 熊本県 (12)
  └ 宮崎県 (7)
```

- 地方名: `font-semibold`（太字）
- 都道府県: `pl-3 border-l-2`（左ボーダーでインデント）

### 記事カード

```html
<div class="mb-2 flex flex-wrap gap-1">
  <span class="category">熊本県</span>
  <span class="category">宮崎県</span>
</div>
```

### 記事詳細ページ

```html
<div class="mb-3 flex flex-wrap gap-2">
  <Link href="/categories/熊本県" class="category">熊本県</Link>
  <Link href="/categories/宮崎県" class="category">宮崎県</Link>
</div>
```

## カテゴリ設定の変更方法

### 都道府県の順序変更

`src/config/categories.ts` の `order` フィールドを編集:

```typescript
{
  id: 'kyushu_okinawa',
  name: '九州・沖縄',
  order: 8,
  prefectures: [
    { id: 'fukuoka', name: '福岡県', order: 1 },
    { id: 'kumamoto', name: '熊本県', order: 4 }, // ← この数値を変更
    { id: 'miyazaki', name: '宮崎県', order: 6 },
  ],
}
```

### 都道府県の追加

```typescript
prefectures: [
  // ... 既存の都道府県
  { id: 'new-pref', name: '新都道府県', order: 9 },
]
```

## 技術仕様

### 型定義

```typescript
// src/config/categories.ts
interface Prefecture {
  id: string;      // 識別子（例: 'aomori'）
  name: string;    // 表示名（例: '青森県'）
  order: number;   // 地方内の順序
}

interface Region {
  id: string;            // 識別子（例: 'tohoku'）
  name: string;          // 表示名（例: '東北'）
  order: number;         // 地方の順序
  prefectures: Prefecture[];
}

// src/lib/posts.ts
interface PostMeta {
  category?: string | string[]; // 単一または複数
}
```

### ユーティリティ関数

```typescript
// src/lib/categoryUtils.ts
normalizeCategory(category?: string | string[]): string[]
getPrefectureRegion(prefecture: string): string | null
getAllPrefectures(): PrefectureWithRegion[]
getCategoryOrder(prefecture: string): { regionOrder: number, prefectureOrder: number } | null
```

## データフロー

```
設定ファイル (categories.ts)
    ↓
ユーティリティ (categoryUtils.ts)
    ├→ 正規化・逆引き
    └→ 順序取得
        ↓
posts.ts
    ├→ getAllCategories() - 設定順ソート
    ├→ getCategoriesByRegion() - 地方別集計
    └→ getPostsByCategory() - 配列対応フィルタ
        ↓
コンポーネント
    ├→ Sidebar - 階層表示
    ├→ PostCard - 複数カテゴリタグ
    └→ 記事詳細 - 複数カテゴリリンク
```

## 互換性

### 既存記事

単一カテゴリ（文字列）の記事はそのまま動作:

```yaml
category: "青森県"  # 変更不要
```

### 新規記事

複数カテゴリを指定可能:

```yaml
category: ["熊本県", "宮崎県"]
```

## パフォーマンス

- **ビルド時計算**: 全てビルド時に処理（ランタイムコストなし）
- **静的生成**: 214ページ全て正常生成
- **型安全性**: TypeScript strictモードで全て型チェック

## 今後の拡張

### 可能な拡張

1. **地方ページの生成**: `/categories/東北` など
2. **アコーディオン表示**: 地方をクリックで展開/折りたたみ
3. **地方区分の変更**: 設定ファイルで簡単にカスタマイズ可能

### 設定ファイルで管理可能な項目

- カテゴリの追加・削除
- 表示順序
- 地方の分け方
- 地方名・都道府県名の表示テキスト

## 参考

- 設定ファイル: [src/config/categories.ts](../src/config/categories.ts)
- ユーティリティ: [src/lib/categoryUtils.ts](../src/lib/categoryUtils.ts)
- データ層: [src/lib/posts.ts](../src/lib/posts.ts)
