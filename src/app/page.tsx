import { getAllArticles } from '@/lib/articles'
import Link from 'next/link'

const categories = [
  { slug: 'salon', label: 'サロン比較', desc: '人気脱毛サロンを徹底比較', emoji: '✨' },
  { slug: 'price', label: '料金・相場', desc: '部位別料金と相場を解説', emoji: '💰' },
  { slug: 'parts', label: '部位別ガイド', desc: 'VIO・顔・全身など部位別情報', emoji: '📋' },
  { slug: 'beginner', label: '脱毛入門', desc: '初めての脱毛 基礎知識', emoji: '🌱' },
]

export default function Home() {
  const articles = getAllArticles().slice(0, 6)
  return (
    <div>
      <section className="bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-2xl p-8 mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3">脱毛サロン徹底比較</h1>
        <p className="text-lg opacity-90">料金・効果・口コミで選ぶ最適な脱毛プラン</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-gray-700">カテゴリから探す</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(c => (
            <Link key={c.slug} href={`/category/${c.slug}`}
              className="bg-white rounded-xl p-5 shadow hover:shadow-md transition text-center border border-pink-100">
              <div className="text-3xl mb-2">{c.emoji}</div>
              <div className="font-bold text-gray-800 mb-1">{c.label}</div>
              <div className="text-xs text-gray-500">{c.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {articles.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 text-gray-700">最新記事</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {articles.map(a => (
              <Link key={a.slug} href={`/article/${a.slug}`}
                className="bg-white rounded-xl p-5 shadow hover:shadow-md transition border border-gray-100">
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">{a.category}</span>
                <h3 className="font-bold mt-2 mb-1 text-gray-800 line-clamp-2">{a.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{a.description}</p>
                <p className="text-xs text-gray-400 mt-2">{a.date}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
