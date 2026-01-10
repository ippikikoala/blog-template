#!/usr/bin/env python3
"""
カテゴリ修正スクリプト
- 廃線、炭鉱、IT、ロードバイク、機材、旅館、島、小山田壮平 → 都道府県またはその他
- 空カテゴリ → 都道府県またはその他
- 元のカテゴリはタグに追加（都道府県以外の場合）
"""

import os
import re
from pathlib import Path

# 修正マッピング: ファイル名 -> (新カテゴリ, 追加タグ)
FIXES = {
    # 廃線カテゴリ（7件）
    "2025-05-18-2025-05-18-185739.mdx": ("宮崎県", ["廃線"]),
    "2022-11-13-2022-11-13-212011.mdx": ("北海道", ["廃線"]),
    "2022-12-07-2022-12-07-221019.mdx": ("北海道", ["廃線"]),
    "2023-02-08-2023-02-08-225216.mdx": ("岐阜県", ["廃線"]),
    "2023-07-08-2023-07-08-230424.mdx": ("和歌山県", ["廃線"]),
    "2023-07-22-2023-07-22-165754.mdx": ("和歌山県", ["廃線"]),
    "2025-05-02-2025-05-02-125631.mdx": ("宮崎県", ["廃線"]),

    # 炭鉱カテゴリ（7件）
    "2026-01-04-2026-01-04-223535.mdx": ("北海道", ["炭鉱"]),
    "2026-01-04-2026-01-04-160836.mdx": ("北海道", ["炭鉱"]),
    "2022-12-11-2022-12-11-183713.mdx": ("北海道", ["炭鉱"]),
    "2023-09-01-2023-09-01-175428.mdx": ("福島県", ["炭鉱"]),
    "2023-10-04-2023-10-04-214231.mdx": ("北海道", ["炭鉱"]),
    "2023-10-06-2023-10-06-172109.mdx": ("北海道", ["炭鉱"]),
    "2024-11-03-2024-11-03-235919.mdx": ("北海道", ["炭鉱"]),

    # ITカテゴリ（9件）→ その他
    "2025-04-19-2025-04-19-174619.mdx": ("その他", ["IT"]),
    "2025-05-10-2025-05-10-223616.mdx": ("その他", ["IT"]),
    "2025-05-11-2025-05-11-184211.mdx": ("その他", ["IT"]),
    "2025-05-11-2025-05-11-230446.mdx": ("その他", ["IT"]),
    "2025-07-06-2025-07-06-000722.mdx": ("その他", ["IT"]),
    "2025-09-30-2025-09-30-000545.mdx": ("その他", ["IT"]),
    "2025-11-09-2025-11-09-233114.mdx": ("その他", ["IT"]),
    "2025-11-06-2025-11-06-235317.mdx": ("その他", ["IT"]),
    "2025-08-24-2025-08-24-224334.mdx": ("その他", ["IT"]),

    # ロードバイクカテゴリ（6件）
    "2022-11-06-2022-11-06-203249.mdx": ("徳島県", ["ロードバイク"]),
    "2022-11-11-2022-11-11-190010.mdx": ("徳島県", ["ロードバイク"]),
    "2022-12-28-2022-12-28-195234.mdx": ("高知県", ["ロードバイク"]),
    "2023-01-04-2023-01-04-220007.mdx": ("高知県", ["ロードバイク"]),
    "2023-12-30-2023-12-30-234815.mdx": ("千葉県", ["ロードバイク"]),
    "2024-01-07-2024-01-07-143705.mdx": ("愛媛県", ["ロードバイク"]),

    # 機材カテゴリ（4件）
    "2024-08-16-2024-08-16-201334.mdx": ("福島県", ["機材"]),
    "2025-06-15-2025-06-15-231152.mdx": ("東京都", ["機材"]),
    "2023-11-29-2023-11-29-191911.mdx": ("その他", ["機材"]),
    "2023-11-25-2023-11-25-132335.mdx": ("その他", ["機材"]),

    # 旅館カテゴリ（4件）
    "2022-12-14-2022-12-14-215043.mdx": ("北海道", ["旅館"]),
    "2024-03-31-2024-03-31-220030.mdx": ("長崎県", ["旅館"]),  # 複数県だが長崎県に
    "2025-08-16-2025-08-16-201919.mdx": ("愛知県", ["旅館"]),
    "2025-12-31-2025-12-31-130034.mdx": ("新潟県", ["旅館"]),

    # 島カテゴリ（3件）
    "2023-01-06-2023-01-06-203951.mdx": ("滋賀県", ["島"]),
    "2023-01-08-2023-01-08-211346.mdx": ("滋賀県", ["島"]),
    "2023-07-09-2023-07-09-173324.mdx": ("兵庫県", ["島"]),

    # 小山田壮平カテゴリ（1件）
    "2025-05-18-2025-05-18-233513.mdx": ("愛知県", ["小山田壮平"]),

    # 空カテゴリ（11件）
    "2025-08-24-2025-08-24-210100.mdx": ("奈良県", []),
    "2024-01-07-2024-01-08-173421.mdx": ("愛媛県", []),
    "2025-07-27-2025-07-27-205234.mdx": ("山形県", []),
    "2025-01-05-2025-01-05-215037.mdx": ("長野県", []),
    "2023-10-06-2023-10-06-220955.mdx": ("その他", []),
    "2025-04-27-2025-04-27-210650.mdx": ("その他", ["IT"]),
    "2025-02-16-2025-02-16-001023.mdx": ("その他", []),
    "2025-10-05-2025-10-05-222807.mdx": ("その他", []),
    "2023-12-26-2023-12-26-003547.mdx": ("その他", []),
    "2023-08-11-2023-08-11-011235.mdx": ("その他", []),
    "2023-08-21-2023-09-10-100645.mdx": ("その他", []),
}


def parse_frontmatter(content: str) -> tuple[dict, str, str]:
    """frontmatterをパースして返す"""
    match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if not match:
        return {}, "", content

    fm_text = match.group(1)
    body = match.group(2)

    # 簡易パース
    fm = {}
    for line in fm_text.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            fm[key.strip()] = value.strip()

    return fm, fm_text, body


def update_category(content: str, new_category: str) -> str:
    """categoryを更新"""
    return re.sub(
        r'^(category:\s*)"[^"]*"',
        f'\\1"{new_category}"',
        content,
        flags=re.MULTILINE
    )


def add_tags(content: str, new_tags: list[str]) -> str:
    """タグを追加（重複しないように）"""
    if not new_tags:
        return content

    # 現在のタグを取得
    tags_match = re.search(r'^tags:\s*\[(.*?)\]', content, re.MULTILINE)
    if tags_match:
        current_tags_str = tags_match.group(1)
        # 既存タグをパース
        current_tags = re.findall(r'"([^"]+)"', current_tags_str)
        if not current_tags:
            current_tags = re.findall(r"'([^']+)'", current_tags_str)

        # 新しいタグを追加（重複除外）
        for tag in new_tags:
            if tag not in current_tags:
                current_tags.append(tag)

        # タグを再構築
        new_tags_str = ', '.join(f'"{t}"' for t in current_tags)
        content = re.sub(
            r'^(tags:\s*)\[.*?\]',
            f'\\1[{new_tags_str}]',
            content,
            flags=re.MULTILINE
        )

    return content


def process_file(filepath: Path, new_category: str, add_tags_list: list[str]) -> bool:
    """ファイルを処理"""
    try:
        content = filepath.read_text(encoding='utf-8')
        original = content

        # カテゴリ更新
        content = update_category(content, new_category)

        # タグ追加
        content = add_tags(content, add_tags_list)

        if content != original:
            filepath.write_text(content, encoding='utf-8')
            return True
        return False
    except Exception as e:
        print(f"  Error: {e}")
        return False


def main():
    posts_dir = Path(__file__).parent.parent / "content" / "posts"

    modified = 0
    errors = 0

    for filename, (new_category, tags_to_add) in FIXES.items():
        filepath = posts_dir / filename
        if not filepath.exists():
            print(f"[SKIP] {filename} - ファイルが見つかりません")
            errors += 1
            continue

        if process_file(filepath, new_category, tags_to_add):
            print(f"[OK] {filename} -> category: {new_category}, tags: +{tags_to_add}")
            modified += 1
        else:
            print(f"[NO CHANGE] {filename}")

    print(f"\n完了: {modified}件修正, {errors}件エラー")


if __name__ == "__main__":
    main()
