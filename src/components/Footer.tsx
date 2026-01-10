import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-color)] mt-12 bg-[var(--background-secondary)]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[var(--color-primary-dark)]">
              いっぴきこあらの大冒険
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログ。写真を主体としたコンテンツをお届けします。
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[var(--color-primary-dark)]">
              Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-[var(--foreground-muted)] hover:text-[var(--color-accent)]"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-[var(--foreground-muted)] hover:text-[var(--color-accent)]"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-[var(--foreground-muted)] hover:text-[var(--color-accent)]"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/tags"
                  className="text-sm text-[var(--foreground-muted)] hover:text-[var(--color-accent)]"
                >
                  Tags
                </Link>
              </li>
              <li>
                <Link
                  href="/feed.xml"
                  className="text-sm text-[var(--foreground-muted)] hover:text-[var(--color-accent)]"
                >
                  RSS Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* SNS */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[var(--color-primary-dark)]">
              Follow
            </h3>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/ippiki_koala"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground-muted)] hover:text-[var(--color-accent)]"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <Link
                href="/feed.xml"
                className="text-[var(--foreground-muted)] hover:text-[var(--color-accent)]"
                aria-label="RSS Feed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--border-color)] text-center">
          <p className="text-sm text-[var(--foreground-subtle)]">
            © {currentYear} いっぴきこあらの大冒険. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
