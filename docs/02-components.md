# コンポーネント設計

## ディレクトリ構造

```
src/components/
├── Header.tsx              # ヘッダー（ナビゲーション）
├── Footer.tsx              # フッター
├── Sidebar.tsx             # サイドバー
├── PostCard.tsx            # 記事カード
├── Pagination.tsx          # ページネーション
├── TableOfContents.tsx     # 目次
├── Lightbox.tsx            # 画像拡大表示
├── ShareButtons.tsx        # SNSシェアボタン
├── ScrollToTop.tsx         # ページトップボタン
├── SearchBox.tsx           # 検索ボックス
├── MonthlyArchive.tsx      # 月別アーカイブ（年別アコーディオン）
├── CategoryAccordion.tsx   # カテゴリアコーディオン（地方別＋テーマ別）
├── MobileMenu.tsx          # モバイルメニュー（ハンバーガーメニュー）
└── embeds/
    ├── YouTube.tsx         # YouTube埋め込み
    ├── GoogleMap.tsx       # Googleマップ埋め込み
    └── Instagram.tsx       # Instagram埋め込み
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

**構成** (`/config/sidebar.ts`で有効/無効・順序を設定可能):
- プロフィールカード
  - アイコン画像（/ippikikoala_profile.png）
  - 名前
  - 自己紹介
  - SNSリンク
- 検索ボックス（SearchBox）
- 月別アーカイブ（MonthlyArchive）
- カテゴリ一覧（CategoryAccordion: 地方別アコーディオン＋テーマ別カテゴリ）
- タグ一覧（上位15件）
- 最新記事（5件、デフォルト無効化）

**スタイル**:
- 幅: 320px (lg:w-80)
- 各セクションはカードコンポーネント

**設定ファイル**:
- `src/config/sidebar.ts` - 表示セクションの有効/無効、順序を設定

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

---

### SearchBox

**役割**: サイドバー内検索ボックス

**Props**: なし

**構成**:
- テキスト入力フィールド
- 検索アイコンボタン

**ロジック**:
- フォーム送信で `/search?q={query}` へ遷移
- クライアントコンポーネント（useRouter使用）

**スタイル**:
- 角丸入力フィールド（focus時にアクセントカラーのring）
- 右側に検索アイコン配置

---

### MonthlyArchive

**役割**: 年別アコーディオン形式の月別アーカイブ

**Props**:
```typescript
interface Props {
  archives: MonthlyArchive[]; // { year, month, count }[]
}
```

**構成**:
- 年ごとにグループ化されたアコーディオン
- 各年をクリックで展開/折りたたみ
- 月ごとのリンクと記事数表示

**ロジック**:
- 最新の年をデフォルトで開く
- 年の合計記事数を表示
- クライアントコンポーネント（開閉状態管理）

**スタイル**:
- 年ヘッダー: ホバー時に背景色変更
- 月リスト: 左インデント + ボーダー
- 右側に記事数を小さく表示

---

### CategoryAccordion

**役割**: 地方別カテゴリ（アコーディオン）＋テーマ別カテゴリ

**Props**:
```typescript
interface Props {
  regionCategories: { region: Region; categories: CategoryCount[] }[];
  themeCategories: { name: string; count: number }[];
}
```

**構成**:
- 地方別カテゴリ（北海道、東北、関東など）
  - 地方名クリックで展開/折りたたみ
  - 都道府県リストと記事数
- テーマ別カテゴリ（旅の話、雑記など）
  - アコーディオンと同じレベルで表示
  - 直接カテゴリページへリンク

**ロジック**:
- 地方ごとの開閉状態を管理
- クライアントコンポーネント

**スタイル**:
- 地方名: 太字、ホバー時アクセントカラー
- 都道府県: 左インデント、ボーダーライン
- テーマカテゴリ: 左padding

---

### MobileMenu

**役割**: モバイル用ハンバーガーメニュー（全画面オーバーレイ）

**Props**:
```typescript
interface Props {
  categories: CategoryData[];
  tags: CategoryData[];
  themeCategories: CategoryData[];
}
```

**構成**:
- ハンバーガーアイコンボタン（md未満で表示）
- 全画面オーバーレイメニュー
  - メインナビゲーション（Home, About, RSS）
  - カテゴリ一覧（上位10件＋テーマカテゴリ）
  - タグ一覧（上位12件）

**ロジック**:
- React Portalで`<body>`直下にレンダリング
- パス変更時に自動クローズ
- デスクトップサイズ（768px以上）に変更時に自動クローズ
- メニューオープン時に`body`のスクロールを無効化

**スタイル**:
- オーバーレイ: rgba背景
- メニュー: 右からスライドイン、白背景
- CSS: globals.cssに`.mobile-menu`クラス定義

---

### YouTube（埋め込み）

**役割**: YouTube動画の埋め込み

**Props**:
```typescript
interface Props {
  videoId: string;
  title?: string;
  start?: number; // 開始秒数（オプション）
}
```

**構成**:
- iframeでYouTube埋め込み
- 16:9アスペクト比維持
- lazy loading有効

**スタイル**:
- 最大幅: 4xl (896px)
- 中央寄せ、角丸、影付き

---

### GoogleMap（埋め込み）

**役割**: Googleマップの埋め込み

**Props**:
```typescript
interface Props {
  src: string;   // Google Maps埋め込みURL
  title?: string;
}
```

**構成**:
- iframeでGoogleマップ埋め込み
- 4:3アスペクト比
- lazy loading有効

**スタイル**:
- 最大幅: 4xl (896px)
- 中央寄せ、角丸、ボーダー、影付き

---

### Instagram（埋め込み）

**役割**: Instagram投稿の埋め込み

**Props**:
```typescript
interface Props {
  url: string;       // Instagram投稿URL
  caption?: boolean; // キャプション表示（デフォルト: true）
}
```

**構成**:
- Instagram公式embed.jsスクリプトを動的ロード
- blockquote要素でInstagram投稿を埋め込み

**ロジック**:
- クライアントコンポーネント
- useEffectでスクリプトロード
- スクリプトが既にロード済みの場合は再利用

**スタイル**:
- 最大幅: 540px
- 中央寄せ
- Instagram公式スタイル（白背景、影付き）

---

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
| **SearchBox** | **Client** | **useRouter使用** |
| **MonthlyArchive** | **Client** | **アコーディオン開閉状態管理** |
| **CategoryAccordion** | **Client** | **アコーディオン開閉状態管理** |
| **MobileMenu** | **Client** | **メニュー開閉状態管理、Portal使用** |
| **YouTube** | **Server** | **静的埋め込みのみ** |
| **GoogleMap** | **Server** | **静的埋め込みのみ** |
| **Instagram** | **Client** | **スクリプト動的ロード** |
