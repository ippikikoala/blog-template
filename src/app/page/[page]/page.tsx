import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import Pagination from "@/components/Pagination";
import type { Metadata } from "next";

const POSTS_PER_PAGE = 9;

interface Props {
  params: Promise<{ page: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `記事一覧 - ページ ${page}`,
  };
}

export default async function PaginatedPage({ params }: Props) {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);

  if (isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  if (pageNumber > totalPages) {
    notFound();
  }

  const startIndex = (pageNumber - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-8 text-[var(--color-primary-dark)]">
            Latest Posts
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <Pagination currentPage={pageNumber} totalPages={totalPages} />
        </main>
        <div className="lg:w-80 shrink-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
