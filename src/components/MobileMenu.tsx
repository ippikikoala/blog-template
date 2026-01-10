"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface CategoryData {
  name: string;
  count: number;
}

interface MobileMenuProps {
  categories: CategoryData[];
  tags: CategoryData[];
}

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

export default function MobileMenu({ categories, tags }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const menuContent = isMenuOpen && (
    <>
      <div
        className="mobile-menu-overlay"
        onClick={() => setIsMenuOpen(false)}
      />
      <div className="mobile-menu">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-lg">Menu</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-[var(--foreground)] hover:text-[var(--color-accent)]"
            aria-label="メニューを閉じる"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="mb-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block text-lg text-[var(--foreground)] hover:text-[var(--color-accent)] py-2 border-b border-[var(--border-color)]"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/feed.xml"
            className="flex items-center gap-2 text-lg text-[var(--foreground)] hover:text-[var(--color-accent)] py-2 border-b border-[var(--border-color)]"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
            </svg>
            RSS Feed
          </Link>
        </nav>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-sm text-[var(--foreground-muted)] mb-3 uppercase tracking-wide">
              Categories
            </h3>
            <ul className="space-y-1">
              {categories.slice(0, 10).map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={`/categories/${encodeURIComponent(cat.name)}`}
                    className="flex justify-between text-sm text-[var(--foreground)] hover:text-[var(--color-accent)] py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[var(--foreground-subtle)]">
                      ({cat.count})
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {categories.length > 10 && (
              <Link
                href="/categories"
                className="block mt-2 text-sm text-[var(--color-accent)] hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                すべてのカテゴリ →
              </Link>
            )}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-sm text-[var(--foreground-muted)] mb-3 uppercase tracking-wide">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 12).map((tag) => (
                <Link
                  key={tag.name}
                  href={`/tags/${encodeURIComponent(tag.name)}`}
                  className="tag"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
            {tags.length > 12 && (
              <Link
                href="/tags"
                className="block mt-3 text-sm text-[var(--color-accent)] hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                すべてのタグ →
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 text-[var(--foreground)] hover:text-[var(--color-accent)]"
        onClick={() => setIsMenuOpen(true)}
        aria-label="メニューを開く"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile Menu Portal */}
      {mounted && menuContent && createPortal(menuContent, document.body)}
    </>
  );
}
