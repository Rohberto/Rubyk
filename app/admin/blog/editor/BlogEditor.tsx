'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface PostForm {
  title: string; slug: string; excerpt: string; content: string
  author: string; tags: string; read_time: string; cover_image: string; published: boolean
}

const empty: PostForm = {
  title: '', slug: '', excerpt: '', content: '',
  author: 'Rubyk', tags: '', read_time: '5 min read', cover_image: '', published: false,
}

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,  '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/^> (.+)$/gm,    '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm,    '<li>$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^(?!<[hbulia])(.*\S.*)$/gm, '<p>$1</p>')
}

export default function BlogEditor() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const editId       = searchParams.get('id')

  const [form,       setForm]       = useState<PostForm>(empty)
  const [status,     setStatus]     = useState<'idle'|'saving'|'saved'|'error'>('idle')
  const [errMsg,     setErrMsg]     = useState('')
  const [slugLocked, setSlugLocked] = useState(false)
  const [loading,    setLoading]    = useState(!!editId)

  useEffect(() => {
    if (!editId) return
    fetch(`/api/blog/posts?id=${editId}`)
      .then(r => r.json())
      .then(({ post }) => {
        if (post) { setForm({ ...post, tags: (post.tags || []).join(', ') }); setSlugLocked(true) }
        setLoading(false)
      })
  }, [editId])

  const setTitle = (title: string) =>
    setForm(f => ({ ...f, title, slug: slugLocked ? f.slug : slugify(title) }))

  const set = (k: keyof PostForm, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }))

  const save = useCallback(async (publish: boolean) => {
    setStatus('saving'); setErrMsg('')
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), published: publish, cover_image: form.cover_image }
    const url    = editId ? `/api/blog/posts/${editId}` : '/api/blog/posts'
    const method = editId ? 'PUT' : 'POST'
    const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    if (!res.ok) { setErrMsg(data.error ?? 'Something went wrong.'); setStatus('error') }
    else {
      setStatus('saved'); setForm(f => ({ ...f, published: publish }))
      if (!editId) router.push(`/admin/blog/editor?id=${data.post.id}`)
      setTimeout(() => setStatus('idle'), 2500)
    }
  }, [form, editId, router])

  const inp = (multiline = false): React.CSSProperties => ({
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
    padding: '11px 14px', fontSize: 14, color: '#fff', outline: 'none',
    fontFamily: 'var(--font-outfit), system-ui, sans-serif',
    resize: multiline ? 'vertical' : 'none', transition: 'border-color 0.2s',
    ...(multiline ? { minHeight: 80, lineHeight: 1.6 } : {}),
  })
  const lbl: React.CSSProperties = {
    fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 6, display: 'block',
  }
  const focus = (e: React.FocusEvent<HTMLElement>) => ((e.currentTarget as HTMLInputElement).style.borderColor = 'var(--orange)')
  const blur  = (e: React.FocusEvent<HTMLElement>) => ((e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)')

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>Loading post…</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
        padding: '14px clamp(16px, 3vw, 32px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: '#130c03', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/admin/blog" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Posts</Link>
          <span style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>{editId ? 'Editing post' : 'New post'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {status === 'saved' && <span style={{ fontSize: 13, color: '#1abc9c' }}>Saved ✓</span>}
          {status === 'error' && <span style={{ fontSize: 13, color: '#e74c3c' }}>{errMsg}</span>}
          <button onClick={() => save(false)} disabled={status === 'saving'} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.6)', borderRadius: 7, padding: '8px 16px',
            fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-outfit), system-ui, sans-serif',
          }}>{status === 'saving' ? 'Saving…' : 'Save draft'}</button>
          <button onClick={() => save(true)} disabled={status === 'saving'} style={{
            background: form.published ? '#1abc9c' : 'var(--orange)',
            color: '#fff', border: 'none', borderRadius: 7, padding: '8px 18px',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--font-outfit), system-ui, sans-serif',
          }}>{form.published ? 'Update' : 'Publish'}</button>
        </div>
      </div>

      {/* Body - 3 column grid */}
      <div className="editor-grid" style={{ flex: 1 }}>

        {/* Sidebar: metadata */}
        <div style={{
          borderRight: '1px solid rgba(255,255,255,0.07)',
          padding: 'clamp(16px, 2.5vw, 28px)',
          overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <div>
            <span style={lbl}>Title</span>
            <input style={inp()} value={form.title} onChange={e => setTitle(e.target.value)}
              placeholder="Post title" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <span style={lbl}>Slug</span>
            <div style={{ position: 'relative' }}>
              <input style={{ ...inp(), paddingRight: 44 }} value={form.slug}
                onChange={e => { set('slug', e.target.value); setSlugLocked(true) }}
                placeholder="post-url-slug" onFocus={focus} onBlur={blur} />
              {slugLocked && (
                <button onClick={() => { setSlugLocked(false); set('slug', slugify(form.title)) }} title="Reset"
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 13 }}>
                  ↺
                </button>
              )}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>
              /blog/{form.slug || '…'}
            </p>
          </div>
          <div>
            <span style={lbl}>Excerpt</span>
            <textarea style={{ ...inp(true), minHeight: 72 }} value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              placeholder="Short summary for the listing page" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <span style={lbl}>Author</span>
            <input style={inp()} value={form.author} onChange={e => set('author', e.target.value)}
              placeholder="Victory" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={lbl}>Tags (comma separated)</span>
              <button
                onClick={() => {
                  const current = form.tags.trim()
                  const hasCS = current.toLowerCase().includes('case study')
                  if (!hasCS) set('tags', current ? `${current}, Case Study` : 'Case Study')
                }}
                style={{
                  fontSize: 10, fontWeight: 500, color: 'var(--orange)',
                  background: 'rgba(232,99,42,0.12)', border: '1px solid rgba(232,99,42,0.25)',
                  borderRadius: 20, padding: '2px 10px', cursor: 'pointer',
                  fontFamily: 'var(--font-outfit), system-ui, sans-serif',
                }}
              >
                + Case Study
              </button>
            </div>
            <input style={inp()} value={form.tags} onChange={e => set('tags', e.target.value)}
              placeholder="Fundraising, Storytelling" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <span style={lbl}>Read time</span>
            <input style={inp()} value={form.read_time} onChange={e => set('read_time', e.target.value)}
              placeholder="5 min read" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <span style={lbl}>Cover image URL</span>
            <input style={inp()} value={form.cover_image} onChange={e => set('cover_image', e.target.value)}
              placeholder="https://... (Google Drive, Cloudinary, etc.)" onFocus={focus} onBlur={blur} />
            {form.cover_image && (
              <img src={form.cover_image} alt="Cover preview"
                style={{ marginTop: 8, width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
            )}
          </div>
          <div style={{
            padding: '12px 14px', background: 'rgba(255,255,255,0.04)',
            borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Status</span>
            <span style={{
              fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px',
              padding: '3px 10px', borderRadius: 20,
              background: form.published ? 'rgba(26,188,156,0.12)' : 'rgba(255,255,255,0.07)',
              color: form.published ? '#1abc9c' : 'rgba(255,255,255,0.4)',
            }}>{form.published ? 'Published' : 'Draft'}</span>
          </div>
          {editId && form.published && (
            <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer" style={{
              display: 'block', textAlign: 'center', fontSize: 13, color: 'var(--orange)',
              textDecoration: 'none', border: '1px solid rgba(232,99,42,0.25)',
              borderRadius: 8, padding: '10px',
            }}>View live post ↗</a>
          )}
        </div>

        {/* Write */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)',
            fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.3)', fontWeight: 500,
          }}>Write — Markdown</div>
          <textarea
            value={form.content}
            onChange={e => set('content', e.target.value)}
            placeholder={`Start writing...\n\n## Use headings to structure\n\nWrite **bold** or *italic* text.\n\n> Pull quotes look great here\n\n- And bullet lists too`}
            style={{
              flex: 1, width: '100%', background: 'transparent', border: 'none',
              outline: 'none', resize: 'none', padding: 'clamp(16px, 2.5vw, 28px)',
              fontSize: 14, color: 'rgba(255,255,255,0.8)',
              fontFamily: '"SF Mono", "Fira Code", monospace',
              lineHeight: 1.8, overflowY: 'auto',
            }}
            onKeyDown={e => {
              if (e.key === 'Tab') {
                e.preventDefault()
                const start = e.currentTarget.selectionStart
                const end   = e.currentTarget.selectionEnd
                const val   = form.content
                set('content', val.substring(0, start) + '  ' + val.substring(end))
                setTimeout(() => { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2 }, 0)
              }
            }}
          />
        </div>

        {/* Preview */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)',
            fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.3)', fontWeight: 500,
          }}>Preview</div>
          <div className="prose-rubyk preview-pane"
            style={{ padding: 'clamp(16px, 2.5vw, 28px)', flex: 1, overflowY: 'auto' }}
            dangerouslySetInnerHTML={{ __html: form.content ? renderMarkdown(form.content) : '<p style="color:rgba(255,255,255,0.2)">Preview will appear here…</p>' }}
          />
        </div>
      </div>

      <style>{`
        .editor-grid {
          display: grid;
          grid-template-columns: 300px 1fr 1fr;
          height: calc(100vh - 57px);
        }
        .preview-pane h1, .preview-pane h2, .preview-pane h3 { color: rgba(255,255,255,0.9) !important; }
        .preview-pane p, .preview-pane li  { color: rgba(255,255,255,0.7) !important; }
        .preview-pane strong { color: #fff !important; }
        .preview-pane a { color: var(--orange) !important; }
        @media (max-width: 960px) {
          .editor-grid { grid-template-columns: 1fr !important; height: auto !important; }
        }
      `}</style>
    </div>
  )
}