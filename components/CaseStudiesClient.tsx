'use client'

import { useState, useEffect } from 'react'
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
  const [activeIdx,   setActiveIdx]   = useState<number | null>(null)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [isMobile,    setIsMobile]    = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const toggleExpand = (i: number) => {
    setExpandedIdx(prev => prev === i ? null : i)
  }

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
          Every founder's story is different. Here's how we've helped a few of them shine through...
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
            {items.map((c, i) => {
              const isActive   = activeIdx === i
              const isExpanded = expandedIdx === i

              /* ── MOBILE: accordion card ── */
              if (isMobile) return (
                <div
                  key={c.slug}
                  style={{
                    position:    'relative',
                    border:      isExpanded ? '1px solid rgba(232,99,42,0.35)' : '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 16,
                    overflow:    'hidden',
                    background:  isExpanded ? 'rgba(232,99,42,0.04)' : 'transparent',
                    transition:  'border-color 0.35s ease, background 0.35s ease',
                  }}
                >
                  {/* Left orange bar when expanded */}
                  <div style={{
                    position:        'absolute',
                    left:            0, top: 16, bottom: 16,
                    width:           3,
                    background:      'var(--orange)',
                    borderRadius:    '0 2px 2px 0',
                    transform:       isExpanded ? 'scaleY(1)' : 'scaleY(0)',
                    transformOrigin: 'top',
                    transition:      'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                  }} />

                  {/* Top gradient line */}
                  <div style={{
                    position:   'absolute',
                    top: 0, left: 0, right: 0, height: 1,
                    background: 'linear-gradient(90deg, transparent, var(--orange), transparent)',
                    opacity:    isExpanded ? 1 : 0,
                    transition: 'opacity 0.35s ease',
                  }} />

                  {/* Header row — always visible, click to toggle */}
                  <button
                    onClick={() => toggleExpand(i)}
                    style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'space-between',
                      width:          '100%',
                      padding:        '18px 20px',
                      background:     'none',
                      border:         'none',
                      cursor:         'pointer',
                      textAlign:      'left',
                      gap:            12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                      <span style={{
                        fontFamily: 'var(--font-cormorant), Georgia, serif',
                        fontSize:   28, fontWeight: 600,
                        color:      isExpanded ? 'var(--orange)' : 'rgba(232,99,42,0.25)',
                        lineHeight: 1, flexShrink: 0,
                        transition: 'color 0.3s ease',
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <div style={{
                          fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.5px',
                          color: 'rgba(232,99,42,0.65)', fontWeight: 500, marginBottom: 3,
                        }}>
                          {c.cat}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-cormorant), Georgia, serif',
                          fontSize: 17, fontWeight: 600,
                          color: isExpanded ? '#fff' : 'var(--cream)',
                          lineHeight: 1.28, transition: 'color 0.25s ease',
                        }}>
                          {c.title}
                        </div>
                      </div>
                    </div>

                    {/* Chevron */}
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      border:     isExpanded ? '1px solid var(--orange)' : '1px solid rgba(255,255,255,0.1)',
                      background: isExpanded ? 'var(--orange)' : 'transparent',
                      display:    'flex', alignItems: 'center', justifyContent: 'center',
                      color:      isExpanded ? '#fff' : 'rgba(253,250,246,0.35)',
                      fontSize:   11,
                      transform:  isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'all 0.3s ease',
                    }}>
                      ↓
                    </div>
                  </button>

                  {/* Expandable body */}
                  <div style={{
                    maxHeight:  isExpanded ? 300 : 0,
                    overflow:   'hidden',
                    transition: 'max-height 0.45s cubic-bezier(0.16,1,0.3,1)',
                  }}>
                    <div style={{
                      padding:   '0 20px 20px',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <p style={{
                        fontSize: 13, fontWeight: 300,
                        color: 'rgba(253,250,246,0.42)', lineHeight: 1.7,
                        margin: '14px 0 12px',
                      }}>
                        {c.desc}
                      </p>
                      <div style={{
                        display: 'flex', alignItems: 'flex-start', gap: 8,
                        fontSize: 12, color: 'rgba(253,250,246,0.62)', marginBottom: 16,
                      }}>
                        <span style={{
                          width: 6, height: 6, background: 'var(--orange)', borderRadius: '50%',
                          flexShrink: 0, marginTop: 4, display: 'inline-block',
                        }} />
                        {c.result}
                      </div>
                      <Link href={`/blog/${c.slug}`} style={{
                        display:        'inline-flex',
                        alignItems:     'center',
                        gap:            6,
                        fontSize:       13,
                        color:          'var(--orange)',
                        textDecoration: 'none',
                        fontWeight:     500,
                        borderBottom:   '1px solid rgba(232,99,42,0.3)',
                        paddingBottom:  2,
                      }}>
                        Read full article →
                      </Link>
                    </div>
                  </div>
                </div>
              )

              /* ── DESKTOP: existing hover row ── */
              return (
                <Link
                  key={c.slug}
                  href={`/blog/${c.slug}`}
                  style={{
                    position:   'relative',
                    border:     isActive ? '1px solid rgba(232,99,42,0.35)' : '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 16,
                    padding:    'clamp(20px,2.5vw,28px) clamp(20px,3vw,32px)',
                    cursor:     'pointer',
                    display:    'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap:        0,
                    textDecoration: 'none',
                    background: isActive ? 'rgba(232,99,42,0.04)' : 'transparent',
                    transform:  isActive ? 'translateX(6px)' : 'translateX(0)',
                    transition: 'border-color 0.35s ease, background 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                >
                  {/* Number */}
                  <div style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: 'clamp(32px,3vw,40px)', fontWeight: 600,
                    color: isActive ? 'var(--orange)' : 'rgba(232,99,42,0.2)',
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
                    }}>{c.cat}</div>
                    <div style={{
                      fontFamily: 'var(--font-cormorant), Georgia, serif',
                      fontSize: 'clamp(17px,1.8vw,21px)', fontWeight: 600,
                      color: isActive ? '#fff' : 'var(--cream)',
                      lineHeight: 1.28, transition: 'color 0.25s ease',
                    }}>{c.title}</div>
                    <div style={{
                      fontSize: 13, fontWeight: 300, color: 'rgba(253,250,246,0.42)',
                      lineHeight: 1.7, marginTop: 8,
                    }}>{c.desc}</div>
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
                      border:     isActive ? '1px solid var(--orange)' : '1px solid rgba(255,255,255,0.1)',
                      background: isActive ? 'var(--orange)' : 'transparent',
                      color:      isActive ? '#fff' : 'rgba(253,250,246,0.35)',
                      fontSize:   13,
                      transform:  isActive ? 'translateX(3px)' : 'translateX(0)',
                      transition: 'background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
                    }}>→</div>
                  </div>
                </Link>
              )
            })}
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