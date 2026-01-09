#!/usr/bin/env python3
"""
iframe_mapping.jsonから更新ガイドを生成

このスクリプトは以下の情報を含むMarkdownガイドを生成します:
1. 各記事ごとのセクション
2. 埋め込み位置のヒント
3. 置換前後のコード例

Usage:
    python3 scripts/update_mdx_iframes.py

Output:
    - iframe_update_guide.md: 手動更新用ガイド

Last Updated: 2026-01-09
"""

import json
import sys
import os
from pathlib import Path
from convert_to_mdx import parse_hatena_export

def basename_to_filename(basename):
    """
    basename（例: "2025/12/28/174758"）をMDXファイル名に変換
    return: "2025-12-28-2025-12-28-174758.mdx"
    """
    parts = basename.split('/')
    if len(parts) == 4:
        date_str = f"{parts[0]}-{parts[1]}-{parts[2]}"
        filename = f"{date_str}-{basename.replace('/', '-')}.mdx"
        return filename
    return f"{basename.replace('/', '-')}.mdx"

def find_title_by_basename(posts, basename):
    """basenameから記事タイトルを検索"""
    for post in posts:
        if post.get('basename', '') == basename:
            return post.get('title', 'タイトル不明')
    return 'タイトル不明'

def main():
    mapping_file = '/Users/ippiki_koala/Desktop/Claude/blog/iframe_mapping.json'
    export_file = '/Users/ippiki_koala/Desktop/Claude/blog/ippikikoala.hatenablog.com.export.txt'
    output_file = '/Users/ippiki_koala/Desktop/Claude/blog/iframe_update_guide.md'

    if not os.path.exists(mapping_file):
        print(f"❌ エラー: iframe_mapping.jsonが見つかりません")
        print(f"   先に python3 scripts/extract_iframes.py を実行してください")
        sys.exit(1)

    # iframe_mapping.json読み込み
    with open(mapping_file, 'r', encoding='utf-8') as f:
        iframe_mapping = json.load(f)

    # エクスポートファイルからタイトル情報を取得
    posts = parse_hatena_export(export_file) if os.path.exists(export_file) else []

    print(f"📖 iframe_mapping.json を読み込みました")
    print(f"   対象記事: {len(iframe_mapping)} 件")
    print()

    # Markdownガイド生成
    guide_lines = []
    guide_lines.append("# iframe埋め込み更新ガイド")
    guide_lines.append("")
    guide_lines.append("このガイドは、ブログ記事にYouTubeとGoogle Mapsの埋め込みを追加するための手順書です。")
    guide_lines.append("")
    guide_lines.append("## 統計情報")
    guide_lines.append("")

    total_youtube = sum(1 for iframes in iframe_mapping.values() for iframe in iframes if iframe['type'] == 'youtube')
    total_maps = sum(1 for iframes in iframe_mapping.values() for iframe in iframes if iframe['type'] == 'google_maps')

    guide_lines.append(f"- 対象記事: {len(iframe_mapping)} 件")
    guide_lines.append(f"- YouTube埋め込み: {total_youtube} 件")
    guide_lines.append(f"- Google Maps埋め込み: {total_maps} 件")
    guide_lines.append("")
    guide_lines.append("---")
    guide_lines.append("")

    # 各記事ごとのガイド生成
    for i, (basename, iframes) in enumerate(sorted(iframe_mapping.items()), 1):
        filename = basename_to_filename(basename)
        title = find_title_by_basename(posts, basename)
        filepath = f"content/posts/{filename}"

        guide_lines.append(f"## {i}. {filename}")
        guide_lines.append("")
        guide_lines.append(f"**記事タイトル**: {title}")
        guide_lines.append("")
        guide_lines.append(f"**ファイルパス**: `{filepath}`")
        guide_lines.append("")

        youtube_count = sum(1 for x in iframes if x['type'] == 'youtube')
        maps_count = sum(1 for x in iframes if x['type'] == 'google_maps')

        guide_lines.append(f"**埋め込み数**: YouTube {youtube_count} 件, Google Maps {maps_count} 件")
        guide_lines.append("")

        # 各埋め込みの詳細
        for j, iframe in enumerate(iframes, 1):
            if iframe['type'] == 'youtube':
                guide_lines.append(f"### 埋め込み {j}: YouTube")
                guide_lines.append("")
                guide_lines.append(f"**動画ID**: `{iframe['id']}`")
                if iframe.get('start'):
                    guide_lines.append(f"**開始時刻**: {iframe['start']}秒")
                guide_lines.append("")
                guide_lines.append("**追加するコード**:")
                guide_lines.append("```tsx")
                if iframe.get('start'):
                    guide_lines.append(f'<YouTube')
                    guide_lines.append(f'  id="{iframe["id"]}"')
                    guide_lines.append(f'  start={iframe["start"]}')
                    guide_lines.append(f'  title="動画タイトルを記入"')
                    guide_lines.append(f'/>')
                else:
                    guide_lines.append(f'<YouTube')
                    guide_lines.append(f'  id="{iframe["id"]}"')
                    guide_lines.append(f'  title="動画タイトルを記入"')
                    guide_lines.append(f'/>')
                guide_lines.append("```")
                guide_lines.append("")

            elif iframe['type'] == 'google_maps':
                guide_lines.append(f"### 埋め込み {j}: Google Maps")
                guide_lines.append("")
                guide_lines.append("**置換対象**: `[Google Maps埋め込み]`")
                guide_lines.append("")
                guide_lines.append("**追加するコード**:")
                guide_lines.append("```tsx")
                guide_lines.append(f'<GoogleMap')
                guide_lines.append(f'  src="{iframe["src"]}"')
                guide_lines.append(f'  title="場所名を記入"')
                guide_lines.append(f'/>')
                guide_lines.append("```")
                guide_lines.append("")

        guide_lines.append("---")
        guide_lines.append("")

    # ガイド末尾に手順を追加
    guide_lines.append("## 更新手順")
    guide_lines.append("")
    guide_lines.append("1. VSCodeで対象ファイルを開く")
    guide_lines.append("2. YouTube埋め込みは、本文中の適切な位置にコードを挿入")
    guide_lines.append("3. Google Maps埋め込みは、`[Google Maps埋め込み]` を検索（Cmd+F）して置換")
    guide_lines.append("4. `title` 属性に周辺の見出しや文脈から適切なタイトルを記入")
    guide_lines.append("5. 保存")
    guide_lines.append("6. `npm run dev` でブラウザ確認")
    guide_lines.append("")
    guide_lines.append("## 注意事項")
    guide_lines.append("")
    guide_lines.append("- YouTubeの埋め込み位置は、元のはてなブログを確認して適切な場所に挿入してください")
    guide_lines.append("- Google Mapsは `[Google Maps埋め込み]` を置換する形で対応")
    guide_lines.append("- title属性は省略可能ですが、アクセシビリティのために記入を推奨")
    guide_lines.append("")

    # ファイル出力
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(guide_lines))

    print(f"✅ 更新ガイドを生成しました: {output_file}")
    print()
    print("次のステップ:")
    print("  1. iframe_update_guide.md を開く")
    print("  2. ガイドに従って各MDXファイルを手動更新")
    print("  3. npm run dev で表示確認")

if __name__ == "__main__":
    main()
