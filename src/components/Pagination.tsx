import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const showPages = 5;
  const halfShow = Math.floor(showPages / 2);

  let startPage = Math.max(1, currentPage - halfShow);
  const endPage = Math.min(totalPages, startPage + showPages - 1);

  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push("...");
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push("...");
    }
    pages.push(totalPages);
  }

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath || "/";
    }
    return `${basePath}/page/${page}`;
  };

  return (
    <nav className="flex justify-center items-center gap-2 mt-12">
      {/* 前へ */}
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-4 py-2 border border-[var(--border-color)] rounded hover:bg-[var(--background-secondary)] transition-colors"
        >
          ←
        </Link>
      )}

      {/* ページ番号 */}
      {pages.map((page, index) =>
        typeof page === "number" ? (
          <Link
            key={index}
            href={getPageUrl(page)}
            className={`px-4 py-2 rounded transition-colors ${page === currentPage
                ? "bg-[var(--color-accent)] !text-white"
                : "border border-[var(--border-color)] hover:bg-[var(--background-secondary)]"
              }`}
          >
            {page}
          </Link>
        ) : (
          <span key={index} className="px-2 text-[var(--foreground-subtle)]">
            {page}
          </span>
        )
      )}

      {/* 次へ */}
      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-4 py-2 border border-[var(--border-color)] rounded hover:bg-[var(--background-secondary)] transition-colors"
        >
          →
        </Link>
      )}
    </nav>
  );
}
