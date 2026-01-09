#!/usr/bin/env python3
"""
はてなブログエクスポートファイルからiframe情報を抽出

このスクリプトは以下の情報を抽出します:
1. YouTube埋め込み動画のID
2. Google Maps埋め込みのURL

Usage:
    python3 scripts/extract_iframes.py

Output:
    - iframe_mapping.json: 記事ごとのiframe情報

Last Updated: 2026-01-09
"""

import re
import json
import sys
import os
from pathlib import Path

# convert_to_mdx.pyからparse_hatena_export関数をインポート
sys.path.insert(0, str(Path(__file__).parent))
from convert_to_mdx import parse_hatena_export

def extract_iframes_from_body(body, basename):
    """本文からiframe情報を抽出"""
    iframes = []

    # YouTube埋め込みの検出
    # パターン: <iframe src="https://www.youtube.com/embed/VIDEO_ID?start=123">
    youtube_pattern = r'<iframe[^>]*src=["\']https://www\.youtube\.com/embed/([^"\'?]+)(?:\?start=(\d+))?[^>]*>'

    for match in re.finditer(youtube_pattern, body):
        video_id = match.group(1)
        start = match.group(2)
        iframes.append({
            "type": "youtube",
            "id": video_id,
            "start": int(start) if start else None,
            "original_url": f"https://www.youtube.com/embed/{video_id}",
            "position": match.start()
        })

    # Google Maps埋め込みの検出
    # パターン: <iframe src="https://www.google.com/maps/embed?pb=...">
    maps_pattern = r'<iframe[^>]*src=["\'](https://www\.google\.com/maps/embed\?pb=[^"\']+)["\'][^>]*>'

    for match in re.finditer(maps_pattern, body):
        src = match.group(1)
        iframes.append({
            "type": "google_maps",
            "src": src,
            "position": match.start()
        })

    # positionでソート
    iframes.sort(key=lambda x: x['position'])

    return iframes

def main():
    export_file = '/Users/ippiki_koala/Desktop/Claude/blog/ippikikoala.hatenablog.com.export.txt'
    output_file = '/Users/ippiki_koala/Desktop/Claude/blog/iframe_mapping.json'

    if not os.path.exists(export_file):
        print(f"❌ エラー: エクスポートファイルが見つかりません: {export_file}")
        sys.exit(1)

    print(f"📖 エクスポートファイル: {export_file}")
    print()

    # エクスポートファイルをパース
    print("📄 記事を解析中...")
    posts = parse_hatena_export(export_file)
    print(f"✅ {len(posts)} 件の記事を検出しました")
    print()

    # iframe情報を抽出
    print("🔍 iframe情報を抽出中...")
    iframe_mapping = {}
    youtube_count = 0
    maps_count = 0

    for i, post in enumerate(posts, 1):
        basename = post.get('basename', '')
        body = post.get('body', '')
        title = post.get('title', 'Untitled')

        if not basename or not body:
            continue

        iframes = extract_iframes_from_body(body, basename)

        if iframes:
            iframe_mapping[basename] = iframes

            # カウント
            for iframe in iframes:
                if iframe['type'] == 'youtube':
                    youtube_count += 1
                elif iframe['type'] == 'google_maps':
                    maps_count += 1

            print(f"✅ [{i}/{len(posts)}] {basename} - {title}")
            print(f"   → YouTube: {sum(1 for x in iframes if x['type'] == 'youtube')} 件, Google Maps: {sum(1 for x in iframes if x['type'] == 'google_maps')} 件")

    print()
    print("="*60)
    print(f"📊 抽出結果:")
    print(f"  - YouTube: {youtube_count} 件")
    print(f"  - Google Maps: {maps_count} 件")
    print(f"  - iframe含む記事: {len(iframe_mapping)} 件")
    print("="*60)
    print()

    # JSON出力
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(iframe_mapping, f, ensure_ascii=False, indent=2)

    print(f"💾 保存完了: {output_file}")
    print()
    print("次のステップ:")
    print("  python3 scripts/update_mdx_iframes.py")

if __name__ == "__main__":
    main()
