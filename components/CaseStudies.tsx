'use client'

import { useRef, useEffect, useState } from 'react'
import SectionLabel from './ui/SectionLabel'

interface Post {
  title: string
  link: string
  desc: string
  date: string
  category: string
  readTime: string
}

function stripHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function getCDATA(xml: string, tag: string): string {
  // Escapes the colon in tags like content:encoded
  const escaped = tag.replace(':', '\\:')
  const re = new RegExp(
    `<${escaped}[^>]*>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*<\\/${escaped}>`,
    'i'
  )
  const match = xml.match(re)
  return match ? match[1].trim() : ''
}

function parseRSS(xmlString: string): Post[] {
  const itemMatches = xmlString.match(/<item>([\s\S]*?)<\/item>/g) ?? []

  return itemMatches.slice(0, 4).map((itemXml) => {
    const title    = stripHTML(getCDATA(itemXml, 'title')) || 'Untitled'
    const link     = getCDATA(itemXml, 'link') || '#'
    const pubDate  = getCDATA(itemXml, 'pubDate')
    const category = stripHTML(getCDATA(itemXml, 'category')) || 'Insight'

    // content:encoded has the full post HTML — colon must be escaped in regex
    const rawContent =
      getCDATA(itemXml, 'content:encoded') ||
      getCDATA(itemXml, 'description') ||
      ''

    const plain    = stripHTML(rawContent)
    const desc     = plain.slice(0, 180).trimEnd() + '…'
    const words    = plain.split(/\s+/).filter(Boolean).length
    const readTime = `${Math.max(1, Math.round(words / 200))} min read`

    const date = pubDate
      ? new Date(pubDate).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        })
      : ''

    return { title, link, desc, date, category, readTime }
  })
}

export default function CaseStudies() {
  const sectionRef    = useRef<HTMLElement>(null)
  const headerRef     = useRef<HTMLDivElement>(null)
  const cardsRef      = useRef<HTMLDivElement>(null)

  // Start as null — we never render posts on the server
  const [posts, setPosts]         = useState<Post[] | null>(null)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  // Fetch only runs client-side
  useEffect(() => {
    fetch('/api/substack')
      .then(r => {
        if (!r.ok) throw new Error(`${r.status}`)
        return r.text()
      })
      .then(xml => setPosts(parseRSS(xml)))
      .catch(() => setPosts([]))
  }, [])

  // GSAP — runs after posts are set
  useEffect(() => {
    if (posts === null) return
    let ctx: any
    ;(async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
          }
        )
        const cards = cardsRef.current?.querySelectorAll('.cs-card')
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 56 },
            {
              opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
              stagger: 0.13,
              scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', once: true },
            }
          )
        }
      }, sectionRef)
    })()

    return () => ctx?.revert()
  }, [posts])

  const loading  = posts === null
  const skeletons = Array.from({ length: 4 })

  return (
    <>
      <style>{`
        .case-header-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: end;
          margin-bottom: 52px;
        }
        @media (min-width: 1024px) {
          .case-header-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
        }

        .cs-cards { display: flex; flex-direction: column; gap: 14px; }

        .cs-card {
          opacity: 0;
          position: relative;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: clamp(20px, 2.5vw, 28px) clamp(20px, 3vw, 32px);
          cursor: pointer;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          text-decoration: none;
          transition: border-color 0.35s ease, background 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        @media (min-width: 1024px) {
          .cs-card { grid-template-columns: 100px 1fr auto; align-items: center; gap: 0; }
        }

        .cs-card:hover, .cs-card.active {
          border-color: rgba(232,99,42,0.35);
          background: rgba(232,99,42,0.04);
          transform: translateX(6px);
        }
        .cs-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--orange), transparent);
          opacity: 0; transform: scaleX(0.4);
          transition: opacity 0.35s ease, transform 0.45s ease;
        }
        .cs-card:hover::before, .cs-card.active::before { opacity: 1; transform: scaleX(1); }
        .cs-card::after {
          content: '';
          position: absolute; left: 0; top: 16px; bottom: 16px; width: 3px;
          background: var(--orange); border-radius: 0 2px 2px 0;
          transform: scaleY(0); transform-origin: top;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .cs-card:hover::after, .cs-card.active::after { transform: scaleY(1); }

        .cs-num {
          font-family: var(--font-cormorant), Georgia, serif;
          font-size: clamp(32px, 3vw, 40px); font-weight: 600;
          color: rgba(232,99,42,0.2); line-height: 1;
          transition: color 0.3s ease;
        }
        .cs-card:hover .cs-num, .cs-card.active .cs-num { color: var(--orange); }

        @media (min-width: 1024px) {
          .cs-num  { padding-right: 28px; }
          .cs-body { padding: 0 32px; border-left: 1px solid rgba(255,255,255,0.06); }
          .cs-meta { padding-left: 28px; border-left: 1px solid rgba(255,255,255,0.06); text-align: right; }
        }

        .cs-cat {
          font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px;
          color: rgba(232,99,42,0.65); font-weight: 500; margin-bottom: 6px;
        }
        .cs-title {
          font-family: var(--font-cormorant), Georgia, serif;
          font-size: clamp(17px, 1.8vw, 21px); font-weight: 600;
          color: var(--cream); line-height: 1.28;
          transition: color 0.25s ease;
        }
        .cs-card:hover .cs-title { color: #fff; }
        .cs-desc {
          font-size: 13px; font-weight: 300;
          color: rgba(253,250,246,0.42); line-height: 1.7;
          max-height: 0; overflow: hidden; margin-top: 0; opacity: 0;
          transition: max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease, margin-top 0.3s ease;
        }
        .cs-card:hover .cs-desc, .cs-card.active .cs-desc {
          max-height: 100px; opacity: 1; margin-top: 8px;
        }

        .cs-date { font-size: 11px; color: rgba(253,250,246,0.32); margin-bottom: 4px; white-space: nowrap; }
        .cs-read { font-size: 11px; color: rgba(232,99,42,0.65); font-weight: 500; white-space: nowrap; margin-bottom: 10px; }
        .cs-arrow {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(253,250,246,0.35); font-size: 13px;
          transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
        }
        .cs-card:hover .cs-arrow {
          background: var(--orange); border-color: var(--orange); color: #fff; transform: translateX(3px);
        }

        .cs-skel {
          border: 1px solid rgba(255,255,255,0.05); border-radius: 16px;
          padding: 24px 32px; display: flex; gap: 24px; align-items: center;
        }
        .skel-block {
          background: rgba(255,255,255,0.06); border-radius: 6px;
          animation: skelPulse 1.4s ease-in-out infinite;
        }
        @keyframes skelPulse { 0%,100% { opacity: 0.3 } 50% { opacity: 0.7 } }
      `}</style>

      <section id="work" ref={sectionRef} style={{
        padding: 'clamp(64px, 8vw, 120px) clamp(20px, 7vw, 96px)',
        background: 'var(--dark)',
      }}>
        <div ref={headerRef} className="case-header-grid" style={{ opacity: 0 }}>
          <div>
            <SectionLabel light>From the journal</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(30px, 3.5vw, 54px)', fontWeight: 600,
              color: 'var(--cream)', letterSpacing: '-1px', lineHeight: 1.12,
            }}>
              Stories we've helped tell
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
            <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(253,250,246,0.48)', lineHeight: 1.8, margin: 0 }}>
              Every founder's story is different. Here's a sample of what we build — and what it unlocks.
            </p>
            <a
              href="https://rubykco.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 13, fontWeight: 500, color: 'var(--orange)',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                borderBottom: '1px solid rgba(232,99,42,0.3)', paddingBottom: 2,
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--orange)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(232,99,42,0.3)')}
            >
              Read all on Substack →
            </a>
          </div>
        </div>

        <div ref={cardsRef} className="cs-cards">
          {loading
            ? skeletons.map((_, i) => (
                <div key={i} className="cs-skel">
                  <div className="skel-block" style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 8 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skel-block" style={{ height: 11, width: '55%' }} />
                    <div className="skel-block" style={{ height: 10, width: '85%' }} />
                    <div className="skel-block" style={{ height: 10, width: '70%' }} />
                  </div>
                </div>
              ))
            : posts!.length === 0
            ? (
                <p style={{ color: 'rgba(253,250,246,0.4)', fontSize: 14 }}>
                  Couldn't load posts right now.{' '}
                  <a href="https://rubykco.substack.com" target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--orange)' }}>
                    Visit Substack directly →
                  </a>
                </p>
              )
            : posts!.map((post, i) => (
                <a
                  key={post.link}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`cs-card${activeIdx === i ? ' active' : ''}`}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                >
                  <div className="cs-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="cs-body">
                    <div className="cs-cat">{post.category}</div>
                    <div className="cs-title">{post.title}</div>
                    <div className="cs-desc">{post.desc}</div>
                  </div>
                  <div className="cs-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div className="cs-date">{post.date}</div>
                    <div className="cs-read">{post.readTime}</div>
                    <div className="cs-arrow">→</div>
                  </div>
                </a>
              ))
          }
        </div>
      </section>
    </>
  )
}