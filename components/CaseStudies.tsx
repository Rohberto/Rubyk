import { supabase } from '@/lib/supabase'
import CaseStudiesClient from './CaseStudiesClient'

export const revalidate = 60

export default async function CaseStudies() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, tags, read_time, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const items = (posts ?? []).map((p:any) => ({
    slug:   p.slug,
    cat:    Array.isArray(p.tags) && p.tags.length > 0
              ? p.tags.join(' · ')
              : 'Article',
    title:  p.title,
    desc:   p.excerpt ?? '',
    result: p.read_time ?? '5 min read',
  }))

  return <CaseStudiesClient items={items} />
}