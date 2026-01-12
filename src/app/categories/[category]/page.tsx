import { notFound } from "next/navigation";
import { getPostsByCategory, getAllCategories } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map(({ name }) => ({
    category: name,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  return {
    title: `${decodedCategory}の記事一覧`,
    description: `${decodedCategory}カテゴリの記事一覧`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const posts = getPostsByCategory(decodedCategory);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1">
          <div className="mb-8">
            <span className="category text-lg">{decodedCategory}</span>
            <h1 className="text-2xl font-bold mt-2 text-[var(--color-primary-dark)]">
              {decodedCategory}の記事一覧
            </h1>
            <p className="text-[var(--foreground-muted)] mt-2">
              {posts.length} 件の記事
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </main>
        <div className="lg:w-80 shrink-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
