# カテゴリ階層構造仕様

## 概要

カテゴリを地方別の都道府県階層とテーマ別カテゴリの2種類で管理。設定ファイルベースで管理し、複数カテゴリにも対応。

## 実装日

2026-01-10（初版）、2026-01-12（テーマ別カテゴリ追加）

## カテゴリの種類

### 1. 都道府県カテゴリ（地方別階層）

- **第1階層**: 地方（北海道、東北、関東、中部、近畿、中国、四国、九州・沖縄）
- **第2階層**: 都道府県

### 2. テーマ別カテゴリ

地方・都道府県に依存しないカテゴリ。

| カテゴリ | 説明 | 記事数 |
|---------|------|--------|
| IT | IT・技術関連記事 | 10件 |
| 小山田壮平 | 小山田壮平関連記事 | 1件 |

## UI表示

### サイドバー表示

```
Categories
━━━━━━━━━━━━━━

▶ 北海道               [アコーディオン]
  └ 北海道 (25)

▶ 東北                 [アコーディオン]
  ├ 青森県 (8)
  └ 岩手県 (3)

... (地方アコーディオン)

IT (10)                [単独リンク]
小山田壮平 (1)          [単独リンク]
```

- **地方アコーディオン**: クリックで展開/折りたたみ
- **テーマ別カテゴリ**: 地方アコーディオンの下に単独リンクとして表示

## ファイル構成

### 設定・ロジック

| ファイル | 説明 |
|---------|------|
| `src/config/categories.ts` | カテゴリ設定ファイル（地方・都道府県・テーマ定義） |
| `src/lib/categoryUtils.ts` | ユーティリティ関数（正規化、判定、順序取得等） |
| `src/lib/posts.ts` | 記事データ層（カテゴリ集計、フィルタリング） |

### UIコンポーネント

| ファイル | 説明 |
|---------|------|
| `src/components/Sidebar.tsx` | サイドバー（カテゴリ表示） |
| `src/components/CategoryAccordion.tsx` | 地方アコーディオン |
| `src/components/MobileMenu.tsx` | モバイルメニュー（カテゴリ表示） |

## 複数カテゴリ対応

記事は複数カテゴリを持つことができる。

```yaml
# 単一カテゴリ
category: "青森県"

# 複数カテゴリ
category: ["熊本県", "宮崎県"]
```

### 重複カウント

1記事が複数カテゴリに属する場合、各カテゴリで1件ずつカウントされる。

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

interface ThemeCategory {
  id: string;      // 識別子（例: 'it'）
  name: string;    // 表示名（例: 'IT'）
  order: number;   // テーマ内の順序
}

interface CategoryConfig {
  regions: Region[];
  themeCategories: ThemeCategory[];
}
```

### 主要ユーティリティ関数

```typescript
// src/lib/categoryUtils.ts

// カテゴリを正規化（文字列/配列 → 配列）
normalizeCategory(category?: string | string[]): string[]

// 都道府県→地方の逆引き
getPrefectureRegion(prefecture: string): string | null

// テーマ別カテゴリかどうか判定
isThemeCategory(categoryName: string): boolean

// すべてのテーマ別カテゴリを取得
getAllThemeCategories(): { name: string; order: number }[]

// カテゴリの表示順序を取得
getCategoryOrder(categoryName: string): { regionOrder: number; ... } | null
```

## カテゴリ設定の変更方法

### テーマ別カテゴリの追加

`src/config/categories.ts` の `themeCategories` に追加:

```typescript
themeCategories: [
  { id: 'it', name: 'IT', order: 1 },
  { id: 'oyamada', name: '小山田壮平', order: 2 },
  { id: 'onsen', name: '温泉', order: 3 },  // ← 新規追加
],
```

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
  ],
}
```

## データフロー

```
設定ファイル (categories.ts)
    ↓
ユーティリティ (categoryUtils.ts)
    ├→ normalizeCategory() - 正規化
    ├→ isThemeCategory() - 種別判定
    └→ getCategoryOrder() - 順序取得
        ↓
posts.ts
    ├→ getAllCategories() - 設定順ソート
    ├→ getCategoriesByRegion() - 地方別集計
    └→ getPostsByCategory() - 配列対応フィルタ
        ↓
コンポーネント
    ├→ Sidebar + CategoryAccordion - 階層表示
    ├→ MobileMenu - モバイル表示
    ├→ PostCard - 複数カテゴリタグ
    └→ 記事詳細 - 複数カテゴリリンク
```

## 互換性

### 既存記事

単一カテゴリ（文字列）の記事はそのまま動作:

```yaml
category: "青森県"  # 変更不要
```

### テーマ別カテゴリ

都道府県以外のカテゴリも同様に指定可能:

```yaml
category: "IT"
category: "小山田壮平"
```

## 参考

- 設定ファイル: [src/config/categories.ts](../src/config/categories.ts)
- ユーティリティ: [src/lib/categoryUtils.ts](../src/lib/categoryUtils.ts)
- データ層: [src/lib/posts.ts](../src/lib/posts.ts)
- アコーディオン: [src/components/CategoryAccordion.tsx](../src/components/CategoryAccordion.tsx)
