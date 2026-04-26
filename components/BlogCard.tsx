'use client'

import Link from 'next/link'
import { formatPostDate, type Post } from '@/lib/post-types'

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/case-studies/${post.slug}`} style={{ textDecoration: 'none' }}>
      <article
        style={{
          background: '#fff', border: '1px solid rgba(61,46,30,0.09)',
          borderRadius: 16, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s',
          cursor: 'pointer', height: '100%',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(61,46,30,0.09)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
      >
        {post.coverImage && (
          <div style={{
            width: '100%', height: 240, flexShrink: 0,
            background: 'var(--warm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <img
              src={post.coverImage}
              alt={post.title}
              style={{
                width: '100%', height: '100%',
                objectFit: 'contain',
                padding: '16px',
                display: 'block',
                transition: 'transform 0.4s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>
        )}

        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', flex: 1 }}>
          {post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {post.tags.map((tag) => (
                <span key={tag} style={{
                  fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1.2px',
                  color: tag.toLowerCase() === 'case study' ? '#fff' : 'var(--orange)',
                  background: tag.toLowerCase() === 'case study' ? 'var(--orange)' : 'var(--orange-pale)',
                  padding: '3px 9px', borderRadius: 20,
                }}>{tag}</span>
              ))}
            </div>
          )}

          <h2 style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 22, fontWeight: 600, color: 'var(--dark)',
            lineHeight: 1.28, marginBottom: 10, letterSpacing: '-0.3px', flexGrow: 1,
          }}>{post.title}</h2>

          {post.excerpt && (
            <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--muted-text)', lineHeight: 1.7, marginBottom: 20 }}>
              {post.excerpt}
            </p>
          )}

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            fontSize: 12, color: 'var(--muted-text)',
            marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(61,46,30,0.07)',
          }}>
            <span>{formatPostDate(post.date)}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--muted-text)' }} />
            <span>{post.readTime}</span>
            <span style={{ marginLeft: 'auto', color: 'var(--orange)' }}>Read →</span>
          </div>
        </div>
      </article>
    </Link>
  )
}