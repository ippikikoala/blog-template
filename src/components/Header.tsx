import Link from "next/link";
import { getAllCategories, getAllTags } from "@/lib/posts";
import MobileMenu from "./MobileMenu";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Categories", href: "/categories" },
  { name: "Tags", href: "/tags" },
];

export default function Header() {
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--header-bg)] backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-[var(--color-primary-dark)] hover:text-[var(--color-accent)]"
          >
            いっぴきこあらの大冒険
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[var(--foreground-muted)] hover:text-[var(--color-accent)] transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/feed.xml"
              className="text-[var(--foreground-muted)] hover:text-[var(--color-accent)] transition-colors"
              title="RSS Feed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu */}
          <MobileMenu categories={categories} tags={tags} />
        </div>
      </nav>
    </header>
  );
}
