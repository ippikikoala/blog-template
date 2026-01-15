# コンテンツ仕様

## ディレクトリ構造

```
content/
└── posts/
    ├── 2025-01-01-hokkaido-trip.mdx
    ├── 2025-01-05-aomori-haisen.mdx
    └── ...
```

## MDXフロントマター

### 必須フィールド

```yaml
---
title: "記事タイトル"
date: "2025-01-05"
description: "記事の説明文（100-150文字程度）"
---
```

### オプションフィールド

```yaml
---
title: "記事タイトル"
date: "2025-01-05"
description: "記事の説明文"
category: "北海道"           # 地域カテゴリ（単一）
# または複数カテゴリの場合
category:                    # 地域カテゴリ（配列形式）
  - 北海道
  - 青森県
tags:                        # テーマタグ（配列）
  - 温泉
  - 秘湯
  - 旅行記
themeCategory: "温泉"        # テーマ別カテゴリ
image: "https://pub-xxx.r2.dev/posts/2025-01/image.jpg"  # アイキャッチ画像（R2 URL）
---
```

### フィールド詳細

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| title | string | ○ | 記事タイトル |
| date | string | ○ | 投稿日（YYYY-MM-DD形式） |
| description | string | ○ | 記事の説明文（OGP、一覧に使用） |
| category | string \| string[] | - | 地域カテゴリ（都道府県名、配列も可） |
| tags | string[] | - | テーマタグの配列 |
| themeCategory | string | - | テーマ別カテゴリ（温泉、廃線など） |
| image | string | - | アイキャッチ画像のURL（Cloudflare R2） |

## カテゴリ体系

### 地域カテゴリ（都道府県）

地方別に階層化されています（詳細は [10-category-hierarchy.md](./10-category-hierarchy.md) を参照）。

```
【北海道地方】北海道
【東北地方】青森県 / 岩手県 / 宮城県 / 秋田県 / 山形県 / 福島県
【関東地方】茨城県 / 栃木県 / 群馬県 / 埼玉県 / 千葉県 / 東京都 / 神奈川県
【中部地方】新潟県 / 富山県 / 石川県 / 福井県 / 山梨県 / 長野県 / 岐阜県 / 静岡県 / 愛知県
【近畿地方】三重県 / 滋賀県 / 京都府 / 大阪府 / 兵庫県 / 奈良県 / 和歌山県
【中国地方】鳥取県 / 島根県 / 岡山県 / 広島県 / 山口県
【四国地方】徳島県 / 香川県 / 愛媛県 / 高知県
【九州・沖縄地方】福岡県 / 佐賀県 / 長崎県 / 熊本県 / 大分県 / 宮崎県 / 鹿児島県 / 沖縄県
```

#### 複数カテゴリの指定

記事が複数の都道府県にまたがる場合、配列形式で指定できます：

```yaml
category:
  - 北海道
  - 青森県
```

### テーマ別カテゴリ

地域とは別に、テーマでも分類できます：

| テーマ | 説明 |
|--------|------|
| 温泉 | 温泉・秘湯に関する記事 |
| 廃線 | 廃線・廃駅に関する記事 |
| 炭鉱 | 炭鉱・鉱山に関する記事 |
| 離島 | 離島に関する記事 |

※ テーマカテゴリの設定は `src/config/categories.ts` で管理されています。

## タグ体系

テーマ別のタグ：

| ジャンル | タグ例 |
|---------|--------|
| 宿泊 | 温泉, 秘湯, 旅館, 民宿 |
| 交通 | 廃線, 鉄道, フェリー |
| 産業遺産 | 炭鉱, 鉱山, 廃墟 |
| 地域 | 離島, 漁村, 山村, 集落 |
| その他 | 旅行記, グルメ, 絶景 |

## ファイル命名規則

```
YYYY-MM-DD-slug.mdx
```

例:
- `2025-01-05-hokkaido-onsen.mdx`
- `2025-01-10-aomori-haisen-part1.mdx`

## 画像の扱い

### 画像ホスティング

画像はCloudflare R2で管理しています。

**R2公開URL**: `https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev`

### 記事内画像

MDX内でR2のURLを使用：

```markdown
![画像の説明](https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev/posts/2025-01/image01.jpg)
```

### 画像パス構成（R2）

```
R2バケット (ippikikoala-blog)
└── posts/
    └── 2025-01/
        ├── image01.jpg
        ├── image02.jpg
        └── ...
```

### アイキャッチ画像

フロントマターの `image` フィールドにもR2のURLを指定：

```yaml
image: "https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev/posts/2025-01/cover.jpg"
```

### 画像サイズ

- 長辺制限なし（フルサイズでアップロード可能）
- 表示時はNext.js Imageで最適化
- 推奨: WebP形式

### R2設定

詳細は [08-cloudflare-r2.md](./08-cloudflare-r2.md) を参照。

## 本文の書き方

### 見出し

```markdown
## 大見出し（h2）- 目次に表示
### 中見出し（h3）- 目次に表示
#### 小見出し（h4）- 目次に表示
```

### 画像

```markdown
![代替テキスト](/images/posts/xxx/image.jpg)
```

※ 画像はクリックでLightbox表示

### リンク

```markdown
[リンクテキスト](https://example.com)
```

### リンクカード（OGPプレビュー）

外部リンクをカード形式で表示したい場合は `LinkCard` コンポーネントを使用：

```mdx
<LinkCard url="https://example.com/article" />
```

OGP情報（タイトル、説明、画像）が自動取得されます。

**カスタム指定も可能**:
```mdx
<LinkCard
  url="https://example.com/article"
  title="カスタムタイトル"
  description="カスタム説明文"
  image="https://example.com/custom-image.jpg"
/>
```

### 引用

```markdown
> 引用テキスト
```

### コードブロック

```markdown
\`\`\`
コード
\`\`\`
```

## サンプル記事

```mdx
---
title: "北海道の秘湯を訪ねて"
date: "2025-01-05"
description: "北海道の山奥にある知られざる秘湯を訪ねた旅行記。大自然の中で味わう極上の温泉体験。"
category: "北海道"
tags:
  - 温泉
  - 秘湯
  - 旅行記
themeCategory: "温泉"
image: "https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev/posts/2025-01/cover.jpg"
---

## はじめに

今回は北海道の山奥にある秘湯を訪ねてきました。

![温泉の外観](https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev/posts/2025-01/onsen-exterior.jpg)

## 道中の風景

レンタカーで札幌を出発し、約3時間のドライブ。

### 渓谷沿いのドライブ

道路は狭く、対向車とすれ違うのも一苦労。

## まとめ

アクセスは大変ですが、それだけの価値がある秘湯でした。
```
