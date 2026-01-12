import { notFound } from "next/navigation";
import { getPostsByMonth, getMonthlyArchive } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ year: string; month: string }>;
}

export async function generateStaticParams() {
    const archives = getMonthlyArchive();
    return archives.map(({ year, month }) => ({
        year: year.toString(),
        month: month.toString(),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { year, month } = await params;
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);

    return {
        title: `${yearNum}年${monthNum}月の記事一覧`,
        description: `${yearNum}年${monthNum}月のブログ記事一覧`,
    };
}

export default async function ArchivePage({ params }: Props) {
    const { year, month } = await params;
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);

    // 無効な年月の場合は404
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        notFound();
    }

    const posts = getPostsByMonth(yearNum, monthNum);

    if (posts.length === 0) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <main className="flex-1">
                    <div className="mb-8">
                        <div className="inline-block px-3 py-1 mb-2 text-sm font-medium bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded">
                            📅 月別アーカイブ
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--color-primary-dark)]">
                            {yearNum}年{monthNum}月の記事一覧
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
