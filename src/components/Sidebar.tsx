import Link from "next/link";
import Image from "next/image";
import {
  getAllPosts,
  getCategoriesByRegion,
  getThemeCategories,
  getMonthlyArchive,
} from "@/lib/posts";
import { getEnabledSidebarItems, type SidebarItemType } from "@/config/sidebar";
import CategoryAccordion from "./CategoryAccordion";
import SearchBox from "./SearchBox";
import MonthlyArchive from "./MonthlyArchive";

// 各サイドバーセクションのコンポーネント

function ProfileSection() {
  return (
    <div className="card p-6">
      <h3 className="font-bold text-lg mb-1 text-[var(--color-primary-dark)]">
        Profile
      </h3>
      <div className="text-center">
        <div className="w-full mx-auto mb-2 overflow-hidden">
          <Image
            src="/ippikikoala_profile.png"
            alt="いっぴきこあら"
            width={280}
            height={280}
            className="object-contain w-full h-auto"
            priority
          />
        </div>
        <p className="font-semibold mb-2">いっぴきこあら</p>
        <p className="text-sm text-[var(--foreground-muted)]">
          鄙びた集落・旅館を巡るブログ。温泉、廃線、炭鉱、離島などを訪ねています。
        </p>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <a
          href="https://twitter.com/ippiki_koala"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--foreground-muted)] hover:text-[var(--color-accent)]"
          aria-label="Twitter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function SearchSection() {
  return (
    <div className="card p-6">
      <h3 className="font-bold text-lg mb-4 text-[var(--color-primary-dark)]">
        Search
      </h3>
      <SearchBox />
    </div>
  );
}

function ArchiveSection() {
  const archives = getMonthlyArchive();

  if (archives.length === 0) {
    return null;
  }

  return (
    <div className="card p-6">
      <h3 className="font-bold text-lg mb-4 text-[var(--color-primary-dark)]">
        Archive
      </h3>
      <MonthlyArchive archives={archives} />
    </div>
  );
}

function CategoriesSection() {
  const regionCategories = getCategoriesByRegion();
  const themeCategories = getThemeCategories();

  if (regionCategories.length === 0 && themeCategories.length === 0) {
    return null;
  }

  return (
    <div className="card p-6">
      <h3 className="font-bold text-lg mb-4 text-[var(--color-primary-dark)]">
        Categories
      </h3>
      <CategoryAccordion
        regionCategories={regionCategories}
        themeCategories={themeCategories}
      />
    </div>
  );
}

function TagsSection() {
  const posts = getAllPosts();
  const tags = posts.reduce(
    (acc, post) => {
      (post.tags || []).forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  if (Object.keys(tags).length === 0) {
    return null;
  }

  return (
    <div className="card p-6">
      <h3 className="font-bold text-lg mb-4 text-[var(--color-primary-dark)]">
        Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {Object.entries(tags)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
          .map(([tag]) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="tag"
            >
              {tag}
            </Link>
          ))}
      </div>
      {Object.keys(tags).length > 15 && (
        <Link
          href="/tags"
          className="block mt-4 text-sm text-[var(--color-accent)] hover:underline"
        >
          すべてのタグを見る →
        </Link>
      )}
    </div>
  );
}

function RecentPostsSection() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 5);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <div className="card p-6">
      <h3 className="font-bold text-lg mb-4 text-[var(--color-primary-dark)]">
        Recent Posts
      </h3>
      <ul className="space-y-3">
        {recentPosts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="text-sm text-[var(--foreground-muted)] hover:text-[var(--color-accent)] line-clamp-2"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// セクションタイプに対応するコンポーネントのマッピング
const sectionComponents: Record<SidebarItemType, React.FC> = {
  profile: ProfileSection,
  search: SearchSection,
  archive: ArchiveSection,
  categories: CategoriesSection,
  tags: TagsSection,
  recentPosts: RecentPostsSection,
};

export default function Sidebar() {
  const enabledItems = getEnabledSidebarItems();

  return (
    <aside className="space-y-8">
      {enabledItems.map((item) => {
        const Component = sectionComponents[item.type];
        return <Component key={item.type} />;
      })}
    </aside>
  );
}
