'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionLabel from './ui/SectionLabel'
import { formatDate, type SubstackPost } from '@/lib/substack'
import { SUBSTACK_HANDLE } from '@/data/content'

export default function SubstackClient({ posts }: { posts: SubstackPost[] }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [email,   setEmail]   = useState('')
  const [focused, setFocused] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    window.open(
      `https://${SUBSTACK_HANDLE}.substack.com/subscribe?email=${encodeURIComponent(email)}`,
      '_blank', 'noopener noreferrer',
    )
    setEmail('')
  }

  return (
    <section ref={ref} style={{
      padding: 'clamp(64px, 8vw, 120px) clamp(20px, 7vw, 96px)',
      background: 'var(--warm)', borderTop: '1px solid rgba(61,46,30,0.07)',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        flexWrap: 'wrap', gap: 16, marginBottom: 48,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel>From the newsletter</SectionLabel>
          <h2 style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(28px, 3.5vw, 50px)', fontWeight: 600,
            color: 'var(--dark)', letterSpacing: '-1px', lineHeight: 1.12, maxWidth: 520,
          }}>
            Thinking out loud on African business & storytelling
          </h2>
        </motion.div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          href={`https://${SUBSTACK_HANDLE}.substack.com`}
          target="_blank" rel="noopener noreferrer"
          style={{
            fontSize: 13, color: 'var(--orange)', textDecoration: 'none',
            borderBottom: '1px solid rgba(232,99,42,0.35)', paddingBottom: 2, whiteSpace: 'nowrap',
          }}
        >
          All posts →
        </motion.a>
      </div>

      {/* Article cards */}
      {posts.length > 0 && (
        <div className="grid-3" style={{ marginBottom: 48 }}>
          {posts.map((post, i) => (
            <motion.a
              key={post.link}
              href={post.link} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 44 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              style={{
                display: 'flex', flexDirection: 'column',
                background: '#fff', border: '1px solid rgba(61,46,30,0.08)',
                borderRadius: 16, padding: 'clamp(20px, 3vw, 28px)',
                textDecoration: 'none', cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(61,46,30,0.04)',
              }}
            >
              <div style={{
                fontSize: 11, fontWeight: 500, textTransform: 'uppercase',
                letterSpacing: '1.4px', color: 'var(--orange)', marginBottom: 12,
              }}>{formatDate(post.pubDate)}</div>
              <h3 style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(17px, 2vw, 20px)', fontWeight: 600,
                color: 'var(--dark)', lineHeight: 1.3, marginBottom: 10, flexGrow: 1,
              }}>{post.title}</h3>
              {post.description && (
                <p style={{
                  fontSize: 13, fontWeight: 300, color: 'var(--muted-text)',
                  lineHeight: 1.7, marginBottom: 18,
                }}>{post.description}</p>
              )}
              <div style={{ fontSize: 13, color: 'var(--orange)', fontWeight: 400, marginTop: 'auto' }}>
                Read on Substack →
              </div>
            </motion.a>
          ))}
        </div>
      )}

      {/* Subscribe form */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        className="subscribe-row"
        style={{
          background: '#fff', border: '1px solid rgba(61,46,30,0.10)',
          borderRadius: 20, padding: 'clamp(24px, 4vw, 48px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 24,
          boxShadow: '0 4px 24px rgba(61,46,30,0.05)',
        }}
      >
        <div>
          <h3 style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(20px, 2.5vw, 30px)', fontWeight: 600,
            color: 'var(--dark)', letterSpacing: '-0.5px', marginBottom: 6,
          }}>
            Get the next one in your inbox
          </h3>
          <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--muted-text)' }}>
            Strategy notes, story frameworks, and founder resources — no noise.
          </p>
        </div>

        <form
          onSubmit={handleSubscribe}
          className="subscribe-form"
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}
        >
          <div style={{
            position: 'relative',
            border: `1.5px solid ${focused ? 'var(--orange)' : 'rgba(61,46,30,0.14)'}`,
            borderRadius: 8, overflow: 'hidden', transition: 'border-color 0.2s',
            background: 'var(--cream)',
          }}>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="your@email.com" required
              style={{
                outline: 'none', border: 'none', background: 'transparent',
                padding: '11px 16px', fontSize: 14, color: 'var(--dark)',
                width: 'clamp(180px, 22vw, 240px)',
                fontFamily: 'var(--font-outfit), system-ui, sans-serif',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              background: 'var(--orange)', color: '#fff', border: 'none',
              borderRadius: 8, padding: '11px 22px', fontSize: 14, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'var(--font-outfit), system-ui, sans-serif',
              transition: 'background 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--dark)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--orange)')}
          >
            Subscribe on Substack
          </button>
        </form>
      </motion.div>
    </section>
  )
}