import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { categoryConfig } from '@/config/categories'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.ippikikoala.com'
    const posts = await getAllPosts()

    // 記事ページ
    const postUrls = posts.map((post) => ({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    // 都道府県カテゴリページ
    const prefectureUrls = categoryConfig.regions.flatMap((region) =>
        region.prefectures.map((pref) => ({
            url: `${baseUrl}/categories/${encodeURIComponent(pref.name)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))
    )

    // テーマカテゴリページ
    const themeCategoryUrls = categoryConfig.themeCategories.map((category) => ({
        url: `${baseUrl}/categories/${encodeURIComponent(category.name)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    // 固定ページ
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/archive`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.5,
        },
    ]

    return [...staticPages, ...prefectureUrls, ...themeCategoryUrls, ...postUrls]
}
