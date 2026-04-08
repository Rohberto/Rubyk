'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface GuideConfig {
  badge:        string
  headline:     string
  subheadline:  string
  highlights:   string[]
  download_url: string
  cover_image:  string
  form_heading: string
  cta_label:    string
  disclaimer:   string
}

const empty: GuideConfig = {
  badge:        'Free resource',
  headline:     '',
  subheadline:  '',
  highlights:   ['', '', '', '', ''],
  download_url: '',
  cover_image:  '',
  form_heading: 'Get your free copy',
  cta_label:    'Send me the guide',
  disclaimer:   'No spam. Just the guide, straight to your inbox.',
}

export default function AdminGuide() {
  const [config,  setConfig]  = useState<GuideConfig>(empty)
  const [status,  setStatus]  = useState<'idle'|'loading'|'saving'|'saved'|'error'>('loading')
  const [errMsg,  setErrMsg]  = useState('')

  useEffect(() => {
    fetch('/api/admin/guide')
      .then(r => r.json())
      .then(({ config: c }) => {
        if (c) setConfig({
          ...c,
          highlights: Array.isArray(c.highlights) && c.highlights.length > 0
            ? c.highlights
            : ['', '', '', '', ''],
        })
        setStatus('idle')
      })
      .catch(() => setStatus('idle'))
  }, [])

  const save = async () => {
    setStatus('saving'); setErrMsg('')
    const payload = { ...config, highlights: config.highlights.filter(h => h.trim()) }
    const res  = await fetch('/api/admin/guide', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) { setErrMsg(data.error ?? 'Save failed.'); setStatus('error') }
    else { setStatus('saved'); setTimeout(() => setStatus('idle'), 2500) }
  }

  const setHighlight = (i: number, val: string) => {
    const h = [...config.highlights]
    h[i] = val
    setConfig(c => ({ ...c, highlights: h }))
  }

  const addHighlight = () =>
    setConfig(c => ({ ...c, highlights: [...c.highlights, ''] }))

  const removeHighlight = (i: number) =>
    setConfig(c => ({ ...c, highlights: c.highlights.filter((_, idx) => idx !== i) }))

  const inp: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
    padding: '11px 14px', fontSize: 14, color: '#fff', outline: 'none',
    fontFamily: 'var(--font-outfit), system-ui, sans-serif',
    transition: 'border-color 0.2s',
  }
  const lbl: React.CSSProperties = {
    fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 6, display: 'block',
  }
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'var(--orange)')
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')

  if (status === 'loading') return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>Loading guide config…</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
        padding: '14px clamp(16px, 3vw, 32px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: '#130c03', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/admin/blog" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
            ← Back
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Guide Editor</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {status === 'saved' && <span style={{ fontSize: 13, color: '#1abc9c' }}>Saved ✓</span>}
          {status === 'error' && <span style={{ fontSize: 13, color: '#e74c3c' }}>{errMsg}</span>}
          <a href="/guide" target="_blank" rel="noopener noreferrer" style={{
            fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '7px 14px',
          }}>Preview ↗</a>
          <button onClick={save} disabled={status === 'saving'} style={{
            background: status === 'saving' ? 'rgba(232,99,42,0.5)' : 'var(--orange)',
            color: '#fff', border: 'none', borderRadius: 7, padding: '8px 20px',
            fontSize: 13, fontWeight: 500, cursor: status === 'saving' ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-outfit), system-ui, sans-serif',
          }}>
            {status === 'saving' ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div style={{
        maxWidth: 720, margin: '0 auto',
        padding: 'clamp(32px, 4vw, 56px) clamp(20px, 4vw, 48px)',
        display: 'flex', flexDirection: 'column', gap: 28,
      }}>

        <div style={{
          background: 'rgba(232,99,42,0.08)', border: '1px solid rgba(232,99,42,0.2)',
          borderRadius: 12, padding: '14px 18px',
          fontSize: 13, color: 'rgba(232,99,42,0.8)', lineHeight: 1.6,
        }}>
          Changes go live on <strong style={{ color: 'var(--orange-light)' }}>rubyk.co/guide</strong> within 60 seconds of saving.
        </div>

        {/* Headline */}
        <div>
          <span style={lbl}>Main headline</span>
          <input style={inp} value={config.headline}
            onChange={e => setConfig(c => ({ ...c, headline: e.target.value }))}
            placeholder="The African Founder's Guide to Storytelling That Converts"
            onFocus={focus} onBlur={blur} />
        </div>

        {/* Subheadline */}
        <div>
          <span style={lbl}>Subheadline</span>
          <textarea
            value={config.subheadline}
            onChange={e => setConfig(c => ({ ...c, subheadline: e.target.value }))}
            placeholder="A practical guide to building narratives..."
            onFocus={focus} onBlur={blur}
            style={{ ...inp, resize: 'vertical', minHeight: 80, lineHeight: 1.6 } as React.CSSProperties}
          />
        </div>

        {/* Highlights */}
        <div>
          <span style={lbl}>Bullet points (what's inside)</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {config.highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(232,99,42,0.15)', border: '1px solid rgba(232,99,42,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 600, color: 'var(--orange)',
                }}>{i + 1}</span>
                <input
                  style={{ ...inp, flex: 1 }}
                  value={h}
                  onChange={e => setHighlight(i, e.target.value)}
                  placeholder={`Bullet point ${i + 1}`}
                  onFocus={focus} onBlur={blur}
                />
                <button onClick={() => removeHighlight(i)} style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)',
                  cursor: 'pointer', fontSize: 18, padding: '0 4px', lineHeight: 1,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#e74c3c')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
                >×</button>
              </div>
            ))}
            <button onClick={addHighlight} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.12)',
              borderRadius: 8, padding: '9px', color: 'rgba(255,255,255,0.35)',
              fontSize: 13, cursor: 'pointer', width: '100%',
              fontFamily: 'var(--font-outfit), system-ui, sans-serif', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,99,42,0.3)'; e.currentTarget.style.color = 'var(--orange)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
            >+ Add bullet point</button>
          </div>
        </div>

        {/* Download URL */}
        <div>
          <span style={lbl}>PDF / Download URL</span>
          <input style={inp} value={config.download_url}
            onChange={e => setConfig(c => ({ ...c, download_url: e.target.value }))}
            placeholder="https://drive.google.com/uc?export=view&id=..."
            onFocus={focus} onBlur={blur} />
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 5 }}>
            Google Drive, Dropbox, or any public URL. This is what gets emailed to subscribers.
          </p>
        </div>

        {/* Cover image */}
        <div>
          <span style={lbl}>Cover image URL</span>
          <input style={inp} value={config.cover_image}
            onChange={e => setConfig(c => ({ ...c, cover_image: e.target.value }))}
            placeholder="https://... or /guide-cover.png"
            onFocus={focus} onBlur={blur} />
          {config.cover_image && (
            <img src={config.cover_image} alt="Cover preview"
              style={{ marginTop: 10, maxWidth: 180, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
          )}
        </div>

        {/* Form heading */}
        <div>
          <span style={lbl}>Form heading</span>
          <input style={inp} value={config.form_heading}
            onChange={e => setConfig(c => ({ ...c, form_heading: e.target.value }))}
            placeholder="Get your free copy"
            onFocus={focus} onBlur={blur} />
        </div>

        {/* CTA label */}
        <div>
          <span style={lbl}>Button label</span>
          <input style={inp} value={config.cta_label}
            onChange={e => setConfig(c => ({ ...c, cta_label: e.target.value }))}
            placeholder="Send me the guide"
            onFocus={focus} onBlur={blur} />
        </div>

        {/* Disclaimer */}
        <div>
          <span style={lbl}>Disclaimer text (below button)</span>
          <input style={inp} value={config.disclaimer}
            onChange={e => setConfig(c => ({ ...c, disclaimer: e.target.value }))}
            placeholder="No spam. Just the guide, straight to your inbox."
            onFocus={focus} onBlur={blur} />
        </div>

        {/* Badge */}
        <div>
          <span style={lbl}>Badge label (top of hero)</span>
          <input style={inp} value={config.badge}
            onChange={e => setConfig(c => ({ ...c, badge: e.target.value }))}
            placeholder="Free resource"
            onFocus={focus} onBlur={blur} />
        </div>

        <button onClick={save} disabled={status === 'saving'} style={{
          background: status === 'saving' ? 'rgba(232,99,42,0.5)' : 'var(--orange)',
          color: '#fff', border: 'none', borderRadius: 8, padding: '14px',
          fontSize: 15, fontWeight: 500, cursor: status === 'saving' ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-outfit), system-ui, sans-serif', width: '100%',
          transition: 'background 0.2s',
        }}>
          {status === 'saving' ? 'Saving…' : 'Save all changes'}
        </button>
      </div>
    </div>
  )
}