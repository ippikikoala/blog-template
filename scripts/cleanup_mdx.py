#!/usr/bin/env python3
"""
Cleanup MDX files from Hatena Blog artifacts.

This script performs the following cleanup tasks:
1. Converts Hatena keyword links to plain text
   - Pattern: [text](http://d.hatena.ne.jp/keyword/...)
   - Also handles links in image alt text: ![alt with [link](url)](image.jpg)

2. Removes remaining old TOC links at the beginning of posts
   - Pattern: [heading](#anchor)

3. Cleans up description field if it contains artifacts
"""

import re
from pathlib import Path


def remove_hatena_keyword_links(content: str) -> str:
    """Convert Hatena keyword links to plain text.

    Replaces [text](http://d.hatena.ne.jp/keyword/...) with just text.
    Handles both http and https versions.
    """
    # Pattern for Hatena keyword links: [text](url)
    hatena_pattern = re.compile(
        r'\[([^\]]+)\]\(https?://d\.hatena\.ne\.jp/keyword/[^)]+\)'
    )

    return hatena_pattern.sub(r'\1', content)


def remove_bare_hatena_urls(content: str) -> str:
    """Remove bare Hatena keyword URLs from description fields.

    Removes patterns like: テキスト(http://d.hatena.ne.jp/keyword/...)
    These appear in description fields where the link is not markdown-formatted.
    Also handles truncated URLs that end with ...
    """
    # Pattern for bare Hatena URLs in parentheses (complete)
    bare_url_pattern = re.compile(
        r'\(https?://d\.hatena\.ne\.jp/keyword/[^)]+\)'
    )
    result = bare_url_pattern.sub('', content)

    # Pattern for truncated Hatena URLs (end with ... followed by ")
    # Handles: (https://d.hatena.ne.jp/keyword/...XXX..."
    truncated_url_pattern = re.compile(
        r'\(https?://d\.hatena\.ne\.jp/keyword/[^"]*\.\.\."'
    )
    result = truncated_url_pattern.sub('"', result)

    # Pattern for truncated Hatena URLs at the very end of description
    # Handles: (https://d.hatena.ne.jp... at end of line
    truncated_url_end_pattern = re.compile(
        r'\(https?://d\.hatena\.ne\.jp[^)]*\.\.\.(?="|\n|$)'
    )
    result = truncated_url_end_pattern.sub('', result)

    return result


def remove_old_toc_links(body: str) -> str:
    """Remove old TOC links from the beginning of content.

    Removes lines that match [text](#anchor) pattern at the start.
    """
    lines = body.split('\n')
    result_lines = []
    in_toc_section = False
    content_started = False

    # Pattern for TOC links
    toc_pattern = re.compile(r'^\s*[-*]?\s*\[.+\]\(#.+\)\s*$')

    for line in lines:
        # Skip empty lines at the start
        if not content_started and line.strip() == '':
            result_lines.append(line)
            continue

        if toc_pattern.match(line):
            if not content_started:
                # TOC link at the beginning - skip it
                in_toc_section = True
                continue
            else:
                # TOC link in middle of content - keep it
                result_lines.append(line)
        else:
            if in_toc_section and line.strip() == '':
                # Empty line after TOC section - skip one
                in_toc_section = False
                continue
            else:
                content_started = True
                in_toc_section = False
                result_lines.append(line)

    return '\n'.join(result_lines)


def cleanup_description(frontmatter: str) -> str:
    """Clean up description field if it contains Hatena links."""
    # Remove Hatena keyword links from description
    result = remove_hatena_keyword_links(frontmatter)
    # Also remove bare Hatena URLs (non-markdown format)
    result = remove_bare_hatena_urls(result)
    return result


def process_mdx_file(file_path: Path) -> dict:
    """Process a single MDX file.

    Returns dict with counts of changes made.
    """
    changes = {
        'hatena_links': 0,
        'toc_links': 0,
        'modified': False
    }

    try:
        content = file_path.read_text(encoding='utf-8')
        original_content = content

        # Split frontmatter and content
        parts = content.split('---', 2)
        if len(parts) < 3:
            print(f"  No frontmatter found in {file_path.name}")
            return changes

        frontmatter = parts[1]
        body = parts[2]

        # Count Hatena links before removal
        hatena_pattern = re.compile(
            r'\[([^\]]+)\]\(https?://d\.hatena\.ne\.jp/keyword/[^)]+\)'
        )
        changes['hatena_links'] = len(hatena_pattern.findall(content))

        # Count TOC links before removal
        toc_pattern = re.compile(r'^\s*[-*]?\s*\[.+\]\(#.+\)\s*$', re.MULTILINE)
        # Only count TOC links at the beginning of body
        body_start = body.lstrip()
        toc_matches = []
        for line in body_start.split('\n'):
            if toc_pattern.match(line):
                toc_matches.append(line)
            elif line.strip() != '':
                break
        changes['toc_links'] = len(toc_matches)

        # Clean up frontmatter (description)
        new_frontmatter = cleanup_description(frontmatter)

        # Remove Hatena links from body
        new_body = remove_hatena_keyword_links(body)

        # Remove old TOC links from body
        new_body = remove_old_toc_links(new_body)

        # Reconstruct the file
        new_content = f"---{new_frontmatter}---{new_body}"

        # Check if anything changed
        if new_content != original_content:
            file_path.write_text(new_content, encoding='utf-8')
            changes['modified'] = True

        return changes

    except Exception as e:
        print(f"  Error processing {file_path.name}: {e}")
        return changes


def main():
    """Main function to process all MDX files."""
    posts_dir = Path(__file__).parent.parent / 'content' / 'posts'

    if not posts_dir.exists():
        print(f"Posts directory not found: {posts_dir}")
        return

    mdx_files = sorted(posts_dir.glob('*.mdx'))
    print(f"Found {len(mdx_files)} MDX files\n")

    total_hatena = 0
    total_toc = 0
    modified_count = 0

    for mdx_file in mdx_files:
        changes = process_mdx_file(mdx_file)

        if changes['modified']:
            details = []
            if changes['hatena_links'] > 0:
                details.append(f"Hatena: {changes['hatena_links']}")
            if changes['toc_links'] > 0:
                details.append(f"TOC: {changes['toc_links']}")

            print(f"  {mdx_file.name} ({', '.join(details)})")
            modified_count += 1

        total_hatena += changes['hatena_links']
        total_toc += changes['toc_links']

    print(f"\n--- Summary ---")
    print(f"Files processed: {len(mdx_files)}")
    print(f"Files modified: {modified_count}")
    print(f"Hatena links removed: {total_hatena}")
    print(f"TOC links removed: {total_toc}")


if __name__ == '__main__':
    main()
