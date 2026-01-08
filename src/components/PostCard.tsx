import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { PostMeta } from "@/lib/posts";

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="card overflow-hidden">
      <Link href={`/posts/${post.slug}`} className="block group">
        {/* アイキャッチ画像 */}
        <div className="relative aspect-[16/9] bg-[var(--background-secondary)] overflow-hidden">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl">
              🐨
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="p-6">
          {/* カテゴリ */}
          {post.category && (
            <span className="category mb-3">{post.category}</span>
          )}

          {/* タイトル */}
          <h2 className="text-xl font-bold mt-2 mb-3 text-[var(--color-primary-dark)] group-hover:text-[var(--color-accent)] transition-colors duration-300 line-clamp-2 leading-snug">
            {post.title}
          </h2>

          {/* 説明 */}
          {post.description && (
            <p className="text-[15px] text-[var(--foreground-muted)] mb-4 line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          )}

          {/* メタ情報 */}
          <div className="flex items-center gap-4 text-[13px] text-[var(--foreground-subtle)] mb-3">
            {post.date && (
              <time dateTime={post.date}>
                {format(new Date(post.date), "yyyy.MM.dd")}
              </time>
            )}
          </div>

          {/* タグ */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded-full"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-[var(--foreground-subtle)] py-1">
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
