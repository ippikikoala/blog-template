"use client";

import { useState } from "react";
import Link from "next/link";
import type { MonthlyArchive as MonthlyArchiveType } from "@/lib/posts";

interface Props {
    archives: MonthlyArchiveType[];
}

interface YearGroup {
    year: number;
    months: MonthlyArchiveType[];
    totalCount: number;
}

export default function MonthlyArchive({ archives }: Props) {
    // 年ごとにグループ化
    const yearGroups: YearGroup[] = archives.reduce((acc, item) => {
        const existingYear = acc.find((g) => g.year === item.year);
        if (existingYear) {
            existingYear.months.push(item);
            existingYear.totalCount += item.count;
        } else {
            acc.push({
                year: item.year,
                months: [item],
                totalCount: item.count,
            });
        }
        return acc;
    }, [] as YearGroup[]);

    // 最新の年を開いた状態にする
    const [openYears, setOpenYears] = useState<number[]>(
        yearGroups.length > 0 ? [yearGroups[0].year] : []
    );

    const toggleYear = (year: number) => {
        setOpenYears((prev) =>
            prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
        );
    };

    if (archives.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            {yearGroups.map((group) => (
                <div key={group.year}>
                    <button
                        onClick={() => toggleYear(group.year)}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-secondary)] rounded transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform ${openYears.includes(group.year) ? "rotate-90" : ""
                                    }`}
                            >
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                            {group.year}年
                        </span>
                        <span className="text-xs text-[var(--foreground-subtle)]">
                            ({group.totalCount})
                        </span>
                    </button>

                    {openYears.includes(group.year) && (
                        <ul className="ml-6 mt-1 space-y-1">
                            {group.months.map((month) => (
                                <li key={`${month.year}-${month.month}`}>
                                    <Link
                                        href={`/archive/${month.year}/${month.month}`}
                                        className="flex items-center justify-between px-2 py-1 text-sm text-[var(--foreground-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--background-secondary)] rounded transition-colors"
                                    >
                                        <span>{month.month}月</span>
                                        <span className="text-xs text-[var(--foreground-subtle)]">
                                            ({month.count})
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}
