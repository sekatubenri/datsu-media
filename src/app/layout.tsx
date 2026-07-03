import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: '脱毛ナビ | 脱毛サロン比較・料金・おすすめ情報', template: '%s | 脱毛ナビ' },
  description: '脱毛サロン・医療脱毛の徹底比較。料金・効果・口コミを詳しく解説。あなたに合った脱毛方法が見つかります。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-800">
        <header className="bg-pink-600 text-white shadow">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight">💆 脱毛ナビ</a>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <a href="/category/salon" className="hover:text-pink-200">サロン比較</a>
              <a href="/category/price" className="hover:text-pink-200">料金・相場</a>
              <a href="/category/parts" className="hover:text-pink-200">部位別</a>
              <a href="/category/beginner" className="hover:text-pink-200">脱毛入門</a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-800 text-gray-400 text-sm mt-16">
          <div className="max-w-5xl mx-auto px-4 py-8 text-center">
            <p>© 2025 脱毛ナビ | 脱毛サロン比較・料金・おすすめ情報</p>
            <p className="mt-1 text-xs">※本サイトにはアフィリエイト広告が含まれます</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
