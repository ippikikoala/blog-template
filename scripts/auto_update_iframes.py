#!/usr/bin/env python3
"""
MDXファイルに自動的にiframe埋め込みコードを追加

このスクリプトは以下の処理を実行します:
1. iframe_mapping.jsonを読み込み
2. 各MDXファイルを読み込み
3. [Google Maps埋め込み]を<GoogleMap>コンポーネントに置換
4. 適切な位置にYouTubeコンポーネントを挿入（※現在は未実装）
5. バックアップを作成してから更新

Usage:
    python3 scripts/auto_update_iframes.py [--dry-run]

Options:
    --dry-run    実際には更新せず、変更内容のみ表示

Last Updated: 2026-01-09
"""

import json
import sys
import os
import re
from pathlib import Path
from datetime import datetime

def basename_to_filename(basename):
    """basenameをMDXファイル名に変換"""
    parts = basename.split('/')
    if len(parts) == 4:
        date_str = f"{parts[0]}-{parts[1]}-{parts[2]}"
        filename = f"{date_str}-{basename.replace('/', '-')}.mdx"
        return filename
    return f"{basename.replace('/', '-')}.mdx"

def create_backup(file_path):
    """ファイルのバックアップを作成"""
    backup_path = f"{file_path}.backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    return backup_path

def generate_google_map_component(src, title=""):
    """GoogleMapコンポーネントのコード生成"""
    if not title:
        title = "Google Maps"

    return f'''<GoogleMap
  src="{src}"
  title="{title}"
/>'''

def generate_youtube_component(video_id, start=None, title=""):
    """YouTubeコンポーネントのコード生成"""
    if not title:
        title = "YouTube video"

    lines = ['<YouTube']
    lines.append(f'  id="{video_id}"')
    if start:
        lines.append(f'  start={start}')
    lines.append(f'  title="{title}"')
    lines.append('/>')

    return '\n'.join(lines)

def extract_context_title(content, position, search_range=500):
    """
    指定位置の前後から適切なタイトルを抽出
    見出し（####など）から抽出を試みる
    """
    start = max(0, position - search_range)
    end = min(len(content), position + search_range)
    context = content[start:end]

    # 見出しを検索（####, ###, ##）
    heading_pattern = r'^#{2,4}\s+(.+)$'
    matches = list(re.finditer(heading_pattern, context, re.MULTILINE))

    if matches:
        # 最も近い見出しを選択
        closest = min(matches, key=lambda m: abs(m.start() - (position - start)))
        return closest.group(1).strip()

    return ""

def update_mdx_file(file_path, iframes, dry_run=False):
    """MDXファイルを更新"""

    # ファイル読み込み
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    updates = []

    # Google Maps埋め込みを置換
    google_maps_iframes = [iframe for iframe in iframes if iframe['type'] == 'google_maps']
    google_maps_placeholder_pattern = r'\[Google Maps埋め込み\]'

    matches = list(re.finditer(google_maps_placeholder_pattern, content))

    if len(matches) != len(google_maps_iframes):
        print(f"  ⚠️  警告: プレースホルダー数({len(matches)})とGoogle Maps数({len(google_maps_iframes)})が一致しません")

    # 後ろから置換（位置がずれないように）
    for i, match in enumerate(reversed(matches)):
        if i < len(google_maps_iframes):
            iframe = google_maps_iframes[-(i+1)]  # 逆順でマッチング

            # コンテキストからタイトル推測
            title = extract_context_title(content, match.start())
            if not title:
                title = f"Google Maps {i+1}"

            component_code = generate_google_map_component(iframe['src'], title)

            content = content[:match.start()] + component_code + content[match.end():]
            updates.append(f"    - Google Maps置換: [Google Maps埋め込み] → <GoogleMap title=\"{title}\" />")

    # YouTube埋め込みを追加
    # ※現在は実装していません（位置特定が難しいため）
    # 将来的には、元のHTMLからの位置情報を使って挿入可能
    youtube_iframes = [iframe for iframe in iframes if iframe['type'] == 'youtube']
    if youtube_iframes:
        updates.append(f"    - YouTube {len(youtube_iframes)}件は手動で追加が必要です")

    # 変更があった場合のみ処理
    if content != original_content:
        if dry_run:
            print(f"  📝 変更内容（実際には更新しません）:")
            for update in updates:
                print(update)
        else:
            # バックアップ作成
            backup_path = create_backup(file_path)
            print(f"  💾 バックアップ作成: {os.path.basename(backup_path)}")

            # ファイル更新
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)

            print(f"  ✅ 更新完了:")
            for update in updates:
                print(update)

        return True
    else:
        print(f"  ℹ️  変更なし（Google Mapsプレースホルダーが見つかりません）")
        return False

def main():
    dry_run = '--dry-run' in sys.argv

    mapping_file = '/Users/ippiki_koala/Desktop/Claude/blog/iframe_mapping.json'
    content_dir = Path('/Users/ippiki_koala/Desktop/Claude/blog/content/posts')

    if not os.path.exists(mapping_file):
        print(f"❌ エラー: iframe_mapping.jsonが見つかりません")
        sys.exit(1)

    # iframe_mapping.json読み込み
    with open(mapping_file, 'r', encoding='utf-8') as f:
        iframe_mapping = json.load(f)

    print("=" * 60)
    if dry_run:
        print("🔍 ドライラン モード（実際には更新しません）")
    else:
        print("🚀 MDXファイル自動更新を開始します")
    print("=" * 60)
    print()
    print(f"📖 対象記事: {len(iframe_mapping)} 件")
    print()

    updated_count = 0
    skipped_count = 0
    error_count = 0

    for i, (basename, iframes) in enumerate(sorted(iframe_mapping.items()), 1):
        filename = basename_to_filename(basename)
        file_path = content_dir / filename

        print(f"[{i}/{len(iframe_mapping)}] {filename}")

        if not file_path.exists():
            print(f"  ❌ エラー: ファイルが見つかりません")
            error_count += 1
            continue

        try:
            updated = update_mdx_file(file_path, iframes, dry_run)
            if updated:
                updated_count += 1
            else:
                skipped_count += 1
        except Exception as e:
            print(f"  ❌ エラー: {str(e)}")
            error_count += 1

        print()

    # サマリー表示
    print("=" * 60)
    print("📊 処理結果:")
    print(f"  - 更新: {updated_count} 件")
    print(f"  - スキップ: {skipped_count} 件")
    print(f"  - エラー: {error_count} 件")
    print("=" * 60)
    print()

    if not dry_run:
        print("✅ 自動更新が完了しました")
        print()
        print("次のステップ:")
        print("  1. npm run build でビルド確認")
        print("  2. npm run dev で表示確認")
        print("  3. 問題なければ git add & git commit")
        print()
        print("⚠️  注意: YouTubeの埋め込みは手動で追加する必要があります")
        print("   iframe_update_guide.md を参照してください")
    else:
        print("実際に更新するには、--dry-run オプションなしで実行してください:")
        print("  python3 scripts/auto_update_iframes.py")

if __name__ == "__main__":
    main()
