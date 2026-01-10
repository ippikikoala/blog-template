"use client";

import { useState } from "react";
import Link from "next/link";
import { getCategoriesByRegion } from "@/lib/posts";

interface CategoryAccordionProps {
  regionCategories: ReturnType<typeof getCategoriesByRegion>;
}

export default function CategoryAccordion({
  regionCategories,
}: CategoryAccordionProps) {
  const [openRegions, setOpenRegions] = useState<Set<string>>(new Set());

  const toggleRegion = (regionId: string) => {
    setOpenRegions((prev) => {
      const next = new Set(prev);
      if (next.has(regionId)) {
        next.delete(regionId);
      } else {
        next.add(regionId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {regionCategories.map(({ region, categories }) => {
        const isOpen = openRegions.has(region.id);
        const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);

        return (
          <div key={region.id}>
            {/* 地方名ヘッダー（クリック可能） */}
            <button
              onClick={() => toggleRegion(region.id)}
              className="flex items-center gap-2 w-full text-left group"
              aria-expanded={isOpen}
            >
              <span
                className="text-xs text-[var(--foreground-muted)] transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
              >
                ▶
              </span>
              <span className="text-sm font-semibold text-[var(--color-primary-dark)] group-hover:text-[var(--color-accent)] transition-colors">
                {region.name}
              </span>
              <span className="text-xs text-[var(--foreground-subtle)]">
                ({totalCount})
              </span>
            </button>

            {/* 都道府県リスト（開いているときのみ表示） */}
            {isOpen && (
              <ul className="mt-2 space-y-1 pl-5 border-l-2 border-[var(--background-secondary)]">
                {categories.map(({ name, count }) => (
                  <li key={name}>
                    <Link
                      href={`/categories/${encodeURIComponent(name)}`}
                      className="flex justify-between text-sm text-[var(--foreground-muted)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      <span>{name}</span>
                      <span className="text-[var(--foreground-subtle)]">
                        ({count})
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
