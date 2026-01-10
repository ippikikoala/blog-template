#!/usr/bin/env python3
"""
はてなブログエクスポートからタグを復元してMDXファイルを更新

このスクリプトは以下の処理を行います:
1. はてなブログエクスポートファイルを解析
2. 各記事のBASENAMEと複数のCATEGORYを抽出
3. 最初のCATEGORYはcategory、2つ目以降はtagsとして扱う
4. 対応するMDXファイルのfrontmatterを更新

Usage:
    python3 scripts/restore_tags.py <export_file>

Example:
    python3 scripts/restore_tags.py ippikikoala.hatenablog.com.export.txt

Output:
    - content/posts/*.mdx ファイルのtagsフィールドが更新されます
"""

import re
import sys
import os
from pathlib import Path
from datetime import datetime


def parse_hatena_export(export_file):
    """はてなブログのエクスポートファイルをパースしてタグ情報を抽出"""

    with open(export_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 記事ごとに分割（--------で区切られている）
    entries = content.split('--------')

    posts = []

    for entry in entries:
        if not entry.strip():
            continue

        # メタデータセクションを取得（最初の-----まで）
        if '-----' not in entry:
            continue

        metadata_section = entry.split('-----')[0]

        # メタデータをパース
        post = {'categories': []}
        for line in metadata_section.split('\n'):
            line = line.strip()
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip().upper()
                value = value.strip()

                if key == 'CATEGORY':
                    post['categories'].append(value)
                elif key == 'BASENAME':
                    post['basename'] = value
                elif key == 'DATE':
                    post['date'] = value
                elif key == 'TITLE':
                    post['title'] = value

        if post.get('basename') and post.get('categories'):
            posts.append(post)

    return posts


def basename_to_slug(basename, date_str):
    """BASENAMEと日付からMDXファイル名のslugを生成"""
    # 日付変換
    try:
        dt = datetime.strptime(date_str, '%m/%d/%Y %H:%M:%S')
        date = dt.strftime('%Y-%m-%d')
    except:
        date = '2025-01-01'

    # basenameをクリーンアップ
    if basename:
        # basenameに "/" やその他の特殊文字が含まれている場合は置換
        clean_basename = re.sub(r'[^a-z0-9]+', '-', basename.lower())
        # 先頭・末尾のハイフンを削除
        clean_basename = clean_basename.strip('-')
    else:
        clean_basename = 'untitled'

    return f"{date}-{clean_basename}"


def update_mdx_tags(mdx_path, tags):
    """MDXファイルのtagsフィールドを更新"""

    with open(mdx_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # frontmatterを解析
    if not content.startswith('---'):
        return False

    # frontmatterの終わりを見つける
    end_match = re.search(r'\n---\n', content[3:])
    if not end_match:
        return False

    frontmatter_end = end_match.start() + 3
    frontmatter = content[3:frontmatter_end]
    body = content[frontmatter_end + 4:]  # \n---\n の4文字分

    # tags行を更新
    tags_str = str(tags)  # Python list to string representation

    # 既存のtags行を置換
    new_frontmatter = re.sub(
        r'^tags:.*$',
        f'tags: {tags_str}',
        frontmatter,
        flags=re.MULTILINE
    )

    # 新しいコンテンツを作成
    new_content = f"---{new_frontmatter}\n---\n{body}"

    with open(mdx_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True


def find_mdx_file(posts_dir, slug):
    """slugに一致するMDXファイルを探す"""
    # 完全一致
    exact_path = posts_dir / f"{slug}.mdx"
    if exact_path.exists():
        return exact_path

    # 部分一致（日付部分で検索）
    date_part = slug[:10]  # YYYY-MM-DD
    for mdx_file in posts_dir.glob(f"{date_part}*.mdx"):
        return mdx_file

    return None


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 restore_tags.py <export_file>")
        print("Example: python3 restore_tags.py ippikikoala.hatenablog.com.export.txt")
        sys.exit(1)

    export_file = sys.argv[1]

    if not os.path.exists(export_file):
        print(f"❌ エラー: ファイルが見つかりません: {export_file}")
        sys.exit(1)

    posts_dir = Path('content/posts')
    if not posts_dir.exists():
        print(f"❌ エラー: content/postsディレクトリが見つかりません")
        sys.exit(1)

    print(f"📖 エクスポートファイル: {export_file}")
    print()

    # エクスポートファイルをパース
    print("📄 記事を解析中...")
    posts = parse_hatena_export(export_file)
    print(f"✅ {len(posts)} 件の記事を検出しました")
    print()

    # 統計情報
    updated = 0
    not_found = 0
    no_tags = 0

    for post in posts:
        basename = post.get('basename', '')
        date_str = post.get('date', '')
        categories = post.get('categories', [])
        title = post.get('title', 'Untitled')

        # slugを生成
        slug = basename_to_slug(basename, date_str)

        # MDXファイルを探す
        mdx_file = find_mdx_file(posts_dir, slug)

        if not mdx_file:
            not_found += 1
            continue

        # タグを抽出（2番目以降のCATEGORY）
        if len(categories) > 1:
            tags = categories[1:]
        else:
            tags = []
            no_tags += 1
            continue

        # MDXファイルを更新
        if update_mdx_tags(mdx_file, tags):
            updated += 1
            print(f"✅ 更新: {mdx_file.name}")
            print(f"   タグ: {tags}")
        else:
            print(f"⚠️  更新失敗: {mdx_file.name}")

    print("\n" + "="*60)
    print(f"✅ 更新完了: {updated} 件")
    print(f"⚠️  タグなし: {no_tags} 件")
    print(f"❌ MDX未発見: {not_found} 件")
    print("="*60)


if __name__ == "__main__":
    main()
