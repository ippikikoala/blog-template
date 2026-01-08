interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

function generateToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, "-")
      .replace(/^-+|-+$/g, "");

    toc.push({ id, text, level });
  }

  return toc;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const toc = generateToc(content);

  if (toc.length === 0) return null;

  return (
    <nav className="toc">
      <div className="toc-title">目次</div>
      <ol className="toc-list">
        {toc.map((item, index) => (
          <li key={index} className={`toc-h${item.level}`}>
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
