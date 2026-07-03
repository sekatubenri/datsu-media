import { getArticleBySlug, getAllArticles } from '@/lib/articles'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllArticles().map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}
  return { title: article.title, description: article.description }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()
  return (
    <article className="bg-white rounded-xl shadow p-6 md:p-10">
      <p className="text-sm text-gray-500 mb-2">{article.date}</p>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">{article.title}</h1>
      <p className="text-gray-600 mb-6 border-l-4 border-pink-400 pl-4">{article.description}</p>
      <div className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  )
}
