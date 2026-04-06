import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import type { Post } from './post-types'

export type { Post } from './post-types'
export { formatPostDate } from './post-types'

const postsDir = path.join(process.cwd(), 'posts')

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDir)) return []

  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace('.md', '')
      const raw  = fs.readFileSync(path.join(postsDir, fileName), 'utf8')
      const { data } = matter(raw)
      return {
        slug,
        title:    data.title    ?? '',
        date:     data.date     ?? '',
        excerpt:  data.excerpt  ?? '',
        author:   data.author   ?? 'Rubyk',
        tags:     data.tags     ?? [],
        readTime: data.readTime ?? '5 min read',
      }
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(postsDir, `${slug}.md`)
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)
    const processed = await remark().use(html).process(content)
    return {
      slug,
      title:    data.title    ?? '',
      date:     data.date     ?? '',
      excerpt:  data.excerpt  ?? '',
      author:   data.author   ?? 'Rubyk',
      tags:     data.tags     ?? [],
      readTime: data.readTime ?? '5 min read',
      content:  processed.toString(),
    }
  } catch {
    return null
  }
}