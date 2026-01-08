#!/usr/bin/env python3
"""
はてなブログの画像を一括ダウンロード

Usage:
    python3 scripts/download_images.py ippikikoala.hatenablog.com.export.txt
"""

import re
import requests
import os
import sys
from pathlib import Path
from urllib.parse import urlparse

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
    print(f"\n📁 保存先: {output_dir}/")
    print(f"📄 マッピングファイル: {mapping_file}")
    print("="*60)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 download_images.py <export_file>")
        print("Example: python3 download_images.py ippikikoala.hatenablog.com.export.txt")
        sys.exit(1)

    export_file = sys.argv[1]

    if not os.path.exists(export_file):
        print(f"❌ エラー: ファイルが見つかりません: {export_file}")
        sys.exit(1)

    download_hatena_images(export_file)
