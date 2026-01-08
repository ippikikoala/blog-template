import Link from "next/link";
import { getAllTags } from "@/lib/posts";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "タグ一覧",
  description: "タグ一覧ページ",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-8 text-[var(--color-primary-dark)]">
            タグ一覧
          </h1>
          {tags.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-[var(--foreground-muted)]">
                タグがまだありません。
              </p>
            </div>
          ) : (
            <div className="card p-6">
              <div className="flex flex-wrap gap-3">
                {tags.map(({ name, count }) => (
                  <Link
                    key={name}
                    href={`/tags/${encodeURIComponent(name)}`}
                    className="tag text-base"
                  >
                    {name}
                    <span className="ml-1 text-[var(--foreground-subtle)]">
                      ({count})
                    </span>
                  </Link>
                ))}
              </div>
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
