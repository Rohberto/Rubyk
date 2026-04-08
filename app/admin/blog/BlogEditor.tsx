'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLogout from './AdminLogout'

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  created_at: string
}

export default function AdminBlogList() {
  const [posts,   setPosts]   = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetch('/api/blog/posts/all')
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setPosts(data.posts ?? [])
        setLoading(false)
      })
      .catch(() => { setError('Failed to load posts.'); setLoading(false) })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(24px, 4vw, 48px)' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, marginBottom: 40,
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 28, fontWeight: 700, color: 'var(--orange)', letterSpacing: '-0.5px',
          }}>Rubyk</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Blog Editor</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/admin/guide" style={{
            background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)',
            textDecoration: 'none', padding: '10px 20px', borderRadius: 8,
            fontSize: 14, fontWeight: 400,
          }}>Edit guide page</Link>
          <Link href="/admin/blog/editor" style={{
            background: 'var(--orange)', color: '#fff', textDecoration: 'none',
            padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500,
          }}>+ New post</Link>
          <AdminLogout />
        </div>
      </div>

      {/* States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>
            Loading posts…
          </p>
        </div>
      )}

      {!loading && error && (
        <div style={{
          border: '1px solid rgba(231,76,60,0.3)', borderRadius: 12,
          padding: '20px 24px', background: 'rgba(231,76,60,0.08)',
        }}>
          <p style={{ fontSize: 14, color: '#e74c3c' }}>{error}</p>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div style={{
          border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16,
          padding: '64px 32px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>
            No posts yet. Write your first one.
          </p>
          <Link href="/admin/blog/editor" style={{
            display: 'inline-block', marginTop: 20,
            background: 'var(--orange)', color: '#fff', textDecoration: 'none',
            padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 500,
          }}>Write first post</Link>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
          {posts.map((post, i) => (
            <div key={post.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 12, padding: '18px 24px',
              borderBottom: i < posts.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 18, fontWeight: 600, color: 'var(--cream)', marginBottom: 4,
                }}>
                  {post.title || 'Untitled'}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                  {post.slug} · {new Date(post.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px',
                  padding: '3px 10px', borderRadius: 20,
                  background: post.published ? 'rgba(26,188,156,0.12)' : 'rgba(255,255,255,0.07)',
                  color: post.published ? '#1abc9c' : 'rgba(255,255,255,0.4)',
                }}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
                <Link href={`/admin/blog/editor?id=${post.id}`} style={{
                  fontSize: 13, color: 'var(--orange)', textDecoration: 'none',
                  border: '1px solid rgba(232,99,42,0.3)', borderRadius: 6, padding: '5px 12px',
                }}>Edit</Link>
                {post.published && (
                  <Link href={`/blog/${post.slug}`} target="_blank" style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
                  }}>View ↗</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}