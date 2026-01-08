# はてなブログ移行スクリプト

はてなブログから「いっぴきこあらの大冒険」への移行を支援するスクリプト集。

## 前提条件

- Python 3.7以上
- `requests` ライブラリ

```bash
pip3 install requests
```

## 使い方

### ステップ1: はてなブログからエクスポート

1. はてなブログ管理画面にログイン
2. **設定** → **詳細設定**
3. **エクスポート** セクション
4. **記事のバックアップと製本サービス** → **ダウンロードする**
5. `ippikikoala.hatenablog.com.export.txt` をダウンロード
6. このファイルを `blog/` ディレクトリに配置

### ステップ2: 画像をダウンロード

```bash
cd /Users/ippiki_koala/Desktop/Claude/blog

# 画像を一括ダウンロード
python3 scripts/download_images.py ippikikoala.hatenablog.com.export.txt
```

**出力**:
- `hatena_images/` フォルダに画像が保存される
- `hatena_images/image_mapping.txt` にマッピング情報が保存される

### ステップ3: 画像をCloudflare R2にアップロード

#### AWS CLIを使う場合（推奨）

```bash
# AWS CLIインストール（未インストールの場合）
brew install awscli

# R2の認証情報を設定
aws configure --profile r2
# Access Key ID: c40e122536159b85771375781c870880
# Secret Access Key: b52bea221aff0fa43a054256c613f90a515c3af031ed341f1ab384322397109a
# Region: auto

# 画像を一括アップロード
aws s3 sync hatena_images/ s3://ippikikoala-blog/posts/ \
  --profile r2 \
  --endpoint-url https://55296aaa46403434c1e94eca7e640b1a.r2.cloudflarestorage.com \
  --exclude "image_mapping.txt"
```

#### 手動でアップロードする場合

1. Cloudflareダッシュボードにログイン
2. R2 → `ippikikoala-blog` バケットを開く
3. `posts/` フォルダを作成
4. `hatena_images/` 内の画像をドラッグ&ドロップ

### ステップ4: MDX形式に変換

```bash
# R2のPublic URLを指定して変換
python3 scripts/convert_to_mdx.py ippikikoala.hatenablog.com.export.txt https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev

# または、デフォルトのURLを使用
python3 scripts/convert_to_mdx.py ippikikoala.hatenablog.com.export.txt
```

**出力**:
- `content/posts/` フォルダにMDXファイルが作成される
- 既存ファイルがある場合は `.bak` でバックアップされる

### ステップ5: 動作確認

```bash
# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:3000 を開く
```

**確認項目**:
- [ ] すべての記事が表示される
- [ ] 画像が正しく表示される
- [ ] 目次が生成される
- [ ] カテゴリ・タグが正しい
- [ ] 日付が正しい

### ステップ6: 本番環境にデプロイ

```bash
# 変更をコミット
git add .
git commit -m "はてなブログからコンテンツを移行"
git push origin main

# Vercelが自動的にデプロイします
```

## トラブルシューティング

### 画像が表示されない

**原因**: R2のPublic accessが無効、または画像がアップロードされていない

**対処**:
1. Cloudflare R2 → `ippikikoala-blog` → Settings → Public access を確認
2. R2バケット内に `posts/` フォルダと画像があるか確認
3. ブラウザで画像URLを直接開いて確認

### 文字化けが発生する

**原因**: エンコーディングの問題

**対処**:
- エクスポートファイルがUTF-8であることを確認
- テキストエディタで再保存（UTF-8）

### 変換後のMarkdownがおかしい

**原因**: はてな記法のパターン漏れ

**対処**:
- 手動で修正
- `scripts/convert_to_mdx.py` の `convert_hatena_syntax()` 関数にパターンを追加

## ファイル構成

```
scripts/
├── download_images.py      # 画像ダウンロード
├── convert_to_mdx.py       # MDX変換
├── update_eyecatch.py      # アイキャッチ画像更新
└── README.md               # このファイル
```

## update_eyecatch.py

はてなブログAPIから各記事のアイキャッチ画像（og:image）を取得し、MDXファイルの`image`フィールドを更新するスクリプト。

### 使い方

```bash
python3 scripts/update_eyecatch.py
```

### 処理内容

1. はてなブログAtomPub APIで記事URL一覧を取得
2. 各記事ページにアクセスし、`og:image`からアイキャッチURLを抽出
3. はてなCDN URLからファイル名を抽出
4. `hatena_images/image_mapping.txt`と照合してR2 URLに変換
5. 対応するMDXファイルの`image`フィールドを更新

### 設定（スクリプト内で変更可能）

```python
HATENA_ID = "ippiki_koala"
BLOG_DOMAIN = "ippikikoala.hatenablog.com"
API_KEY = "your_api_key"
R2_BASE_URL = "https://pub-xxx.r2.dev/posts"
```

### 出力

- R2に画像がない場合は警告を表示
- 更新件数のサマリーを表示

## 補足

### 段階的移行

すべてを一度に移行せず、段階的に進めることも可能：

1. **テスト移行**: 最新記事5件のみ
2. **本格移行**: 残りの記事を移行
3. **検証**: すべての記事を確認

### 画像の整理

記事ごとにフォルダ分けする場合：

```bash
hatena_images/
├── 2025-01-hokkaido-onsen/
│   ├── 01.jpg
│   └── 02.jpg
├── 2025-01-aomori-haisen/
│   ├── 01.jpg
│   └── 02.jpg
```

この場合、R2へのアップロードも記事ごとに：

```bash
aws s3 sync hatena_images/2025-01-hokkaido-onsen/ \
  s3://ippikikoala-blog/posts/2025-01-hokkaido-onsen/ \
  --profile r2 \
  --endpoint-url https://xxxxx.r2.cloudflarestorage.com
```
