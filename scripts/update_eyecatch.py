#!/usr/bin/env python3
"""
はてなブログからアイキャッチ画像を取得し、MDXファイルを更新する

方法: 各記事のHTMLページからog:imageを取得

Usage:
    python3 scripts/update_eyecatch.py
"""

import requests
import xml.etree.ElementTree as ET
import os
import re
from pathlib import Path
from urllib.parse import unquote
import time

# 設定
HATENA_ID = "ippiki_koala"
BLOG_DOMAIN = "ippikikoala.hatenablog.com"
API_KEY = "eh7uobkq38"
R2_BASE_URL = "https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev/posts"
CONTENT_DIR = Path(__file__).parent.parent / "content" / "posts"
MAPPING_FILE = Path(__file__).parent.parent / "hatena_images" / "image_mapping.txt"

# XML名前空間
NAMESPACES = {
    'atom': 'http://www.w3.org/2005/Atom',
    'app': 'http://www.w3.org/2007/app',
}


def load_image_mapping():
    """image_mapping.txtからファイル名のセットを読み込む"""
    filenames = set()
    if MAPPING_FILE.exists():
        with open(MAPPING_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if '|' in line:
                    _, filename = line.split('|', 1)
                    filenames.add(filename)
    print(f"📷 R2にある画像: {len(filenames)} 件")
    return filenames


def fetch_hatena_entries():
    """はてなブログAPIから全記事のURL一覧を取得"""
    entries = []
    url = f"https://blog.hatena.ne.jp/{HATENA_ID}/{BLOG_DOMAIN}/atom/entry"

    while url:
        print(f"📥 取得中: {url}")
        response = requests.get(url, auth=(HATENA_ID, API_KEY))

        if response.status_code != 200:
            print(f"❌ APIエラー: {response.status_code}")
            break

        root = ET.fromstring(response.content)

        for entry in root.findall('atom:entry', NAMESPACES):
            title = entry.find('atom:title', NAMESPACES)
            published = entry.find('atom:published', NAMESPACES)

            # 記事のURL（alternate link）を取得
            alternate_link = entry.find("atom:link[@rel='alternate']", NAMESPACES)
            entry_url = alternate_link.get('href') if alternate_link is not None else None

            if title is not None and published is not None and entry_url:
                entry_data = {
                    'title': title.text or '',
                    'published': published.text or '',
                    'url': entry_url
                }
                entries.append(entry_data)

        next_link = root.find("atom:link[@rel='next']", NAMESPACES)
        url = next_link.get('href') if next_link is not None else None

    print(f"✅ 取得完了: {len(entries)} 件の記事")
    return entries


def get_eyecatch_from_page(page_url):
    """記事ページからog:imageを取得し、実際の画像URLを抽出"""
    try:
        response = requests.get(page_url, timeout=10)
        if response.status_code != 200:
            return None

        # og:imageを正規表現で取得
        match = re.search(r'<meta property="og:image" content="([^"]+)"', response.text)
        if not match:
            return None

        og_image_url = match.group(1)

        # はてなの画像変換URLから実際のURLを抽出
        # 例: https://cdn.image.st-hatena.com/.../https%3A%2F%2Fcdn-ak.f.st-hatena.com%2F...
        inner_match = re.search(r'https%3A%2F%2Fcdn-ak\.f\.st-hatena\.com[^"&]+', og_image_url)
        if inner_match:
            return unquote(inner_match.group(0))

        # 直接のはてなCDN URLの場合
        if 'cdn-ak.f.st-hatena.com' in og_image_url:
            return og_image_url

        return None
    except Exception as e:
        print(f"    ⚠️ ページ取得エラー: {e}")
        return None


def extract_filename_from_hatena_url(hatena_url):
    """はてなCDN URLからファイル名を抽出"""
    # 例: https://cdn-ak.f.st-hatena.com/images/fotolife/i/ippiki_koala/20260104/20260104233503.jpg
    match = re.search(r'/(\d{14}\.(?:jpg|jpeg|png|gif))$', hatena_url, re.IGNORECASE)
    if match:
        return match.group(1)
    return None


def parse_published_date(published_str):
    """ISO 8601形式の日付をパース"""
    try:
        return published_str[:10]  # YYYY-MM-DD
    except:
        return None


def find_mdx_file(date_str, title):
    """日付とタイトルからMDXファイルを探す"""
    if not CONTENT_DIR.exists():
        return None

    for mdx_file in CONTENT_DIR.glob(f"{date_str}*.mdx"):
        with open(mdx_file, 'r', encoding='utf-8') as f:
            content = f.read()

        title_match = re.search(r'^title:\s*["\'](.+?)["\']', content, re.MULTILINE)
        if title_match:
            file_title = title_match.group(1)
            if file_title == title or title in file_title or file_title in title:
                return mdx_file

    return None


def update_mdx_image(mdx_file, r2_url):
    """MDXファイルのimageフィールドを更新"""
    with open(mdx_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 既にimageが設定されている場合はスキップ
    current_image_match = re.search(r'^image:\s*["\'](.+?)["\']', content, re.MULTILINE)
    if current_image_match and current_image_match.group(1).strip():
        return False, "already_set"

    # image: "" を更新
    new_content = re.sub(
        r'^image:\s*["\']["\']',
        f'image: "{r2_url}"',
        content,
        flags=re.MULTILINE
    )

    if new_content != content:
        with open(mdx_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True, "updated"

    return False, "no_change"


def main():
    print("=" * 60)
    print("はてなブログ アイキャッチ画像 更新スクリプト")
    print("=" * 60)
    print()

    # R2にある画像のファイル名セットを読み込み
    r2_filenames = load_image_mapping()

    # はてなブログAPIから記事URL一覧を取得
    print()
    entries = fetch_hatena_entries()

    if not entries:
        print("❌ 記事が取得できませんでした")
        return

    print()
    print("=" * 60)
    print("各記事のアイキャッチを取得してMDXを更新中...")
    print("=" * 60)
    print()

    stats = {
        'updated': 0,
        'already_set': 0,
        'no_eyecatch': 0,
        'not_in_r2': 0,
        'mdx_not_found': 0,
    }

    not_in_r2_list = []

    for i, entry in enumerate(entries, 1):
        title = entry['title']
        published = entry['published']
        page_url = entry['url']

        date_str = parse_published_date(published)
        if not date_str:
            continue

        print(f"[{i}/{len(entries)}] {title[:40]}...")

        # 記事ページからアイキャッチURLを取得
        eyecatch_url = get_eyecatch_from_page(page_url)

        if not eyecatch_url:
            print(f"    ⏭️ アイキャッチなし")
            stats['no_eyecatch'] += 1
            continue

        # ファイル名を抽出
        filename = extract_filename_from_hatena_url(eyecatch_url)

        if not filename:
            print(f"    ⚠️ ファイル名抽出失敗: {eyecatch_url}")
            stats['no_eyecatch'] += 1
            continue

        # R2にあるか確認
        if filename not in r2_filenames:
            stats['not_in_r2'] += 1
            not_in_r2_list.append({
                'title': title,
                'date': date_str,
                'hatena_url': eyecatch_url,
                'filename': filename
            })
            print(f"    ❌ R2にない: {filename}")
            continue

        r2_url = f"{R2_BASE_URL}/{filename}"

        # MDXファイルを探す
        mdx_file = find_mdx_file(date_str, title)

        if not mdx_file:
            stats['mdx_not_found'] += 1
            print(f"    ⚠️ MDXファイルが見つからない")
            continue

        # MDXを更新
        updated, status = update_mdx_image(mdx_file, r2_url)

        if status == 'updated':
            stats['updated'] += 1
            print(f"    ✅ 更新完了")
        elif status == 'already_set':
            stats['already_set'] += 1
            print(f"    ⏭️ 既に設定済み")

        # サーバー負荷軽減のため少し待機
        time.sleep(0.3)

    # 結果表示
    print()
    print("=" * 60)
    print("結果サマリー")
    print("=" * 60)
    print(f"✅ 更新成功: {stats['updated']} 件")
    print(f"⏭️  既に設定済み: {stats['already_set']} 件")
    print(f"📷 アイキャッチなし: {stats['no_eyecatch']} 件")
    print(f"❌ R2に画像なし: {stats['not_in_r2']} 件")
    print(f"📄 MDXファイルなし: {stats['mdx_not_found']} 件")

    # R2にない画像を表示
    if not_in_r2_list:
        print()
        print("=" * 60)
        print("⚠️  R2に見つからなかったアイキャッチ画像:")
        print("=" * 60)
        for item in not_in_r2_list:
            print(f"  📅 {item['date']} | {item['title'][:40]}...")
            print(f"     ファイル名: {item['filename']}")
            print(f"     URL: {item['hatena_url']}")
            print()


if __name__ == "__main__":
    main()
