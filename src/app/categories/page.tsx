import Link from "next/link";
import { getAllCategories } from "@/lib/posts";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "カテゴリ一覧",
  description: "カテゴリ一覧ページ",
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-8 text-[var(--color-primary-dark)]">
            カテゴリ一覧
          </h1>
          {categories.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-[var(--foreground-muted)]">
                カテゴリがまだありません。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map(({ name, count }) => (
                <Link
                  key={name}
                  href={`/categories/${encodeURIComponent(name)}`}
                  className="card p-6 text-center hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <div className="font-semibold text-[var(--color-primary-dark)] mb-1">
                    {name}
                  </div>
                  <div className="text-sm text-[var(--foreground-subtle)]">
                    {count} 記事
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
        <div className="lg:w-80 shrink-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
