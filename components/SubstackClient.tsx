'use client'

import { useRef, useEffect } from 'react'
import SectionLabel from './ui/SectionLabel'
import { formatDate, type SubstackPost } from '@/lib/substack'
import { SUBSTACK_HANDLE } from '@/data/content'

const STYLES = `
  .substack-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 48px;
  }
  @media (min-width: 1024px) {
    .substack-cards { grid-template-columns: repeat(3, 1fr); }
  }

  .substack-card {
    display: flex;
    flex-direction: column;
    background: #fff;
    border: 1px solid rgba(61,46,30,0.08);
    border-radius: 16px;
    padding: clamp(20px, 3vw, 28px);
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(61,46,30,0.04);
    position: relative;
    overflow: hidden;
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease, border-color 0.35s ease;
  }
  .substack-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 48px rgba(61,46,30,0.10);
    border-color: rgba(232,99,42,0.2);
  }
  .substack-card::after {
    content: "";
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: var(--orange);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .substack-card:hover::after { transform: scaleX(1); }

  .substack-card-title {
    font-family: var(--font-cormorant), Georgia, serif;
    font-size: clamp(17px, 2vw, 20px);
    font-weight: 600;
    color: var(--dark);
    line-height: 1.3;
    margin-bottom: 10px;
    flex-grow: 1;
    transition: color 0.25s ease;
  }
  .substack-card:hover .substack-card-title { color: var(--orange); }

  .substack-card-cta {
    font-size: 13px;
    color: var(--orange);
    font-weight: 400;
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: gap 0.2s ease;
  }
  .substack-card:hover .substack-card-cta { gap: 8px; }

  .subscribe-box {
    background: #fff;
    border: 1px solid rgba(61,46,30,0.10);
    border-radius: 20px;
    padding: clamp(24px, 4vw, 48px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 32px;
    box-shadow: 0 4px 24px rgba(61,46,30,0.05);
    transition: box-shadow 0.35s ease, border-color 0.35s ease;
  }
  .subscribe-box:hover {
    box-shadow: 0 8px 40px rgba(61,46,30,0.09);
    border-color: rgba(232,99,42,0.15);
  }

  /* strip Substack iframe default border and blend it in */
  .substack-embed {
    border: none !important;
    border-radius: 12px;
    flex-shrink: 0;
    max-width: 100%;
  }
`

export default function SubstackClient({ posts }: { posts: SubstackPost[] }) {
  const sectionRef   = useRef<HTMLElement>(null)
  const headerRef    = useRef<HTMLDivElement>(null)
  const cardsRef     = useRef<HTMLDivElement>(null)
  const subscribeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any
    ;(async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.set(headerRef.current, { opacity: 0, y: 28 })
        gsap.to(headerRef.current, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
        })

        const cards = cardsRef.current?.querySelectorAll('.substack-card')
        if (cards?.length) {
          gsap.set(cards, { opacity: 0, y: 44 })
          gsap.to(cards, {
            opacity: 1, y: 0, duration: 0.78, ease: 'power3.out', stagger: 0.12,
            scrollTrigger: { trigger: cardsRef.current, start: 'top 65%', once: true },
          })
        }

        gsap.set(subscribeRef.current, { opacity: 0, y: 32 })
        gsap.to(subscribeRef.current, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: subscribeRef.current, start: 'top 60%', once: true },
        })
      }, sectionRef)
    })()

    return () => ctx?.revert()
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <section ref={sectionRef} style={{
        padding: 'clamp(64px, 8vw, 120px) clamp(20px, 7vw, 96px)',
        background: 'var(--warm)',
        borderTop: '1px solid rgba(61,46,30,0.07)',
      }}>

        {/* Header */}
        <div ref={headerRef} style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 48,
        }}>
          <div>
            <SectionLabel>From the newsletter</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(28px, 3.5vw, 50px)', fontWeight: 600,
              color: 'var(--dark)', letterSpacing: '-1px', lineHeight: 1.12, maxWidth: 520,
            }}>
              Thinking out loud on African business & storytelling
            </h2>
          </div>
          <a
            href={`https://${SUBSTACK_HANDLE}.substack.com`}
            target="_blank" rel="noopener noreferrer"
            style={{
              fontSize: 13, color: 'var(--orange)', textDecoration: 'none',
              borderBottom: '1px solid rgba(232,99,42,0.35)', paddingBottom: 2,
              whiteSpace: 'nowrap', transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--orange)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(232,99,42,0.35)')}
          >
            All posts →
          </a>
        </div>

        {/* Article cards — only shown when posts exist */}
        {posts.length > 0 && (
          <div ref={cardsRef} className="substack-cards">
            {posts.map((post) => (
              <a
                key={post.link}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="substack-card"
              >
                <div style={{
                  fontSize: 11, fontWeight: 500, textTransform: 'uppercase',
                  letterSpacing: '1.4px', color: 'var(--orange)', marginBottom: 12,
                }}>{formatDate(post.pubDate)}</div>
                <h3 className="substack-card-title">{post.title}</h3>
                {post.description && (
                  <p style={{
                    fontSize: 13, fontWeight: 300, color: 'var(--muted-text)',
                    lineHeight: 1.7, marginBottom: 18,
                  }}>{post.description}</p>
                )}
                <div className="substack-card-cta">Read on Substack →</div>
              </a>
            ))}
          </div>
        )}

        {/* Subscribe box with official Substack embed */}
        <div ref={subscribeRef} className="subscribe-box">
          <div style={{ flex: 1, minWidth: 240 }}>
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

          {/* Official Substack embed — handles subscription natively */}
          <iframe
            src="https://rubykco.substack.com/embed"
            width="480"
            height="150"
            className="substack-embed"
            style={{ background: 'transparent' }}
            frameBorder={0}
            scrolling="no"
          />
        </div>
      </section>
    </>
  )
}