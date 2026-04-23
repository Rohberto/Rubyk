'use client'

import { useState } from 'react'
import Link from 'next/link'
import SectionLabel from './ui/SectionLabel'

interface CaseItem {
  slug:   string
  cat:    string
  title:  string
  desc:   string
  result: string
}

export default function CaseStudiesClient({ items }: { items: CaseItem[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  return (
    <section id="work" style={{
      padding: 'clamp(64px, 8vw, 120px) clamp(20px, 7vw, 96px)',
      background: 'var(--dark)',
    }}>
      {/* Header */}
      <div className="grid-2 case-header" style={{ alignItems: 'end', marginBottom: 52 }}>
        <div>
          <SectionLabel light>Case Studies</SectionLabel>
          <h2 style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(30px, 3.5vw, 54px)', fontWeight: 600,
            color: 'var(--cream)', letterSpacing: '-1px', lineHeight: 1.12,
          }}>
            Stories we've helped tell
          </h2>
        </div>
        <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(253,250,246,0.48)', lineHeight: 1.8 }}>
          Every founder's story is different. Here's how we've helped a few of them shine through.
        </p>
      </div>

      {/* Cards */}
      {items.length === 0 ? (
        <div style={{
          border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16,
          padding: '48px 32px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>
            No posts published yet — check back soon.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.map((c, i) => (
              <Link
                key={c.slug}
                href={`/blog/${c.slug}`}
                style={{
                  position: 'relative',
                  border: activeIdx === i ? '1px solid rgba(232,99,42,0.35)' : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  padding: 'clamp(20px,2.5vw,28px) clamp(20px,3vw,32px)',
                  cursor: 'pointer',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: 0,
                  textDecoration: 'none',
                  background: activeIdx === i ? 'rgba(232,99,42,0.04)' : 'transparent',
                  transform: activeIdx === i ? 'translateX(6px)' : 'translateX(0)',
                  transition: 'border-color 0.35s ease, background 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
                }}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {/* Number */}
                <div style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 'clamp(32px,3vw,40px)', fontWeight: 600,
                  color: activeIdx === i ? 'var(--orange)' : 'rgba(232,99,42,0.2)',
                  lineHeight: 1, paddingRight: 28, paddingTop: 4,
                  transition: 'color 0.3s ease',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Body */}
                <div style={{ padding: '0 32px', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{
                    fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.5px',
                    color: 'rgba(232,99,42,0.65)', fontWeight: 500, marginBottom: 6,
                  }}>
                    {c.cat}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: 'clamp(17px,1.8vw,21px)', fontWeight: 600,
                    color: activeIdx === i ? '#fff' : 'var(--cream)',
                    lineHeight: 1.28, transition: 'color 0.25s ease',
                  }}>
                    {c.title}
                  </div>
                  <div style={{
                    fontSize: 13, fontWeight: 300, color: 'rgba(253,250,246,0.42)',
                    lineHeight: 1.7, marginTop: 8,
                  }}>
                    {c.desc}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                    fontSize: 12, color: 'rgba(253,250,246,0.62)', marginTop: 10,
                  }}>
                    <span style={{
                      width: 6, height: 6, background: 'var(--orange)', borderRadius: '50%',
                      flexShrink: 0, marginTop: 5, display: 'inline-block',
                    }} />
                    {c.result}
                  </div>
                </div>

                {/* Arrow */}
                <div style={{
                  paddingLeft: 28, borderLeft: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingTop: 4,
                }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 30, height: 30, borderRadius: '50%',
                    border: activeIdx === i ? '1px solid var(--orange)' : '1px solid rgba(255,255,255,0.1)',
                    background: activeIdx === i ? 'var(--orange)' : 'transparent',
                    color: activeIdx === i ? '#fff' : 'rgba(253,250,246,0.35)',
                    fontSize: 13,
                    transform: activeIdx === i ? 'translateX(3px)' : 'translateX(0)',
                    transition: 'background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
                  }}>
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Link href="/blog" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 14, fontWeight: 400, color: 'rgba(253,250,246,0.45)',
            textDecoration: 'none', marginTop: 28,
            borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 2,
          }}>
            View all posts →
          </Link>
        </>
      )}
    </section>
  )
}