#!/usr/bin/env python3
"""
#21: 画像のMarkdown構文エラーを修正するスクリプト

誤った構文: !テキスト[続き](URL)
正しい構文: ![テキスト続き](URL)

正規表現パターン: ^!([^\[\]]+)\[([^\]]+)\]\(([^)]+)\)
"""

import re
import os
from pathlib import Path

def fix_image_markdown(content: str) -> tuple[str, list[dict]]:
    """
    画像のMarkdown構文エラーを修正する
    
    Returns:
        tuple: (修正後のコンテンツ, 修正リスト)
    """
    # パターン: !テキスト[続き](URL) → ![テキスト続き](URL)
    pattern = r'^(!([^\[\]]+)\[([^\]]+)\]\(([^)]+)\))$'
    
    fixes = []
    lines = content.split('\n')
    new_lines = []
    
    for i, line in enumerate(lines, 1):
        match = re.match(pattern, line)
        if match:
            original = match.group(1)
            text_before = match.group(2)
            text_inside = match.group(3)
            url = match.group(4)
            
            # 修正後の形式: ![テキスト続き](URL)
            fixed = f'![{text_before}{text_inside}]({url})'
            new_lines.append(fixed)
            
            fixes.append({
                'line': i,
                'original': original,
                'fixed': fixed
            })
        else:
            new_lines.append(line)
    
    return '\n'.join(new_lines), fixes


def process_file(file_path: Path) -> list[dict]:
    """ファイルを処理して修正を適用"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content, fixes = fix_image_markdown(content)
    
    if fixes:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
    
    return fixes


def main():
    posts_dir = Path(__file__).parent.parent / 'content' / 'posts'
    
    total_fixes = 0
    files_modified = 0
    
    print("=" * 60)
    print("画像Markdown構文エラー修正スクリプト (#21)")
    print("=" * 60)
    print()
    
    for mdx_file in sorted(posts_dir.glob('*.mdx')):
        fixes = process_file(mdx_file)
        
        if fixes:
            files_modified += 1
            total_fixes += len(fixes)
            print(f"📝 {mdx_file.name}: {len(fixes)}件修正")
            for fix in fixes:
                print(f"   L{fix['line']}: {fix['original'][:50]}...")
                print(f"        → {fix['fixed'][:50]}...")
    
    print()
    print("=" * 60)
    print(f"完了: {files_modified}ファイル、{total_fixes}件を修正しました")
    print("=" * 60)


if __name__ == '__main__':
    main()
