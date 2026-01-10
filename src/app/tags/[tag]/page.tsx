import { notFound } from "next/navigation";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ name }) => ({
    tag: name,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `${decodedTag}の記事一覧`,
    description: `${decodedTag}タグの記事一覧`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1">
          <div className="mb-8">
            <span className="tag text-lg">{decodedTag}</span>
            <h1 className="text-2xl font-bold mt-2 text-[var(--color-primary-dark)]">
              {decodedTag}の記事一覧
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
