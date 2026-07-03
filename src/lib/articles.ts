import fs from 'fs'
import path from 'path'

export type Article = {
  slug: string
  title: string
  description: string
  category: string
  date: string
  content: string
}

const contentDir = path.join(process.cwd(), 'content')

export function getAllArticles(): Article[] {
  if (!fs.existsSync(contentDir)) return []
  return fs.readdirSync(contentDir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(contentDir, f), 'utf-8'))
      return { ...data, slug: f.replace('.json', '') }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(contentDir, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  return { ...data, slug }
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter(a => a.category === category)
}
