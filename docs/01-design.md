# デザイン仕様

## カラースキーム

はてなブログの色調を継承した、落ち着いたライトテーマ。

### CSS変数定義

```css
:root {
  /* プライマリカラー */
  --color-primary: #454545;        /* 本文テキスト */
  --color-primary-dark: #333333;   /* 見出し */
  --color-accent: #4a8cb7;         /* リンク、アクセント */
  --color-accent-hover: #3a7ca7;   /* ホバー時 */

  /* 背景色 */
  --background: #ffffff;           /* メイン背景 */
  --background-secondary: #f8f9fa; /* サブ背景（カード内、目次など） */

  /* テキストカラー */
  --foreground: #333333;           /* 本文 */
  --foreground-muted: #666666;     /* 補助テキスト */
  --foreground-subtle: #999999;    /* 薄いテキスト（日付など） */

  /* ボーダー・シャドウ */
  --border-color: #e5e7eb;
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --card-shadow-hover: 0 4px 16px rgba(0, 0, 0, 0.12);
}
```

### カラー使用ルール

| 用途 | 変数 | 色 |
|------|------|-----|
| 本文テキスト | --foreground | #333333 |
| 見出し | --color-primary-dark | #333333 |
| リンク | --color-accent | #4a8cb7 |
| 補助テキスト | --foreground-muted | #666666 |
| 日付・件数 | --foreground-subtle | #999999 |
| ページ背景 | --background | #ffffff |
| カード・目次背景 | --background-secondary | #f8f9fa |
| ボーダー | --border-color | #e5e7eb |

## タイポグラフィ

### フォントファミリー

```css
font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont,
             "Segoe UI", Roboto, "Hiragino Sans", "Noto Sans JP", sans-serif;
```

### フォントサイズ

| 要素 | サイズ | 備考 |
|------|--------|------|
| 本文 | 16px (1rem) | line-height: 1.8 |
| h1 | 24-30px | ページタイトル |
| h2 | 20-24px | セクション見出し |
| h3 | 18px | サブセクション |
| 小テキスト | 12-14px | 日付、タグ、補助 |

## レイアウト

### 基本構成

```
┌─────────────────────────────────────────┐
│                 Header                   │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────────────────┐  ┌──────────┐    │
│   │                 │  │          │    │
│   │     Main        │  │ Sidebar  │    │
│   │    Content      │  │  (320px) │    │
│   │                 │  │          │    │
│   │                 │  │          │    │
│   └─────────────────┘  └──────────┘    │
│                                         │
├─────────────────────────────────────────┤
│                 Footer                   │
└─────────────────────────────────────────┘
```

### ブレークポイント

| 名称 | 幅 | レイアウト |
|------|-----|-----------|
| Mobile | < 768px | 1カラム、ハンバーガーメニュー |
| Tablet | 768px - 1024px | 2カラム（サイドバー狭め） |
| Desktop | > 1024px | 2カラム（サイドバー320px） |

### コンテナ幅

- 最大幅: 1152px (max-w-6xl)
- パディング: 16px (モバイル) / 24px (デスクトップ)

## コンポーネントスタイル

### カード

```css
.card {
  background: var(--background);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: var(--card-shadow-hover);
  transform: translateY(-2px);
}
```

### タグ

```css
.tag {
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  background: var(--background-secondary);
  color: var(--foreground-muted);
  border-radius: 16px;
}
```

### カテゴリバッジ

```css
.category {
  display: inline-block;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  background: var(--color-accent);
  color: white;
  border-radius: 4px;
}
```

## アニメーション

### トランジション

- デフォルト: `transition: 0.2s ease`
- ホバー効果: transform, box-shadow, color, background-color

### キーフレーム

```css
/* フェードイン */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* スケールイン（Lightbox用） */
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* スライドイン（モバイルメニュー用） */
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
```

## ダークモード

**対応しない**。常にライトテーマで表示。
