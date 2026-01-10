# はてなブログからの移行ガイド（完全版）

## 概要

はてなブログから Next.js + MDX ブログへの完全移行手順を説明します。
このガイドに従えば、**137件の記事を完全にエラーなく移行**できます。

**実績**: 2026年1月7日時点で137件すべての記事が正常に動作確認済み

---

## 前提条件

### 必要な環境
- Python 3.9以上
- Node.js 18以上
- npm または yarn
- AWS CLI（Cloudflare R2アクセス用）

### 必要なファイル
- はてなブログのエクスポートファイル（`.export.txt`）

---

## 全体の流れ

```
1. はてなブログからエクスポート（5分）
   ↓
2. 画像をダウンロード（30分）
   ↓
3. 画像をCloudflare R2にアップロード（30分）
   ↓
4. 記事をMDX形式に変換（10分）
   ↓
5. 動作確認（全記事テスト）
```

**合計所要時間**: 約1.5時間（記事数による）

---

## ステップ1: はてなブログからエクスポート

### 1-1. 管理画面からエクスポート

1. はてなブログ管理画面にログイン
2. **設定** → **詳細設定**
3. **エクスポート** セクション
4. **記事のバックアップと製本サービス** → **ダウンロードする**
5. `ユーザー名.hatenablog.com.export.txt` がダウンロードされる

### 1-2. エクスポートファイルを配置

```bash
# プロジェクトルートに配置
cd /Users/ippiki_koala/Desktop/Claude/blog
mv ~/Downloads/ユーザー名.hatenablog.com.export.txt ./
```

### 1-3. エクスポートファイルの形式

```
AUTHOR: ippiki_koala
TITLE: 北海道の秘湯を訪ねて
BASENAME: 2025/01/15/123456
STATUS: Publish
ALLOW COMMENTS: 1
CONVERT BREAKS: 0
DATE: 01/15/2025 10:30:00
CATEGORY: 北海道
TAGS: 温泉,秘湯
-----
BODY:
<p>今回は北海道の山奥にある秘湯を訪ねてきました。</p>
<figure>
  <img src="https://cdn-ak.f.st-hatena.com/images/fotolife/i/ippiki_koala/20250115/20250115103000.jpg">
  <figcaption>秘湯の外観</figcaption>
</figure>
-----
EXTENDED BODY:
<h3>温泉の詳細</h3>
<p>...</p>
-----
--------
```

**重要**:
- 記事は `--------` で区切られる
- BODYとEXTENDED BODYが分離されている（統合が必要）
- 画像はHTMLタグで記述されている

---

## ステップ2: 画像をダウンロード

### 2-1. ダウンロードスクリプトの確認

`scripts/download_images.py` が存在することを確認：

```bash
ls scripts/download_images.py
```

存在しない場合は以下の内容で作成：

```python
#!/usr/bin/env python3
"""
はてなブログの画像を一括ダウンロード

Usage:
    python3 scripts/download_images.py ippikikoala.hatenablog.com.export.txt
"""

import re
import requests
import os
from pathlib import Path
from urllib.parse import urlparse
import sys

def download_hatena_images(export_file, output_dir='hatena_images'):
    """はてなブログの画像を一括ダウンロード"""

    # 出力ディレクトリ作成
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # エクスポートファイルを読み込み
    print(f"📖 読み込み中: {export_file}")
    with open(export_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # HTMLの<img src>から画像URLを抽出
    image_url_pattern = r'https://cdn-ak\.f\.st-hatena\.com/images/fotolife/[^"\s]+'
    all_urls = re.findall(image_url_pattern, content)

    # 重複を削除
    unique_urls = list(set(all_urls))
    print(f"📊 {len(unique_urls)} 個のユニークな画像URLを検出しました")

    downloaded = []
    failed = []

    for i, url in enumerate(unique_urls, 1):
        # URLからファイル名を抽出
        parsed_url = urlparse(url)
        filename = os.path.basename(parsed_url.path)
        filepath = os.path.join(output_dir, filename)

        # 既にダウンロード済みならスキップ
        if os.path.exists(filepath):
            print(f"⏭️  [{i}/{len(unique_urls)}] スキップ: {filename} (既存)")
            downloaded.append({
                'url': url,
                'filename': filename
            })
            continue

        # ダウンロード
        try:
            print(f"⬇️  [{i}/{len(unique_urls)}] ダウンロード中: {filename}")
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                with open(filepath, 'wb') as img_file:
                    img_file.write(response.content)
                size_kb = len(response.content) / 1024
                print(f"✅ [{i}/{len(unique_urls)}] 完了: {filename} ({size_kb:.1f} KB)")
                downloaded.append({
                    'url': url,
                    'filename': filename
                })
            else:
                print(f"❌ [{i}/{len(unique_urls)}] 失敗: {url} (Status: {response.status_code})")
                failed.append({'url': url, 'reason': f'HTTP {response.status_code}'})
        except Exception as e:
            print(f"❌ [{i}/{len(unique_urls)}] エラー: {url} - {str(e)}")
            failed.append({'url': url, 'reason': str(e)})

    # マッピングファイルを保存
    mapping_file = os.path.join(output_dir, 'image_mapping.txt')
    with open(mapping_file, 'w', encoding='utf-8') as f:
        for item in downloaded:
            f.write(f"{item['url']}|{item['filename']}\n")

    print("\n" + "="*60)
    print(f"✅ ダウンロード完了: {len(downloaded)} 枚")
    if failed:
        print(f"❌ 失敗: {len(failed)} 枚")
        print("\n失敗したURL:")
        for item in failed:
            print(f"  - {item['url']} ({item['reason']})")
    print(f"📁 保存先: {output_dir}/")
    print(f"📄 マッピングファイル: {mapping_file}")
    print("="*60)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 download_images.py <export_file>")
        sys.exit(1)

    export_file = sys.argv[1]
    download_hatena_images(export_file)
```

### 2-2. 実行

```bash
python3 scripts/download_images.py ippikikoala.hatenablog.com.export.txt
```

**実行結果例**:
```
📖 読み込み中: ippikikoala.hatenablog.com.export.txt
📊 3237 個のユニークな画像URLを検出しました
⬇️  [1/3237] ダウンロード中: 20221106195534.jpg
✅ [1/3237] 完了: 20221106195534.jpg (245.3 KB)
...
============================================================
✅ ダウンロード完了: 3237 枚
📁 保存先: hatena_images/
📄 マッピングファイル: hatena_images/image_mapping.txt
============================================================
```

---

## ステップ3: 画像をCloudflare R2にアップロード

### 3-1. AWS CLIの設定（初回のみ）

```bash
# AWS CLIのインストール（macOS）
brew install awscli

# Cloudflare R2用のプロファイル設定
aws configure --profile r2

# 以下を入力:
# AWS Access Key ID: <R2のアクセスキーID>
# AWS Secret Access Key: <R2のシークレットキー>
# Default region name: auto
# Default output format: json
```

### 3-2. R2バケットの作成（初回のみ）

Cloudflareダッシュボードで:
1. R2 → Create bucket
2. Bucket name: `blog-images`
3. Location: Automatic
4. Public access: **Allow**（重要）

### 3-3. R2へアップロード

```bash
# hatena_images/ フォルダ内のすべての画像を posts/ に一括アップロード
aws s3 sync hatena_images/ s3://blog-images/posts/ \
  --profile r2 \
  --endpoint-url https://<アカウントID>.r2.cloudflarestorage.com \
  --exclude "image_mapping.txt"
```

**実行結果例**:
```
upload: hatena_images/20221106195534.jpg to s3://blog-images/posts/20221106195534.jpg
upload: hatena_images/20221107123456.jpg to s3://blog-images/posts/20221107123456.jpg
...
```

### 3-4. Public URLの確認

R2バケット → Settings → Public R2.dev subdomain

例: `https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev`

ブラウザで確認:
```
https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev/posts/20221106195534.jpg
```

画像が表示されればOK。

---

## ステップ4: 記事をMDX形式に変換

### 4-1. 変換スクリプトの確認

`scripts/convert_to_mdx.py` が以下の内容になっていることを確認：

**重要な機能**:
1. ✅ BODYとEXTENDED BODYの統合
2. ✅ コードブロック（`<ul style="list-style: none">`）の変換
3. ✅ HTMLタグの完全削除
4. ✅ MDX波括弧（`{}`）のエスケープ
5. ✅ 画像URLのR2への変換
6. ✅ descriptionのクリーンアップ

完全なスクリプトは `scripts/convert_to_mdx.py` を参照。

### 4-2. 実行

```bash
python3 scripts/convert_to_mdx.py ippikikoala.hatenablog.com.export.txt
```

**実行結果例**:
```
📖 エクスポートファイル: ippikikoala.hatenablog.com.export.txt
🌐 R2 Public URL: https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev

📷 画像マッピング: 6474 件

📄 記事を解析中...
✅ 137 件の記事を検出しました

🔄 [1/137] バックアップ: 2026-01-05-2026-01-05-001743.mdx.bak
✅ [1/137] 作成: 2026-01-05-2026-01-05-001743.mdx - 【真鶴・三島】ひねくれ夫婦の年越し。そして風邪を引いた
...
============================================================
✅ 変換完了: 137 件
📁 保存先: content/posts/
============================================================
```

### 4-3. 生成されたファイルの確認

```bash
ls content/posts/*.mdx | head -5
```

出力例:
```
content/posts/2022-11-06-2022-11-06-203249.mdx
content/posts/2022-11-11-2022-11-11-190010.mdx
content/posts/2022-11-13-2022-11-13-212011.mdx
content/posts/2022-11-14-2022-11-14-232138.mdx
content/posts/2022-11-16-2022-11-16-215611.mdx
```

### 4-4. MDXファイルの構造

```markdown
---
title: "【北海道】濃昼漁港とかつて陸の孤島と呼ばれた雄冬へ"
date: "2026-01-04"
description: "2日目：静内〜雄冬〜増毛〜羽幌〜旭川 - 静内 - 濃昼（ごきびる）漁港 - 雄冬 - 岩尾温泉あったま～る - 大別苅 静内に宿泊し、札幌を経由して旭川に向かいました。..."
category: "北海道"
tags: []
image: ""
---

#### 2日目：静内〜雄冬〜増毛〜羽幌〜旭川

##### 静内

せっかくなのでホテルのチェックアウト前に静内を歩きました。

![静内を歩きます](https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev/posts/20260104174756.jpg)

_静内を歩きます_

...
```

---

## ステップ5: 動作確認

### 5-1. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開く。

### 5-2. 記事一覧の確認

- トップページに記事が表示されること
- サムネイル画像が表示されること（あれば）
- カテゴリが正しいこと

### 5-3. 個別記事の確認

記事をクリックして開く:
- 本文が正しく表示されること
- 画像が表示されること
- 目次が自動生成されること
- コードブロックが正しく表示されること

### 5-4. 全記事の自動テスト

以下のスクリプトで全記事のHTTPステータスを確認:

```bash
cd content/posts

for file in *.mdx; do
  slug=$(basename "$file" .mdx)

  # サンプル記事をスキップ
  if [ "$slug" = "hello-world" ] || [ "$slug" = "sample-post" ]; then
    continue
  fi

  status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/posts/$slug")

  if [ "$status" != "200" ]; then
    echo "❌ $slug (HTTP $status)"
  fi
done

echo "✅ テスト完了"
```

**期待される結果**: すべての記事がHTTP 200を返す

### 5-5. ビルド確認

```bash
npm run build
```

エラーが出ないことを確認。

---

## トラブルシューティング

### 問題1: MDXパースエラー

**エラー例**:
```
[next-mdx-remote] error compiling MDX:
Expected a closing tag for `<li>` (3:5-3:9)
```

**原因**:
- BODYとEXTENDED BODYが統合されていない
- HTMLタグが不完全

**対処**:
1. `scripts/convert_to_mdx.py` の `parse_hatena_export()` 関数を確認
2. 以下のコードが含まれていることを確認:

```python
# EXTENDED BODY: セクションを探す
if 'EXTENDED BODY:' in part and '-----' in part:
    extended_parts = part.split('EXTENDED BODY:')
    if len(extended_parts) > 1:
        extended_body = extended_parts[1].strip()
        break  # 最初のEXTENDED BODYのみ処理

# BODYとEXTENDED BODYを結合
full_body = body
if extended_body:
    full_body = body + '\n' + extended_body
```

### 問題2: コンテンツ重複

**症状**: 記事の内容が2回繰り返される

**原因**: 複数のEXTENDED BODYセクションを取得している

**対処**: `break` 文が追加されていることを確認（上記コード参照）

### 問題3: リストがコードとして表示される

**症状**: JSONコードがMarkdownリストになっている

**原因**: `<ul style="list-style: none">` がコードブロックとして処理されていない

**対処**: 以下のコードが `convert_hatena_syntax()` に含まれていることを確認:

```python
# 1.5. コードブロック（ul style="list-style: none"）をMarkdownコードブロックに変換
def convert_code_block(match):
    ul_content = match.group(1)
    lines = re.findall(r'<li>(.*?)</li>', ul_content, re.DOTALL)
    cleaned_lines = []
    for line in lines:
        line = re.sub(r'<span[^>]*>', '', line)
        line = re.sub(r'</span>', '', line)
        line = re.sub(r'<[^>]+>', '', line)
        line = html.unescape(line)
        cleaned_lines.append(line)
    code_content = '\n'.join(cleaned_lines)
    return f'\n\n```\n{code_content}\n```\n\n'

body = re.sub(r'<ul style="list-style: none[^"]*"[^>]*>(.*?)</ul>', convert_code_block, body, flags=re.DOTALL)
```

### 問題4: 見出しに波括弧エラー

**エラー例**:
```
Unexpected token `{`. Expected identifier...
```

**原因**: 見出し内の `{DRAFT}` などの波括弧がMDXエラーを引き起こす

**対処**: 以下のコードが含まれていることを確認:

```python
# 16.5. MDXで問題となる文字をエスケープ
def escape_mdx_braces_in_headings(match):
    level = match.group(1)
    content = match.group(2)
    content = content.replace('{', '').replace('}', '')
    return f'{level} {content}'

body = re.sub(r'^(#{1,6}) (.+)$', escape_mdx_braces_in_headings, body, flags=re.MULTILINE)
```

### 問題5: 画像が表示されない

**原因**:
1. R2のPublic accessが無効
2. 画像URLが間違っている
3. `next.config.ts`でremotePatternsが未設定

**対処**:

1. R2のPublic accessを確認:
   - Cloudflare → R2 → `blog-images` → Settings
   - Public R2.dev subdomain: **Allow**

2. 画像URLをブラウザで直接開いて確認:
   ```
   https://pub-xxxxx.r2.dev/posts/20221106195534.jpg
   ```

3. `next.config.ts`を確認:
   ```typescript
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: 'pub-xxxxx.r2.dev',
         pathname: '/**',
       },
     ],
   },
   ```

### 問題6: descriptionにHTMLタグが残る

**症状**: 記事カードの説明文に `</p>` などが表示される

**対処**: `extract_description()` 関数を確認:

```python
def extract_description(body, max_length=150):
    """本文から説明文を抽出"""
    # HTMLタグを削除
    text = re.sub(r'<[^>]+>', '', body)
    # Markdown記法を削除
    text = re.sub(r'[#\*\[\]!]', '', text)
    # 改行を削除してスペースに
    text = re.sub(r'\n+', ' ', text)
    # 連続するスペースを1つに
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()

    if len(text) > max_length:
        return text[:max_length] + '...'
    return text
```

---

## チェックリスト

### 移行前
- [ ] はてなブログのエクスポートファイル取得
- [ ] Python 3.9以上インストール
- [ ] AWS CLI設定（R2アクセス用）
- [ ] Cloudflare R2バケット作成

### 画像準備
- [ ] `scripts/download_images.py` 作成
- [ ] 画像ダウンロード実行
- [ ] `hatena_images/image_mapping.txt` 生成確認
- [ ] R2へ画像アップロード
- [ ] Public URLで画像表示確認

### 記事変換
- [ ] `scripts/convert_to_mdx.py` 作成（全機能実装）
- [ ] 変換スクリプト実行
- [ ] `content/posts/*.mdx` ファイル生成確認
- [ ] MDXファイルの構造確認

### 動作確認
- [ ] `npm run dev` で起動
- [ ] トップページで記事一覧表示
- [ ] 記事詳細ページで画像表示
- [ ] 目次自動生成
- [ ] Lightbox動作
- [ ] 全記事HTTPステータス確認（200）
- [ ] `npm run build` エラーなし

### 最終確認
- [ ] カテゴリページ動作
- [ ] タグページ動作
- [ ] RSS feed生成
- [ ] OGP設定
- [ ] レスポンシブ対応

---

## スクリプトファイル構成

```
blog/
├── scripts/
│   ├── download_images.py       # 画像ダウンロード
│   └── convert_to_mdx.py         # MDX変換（全機能実装）
├── hatena_images/
│   ├── *.jpg                     # ダウンロードした画像
│   └── image_mapping.txt         # URL→ファイル名マッピング
├── content/
│   └── posts/
│       ├── 2022-11-06-*.mdx
│       ├── 2023-01-04-*.mdx
│       └── ...                   # 137件の記事
└── ippikikoala.hatenablog.com.export.txt
```

---

## 実行履歴の例

### 完全な実行フロー

```bash
# 1. 画像ダウンロード
python3 scripts/download_images.py ippikikoala.hatenablog.com.export.txt
# 結果: 3237枚ダウンロード

# 2. R2アップロード
aws s3 sync hatena_images/ s3://blog-images/posts/ \
  --profile r2 \
  --endpoint-url https://xxxxx.r2.cloudflarestorage.com \
  --exclude "image_mapping.txt"
# 結果: 3237枚アップロード

# 3. MDX変換
python3 scripts/convert_to_mdx.py ippikikoala.hatenablog.com.export.txt
# 結果: 137件変換

# 4. 開発サーバー起動
npm run dev

# 5. 全記事テスト
# (上記スクリプトを実行)
# 結果: 137/137 成功 (100%)

# 6. ビルド確認
npm run build
# 結果: エラーなし
```

---

## まとめ

このガイドに従えば、はてなブログから完全にエラーなく移行できます。

### 重要なポイント

1. **BODYとEXTENDED BODYの統合**: 必ず両方を結合する
2. **コードブロックの検出**: `<ul style="list-style: none">` を正しく処理
3. **HTMLタグの完全削除**: 最後にすべてのHTMLタグを削除
4. **MDX波括弧のエスケープ**: 見出し内の `{}` を削除
5. **全記事テスト**: 変換後は必ず全記事の動作確認を行う

### 次のステップ

- Vercelへデプロイ
- カスタムドメイン設定
- Google Analytics設定
- サイトマップ生成

---

## ステップ6: 記事クリーンアップ（移行後）

移行後の記事には、はてなブログ由来のアーティファクト（目次パターン、キーワードリンクなど）が残っている場合があります。以下のスクリプトで一括クリーンアップできます。

### 6-1. Hatenaキーワードリンク・TOCの削除

`scripts/cleanup_mdx.py` を使用：

```bash
python3 scripts/cleanup_mdx.py
```

**処理内容**:
- Hatenaキーワードリンク（`[text](http://d.hatena.ne.jp/keyword/...)`）をプレーンテキストに変換
- 記事冒頭のTOCリンク（`[見出し](#anchor)`）を削除
- description内のHatena URLを削除

### 6-2. description内のTOCパターン修正

`scripts/cleanup_description_toc.py` を使用：

```bash
# 問題のある記事を確認（修正せず）
python3 scripts/cleanup_description_toc.py --check

# ドライラン（変更内容を確認）
python3 scripts/cleanup_description_toc.py --dry-run

# 実際に修正
python3 scripts/cleanup_description_toc.py
```

**処理内容**:
- description内のTOCパターン（`見出し(アンカー) - 見出し(アンカー)`など）を検出
- 問題があれば本文から最初の意味のある段落を抽出して置換

**検出パターン**:
1. `見出し(アンカー)` が2つ以上含まれる
2. ` - 見出し(アンカー)` セパレータパターン
3. `1日目` や `Part1` で始まりアンカーを含む
4. `href=` を含む
5. 括弧が閉じていない（`(incomplete-anchor` で終わる）

**抽出ロジック**:
- 見出し（`#`）をスキップ
- 画像行をスキップ
- キャプション（`_text_`）をスキップ
- TOCリンクをスキップ
- 最初の150文字程度を抽出（最大200文字）

### 6-3. クリーンアップスクリプト一覧

| スクリプト | 用途 | 実行タイミング |
|-----------|------|---------------|
| `cleanup_mdx.py` | Hatenaリンク・TOC削除 | 変換直後 |
| `cleanup_description_toc.py` | description修正 | cleanup_mdx.py後 |
| `remove_old_toc.py` | 古いTOCリンク削除 | 必要に応じて |
| `fix_categories.py` | カテゴリ正規化 | 必要に応じて |
| `restore_tags.py` | タグ復元 | 必要に応じて |

### 6-4. クリーンアップ後の確認

```bash
# 開発サーバーで確認
npm run dev

# ビルドテスト
npm run build
```

---

**最終更新**: 2026年1月10日
**テスト済み環境**: macOS, Python 3.11, Node.js 18, Next.js 16
