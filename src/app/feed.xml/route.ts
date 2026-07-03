import { getAllArticles } from '@/lib/articles'
const BASE_URL = 'https://datsu-media.vercel.app'
export async function GET() {
  const articles = getAllArticles().slice(0, 20)
  const items = articles.map(a => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${BASE_URL}/article/${a.slug}</link>
      <guid>${BASE_URL}/article/${a.slug}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <description><![CDATA[${a.description ?? ''}]]></description>
    </item>`).join('')
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>脱毛ナビ</title>
    <link>${BASE_URL}</link>
    <description>脱毛サロン比較・料金・おすすめ情報</description>
    <language>ja</language>
    ${items}
  </channel>
</rss>`
  return new Response(rss, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
