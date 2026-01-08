# コンポーネント設計

## ディレクトリ構造

```
src/components/
├── Header.tsx          # ヘッダー（ナビゲーション）
├── Footer.tsx          # フッター
├── Sidebar.tsx         # サイドバー
├── PostCard.tsx        # 記事カード
├── Pagination.tsx      # ページネーション
├── TableOfContents.tsx # 目次
├── Lightbox.tsx        # 画像拡大表示
├── ShareButtons.tsx    # SNSシェアボタン
└── ScrollToTop.tsx     # ページトップボタン
```

## 各コンポーネント仕様

### Header

**役割**: サイトロゴとグローバルナビゲーション

**Props**: なし

**構成**:
- ロゴ（サイト名リンク）
- ナビゲーションリンク: Home, About, Categories, Tags
- RSSアイコン
- モバイル: ハンバーガーメニュー

**状態**:
- `isMenuOpen`: モバイルメニューの開閉状態

**スタイル**:
- sticky top-0 で固定
- 背景: var(--header-bg)
- ボーダー下線: 1px solid var(--border-color)

---

### Footer

**役割**: サイト情報とリンク集

**Props**: なし

**構成**:
- サイト説明
- リンク集（Home, About, Categories, Tags, RSS）
- SNSリンク
- コピーライト

**スタイル**:
- 背景: var(--background-secondary)
- 3カラムグリッド（モバイルは1カラム）

---

### Sidebar

**役割**: 補助的なナビゲーションと情報表示

**Props**: なし

**構成**:
- プロフィールカード
  - アイコン（絵文字）
  - 名前
  - 自己紹介
  - SNSリンク
- カテゴリ一覧（上位10件）
- タグ一覧（上位15件）
- 最新記事（5件）

**スタイル**:
- 幅: 320px (lg:w-80)
- 各セクションはカードコンポーネント

---

### PostCard

**役割**: 記事一覧で使用するカード

**Props**:
```typescript
interface PostCardProps {
  post: PostMeta;
}
```

**構成**:
- アイキャッチ画像（16:9比率）
- カテゴリバッジ
- タイトル（2行で省略）
- 説明文（2行で省略）
- 投稿日
- タグ（最大3つ + 残り件数）

**スタイル**:
- カード全体がリンク
- ホバー時: 影が深くなる、画像が少しズーム

---

### Pagination

**役割**: ページネーション

**Props**:
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}
```

**構成**:
- 前へボタン
- ページ番号（最大5つ表示 + 省略記号）
- 次へボタン

**ロジック**:
- 1ページのみの場合は非表示
- 現在ページはアクセント色で強調

---

### TableOfContents

**役割**: 記事の目次を自動生成

**Props**:
```typescript
interface TableOfContentsProps {
  content: string; // MDXコンテンツ
}
```

**構成**:
- 「目次」タイトル
- 見出しリスト（h2, h3, h4）

**ロジック**:
- 正規表現で見出しを抽出
- 見出しテキストからIDを生成
- h3, h4はインデント

**スタイル**:
- 背景: var(--background-secondary)
- 角丸: 8px

---

### Lightbox

**役割**: 画像のクリックで拡大表示

**Props**: なし（グローバルに動作）

**構成**:
- オーバーレイ背景
- 拡大画像
- 閉じるボタン

**ロジック**:
- `.prose img` のクリックを監視
- Escキーで閉じる
- オーバーレイクリックで閉じる

**スタイル**:
- オーバーレイ: rgba(0, 0, 0, 0.9)
- 画像: max-width 95vw, max-height 95vh

---

### ShareButtons

**役割**: SNSシェアボタン

**Props**:
```typescript
interface ShareButtonsProps {
  title: string;
  url: string;
}
```

**構成**:
- X（Twitter）シェアボタン

**スタイル**:
- X: 背景 #1DA1F2

---

### ScrollToTop

**役割**: ページトップへスクロールするボタン

**Props**: なし

**構成**:
- 上矢印アイコンのボタン

**ロジック**:
- スクロール位置が300px以上で表示
- クリックでスムーススクロール

**スタイル**:
- 固定位置: 右下
- 背景: var(--color-accent)
- 円形: 48px (モバイル: 40px)

## Server/Client Component

| コンポーネント | 種類 | 理由 |
|---------------|------|------|
| Header | Client | メニュー開閉の状態管理 |
| Footer | Server | 静的コンテンツのみ |
| Sidebar | Server | 静的コンテンツのみ |
| PostCard | Server | 静的コンテンツのみ |
| Pagination | Server | 静的コンテンツのみ |
| TableOfContents | Server | 静的コンテンツのみ |
| Lightbox | Client | イベントリスナー |
| ShareButtons | Client | URL生成のため |
| ScrollToTop | Client | スクロール監視 |
