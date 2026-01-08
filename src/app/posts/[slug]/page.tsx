import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
  getAdjacentPosts,
} from "@/lib/posts";
import { format } from "date-fns";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import TableOfContents from "@/components/TableOfContents";
import ShareButtons from "@/components/ShareButtons";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import { slug as slugify } from "github-slugger";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, post.category, post.tags);
  const { prev, next } = getAdjacentPosts(slug);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* メインコンテンツ */}
        <main className="flex-1 min-w-0">
          <article className="card p-6 md:p-10">
            {/* ヘッダー */}
            <header className="mb-8">
              {/* カテゴリ */}
              {post.category && (
                <Link
                  href={`/categories/${encodeURIComponent(post.category)}`}
                  className="category mb-3 inline-block"
                >
                  {post.category}
                </Link>
              )}

              {/* タイトル */}
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--color-primary-dark)]">
                {post.title}
              </h1>

              {/* メタ情報 */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--foreground-muted)]">
                {post.date && (
                  <time dateTime={post.date}>
                    {format(new Date(post.date), "yyyy年MM月dd日")}
                  </time>
                )}
              </div>

              {/* タグ */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="tag"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* アイキャッチ画像 */}
            {post.image && (
              <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* 目次 */}
            <TableOfContents content={post.content} />

            {/* 本文 */}
            <div className="prose prose-lg max-w-none">
              <MDXRemote
                source={post.content}
                components={{
                  h2: ({ children }) => {
                    const text = String(children);
                    const id = slugify(text);
                    return <h2 id={id}>{children}</h2>;
                  },
                  h3: ({ children }) => {
                    const text = String(children);
                    const id = slugify(text);
                    return <h3 id={id}>{children}</h3>;
                  },
                  h4: ({ children }) => {
                    const text = String(children);
                    const id = slugify(text);
                    return <h4 id={id}>{children}</h4>;
                  },
                }}
              />
            </div>

            {/* シェアボタン */}
            <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
              <ShareButtons
                title={post.title}
                url={`https://example.com/posts/${slug}`}
              />
            </div>
          </article>

          {/* 前後の記事 */}
          {(prev || next) && (
            <nav className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {prev && (
                <Link
                  href={`/posts/${prev.slug}`}
                  className="card p-4 hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <span className="text-xs text-[var(--foreground-subtle)]">
                    ← 前の記事
                  </span>
                  <p className="mt-1 font-medium text-[var(--color-primary-dark)] line-clamp-2">
                    {prev.title}
                  </p>
                </Link>
              )}
              {next && (
                <Link
                  href={`/posts/${next.slug}`}
                  className="card p-4 hover:bg-[var(--background-secondary)] transition-colors md:text-right"
                >
                  <span className="text-xs text-[var(--foreground-subtle)]">
                    次の記事 →
                  </span>
                  <p className="mt-1 font-medium text-[var(--color-primary-dark)] line-clamp-2">
                    {next.title}
                  </p>
                </Link>
              )}
            </nav>
          )}

          {/* 関連記事 */}
          {relatedPosts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold mb-6 text-[var(--color-primary-dark)]">
                関連記事
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <PostCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </section>
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
