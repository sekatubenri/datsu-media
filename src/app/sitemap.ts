import { getAllArticles } from '@/lib/articles'
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://datsu-select.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/category/salon`,    lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/category/price`,    lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/category/parts`,    lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/category/beginner`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...articles.map(a => ({ url: `${BASE_URL}/article/${a.slug}`, lastModified: new Date(a.date), changeFrequency: 'weekly' as const, priority: 0.8 })),
  ]
}
