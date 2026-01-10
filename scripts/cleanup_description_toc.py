#!/usr/bin/env python3
"""
Fix description fields in MDX files.

If the description contains TOC artifacts (見出し(アンカー) patterns),
extract the first meaningful paragraph from the body as the new description.
"""

import re
from pathlib import Path


def has_toc_pattern(text: str) -> bool:
    """Check if text contains TOC-like patterns."""
    if not text:
        return False

    # Pattern 1: 見出し(アンカー) - multiple occurrences
    anchor_pattern = r'[^\s\(\)]+\([^\)]+\)'
    matches = re.findall(anchor_pattern, text)
    if len(matches) >= 2:
        return True

    # Pattern 2: " - 見出し(アンカー)" separator pattern
    if re.search(r'\s+-\s+[^\-\(\)]+\([^\)]+\)', text):
        return True

    # Pattern 3: Starts with day/part markers followed by anchor
    if re.match(r'^[\d１２３４５６７８９]+日目|^Part\s*\d|^（続き）|^\(続き\)', text):
        if re.search(r'\([^\)]+\)', text):
            return True

    # Pattern 4: Contains href patterns
    if 'href=' in text:
        return True

    # Pattern 5: Contains truncated content (ends with incomplete sentence)
    if re.search(r'\([a-zA-Z0-9\-]+$', text):  # Ends with (incomplete-anchor
        return True

    return False


def extract_first_paragraph(body: str) -> str:
    """Extract the first meaningful paragraph from body text."""
    # Remove leading whitespace and empty lines
    lines = body.strip().split('\n')

    paragraph_lines = []
    in_paragraph = False

    for line in lines:
        stripped = line.strip()

        # Skip empty lines at the start
        if not stripped and not in_paragraph:
            continue

        # Skip headings (#### or #####)
        if stripped.startswith('#'):
            if in_paragraph:
                break  # End of paragraph
            continue

        # Skip image lines
        if stripped.startswith('![') or stripped.startswith('<'):
            if in_paragraph:
                break
            continue

        # Skip italic captions (_text_)
        if stripped.startswith('_') and stripped.endswith('_'):
            continue

        # Skip "Part1はこちら：" or similar links
        if re.match(r'^Part\s*\d+.*[：:]?\s*$', stripped, re.IGNORECASE):
            continue

        # Skip TOC lines (contain href or [text](#anchor) patterns)
        if 'href=' in stripped or re.search(r'\[[^\]]+\]\(#[^\)]+\)', stripped):
            continue

        # Skip lines that are just links
        if re.match(r'^\[[^\]]+\]\([^\)]+\)$', stripped):
            continue

        # Skip empty lines in middle of content (paragraph break)
        if not stripped:
            if in_paragraph:
                break
            continue

        # This is content
        in_paragraph = True
        paragraph_lines.append(stripped)

        # Stop after collecting enough text (roughly 150 chars)
        current_text = ' '.join(paragraph_lines)
        if len(current_text) > 150:
            break

    result = ' '.join(paragraph_lines)

    # Truncate if too long (max 200 chars)
    if len(result) > 200:
        result = result[:197] + '...'

    return result


def clean_extracted_text(text: str) -> str:
    """Clean up extracted text for use as description."""
    # Remove markdown links [text](url) -> text
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)

    # Remove URLs
    text = re.sub(r'https?://\S+', '', text)

    # Remove image references
    text = re.sub(r'!\[[^\]]*\]\([^\)]+\)', '', text)

    # Clean up whitespace
    text = re.sub(r'\s+', ' ', text).strip()

    return text


def process_mdx_file(file_path: Path, dry_run: bool = False) -> dict:
    """Process a single MDX file to fix description."""
    result = {
        'modified': False,
        'old_description': '',
        'new_description': '',
        'reason': ''
    }

    try:
        content = file_path.read_text(encoding='utf-8')

        # Parse frontmatter
        parts = content.split('---', 2)
        if len(parts) < 3:
            return result

        frontmatter = parts[1]
        body = parts[2]

        # Extract description
        desc_match = re.search(r'^description:\s*["\'](.+)["\']', frontmatter, re.MULTILINE)
        if not desc_match:
            desc_match = re.search(r'^description:\s*(.+)$', frontmatter, re.MULTILINE)

        if not desc_match:
            return result

        old_description = desc_match.group(1).strip().strip('"\'')
        result['old_description'] = old_description

        # Check if description needs fixing
        if has_toc_pattern(old_description):
            # Extract new description from body
            new_description = extract_first_paragraph(body)
            new_description = clean_extracted_text(new_description)
            result['reason'] = 'TOC pattern detected'
        else:
            # No TOC pattern, keep original
            new_description = old_description
            result['reason'] = 'OK'

        result['new_description'] = new_description

        if old_description != new_description and new_description:
            result['modified'] = True

            if not dry_run:
                # Escape quotes in description
                escaped_desc = new_description.replace('"', '\\"')
                new_desc_line = f'description: "{escaped_desc}"'

                new_frontmatter = re.sub(
                    r'^description:.*$',
                    new_desc_line,
                    frontmatter,
                    flags=re.MULTILINE
                )

                new_content = f"---{new_frontmatter}---{body}"
                file_path.write_text(new_content, encoding='utf-8')

        return result

    except Exception as e:
        print(f"  Error processing {file_path.name}: {e}")
        result['reason'] = f'Error: {e}'
        return result


def main():
    """Main function."""
    import argparse

    parser = argparse.ArgumentParser(description='Fix description fields in MDX files')
    parser.add_argument('--dry-run', action='store_true', help='Show changes without modifying files')
    parser.add_argument('--check', action='store_true', help='Only check for problematic descriptions')
    args = parser.parse_args()

    posts_dir = Path(__file__).parent.parent / 'content' / 'posts'

    if not posts_dir.exists():
        print(f"Posts directory not found: {posts_dir}")
        return

    mdx_files = sorted(posts_dir.glob('*.mdx'))
    print(f"Found {len(mdx_files)} MDX files")

    if args.check:
        print("(CHECK MODE - only showing problematic files)\n")
    elif args.dry_run:
        print("(DRY RUN - no files will be modified)\n")
    else:
        print()

    modified_count = 0
    problem_count = 0

    for mdx_file in mdx_files:
        if args.check:
            # Just check for problems
            content = mdx_file.read_text(encoding='utf-8')
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter = parts[1]
                desc_match = re.search(r'^description:\s*["\']?(.+?)["\']?\s*$', frontmatter, re.MULTILINE)
                if desc_match:
                    desc = desc_match.group(1).strip().strip('"\'')
                    if has_toc_pattern(desc):
                        problem_count += 1
                        print(f"{mdx_file.name}")
                        print(f"  {desc[:100]}...")
                        print()
        else:
            result = process_mdx_file(mdx_file, dry_run=args.dry_run)

            if result['modified']:
                modified_count += 1
                prefix = '[DRY RUN] ' if args.dry_run else ''
                print(f"{prefix}{mdx_file.name}")
                print(f"  Before: {result['old_description'][:80]}...")
                print(f"  After:  {result['new_description'][:80]}...")
                print()

    print(f"--- Summary ---")
    print(f"Files processed: {len(mdx_files)}")
    if args.check:
        print(f"Files with TOC patterns: {problem_count}")
    else:
        print(f"Files {'would be ' if args.dry_run else ''}modified: {modified_count}")


if __name__ == '__main__':
    main()
