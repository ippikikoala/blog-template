import Image from "next/image";

interface LinkCardProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

async function fetchOGP(url: string): Promise<{
  title: string;
  description: string;
  image: string;
  siteName: string;
}> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "bot",
      },
      next: { revalidate: 86400 }, // 24時間キャッシュ
    });

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const html = await response.text();

    // OGPタグを抽出
    const getMetaContent = (property: string): string => {
      const match = html.match(
        new RegExp(
          `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`,
          "i"
        )
      );
      if (match) return match[1];

      // content が先に来るパターン
      const match2 = html.match(
        new RegExp(
          `<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["']`,
          "i"
        )
      );
      return match2 ? match2[1] : "";
    };

    // タイトルを取得
    let title = getMetaContent("og:title");
    if (!title) {
      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      title = titleMatch ? titleMatch[1] : "";
    }

    // 説明を取得
    let description = getMetaContent("og:description");
    if (!description) {
      description = getMetaContent("description");
    }

    // 画像を取得
    const image = getMetaContent("og:image");

    // サイト名を取得
    let siteName = getMetaContent("og:site_name");
    if (!siteName) {
      try {
        siteName = new URL(url).hostname;
      } catch {
        siteName = "";
      }
    }

    return {
      title: title || url,
      description: description || "",
      image: image || "",
      siteName,
    };
  } catch {
    // フェッチ失敗時はURLからドメイン名を取得
    let hostname = "";
    try {
      hostname = new URL(url).hostname;
    } catch {
      hostname = url;
    }
    return {
      title: url,
      description: "",
      image: "",
      siteName: hostname,
    };
  }
}

export default async function LinkCard({
  url,
  title: customTitle,
  description: customDescription,
  image: customImage,
}: LinkCardProps) {
  const ogp = await fetchOGP(url);

  const title = customTitle || ogp.title;
  const description = customDescription || ogp.description;
  const image = customImage || ogp.image;
  const siteName = ogp.siteName;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose block my-6 border border-[var(--border-color)] rounded-lg overflow-hidden hover:bg-[var(--background-secondary)] transition-colors"
    >
      <div className="flex">
        {/* テキスト部分 */}
        <div className="flex-1 p-4 min-w-0">
          <div className="font-medium text-[var(--color-primary-dark)] line-clamp-2 mb-1">
            {title}
          </div>
          {description && (
            <div className="text-sm text-[var(--foreground-muted)] line-clamp-2 mb-2">
              {description}
            </div>
          )}
          <div className="text-xs text-[var(--foreground-subtle)] flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            {siteName}
          </div>
        </div>

        {/* 画像部分 */}
        {image && (
          <div className="relative w-32 sm:w-40 shrink-0">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
              sizes="160px"
              unoptimized // 外部画像のため
            />
          </div>
        )}
      </div>
    </a>
  );
}
