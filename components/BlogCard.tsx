'use client'

import Link from 'next/link'
import { formatPostDate, type Post } from '@/lib/post-types'

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <article
        style={{
          background: '#fff',
          border: '1px solid rgba(61,46,30,0.09)',
          borderRadius: 16,
          padding: 32,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 20px 48px rgba(61,46,30,0.09)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {post.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: 11, fontWeight: 500, textTransform: 'uppercase',
                letterSpacing: '1.2px', color: 'var(--orange)',
                background: 'var(--orange-pale)', padding: '3px 9px', borderRadius: 20,
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: 24, fontWeight: 600, color: 'var(--dark)',
          lineHeight: 1.28, marginBottom: 10, letterSpacing: '-0.3px', flexGrow: 1,
        }}>
          {post.title}
        </h2>

        {post.excerpt && (
          <p style={{
            fontSize: 14, fontWeight: 300, color: 'var(--muted-text)',
            lineHeight: 1.7, marginBottom: 20,
          }}>
            {post.excerpt}
          </p>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: 12, color: 'var(--muted-text)',
          marginTop: 'auto', paddingTop: 16,
          borderTop: '1px solid rgba(61,46,30,0.07)',
        }}>
          <span>{formatPostDate(post.date)}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--muted-text)' }} />
          <span>{post.readTime}</span>
          <span style={{ marginLeft: 'auto', color: 'var(--orange)' }}>Read →</span>
        </div>
      </article>
    </Link>
  )
}