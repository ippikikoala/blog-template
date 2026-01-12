"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="記事を検索..."
                className="w-full px-4 py-2 pr-10 text-sm border border-[var(--border-color)] rounded-lg bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
            />
            <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--foreground-muted)] hover:text-[var(--color-accent)] transition-colors"
                aria-label="検索"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </button>
        </form>
    );
}
