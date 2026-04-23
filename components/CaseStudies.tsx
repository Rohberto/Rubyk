import { supabase } from '@/lib/supabase'
import CaseStudiesClient from './CaseStudiesClient'

export const revalidate = 60

export default async function CaseStudies() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, content, tags, read_time, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const items = (posts ?? []).map((p:any) => ({
    slug:   p.slug,
    cat:    Array.isArray(p.tags) && p.tags.length > 0
              ? p.tags.join(' · ')
              : 'Article',
    title:  p.title,
    desc: p.content
  ? p.content
      .replace(/#{1,6}\s*/g, '')        // headings
      .replace(/\*\*(.*?)\*\*/g, '$1')  // bold
      .replace(/\*(.*?)\*/g, '$1')      // italic
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → just label
      .replace(/^[-*+]\s+/gm, '')       // list bullets
      .replace(/^>\s*/gm, '')           // blockquotes
      .replace(/\n+/g, ' ')             // newlines → space
      .trim()
      .slice(0, 160) + '…'
  : p.excerpt ?? '',
    result: p.read_time ?? '5 min read',
  }))

  return <CaseStudiesClient items={items} />
}