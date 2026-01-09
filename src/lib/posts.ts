import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  category?: string;
  tags?: string[];
  image?: string;
  draft?: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

// 本番環境かどうかを判定
const isProduction = process.env.NODE_ENV === "production";

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((name) => name.endsWith(".mdx") || name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
        description: data.description || "",
        category: data.category || "",
        tags: data.tags || [],
        image: data.image || "",
        draft: data.draft === true,
      };
    })
    // 本番環境では下書きを除外
    .filter((post) => !isProduction || !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
  const mdPath = path.join(postsDirectory, `${slug}.md`);

  let fullPath: string;
  if (fs.existsSync(mdxPath)) {
    fullPath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    fullPath = mdPath;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // 本番環境で下書きの場合はnullを返す（直接URLアクセス防止）
  if (isProduction && data.draft === true) {
    return null;
  }

  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    description: data.description || "",
    category: data.category || "",
    tags: data.tags || [],
    image: data.image || "",
    draft: data.draft === true,
    content,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  // 本番環境では下書きのslugを除外（静的生成防止）
  return getAllPosts().map((post) => post.slug);
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => post.tags?.includes(tag));
}

// 都道府県の北から南順（JISコード順）
const PREFECTURE_ORDER: string[] = [
  "北海道",
  "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
  "その他", // 最後に表示
];

export function getAllCategories(): { name: string; count: number }[] {
  const posts = getAllPosts();
  const categories = posts.reduce(
    (acc, post) => {
      if (post.category) {
        acc[post.category] = (acc[post.category] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(categories)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      const indexA = PREFECTURE_ORDER.indexOf(a.name);
      const indexB = PREFECTURE_ORDER.indexOf(b.name);
      // リストにない場合は「その他」の前に配置
      const orderA = indexA === -1 ? PREFECTURE_ORDER.length - 1 : indexA;
      const orderB = indexB === -1 ? PREFECTURE_ORDER.length - 1 : indexB;
      return orderA - orderB;
    });
}

export function getAllTags(): { name: string; count: number }[] {
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

  return Object.entries(tags)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getRelatedPosts(
  currentSlug: string,
  category?: string,
  tags?: string[],
  limit: number = 4
): PostMeta[] {
  const allPosts = getAllPosts().filter((post) => post.slug !== currentSlug);

  // スコア計算: 同じカテゴリ +2, 同じタグ +1
  const scoredPosts = allPosts.map((post) => {
    let score = 0;
    if (category && post.category === category) {
      score += 2;
    }
    if (tags && post.tags) {
      score += tags.filter((tag) => post.tags?.includes(tag)).length;
    }
    return { post, score };
  });

  return scoredPosts
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

export function getAdjacentPosts(slug: string): {
  prev: PostMeta | null;
  next: PostMeta | null;
} {
  const posts = getAllPosts();
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  return {
    prev: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    next: currentIndex > 0 ? posts[currentIndex - 1] : null,
  };
}
