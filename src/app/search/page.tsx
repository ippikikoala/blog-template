import { searchPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";

interface Props {
    searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { q } = await searchParams;
    const query = q || "";

    return {
        title: query ? `「${query}」の検索結果` : "検索",
        description: query ? `「${query}」の検索結果ページ` : "記事を検索",
    };
}

export default async function SearchPage({ searchParams }: Props) {
    const { q } = await searchParams;
    const query = q || "";
    const posts = query ? searchPosts(query) : [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <main className="flex-1">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[var(--color-primary-dark)]">
                            {query ? `「${query}」の検索結果` : "検索"}
                        </h1>
                        {query && (
                            <p className="text-[var(--foreground-muted)] mt-2">
                                {posts.length > 0
                                    ? `${posts.length} 件の記事が見つかりました`
                                    : "該当する記事が見つかりませんでした"}
                            </p>
                        )}
                    </div>

                    {!query ? (
                        <div className="card p-12 text-center">
                            <p className="text-6xl mb-4">🔍</p>
                            <p className="text-[var(--foreground-muted)]">
                                サイドバーの検索ボックスからキーワードを入力してください。
                            </p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="card p-12 text-center">
                            <p className="text-6xl mb-4">😢</p>
                            <p className="text-[var(--foreground-muted)]">
                                「{query}」に一致する記事が見つかりませんでした。
                                <br />
                                別のキーワードで検索してみてください。
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <PostCard key={post.slug} post={post} />
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
