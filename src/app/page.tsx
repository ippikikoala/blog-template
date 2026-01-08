import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import Pagination from "@/components/Pagination";

const POSTS_PER_PAGE = 9;

export default function Home() {
  const allPosts = getAllPosts();
  const posts = allPosts.slice(0, POSTS_PER_PAGE);
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* メインコンテンツ */}
        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-10 text-[var(--color-primary-dark)] tracking-tight">
            Latest Posts
          </h1>
          {posts.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-6xl mb-4">🐨</p>
              <p className="text-[var(--foreground-muted)]">
                まだ記事がありません。
                <br />
                <code className="text-sm bg-[var(--background-secondary)] px-2 py-1 rounded">
                  content/posts/
                </code>{" "}
                にMDXファイルを追加してください。
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
              <Pagination currentPage={1} totalPages={totalPages} />
            </>
          )}
        </main>

        {/* サイドバー */}
        <div className="lg:w-80 shrink-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
