import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { PostMeta } from "@/lib/posts";
import { normalizeCategory } from "@/lib/categoryUtils";

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  const categories = normalizeCategory(post.category);

  return (
    <article className="card overflow-hidden">
      <Link href={`/posts/${post.slug}`} className="block group">
        {/* アイキャッチ画像 - 16:9アスペクト比 */}
        <div className="relative aspect-video bg-[var(--background-secondary)] overflow-hidden">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl">
              🐨
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="p-4">
          {/* カテゴリ（複数対応） */}
          {categories.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {categories.map((category) => (
                <span key={category} className="category text-[10px]">
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* タイトル */}
          <h2 className="text-base font-bold mt-1.5 mb-2 text-[var(--color-primary-dark)] group-hover:text-[var(--color-accent)] transition-colors duration-300 leading-snug">
            {post.title}
          </h2>

          {/* 説明 */}
          {post.description && (
            <p className="text-[13px] text-[var(--foreground-muted)] mb-3 line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          )}

          {/* メタ情報 */}
          <div className="flex items-center gap-3 text-[11px] text-[var(--foreground-subtle)] mb-2">
            {post.date && (
              <time dateTime={post.date}>
                {format(new Date(post.date), "yyyy.MM.dd")}
              </time>
            )}
          </div>

          {/* タグ */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded-full"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-[10px] text-[var(--foreground-subtle)] py-0.5">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
