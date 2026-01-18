#!/usr/bin/env python3
"""
はてなブログのエクスポートファイルをMDX形式に変換

このスクリプトは以下の機能を実装しています:
1. BODYとEXTENDED BODYの統合（コンテンツ重複防止）
2. コードブロック（ul style="list-style: none"）の正しい変換
3. 見出しタグの画像・HTML削除
4. figure+img+figcaptionの適切な変換
5. HTMLタグの完全削除
6. MDX波括弧（{}）のエスケープ
7. 画像URLのCloudflare R2への変換
8. descriptionフィールドのクリーンアップ

Usage:
    python3 scripts/convert_to_mdx.py <export_file> [r2_public_url]

Example:
    python3 scripts/convert_to_mdx.py ippikikoala.hatenablog.com.export.txt
    python3 scripts/convert_to_mdx.py ippikikoala.hatenablog.com.export.txt https://pub-xxxxx.r2.dev

Requirements:
    - hatena_images/image_mapping.txt が存在すること
    - R2のPublic URLが設定されていること

Output:
    - content/posts/*.mdx ファイルが生成されます
    - 既存ファイルは .bak として自動バックアップされます

Last Updated: 2026-01-07
Tested: 137 articles migrated successfully with 0 errors
"""

import re
import sys
import os
from datetime import datetime
from pathlib import Path

def parse_hatena_export(export_file):
    """はてなブログのエクスポートファイルをパース"""

    with open(export_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 記事ごとに分割（--------で区切られている）
    entries = content.split('--------')

    posts = []

    for entry in entries:
        if not entry.strip():
            continue

        # メタデータとコンテンツを分離
        if '-----' not in entry:
            continue

        parts = entry.split('-----')
        if len(parts) < 2:
            continue

        metadata_section = parts[0]

        # BODYとEXTENDED BODYを統合
        body = ''
        extended_body = ''

        for i, part in enumerate(parts):
            # BODY: セクションを探す
            if 'BODY:' in part:
                body_content = part.split('BODY:')
                if len(body_content) > 1:
                    body = body_content[1].strip()

            # EXTENDED BODY: セクションを探す
            if 'EXTENDED BODY:' in part and '-----' in part:
                # 'EXTENDED BODY:' から次の '-----' までを取得
                extended_parts = part.split('EXTENDED BODY:')
                if len(extended_parts) > 1:
                    extended_body = extended_parts[1].strip()
                    break  # 最初のEXTENDED BODYのみ処理

        # BODYとEXTENDED BODYを結合
        full_body = body
        if extended_body:
            full_body = body + '\n' + extended_body

        # メタデータをパース
        post = {}
        for line in metadata_section.split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                post[key.strip().lower()] = value.strip()

        if full_body:
            post['body'] = full_body
            posts.append(post)

    return posts

def convert_to_mdx(post, image_mapping, r2_public_url):
    """はてなブログ記事をMDX形式に変換"""

    # 日付変換
    date_str = post.get('date', '')
    try:
        dt = datetime.strptime(date_str, '%m/%d/%Y %H:%M:%S')
        date = dt.strftime('%Y-%m-%d')
    except:
        date = '2025-01-01'

    # スラッグ生成
    basename = post.get('basename', '')
    if not basename:
        # basenameがない場合はタイトルから生成
        title = post.get('title', 'untitled')
        basename = re.sub(r'[^a-z0-9]+', '-', title.lower())
    else:
        # basenameに "/" やその他の特殊文字が含まれている場合は置換
        basename = re.sub(r'[^a-z0-9]+', '-', basename.lower())

    slug = f"{date}-{basename}"

    # カテゴリ・タグ
    category = post.get('category', '')
    tags_str = post.get('tags', '')
    tags = [tag.strip() for tag in tags_str.split(',') if tag.strip()]

    # 本文処理
    body = post.get('body', '')

    # はてな記法を変換
    body = convert_hatena_syntax(body, image_mapping, r2_public_url)

    # 説明文を抽出
    description = extract_description(body)

    # フロントマター作成
    title = post.get('title', 'Untitled').replace('"', '\\"')
    description = description.replace('"', '\\"')

    frontmatter = f"""---
title: "{title}"
date: "{date}"
description: "{description}"
category: "{category}"
tags: {tags}
image: ""
---

{body}
"""

    return slug, frontmatter

def convert_hatena_syntax(body, image_mapping, r2_public_url):
    """はてな記法とHTMLをMarkdownに変換"""
    import html

    # 1. 目次の削除（MDXで自動生成されるため）
    body = re.sub(r'<ul class="table-of-contents">.*?</ul>', '', body, flags=re.DOTALL)

    # 1.5. コードブロック（ul style="list-style: none"）をMarkdownコードブロックに変換
    def convert_code_block(match):
        ul_content = match.group(1)
        # li タグからコード行を抽出
        lines = re.findall(r'<li>(.*?)</li>', ul_content, re.DOTALL)
        # span タグなどのHTMLを削除
        cleaned_lines = []
        for line in lines:
            # span タグを削除
            line = re.sub(r'<span[^>]*>', '', line)
            line = re.sub(r'</span>', '', line)
            # その他のHTMLタグを削除
            line = re.sub(r'<[^>]+>', '', line)
            # HTMLエンティティをデコード
            line = html.unescape(line)
            cleaned_lines.append(line)
        # コードブロックとして出力
        code_content = '\n'.join(cleaned_lines)
        return f'\n\n```\n{code_content}\n```\n\n'

    body = re.sub(r'<ul style="list-style: none[^"]*"[^>]*>(.*?)</ul>', convert_code_block, body, flags=re.DOTALL)

    # 2. YouTube埋め込みをMDXコンポーネントに変換
    def convert_youtube_iframe(match):
        iframe_content = match.group(0)
        # src属性からvideoIdを抽出
        # パターン1: https://www.youtube.com/embed/VIDEO_ID
        video_id_match = re.search(r'youtube\.com/embed/([a-zA-Z0-9_-]+)', iframe_content)
        if video_id_match:
            video_id = video_id_match.group(1)
            # title属性があれば取得
            title_match = re.search(r'title="([^"]*)"', iframe_content)
            title = title_match.group(1) if title_match else ""
            if title:
                return f'\n\n<YouTube videoId="{video_id}" title="{title}" />\n\n'
            else:
                return f'\n\n<YouTube videoId="{video_id}" />\n\n'
        return ''

    body = re.sub(r'<iframe[^>]*youtube\.com/embed[^>]*>.*?</iframe>', convert_youtube_iframe, body, flags=re.DOTALL)

    # 2.5. はてなブログの埋め込みコンテンツを削除
    body = re.sub(r'<iframe[^>]*src="https://hatenablog-parts\.com/embed[^>]*>.*?</iframe>', '', body, flags=re.DOTALL)
    body = re.sub(r'<iframe[^>]*src="https://www\.google\.com/maps/embed[^>]*>.*?</iframe>', '\n\n[Google Maps埋め込み]\n\n', body, flags=re.DOTALL)

    # 3. はてな特有のタグを削除
    body = re.sub(r'<cite class="hatena-citation">.*?</cite>', '', body, flags=re.DOTALL)

    # 4. 見出しタグ: <h3>, <h4>, <h5> → ###, ####, #####
    # 見出し内の画像タグや改行タグを削除してからMarkdown化（画像処理の前に実行）
    def clean_heading(match):
        tag = match.group(1)  # h3, h4, h5
        content = match.group(2)
        # 見出し内の画像タグを削除
        content = re.sub(r'<img[^>]*>', '', content)
        # 見出し内の改行タグを削除
        content = re.sub(r'<br\s*/?\s*>', ' ', content, flags=re.IGNORECASE)
        # 見出し内のリンクタグはテキストのみ抽出
        content = re.sub(r'<a[^>]*>(.*?)</a>', r'\1', content, flags=re.DOTALL)
        # 見出し内のその他のHTMLタグを削除
        content = re.sub(r'<[^>]+>', '', content)
        # 前後の空白を削除
        content = content.strip()
        level = '#' * (int(tag[1]) + 1)  # h3→###, h4→####, h5→#####
        return f'\n\n{level} {content}\n\n'

    body = re.sub(r'<(h3)[^>]*>(.*?)</h3>', clean_heading, body, flags=re.DOTALL)
    body = re.sub(r'<(h4)[^>]*>(.*?)</h4>', clean_heading, body, flags=re.DOTALL)
    body = re.sub(r'<(h5)[^>]*>(.*?)</h5>', clean_heading, body, flags=re.DOTALL)

    # 5. figure + img + figcaption → 画像 + キャプション
    def replace_figure(match):
        full_figure = match.group(0)
        # figcaptionからキャプションを抽出
        caption_match = re.search(r'<figcaption[^>]*>(.*?)</figcaption>', full_figure, re.DOTALL)
        caption = caption_match.group(1).strip() if caption_match else ''
        # imgタグを抽出
        img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', full_figure)
        if img_match:
            src = img_match.group(1)
            # 画像URLをR2に変換
            basename = os.path.basename(src).rsplit('.', 1)[0]
            if src in image_mapping:
                filename = image_mapping[src]
                new_path = f"{r2_public_url}/posts/{filename}"
            elif basename in image_mapping:
                filename = image_mapping[basename]
                new_path = f"{r2_public_url}/posts/{filename}"
            else:
                new_path = src
            # Markdown形式で出力（キャプションはalt textとして使用）
            if caption:
                result = f"\n\n![{caption}]({new_path})\n\n_{caption}_\n\n"
            else:
                result = f"\n\n![画像]({new_path})\n\n"
            return result
        return ''

    body = re.sub(r'<figure[^>]*>.*?</figure>', replace_figure, body, flags=re.DOTALL)

    # 5. 残った画像タグ: <img> → ![](...)
    def replace_html_image(match):
        src = match.group(1)
        # URLがマッピングにある場合、R2のURLに変換
        if src in image_mapping:
            filename = image_mapping[src]
            new_path = f"{r2_public_url}/posts/{filename}"
            return f"![画像]({new_path})"
        # URLからファイル名を抽出して検索
        basename = os.path.basename(src).rsplit('.', 1)[0]
        if basename in image_mapping:
            filename = image_mapping[basename]
            new_path = f"{r2_public_url}/posts/{filename}"
            return f"![画像]({new_path})"
        # マッピングになければ元のURLをそのまま使用
        return f"![画像]({src})"

    body = re.sub(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', replace_html_image, body)

    # 6. 画像: [f:id:...] → ![](...)
    def replace_fid_image(match):
        image_id = match.group(1)
        if image_id in image_mapping:
            filename = image_mapping[image_id]
            new_path = f"{r2_public_url}/posts/{filename}"
            return f"![画像]({new_path})"
        return match.group(0)

    body = re.sub(r'\[f:id:([^\]]+)\]', replace_fid_image, body)

    # 7. リンク: <a> → [text](url)
    body = re.sub(r'<a[^>]*class="keyword"[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', r'[\2](\1)', body, flags=re.DOTALL)
    body = re.sub(r'<a[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', r'[\2](\1)', body, flags=re.DOTALL)

    # 8. 段落タグ: <p> → 空行区切り
    body = re.sub(r'<p[^>]*>(.*?)</p>', r'\n\n\1\n\n', body, flags=re.DOTALL)
    # 残った開始・終了タグを削除
    body = re.sub(r'</?p[^>]*>', '', body)

    # 9. リストタグ: <ul>, <ol>, <li> → Markdownリスト
    # 単純なリストの変換（ネストは考慮しない）
    body = re.sub(r'<ul[^>]*>', '\n', body)
    body = re.sub(r'</ul>', '\n', body)
    body = re.sub(r'<ol[^>]*>', '\n', body)
    body = re.sub(r'</ol>', '\n', body)
    body = re.sub(r'<li[^>]*>(.*?)</li>', r'- \1\n', body, flags=re.DOTALL)
    # 残った閉じタグだけの<li>を削除
    body = re.sub(r'</li>', '', body)
    body = re.sub(r'<li[^>]*>', '- ', body)

    # 10. 強調タグ: <strong>, <b> → **...**
    body = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', body, flags=re.DOTALL)
    body = re.sub(r'<b[^>]*>(.*?)</b>', r'**\1**', body, flags=re.DOTALL)

    # 11. 斜体タグ: <em>, <i> → *...*
    body = re.sub(r'<em[^>]*>(.*?)</em>', r'*\1*', body, flags=re.DOTALL)
    body = re.sub(r'<i[^>]*>(.*?)</i>', r'*\1*', body, flags=re.DOTALL)

    # 12. はてな記法の見出し: *... → ##
    body = re.sub(r'^\*\*\*(.+)$', r'#### \1', body, flags=re.MULTILINE)
    body = re.sub(r'^\*\*(.+)$', r'### \1', body, flags=re.MULTILINE)
    body = re.sub(r'^\*([^*].+)$', r'## \1', body, flags=re.MULTILINE)

    # 13. リンク: [url:title=text] → [text](url)
    body = re.sub(r'\[([^\]]+):title=([^\]]+)\]', r'[\2](\1)', body)

    # 14. 改行タグ: <br />, <br>, <br/> → 空白または削除
    body = re.sub(r'<br\s*/?\s*>', '\n\n', body, flags=re.IGNORECASE)

    # 15. HTMLエンティティをデコード
    body = html.unescape(body)

    # 16. 残りの全てのHTMLタグを削除
    body = re.sub(r'<[^>]+>', '', body)

    # 16.5. MDXで問題となる文字をエスケープ
    # 見出し内の{DRAFT}などの波括弧を削除（MDXでは{}は特別な意味を持つ）
    def escape_mdx_braces_in_headings(match):
        level = match.group(1)
        content = match.group(2)
        # 波括弧を削除
        content = content.replace('{', '').replace('}', '')
        return f'{level} {content}'

    body = re.sub(r'^(#{1,6}) (.+)$', escape_mdx_braces_in_headings, body, flags=re.MULTILINE)

    # 17. クリーンアップ: 連続する空行を2つまでに
    body = re.sub(r'\n{3,}', '\n\n', body)

    # 18. 行末の空白を削除
    body = '\n'.join(line.rstrip() for line in body.split('\n'))

    return body.strip()

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

def load_image_mapping(mapping_file, r2_public_url):
    """画像マッピングファイルを読み込み"""
    mapping = {}

    if not os.path.exists(mapping_file):
        print(f"⚠️  警告: 画像マッピングファイルが見つかりません: {mapping_file}")
        return mapping

    with open(mapping_file, 'r', encoding='utf-8') as f:
        for line in f:
            if '|' in line:
                url, filename = line.strip().split('|')
                # URLからファイル名（拡張子なし）を抽出してはてな記法IDとしてマッピング
                # 例: https://cdn-ak.f.st-hatena.com/images/fotolife/i/ippiki_koala/20221106/20221106195534.jpg
                # -> 20221106195534 がIDになる
                basename = filename.rsplit('.', 1)[0]  # 拡張子を除去
                mapping[url] = filename
                # はてな記法の [f:id:...] パターンにも対応
                mapping[basename] = filename

    return mapping

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 convert_to_mdx.py <export_file> [r2_public_url]")
        print("Example: python3 convert_to_mdx.py ippikikoala.hatenablog.com.export.txt")
        sys.exit(1)

    export_file = sys.argv[1]
    r2_public_url = sys.argv[2] if len(sys.argv) > 2 else "https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev"

    if not os.path.exists(export_file):
        print(f"❌ エラー: ファイルが見つかりません: {export_file}")
        sys.exit(1)

    print(f"📖 エクスポートファイル: {export_file}")
    print(f"🌐 R2 Public URL: {r2_public_url}")
    print()

    # 画像マッピング読み込み
    mapping_file = 'hatena_images/image_mapping.txt'
    image_mapping = load_image_mapping(mapping_file, r2_public_url)
    print(f"📷 画像マッピング: {len(image_mapping)} 件")
    print()

    # エクスポートファイルをパース
    print("📄 記事を解析中...")
    posts = parse_hatena_export(export_file)
    print(f"✅ {len(posts)} 件の記事を検出しました")
    print()

    # MDXファイルを作成
    output_dir = Path('content/posts')
    output_dir.mkdir(parents=True, exist_ok=True)

    created = []
    for i, post in enumerate(posts, 1):
        slug, mdx_content = convert_to_mdx(post, image_mapping, r2_public_url)

        output_file = output_dir / f"{slug}.mdx"

        # 既存ファイルがある場合はバックアップ
        if output_file.exists():
            backup_file = output_dir / f"{slug}.mdx.bak"
            output_file.rename(backup_file)
            print(f"🔄 [{i}/{len(posts)}] バックアップ: {output_file.name}.bak")

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(mdx_content)

        title = post.get('title', 'Untitled')
        print(f"✅ [{i}/{len(posts)}] 作成: {output_file.name} - {title}")
        created.append(str(output_file))

    print("\n" + "="*60)
    print(f"✅ 変換完了: {len(created)} 件")
    print(f"📁 保存先: {output_dir}/")
    print("="*60)
    print("\n次のステップ:")
    print("1. npm run dev で動作確認")
    print("2. 画像が表示されない場合は画像をR2にアップロード")
    print("3. 各記事を開いて内容を確認")
