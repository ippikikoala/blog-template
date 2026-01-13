# デザイン仕様

## カラースキーム

はてなブログの色調を継承した、落ち着いたライトテーマ。

### CSS変数定義

```css
:root {
  /* プライマリカラー */
  --color-primary: #454545;        /* 本文テキスト */
  --color-primary-dark: #2c2c2c;   /* 見出し */
  --color-accent: #586e8f;         /* リンク、アクセント */
  --color-accent-hover: #4a5f7f;   /* ホバー時 */

  /* 背景色 */
  --background: #ffffff;                      /* メイン背景 */
  --background-secondary: rgba(88, 110, 143, 0.03); /* サブ背景（カード内、目次など） */

  /* テキストカラー */
  --foreground: #2c2c2c;           /* 本文 */
  --foreground-muted: #666666;     /* 補助テキスト */
  --foreground-subtle: #999999;    /* 薄いテキスト（日付など） */

  /* ボーダー・シャドウ */
  --border-color: #e8eaed;
  --card-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  --card-shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.08);

  /* レイアウト用背景色 */
  --header-bg: #ffffff;
  --sidebar-bg: #ffffff;
}
```

### カラー使用ルール

| 用途 | 変数 | 色 |
|------|------|-----|
| 本文テキスト | --foreground | #2c2c2c |
| 見出し | --color-primary-dark | #2c2c2c |
| リンク | --color-accent | #586e8f |
| 補助テキスト | --foreground-muted | #666666 |
| 日付・件数 | --foreground-subtle | #999999 |
| ページ背景 | --background | #ffffff |
| カード・目次背景 | --background-secondary | rgba(88, 110, 143, 0.03) |
| ボーダー | --border-color | #e8eaed |

## タイポグラフィ

### フォントファミリー

```css
font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont,
             "Segoe UI", Roboto, "Hiragino Kaku Gothic ProN", "Hiragino Sans",
             "Noto Sans JP", "Meiryo", sans-serif;
```

### フォントサイズ

| 要素 | サイズ | 備考 |
|------|--------|------|
| 本文 | 15px | line-height: 1.8, letter-spacing: 0.01em |
| 記事本文(.prose) | 17px | 読みやすさ重視 |
| h2 | 24px | セクション見出し、border-bottom付き |
| h3 | 20px | サブセクション |
| h4 | 18px | 小見出し |
| h5 | 17px | より小さい見出し |
| h6 | 16px | 最小見出し |
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

- 最大幅: 1280px (max-w-7xl)
- パディング: 16px (モバイル) / 24px (デスクトップ)

## コンポーネントスタイル

### カード

```css
.card {
  background: var(--background);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  box-shadow: var(--card-shadow-hover);
  transform: translateY(-4px);
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
  transition: background-color 0.2s ease;
}

.tag:hover {
  background: var(--color-accent);
  color: white;
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
- カード: `transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)` (滑らかな動き)
- ホバー効果: transform, box-shadow, color, background-color

### キーフレーム

```css
/* フェードイン（Lightbox、モバイルメニュー背景） */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* スケールイン（Lightbox画像） */
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* スライドイン（モバイルメニュー） */
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
```

### ホバーエフェクト

| 要素 | 効果 |
|------|------|
| カード | 上に4px移動、シャドウ強化 |
| リンク | 色変更（accent → accent-hover） |
| タグ | 背景色変更、白文字 |
| 画像 | 透明度90% |

## 画像キャプション

記事内で画像の直後にイタリックで記述したテキストは、キャプションとしてスタイリングされる。

### 記述方法

```markdown
![alt text](image-url.jpg)

_これがキャプションになります_
```

### スタイル

```css
/* 画像直後のイタリックをキャプションとして表示 */
.prose p:has(> img) + p > em:first-child {
  display: block;
  text-align: center;
  margin-top: -1rem;      /* 画像に近づける */
  margin-bottom: 1.5rem;
  font-size: 14px;
  font-style: normal;     /* イタリック解除 */
  color: var(--foreground-muted);
}
```

### 表示結果

- 中央寄せ
- 画像との間隔が狭い（キャプションであることが明確）
- フォントサイズ 14px
- グレー色（#666666）

## ダークモード

**対応しない**。常にライトテーマで表示。
