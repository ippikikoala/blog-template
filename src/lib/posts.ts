import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  normalizeCategory,
  getCategoryOrder,
  getAllRegions,
} from "@/lib/categoryUtils";
import type { Region } from "@/config/categories";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  category?: string | string[]; // 単一または複数カテゴリ対応
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
  return getAllPosts().filter((post) => {
    const categories = normalizeCategory(post.category);
    return categories.includes(category);
  });
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => post.tags?.includes(tag));
}

/**
 * すべてのカテゴリ（都道府県）を記事数とともに取得
 * 複数カテゴリ記事は各カテゴリで重複カウントされる
 * @returns カテゴリ名と記事数の配列（設定ファイルの順序でソート）
 */
export function getAllCategories(): { name: string; count: number }[] {
  const posts = getAllPosts();
  const categoryCounts: Record<string, number> = {};

  // 複数カテゴリ対応: 各カテゴリで重複カウント
  posts.forEach((post) => {
    const categories = normalizeCategory(post.category);
    categories.forEach((category) => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
  });

  // 設定ファイルの順序でソート
  return Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      const orderA = getCategoryOrder(a.name);
      const orderB = getCategoryOrder(b.name);

      // 設定にない都道府県は最後に配置
      if (!orderA) return 1;
      if (!orderB) return -1;

      // 地方順 → 都道府県順でソート
      if (orderA.regionOrder !== orderB.regionOrder) {
        return orderA.regionOrder - orderB.regionOrder;
      }
      return orderA.prefectureOrder - orderB.prefectureOrder;
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

/**
 * 地方別にカテゴリ（都道府県）と記事数を取得
 * サイドバーでの階層表示に使用
 * @returns 地方ごとのカテゴリ情報
 */
export interface RegionWithCategories {
  region: Region;
  categories: { name: string; count: number }[];
}

export function getCategoriesByRegion(): RegionWithCategories[] {
  const posts = getAllPosts();
  const regions = getAllRegions();
  const categoryCounts: Record<string, number> = {};

  // 複数カテゴリ対応: 各カテゴリで重複カウント
  posts.forEach((post) => {
    const categories = normalizeCategory(post.category);
    categories.forEach((category) => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
  });

  // 地方ごとにグループ化
  return regions
    .map((region) => {
      const categories = region.prefectures
        .map((prefecture) => ({
          name: prefecture.name,
          count: categoryCounts[prefecture.name] || 0,
        }))
        .filter((cat) => cat.count > 0) // 記事が存在する都道府県のみ
        .sort((a, b) => {
          // 設定ファイルの順序でソート
          const orderA = getCategoryOrder(a.name);
          const orderB = getCategoryOrder(b.name);
          if (!orderA || !orderB) return 0;
          return orderA.prefectureOrder - orderB.prefectureOrder;
        });

      return { region, categories };
    })
    .filter((item) => item.categories.length > 0); // 記事が存在する地方のみ
}

export function getRelatedPosts(
  currentSlug: string,
  category?: string | string[],
  tags?: string[],
  limit: number = 4
): PostMeta[] {
  const allPosts = getAllPosts().filter((post) => post.slug !== currentSlug);
  const currentCategories = normalizeCategory(category);

  // スコア計算: 同じカテゴリ +2, 同じタグ +1
  const scoredPosts = allPosts.map((post) => {
    let score = 0;

    // 複数カテゴリ対応: いずれか1つでもマッチすればスコア加算
    const postCategories = normalizeCategory(post.category);
    const hasCommonCategory = currentCategories.some((cat) =>
      postCategories.includes(cat)
    );
    if (hasCommonCategory) {
      score += 2;
    }

    // タグのスコア計算
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
