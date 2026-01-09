import Link from "next/link";
import { getAllPosts, getCategoriesByRegion } from "@/lib/posts";

export default function Sidebar() {
  const posts = getAllPosts();

  // 地方別のカテゴリ（都道府県）を取得
  const regionCategories = getCategoriesByRegion();

  // タグを集計
  const tags = posts.reduce(
    (acc, post) => {
      (post.tags || []).forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  // 最新記事5件
  const recentPosts = posts.slice(0, 5);

  return (
    <aside className="space-y-8">
      {/* プロフィール */}
      <div className="card p-6">
        <h3 className="font-bold text-lg mb-4 text-[var(--color-primary-dark)]">
          Profile
        </h3>
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[var(--background-secondary)] flex items-center justify-center text-4xl">
            🐨
          </div>
          <p className="font-semibold mb-2">いっぴきこあら</p>
          <p className="text-sm text-[var(--foreground-muted)]">
            鄙びた集落・旅館を巡るブログ。温泉、廃線、炭鉱、離島などを訪ねています。
          </p>
        </div>
        <div className="mt-4 flex justify-center gap-4">
          <a
            href="https://twitter.com/ippiki_koala"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--foreground-muted)] hover:text-[var(--color-accent)]"
            aria-label="Twitter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>

      {/* カテゴリ（階層表示） */}
      {regionCategories.length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4 text-[var(--color-primary-dark)]">
            Categories
          </h3>
          <div className="space-y-4">
            {regionCategories.map(({ region, categories }) => (
              <div key={region.id}>
                {/* 地方名 */}
                <div className="text-sm font-semibold text-[var(--color-primary-dark)] mb-2">
                  {region.name}
                </div>
                {/* 都道府県リスト */}
                <ul className="space-y-1 pl-3 border-l-2 border-[var(--background-secondary)]">
                  {categories.map(({ name, count }) => (
                    <li key={name}>
                      <Link
                        href={`/categories/${encodeURIComponent(name)}`}
                        className="flex justify-between text-sm text-[var(--foreground-muted)] hover:text-[var(--color-accent)]"
                      >
                        <span>{name}</span>
                        <span className="text-[var(--foreground-subtle)]">
                          ({count})
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* タグ */}
      {Object.keys(tags).length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4 text-[var(--color-primary-dark)]">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(tags)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 15)
              .map(([tag]) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="tag"
                >
                  {tag}
                </Link>
              ))}
          </div>
          {Object.keys(tags).length > 15 && (
            <Link
              href="/tags"
              className="block mt-4 text-sm text-[var(--color-accent)] hover:underline"
            >
              すべてのタグを見る →
            </Link>
          )}
        </div>
      )}

      {/* 最新記事 */}
      {recentPosts.length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4 text-[var(--color-primary-dark)]">
            Recent Posts
          </h3>
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-sm text-[var(--foreground-muted)] hover:text-[var(--color-accent)] line-clamp-2"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
