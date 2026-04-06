'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SectionLabel from './ui/SectionLabel'
import { caseStudies } from '@/data/content'

const STYLES = `
  .cs-cards {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .cs-card {
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
    .cs-card {
      grid-template-columns: 100px 1fr auto;
      align-items: center;
      gap: 0;
    }
  }

  .cs-card:hover, .cs-card.cs-active {
    border-color: rgba(232,99,42,0.35);
    background: rgba(232,99,42,0.04);
    transform: translateX(6px);
  }

  .cs-card::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--orange), transparent);
    opacity: 0;
    transform: scaleX(0.4);
    transition: opacity 0.35s ease, transform 0.45s ease;
  }
  .cs-card:hover::before, .cs-card.cs-active::before {
    opacity: 1;
    transform: scaleX(1);
  }

  .cs-card::after {
    content: "";
    position: absolute;
    left: 0; top: 16px; bottom: 16px;
    width: 3px;
    background: var(--orange);
    border-radius: 0 2px 2px 0;
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .cs-card:hover::after, .cs-card.cs-active::after {
    transform: scaleY(1);
  }

  .cs-num {
    font-family: var(--font-cormorant), Georgia, serif;
    font-size: clamp(32px, 3vw, 40px);
    font-weight: 600;
    color: rgba(232,99,42,0.2);
    line-height: 1;
    transition: color 0.3s ease;
  }
  .cs-card:hover .cs-num, .cs-card.cs-active .cs-num { color: var(--orange); }

  @media (min-width: 1024px) {
    .cs-num  { padding-right: 28px; }
    .cs-body { padding: 0 32px; border-left: 1px solid rgba(255,255,255,0.06); }
    .cs-meta { padding-left: 28px; border-left: 1px solid rgba(255,255,255,0.06); text-align: right; }
  }

  .cs-cat {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: rgba(232,99,42,0.65);
    font-weight: 500;
    margin-bottom: 6px;
  }

  .cs-title {
    font-family: var(--font-cormorant), Georgia, serif;
    font-size: clamp(17px, 1.8vw, 21px);
    font-weight: 600;
    color: var(--cream);
    line-height: 1.28;
    transition: color 0.25s ease;
  }
  .cs-card:hover .cs-title { color: #fff; }

  .cs-desc {
    font-size: 13px;
    font-weight: 300;
    color: rgba(253,250,246,0.42);
    line-height: 1.7;
    max-height: 0;
    overflow: hidden;
    margin-top: 0;
    opacity: 0;
    transition: max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease, margin-top 0.3s ease;
  }
  .cs-card:hover .cs-desc, .cs-card.cs-active .cs-desc {
    max-height: 120px;
    opacity: 1;
    margin-top: 8px;
  }

  .cs-result {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 12px;
    color: rgba(253,250,246,0.62);
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    margin-top: 0;
    transition: max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease, margin-top 0.3s ease;
  }
  .cs-card:hover .cs-result, .cs-card.cs-active .cs-result {
    max-height: 60px;
    opacity: 1;
    margin-top: 10px;
  }

  .cs-dot {
    width: 6px; height: 6px;
    background: var(--orange);
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 3px;
    display: inline-block;
  }

  .cs-date {
    font-size: 11px;
    color: rgba(253,250,246,0.32);
    margin-bottom: 4px;
    white-space: nowrap;
  }

  .cs-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px; height: 30px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(253,250,246,0.35);
    font-size: 13px;
    transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
  }
  .cs-card:hover .cs-arrow {
    background: var(--orange);
    border-color: var(--orange);
    color: #fff;
    transform: translateX(3px);
  }
`

export default function CaseStudies() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const cardsRef    = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  useEffect(() => {
    let ctx: any
    ;(async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Set initial states
        gsap.set(headerRef.current, { opacity: 0, y: 32 })
        const cards = cardsRef.current?.querySelectorAll('.cs-card')
        if (cards?.length) gsap.set(cards, { opacity: 0, y: 56 })

        // Animate header
        gsap.to(headerRef.current, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 65%', once: true },
        })

        // Animate cards
        if (cards?.length) {
          gsap.to(cards, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.13,
            scrollTrigger: { trigger: cardsRef.current, start: 'top 65%', once: true },
          })
        }
      }, sectionRef)
    })()

    return () => ctx?.revert()
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <section id="work" ref={sectionRef} style={{
        padding: 'clamp(64px, 8vw, 120px) clamp(20px, 7vw, 96px)',
        background: 'var(--dark)',
      }}>

        {/* Header */}
        <div
          ref={headerRef}
          className="grid-2 case-header"
          style={{ alignItems: 'end', marginBottom: 52 }}
        >
          <div>
            <SectionLabel light>Case studies</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(30px, 3.5vw, 54px)', fontWeight: 600,
              color: 'var(--cream)', letterSpacing: '-1px', lineHeight: 1.12,
            }}>
              Stories we've helped tell
            </h2>
          </div>
          <p style={{
            fontSize: 16, fontWeight: 300,
            color: 'rgba(253,250,246,0.48)', lineHeight: 1.8,
          }}>
            Every founder's story is different. Here's a sample of what we build — and what it unlocks.
          </p>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="cs-cards">
          {caseStudies.map((c, i) => (
            <div
              key={c.title}
              className={`cs-card${activeIdx === i ? ' cs-active' : ''}`}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              {/* Number */}
              <div className="cs-num">{String(i + 1).padStart(2, '0')}</div>

              {/* Body */}
              <div className="cs-body">
                <div className="cs-cat">{c.cat}</div>
                <div className="cs-title">{c.title}</div>
                <div className="cs-desc">{c.desc}</div>
                <div className="cs-result">
                  <span className="cs-dot" />
                  {c.result}
                </div>
              </div>

              {/* Meta */}
              <div className="cs-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div className="cs-arrow">→</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}