import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { remark } from 'remark'
import html from 'remark-html'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer' 
import type { BlogPost } from '@/lib/supabase'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true)
  return (data ?? []).map((p: BlogPost) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!post) return {}
  return { title: `${post.title} — Rubyk`, description: post.excerpt }
}

async function renderContent(markdown: string) {
  const processed = await remark().use(html).process(markdown)
  return processed.toString()
}

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(dateStr))
  } catch { return dateStr }
}

export default async function PostPage({ params }: Props) {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  const contentHtml = post.content ? await renderContent(post.content) : ''

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--cream)', minHeight: '100vh', paddingTop: 100 }}>

        {/* Article header — centred */}
        <header style={{
          padding:   'clamp(48px, 6vw, 80px) clamp(20px, 7vw, 96px) clamp(40px, 5vw, 56px)',
          borderBottom: '1px solid rgba(61,46,30,0.08)',
          maxWidth:  800,
          margin:    '0 auto',
          textAlign: 'center',
        }}>
          {/* Back link — left aligned inside the centred block */}
          <div style={{ textAlign: 'left', marginBottom: 28 }}>
            <Link
              href="/blog"
              className="back-link"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, color: 'var(--muted-text)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
            >
              ← All posts
            </Link>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{
              display: 'flex', gap: 6, flexWrap: 'wrap',
              marginBottom: 20, justifyContent: 'center',
            }}>
              {(post.tags as string[]).map((tag: string) => (
                <span key={tag} style={{
                  fontSize: 11, fontWeight: 500, textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color:      tag.toLowerCase() === 'case study' ? '#fff' : 'var(--orange)',
                  background: tag.toLowerCase() === 'case study' ? 'var(--orange)' : 'var(--orange-pale)',
                  padding: '3px 9px', borderRadius: 20,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 style={{
            fontFamily:    'var(--font-cormorant), Georgia, serif',
            fontSize:      'clamp(36px, 4.5vw, 60px)', fontWeight: 600,
            color:         'var(--dark)', letterSpacing: '-1.5px',
            lineHeight:    1.1, marginBottom: 24,
          }}>
            {post.title}
          </h1>

          {/* Meta */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 12, fontSize: 13, color: 'var(--muted-text)', flexWrap: 'wrap',
          }}>
            <span style={{ fontWeight: 500, color: 'var(--mid)' }}>{post.author}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--muted-text)' }} />
            <span>{formatDate(post.created_at)}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--muted-text)' }} />
            <span>{post.read_time}</span>
          </div>
        </header>

        {/* Cover image — full width */}
        {post.cover_image && (
          <div style={{
            width:      '100%',
            maxHeight:  520,
            overflow:   'hidden',
            background: 'var(--warm)',
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src={post.cover_image}
              alt={post.title}
              style={{
                width:     '100%',
                maxHeight: 520,
                objectFit: 'contain',
                display:   'block',
                padding:   'clamp(16px, 3vw, 40px)',
              }}
            />
          </div>
        )}

        {/* Article body — centred */}
        <div style={{
          maxWidth: 740,
          margin:   '0 auto',
          padding:  'clamp(40px, 5vw, 64px) clamp(20px, 5vw, 48px) clamp(80px, 10vw, 120px)',
        }}>
          {post.excerpt && (
            <p style={{
              fontFamily:   'var(--font-cormorant), Georgia, serif',
              fontSize:     22, fontStyle: 'italic', fontWeight: 400,
              color:        'var(--mid)', lineHeight: 1.7,
              marginBottom: 40, paddingBottom: 40,
              borderBottom: '1px solid rgba(61,46,30,0.09)',
              textAlign:    'center',
            }}>
              {post.excerpt}
            </p>
          )}

          <div
            className="prose-rubyk"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <div style={{ marginTop: 56, paddingTop: 40, borderTop: '1px solid rgba(61,46,30,0.09)' }}>
            <Link
              href="/blog"
              className="back-link"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 14, color: 'var(--orange)', textDecoration: 'none',
                fontWeight: 400, borderBottom: '1px solid rgba(232,99,42,0.3)', paddingBottom: 2,
              }}
            >
              ← Back to all posts
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}