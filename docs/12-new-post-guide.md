# PC新規記事投稿ガイド

PCから新しいブログ記事を作成・投稿するための手順書です。

---

## 事前準備

### 必要なもの

- **テキストエディタ**: VS Code、Cursor など
- **Git**: リポジトリへのpushに必要
- **Node.js**: ローカルプレビュー用（`npm run dev`）
- **Cloudflareアカウント**: 画像アップロード用

### リポジトリのクローン（初回のみ）

```bash
git clone https://github.com/your-username/blog.git
cd blog
npm install
```

---

## Step 1: 画像のアップロード

### 1.1 画像の準備

| 項目 | 推奨値 |
|------|--------|
| 形式 | JPG / WebP |
| サイズ | 長辺1200px以下 |
| ファイル名 | `YYYYMMDDHHMMSS.jpg` 形式 |

### 1.2 Cloudflare R2にアップロード

1. [Cloudflareダッシュボード](https://dash.cloudflare.com/) にログイン
2. 左メニュー **「R2」** をクリック
3. バケット（`blog-images`）を選択
4. **「posts/」** フォルダを開く
5. **「Upload」** ボタンをクリック
6. 画像ファイルをドラッグ&ドロップ
7. アップロード完了後、**画像のパス**をコピー

### 1.3 画像URLの形式

```
https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev/posts/YYYYMMDDHHMMSS.jpg
```

---

## Step 2: 記事ファイルの作成

### 2.1 ファイル名

```
content/posts/YYYY-MM-DD-YYYY-MM-DD-HHMMSS.mdx
```

**例**: `2026-01-11-2026-01-11-210000.mdx`

> **ヒント**: `templates/new-post.mdx` をコピーして使うと便利です。

### 2.2 frontmatter（必須）

```yaml
---
title: "【都道府県】記事タイトル"
date: "2026-01-11"
description: "記事の説明文（100-150文字程度）。一覧ページに表示されます。"
category: "北海道"
tags: ['温泉', '秘湯']
image: "https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev/posts/YYYYMMDDHHMMSS.jpg"
draft: true
---
```

### フィールド一覧

| フィールド | 必須 | 説明 |
|------------|------|------|
| `title` | ○ | 記事タイトル。【都道府県】形式推奨 |
| `date` | ○ | 投稿日（YYYY-MM-DD形式） |
| `description` | ○ | 記事の説明文（一覧・OGPに使用） |
| `category` | △ | 都道府県名 |
| `tags` | △ | テーマタグの配列 |
| `image` | △ | アイキャッチ画像のURL |
| `draft` | - | `true`で下書き（本番に表示されない） |

### カテゴリ（都道府県）一覧

```
北海道 / 青森県 / 岩手県 / 宮城県 / 秋田県 / 山形県 / 福島県 /
茨城県 / 栃木県 / 群馬県 / 埼玉県 / 千葉県 / 東京都 / 神奈川県 /
新潟県 / 富山県 / 石川県 / 福井県 / 山梨県 / 長野県 /
岐阜県 / 静岡県 / 愛知県 / 三重県 /
滋賀県 / 京都府 / 大阪府 / 兵庫県 / 奈良県 / 和歌山県 /
鳥取県 / 島根県 / 岡山県 / 広島県 / 山口県 /
徳島県 / 香川県 / 愛媛県 / 高知県 /
福岡県 / 佐賀県 / 長崎県 / 熊本県 / 大分県 / 宮崎県 / 鹿児島県 / 沖縄県 /
その他
```

### よく使うタグ

```
温泉 / 秘湯 / 旅館 / 廃線 / 炭鉱 / 島 / ロードバイク / IT
```

---

## Step 3: 本文の書き方

### 見出し

```markdown
## 大見出し（h2）
### 中見出し（h3）
#### 小見出し（h4）
```

### 画像

```markdown
![画像の説明](https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev/posts/YYYYMMDDHHMMSS.jpg)

_画像のキャプション_
```

### Google Maps埋め込み

```jsx
<GoogleMap
  src="埋め込みURL"
  title="場所の名前"
/>
```

### YouTube埋め込み

```jsx
<YouTube videoId="動画ID" />
```

> [!WARNING]
> **必ず独立した段落として配置してください**
> 
> `<YouTube />` コンポーネントは**前後に空行を入れて**配置する必要があります。
> 文章の途中に配置すると、Hydration Error（ハイドレーションエラー）が発生します。
> 
> **❌ NG（エラーになる）**:
> ```markdown
> 参考動画はこちら：<YouTube videoId="xxx" />
> ```
> 
> **✅ OK（正しい）**:
> ```markdown
> 参考動画はこちら：
> 
> <YouTube videoId="xxx" />
> ```

> **動画IDとは？**
> YouTubeのURLに含まれる11文字の英数字です。
> - 通常のURL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ` の `v=` の後ろ
> - 短縮URL: `https://youtu.be/dQw4w9WgXcQ` の `/` の後ろ
>
> この例では `dQw4w9WgXcQ` が動画IDになります。

### Instagram埋め込み

```jsx
<Instagram url="https://www.instagram.com/p/投稿ID/" />
```

> [!WARNING]
> **必ず独立した段落として配置してください**
> 
> `<Instagram />` コンポーネントは**前後に空行を入れて**配置する必要があります。
> 文章の途中に配置すると、Hydration Error（ハイドレーションエラー）が発生します。
> 
> **❌ NG（エラーになる）**:
> ```markdown
> 参考投稿はこちら：<Instagram url="xxx" />
> ```
> 
> **✅ OK（正しい）**:
> ```markdown
> 参考投稿はこちら：
> 
> <Instagram url="xxx" />
> ```

> **投稿URLの取得方法**
> 1. Instagramアプリまたはウェブで投稿を開く
> 2. **「…」** （その他）ボタンをタップ
> 3. **「リンクをコピー」** を選択
> 4. コピーしたURLをそのまま使用
>
> **URLの例**:
> - `https://www.instagram.com/p/ABC123xyz/`
> - `https://www.instagram.com/reel/ABC123xyz/`

#### オプション

| プロパティ | 型 | デフォルト | 説明 |
|-----------|-----|-----------|------|
| `url` | string | **必須** | Instagram投稿のURL |
| `caption` | boolean | `true` | キャプションを表示するか |

**キャプションを非表示にする例**:
```jsx
<Instagram url="https://www.instagram.com/p/投稿ID/" caption={false} />
```

### 他の記事へのリンク（内部リンク）

```markdown
[Part1はこちら](/posts/2026-01-10-2026-01-10-123456)
```

### 外部サイトへのリンク

```markdown
[Google](https://google.com)
```
外部サイトも同様の書き方でOKです。標準的なMarkdown記法が使えます。

### リンクカード（OGPプレビュー）

外部リンクをカード形式で表示したい場合に使用します。リンク先のOGP情報（タイトル、説明、画像）が自動取得されます。

```jsx
<LinkCard url="https://example.com/article" />
```

> [!WARNING]
> **必ず独立した段落として配置してください**
>
> `<LinkCard />` コンポーネントは**前後に空行を入れて**配置する必要があります。
> 文章の途中に配置すると、正しく表示されない場合があります。
>
> **❌ NG**:
> ```markdown
> 参考記事はこちら：<LinkCard url="xxx" />
> ```
>
> **✅ OK（正しい）**:
> ```markdown
> 参考記事はこちら：
>
> <LinkCard url="xxx" />
> ```

#### オプション

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `url` | string | ○ | リンク先URL |
| `title` | string | - | カスタムタイトル（省略時はOGPから取得） |
| `description` | string | - | カスタム説明文（省略時はOGPから取得） |
| `image` | string | - | カスタム画像URL（省略時はOGPから取得） |

**カスタム指定の例**:
```jsx
<LinkCard
  url="https://example.com/article"
  title="カスタムタイトル"
  description="カスタム説明文"
  image="https://example.com/image.jpg"
/>
```

### コメントアウト

```markdown
<!-- このテキストは表示されません -->
```
HTMLのコメントアウト記法が使えます。下書き中のメモなどに便利です。

---

## Step 4: ローカルプレビュー

```bash
# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 を開いて確認。

### 確認項目

- [ ] 記事一覧に表示されるか
- [ ] 記事詳細ページが正しく表示されるか
- [ ] 画像が正しく表示されるか
- [ ] 目次が正しく生成されるか
- [ ] カテゴリ・タグが正しく表示されるか

---

## Step 5: 公開

### 5.1 変更をコミット

```bash
git add content/posts/新しい記事.mdx
git commit -m "Add: 新しい記事タイトル"
```

### 5.2 プッシュ

```bash
git push origin main
```

### 5.3 自動デプロイ

Vercelが自動的にビルド・デプロイを実行。
数分後に https://www.ippikikoala.com で公開されます。

---

## クイックリファレンス

### 新規記事作成コマンド

```bash
# テンプレートをコピー
cp templates/new-post.mdx content/posts/$(date +%Y-%m-%d-%Y-%m-%d-%H%M%S).mdx
```

### よくあるエラー

| エラー | 原因 | 対処法 |
|--------|------|--------|
| 画像が表示されない | URLが間違っている | R2の正しいURLを確認 |
| ビルドエラー | frontmatterの形式エラー | YAML構文を確認 |
| 記事が表示されない | `draft: true` になっている | `draft`を削除または`false`に |
| ポート3000が使えない | `Port 3000 is in use` エラー | 既に起動中のプロセスを終了する。<br>`lsof -i :3000` でPIDを確認し `kill -9 [PID]` で終了。 |

### ポート競合の解消コマンド（Mac）

```bash
# ポート3000を使用しているプロセスを確認して強制終了
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## 既存記事の編集・更新

既に公開されている記事を修正してデプロイする手順です。

### 編集の流れ

1. **記事ファイルを開く**
   ```
   content/posts/YYYY-MM-DD-YYYY-MM-DD-HHMMSS.mdx
   ```
   エディタで該当の記事を開いて、必要な箇所を修正します。

2. **ローカルで確認**
   ```bash
   npm run dev
   ```
   ブラウザで `http://localhost:3000` を開いて変更を確認します。

3. **変更をコミット**
   ```bash
   git add content/posts/編集した記事.mdx
   git commit -m "Update: 記事タイトル - 修正内容の簡単な説明"
   ```

4. **リモートにプッシュ**
   ```bash
   git push origin main
   ```

5. **自動デプロイ**
   Vercelが自動的にビルド・デプロイを実行。
   数分後に https://www.ippikikoala.com で更新が反映されます。

### 新規記事作成との違い

| 項目 | 新規記事 | 既存記事の編集 |
|------|----------|----------------|
| ファイル作成 | 必要 | 不要 |
| 画像アップロード | 新規画像がある場合のみ | 新規画像がある場合のみ |
| コミットメッセージ | `Add:` で始める | `Update:` で始める |

### よくある編集内容

- 誤字脱字の修正
- 画像の追加・変更
- リンクの追加・修正
- 内容の加筆・修正
- タグやカテゴリの変更

---

## 関連ドキュメント

- [コンテンツ仕様](./03-content.md)
- [Cloudflare R2セットアップ](./08-cloudflare-r2.md)
- [カテゴリ階層](./10-category-hierarchy.md)
