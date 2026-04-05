import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getPostBySlug, formatPostDate } from '@/lib/posts'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title:       `${post.title} — Rubyk`,
    description: post.excerpt,
  }
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <>
      <Navbar />
      <main
        style={{
          background: 'var(--cream)',
          minHeight:  '100vh',
          paddingTop: 100,
        }}
      >
        {/* Article header */}
        <header
          style={{
            padding:      'clamp(48px, 6vw, 80px) clamp(24px, 7vw, 96px) clamp(40px, 5vw, 64px)',
            borderBottom: '1px solid rgba(61,46,30,0.08)',
            maxWidth:     800,
          }}
        >
          {/* Back link */}
          <Link
            href="/blog"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            6,
              fontSize:       13,
              color:          'var(--muted-text)',
              textDecoration: 'none',
              marginBottom:   28,
              transition:     'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--orange)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-text)')}
          >
            ← All posts
          </Link>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize:      11,
                    fontWeight:    500,
                    textTransform: 'uppercase',
                    letterSpacing: '1.2px',
                    color:         'var(--orange)',
                    background:    'var(--orange-pale)',
                    padding:       '3px 9px',
                    borderRadius:  20,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            style={{
              fontFamily:    'var(--font-cormorant), Georgia, serif',
              fontSize:      'clamp(36px, 4.5vw, 60px)',
              fontWeight:    600,
              color:         'var(--dark)',
              letterSpacing: '-1.5px',
              lineHeight:    1.1,
              marginBottom:  20,
            }}
          >
            {post.title}
          </h1>

          {/* Meta */}
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        12,
              fontSize:   13,
              color:      'var(--muted-text)',
            }}
          >
            <span style={{ fontWeight: 500, color: 'var(--mid)' }}>{post.author}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--muted-text)' }} />
            <span>{formatPostDate(post.date)}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--muted-text)' }} />
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* Article body */}
        <div
          style={{
            padding: 'clamp(40px, 5vw, 64px) clamp(24px, 7vw, 96px) clamp(80px, 10vw, 120px)',
            maxWidth: 800,
          }}
        >
          {post.excerpt && (
            <p
              style={{
                fontFamily:   'var(--font-cormorant), Georgia, serif',
                fontSize:     22,
                fontStyle:    'italic',
                fontWeight:   400,
                color:        'var(--mid)',
                lineHeight:   1.7,
                marginBottom: 40,
                paddingBottom: 40,
                borderBottom: '1px solid rgba(61,46,30,0.09)',
              }}
            >
              {post.excerpt}
            </p>
          )}

          <div
            className="prose-rubyk"
            dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
          />

          {/* Footer nav */}
          <div
            style={{
              marginTop:  56,
              paddingTop: 40,
              borderTop:  '1px solid rgba(61,46,30,0.09)',
            }}
          >
            <Link
              href="/blog"
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            6,
                fontSize:       14,
                color:          'var(--orange)',
                textDecoration: 'none',
                fontWeight:     400,
                borderBottom:   '1px solid rgba(232,99,42,0.3)',
                paddingBottom:  2,
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
