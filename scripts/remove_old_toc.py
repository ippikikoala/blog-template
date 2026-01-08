#!/usr/bin/env python3
"""
Remove old table of contents links from MDX files.

This script removes lines like:
- [見出し](#見出し)
- [Section Title](#section-title)

These are typically found at the beginning of posts after frontmatter
and should be removed since we now have a proper TableOfContents component.
"""

import re
from pathlib import Path

def remove_old_toc_from_content(content: str) -> str:
    """Remove old TOC links from markdown content.

    Removes lines that match the pattern: [text](#anchor)
    but only if they appear in a block at the start of the content
    (after frontmatter).
    """
    lines = content.split('\n')
    result_lines = []
    in_toc_section = False
    toc_section_started = False
    content_started = False

    # Pattern for TOC links: [text](#anchor) or variations with spacing/bullets
    toc_pattern = re.compile(r'^\s*[-*]?\s*\[.+\]\(#.+\)\s*$')

    for line in lines:
        # Skip empty lines at the start
        if not content_started and line.strip() == '':
            result_lines.append(line)
            continue

        # Check if this is a TOC link
        if toc_pattern.match(line):
            if not content_started:
                # This is part of the old TOC at the beginning
                in_toc_section = True
                toc_section_started = True
                continue  # Skip this line
            else:
                # TOC link in the middle of content - keep it (might be intentional)
                result_lines.append(line)
        else:
            # Not a TOC link
            if in_toc_section and line.strip() == '':
                # Empty line after TOC section - skip it
                in_toc_section = False
                continue
            else:
                # Regular content
                content_started = True
                in_toc_section = False
                result_lines.append(line)

    return '\n'.join(result_lines)

def process_mdx_file(file_path: Path) -> bool:
    """Process a single MDX file to remove old TOC.

    Returns True if file was modified, False otherwise.
    """
    try:
        content = file_path.read_text(encoding='utf-8')

        # Split frontmatter and content
        parts = content.split('---', 2)
        if len(parts) < 3:
            print(f"⚠️  No frontmatter found in {file_path.name}")
            return False

        frontmatter = parts[1]
        body = parts[2]

        # Remove old TOC from body
        new_body = remove_old_toc_from_content(body)

        # Check if anything changed
        if new_body == body:
            return False

        # Reconstruct the file
        new_content = f"---{frontmatter}---{new_body}"

        # Write back
        file_path.write_text(new_content, encoding='utf-8')
        return True

    except Exception as e:
        print(f"❌ Error processing {file_path.name}: {e}")
        return False

def main():
    """Main function to process all MDX files."""
    posts_dir = Path(__file__).parent.parent / 'content' / 'posts'

    if not posts_dir.exists():
        print(f"❌ Posts directory not found: {posts_dir}")
        return

    mdx_files = list(posts_dir.glob('*.mdx'))
    print(f"📁 Found {len(mdx_files)} MDX files")

    modified_count = 0

    for mdx_file in mdx_files:
        if process_mdx_file(mdx_file):
            print(f"✅ Removed old TOC from: {mdx_file.name}")
            modified_count += 1

    print(f"\n🎉 Complete! Modified {modified_count} files")

if __name__ == '__main__':
    main()
