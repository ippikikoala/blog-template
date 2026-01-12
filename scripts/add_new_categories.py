#!/usr/bin/env python3
"""
カテゴリ移行スクリプト
「その他」+ITタグ → 「IT」カテゴリ
「愛知県」+小山田壮平タグ → 「小山田壮平」カテゴリ
"""

import os
import re
from pathlib import Path

# ブログのルートディレクトリ
BLOG_ROOT = Path(__file__).parent.parent
POSTS_DIR = BLOG_ROOT / "content" / "posts"


def update_frontmatter(file_path: Path) -> bool:
    """
    MDXファイルのfrontmatterを更新
    Returns: True if file was modified
    """
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # frontmatterを抽出
    match = re.match(r"^---\n(.*?)\n---\n(.*)$", content, re.DOTALL)
    if not match:
        return False

    frontmatter = match.group(1)
    body = match.group(2)

    # category と tags を抽出
    category_match = re.search(r'^category:\s*"([^"]*)"', frontmatter, re.MULTILINE)
    tags_match = re.search(r'^tags:\s*\[(.*?)\]', frontmatter, re.MULTILINE)

    if not category_match:
        return False

    category = category_match.group(1)
    tags_str = tags_match.group(1) if tags_match else ""
    tags = [tag.strip().strip('"') for tag in tags_str.split(",") if tag.strip()]

    modified = False
    new_category = category

    # 「その他」+ ITタグ → 「IT」カテゴリ
    if category == "その他" and "IT" in tags:
        new_category = "IT"
        modified = True
        print(f"  {file_path.name}: 「その他」→「IT」")

    # 「愛知県」+ 小山田壮平タグ → 「小山田壮平」カテゴリ
    elif category == "愛知県" and "小山田壮平" in tags:
        new_category = "小山田壮平"
        modified = True
        print(f"  {file_path.name}: 「愛知県」→「小山田壮平」")

    if not modified:
        return False

    # frontmatterを更新
    new_frontmatter = re.sub(
        r'^category:\s*"[^"]*"',
        f'category: "{new_category}"',
        frontmatter,
        flags=re.MULTILINE
    )

    # 新しいコンテンツを書き込み
    new_content = f"---\n{new_frontmatter}\n---\n{body}"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True


def main():
    """メイン処理"""
    print("カテゴリ移行スクリプトを開始します...")
    print(f"対象ディレクトリ: {POSTS_DIR}")
    print()

    if not POSTS_DIR.exists():
        print(f"エラー: {POSTS_DIR} が見つかりません")
        return

    # MDXファイルを処理
    mdx_files = sorted(POSTS_DIR.glob("*.mdx"))
    modified_count = 0

    for mdx_file in mdx_files:
        if update_frontmatter(mdx_file):
            modified_count += 1

    print()
    print(f"処理完了: {modified_count}件のファイルを更新しました")


if __name__ == "__main__":
    main()
