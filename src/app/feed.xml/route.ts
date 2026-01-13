import { getAllPosts } from "@/lib/posts";
import RSS from "rss";

export async function GET() {
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";

  const feed = new RSS({
    title: "いっぴきこあらの大冒険",
    description: "鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログ",
    site_url: siteUrl,
    feed_url: `${siteUrl}/feed.xml`,
    language: "ja",
  });

  const posts = getAllPosts();

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `${siteUrl}/posts/${post.slug}`,
      date: post.date,
      categories: post.tags || [],
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
