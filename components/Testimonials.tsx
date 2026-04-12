'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionLabel from './ui/SectionLabel'
import { testimonials } from '@/data/content'

const STYLES = `
  .testi-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  @media (min-width: 1024px) {
    .testi-cards {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .testi-card {
    background: #fff;
    border: 1px solid rgba(61,46,30,0.08);
    border-radius: 20px;
    padding: clamp(24px, 3vw, 36px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 2px 12px rgba(61,46,30,0.04);
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease;
  }
  .testi-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 22px 52px rgba(61,46,30,0.11);
    border-color: rgba(232,99,42,0.2);
  }

  /* orange fill from bottom on hover */
  .testi-card::after {
    content: "";
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: var(--orange);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
  }
  .testi-card:hover::after {
    transform: scaleX(1);
  }

  /* quote mark grows slightly */
  .testi-quote-mark {
    font-family: var(--font-cormorant), Georgia, serif;
    font-size: 52px;
    color: var(--orange);
    line-height: 0.85;
    margin-bottom: 18px;
    opacity: 0.7;
    display: inline-block;
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease;
  }
  .testi-card:hover .testi-quote-mark {
    transform: scale(1.15) translateY(-3px);
    opacity: 1;
  }

  /* blockquote colour shift */
  .testi-blockquote {
    font-family: var(--font-cormorant), Georgia, serif;
    font-size: clamp(15px, 1.8vw, 17px);
    font-style: italic;
    color: var(--dark);
    line-height: 1.78;
    margin-bottom: 28px;
    font-weight: 400;
    transition: color 0.3s ease;
  }
  .testi-card:hover .testi-blockquote {
    color: #1a1208;
  }

  /* avatar ring pulse */
  .testi-avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }
  .testi-avatar-wrap::before {
    content: "";
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 1.5px solid rgba(232,99,42,0);
    transition: border-color 0.35s ease, inset 0.35s ease;
  }
  .testi-card:hover .testi-avatar-wrap::before {
    border-color: rgba(232,99,42,0.45);
    inset: -5px;
  }

  .testi-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--dark);
    transition: color 0.25s ease;
  }
  .testi-card:hover .testi-name {
    color: var(--orange);
  }
`

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const cardsRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any
    ;(async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.set(headerRef.current, { opacity: 0, y: 28 })
        const cards = cardsRef.current?.querySelectorAll('.testi-card')
        if (cards?.length) gsap.set(cards, { opacity: 0, y: 44 })

        gsap.to(headerRef.current, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 65%', once: true },
        })

        if (cards?.length) {
          gsap.to(cards, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.14,
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

      <section ref={sectionRef} style={{
        padding: 'clamp(64px, 8vw, 120px) clamp(20px, 7vw, 96px)',
        background: 'var(--orange-pale)',
        borderTop: '1px solid rgba(232,99,42,0.12)',
        borderBottom: '1px solid rgba(232,99,42,0.12)',
      }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: 52 }}>
          <SectionLabel>What founders say</SectionLabel>
          <h2 style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(30px, 3.5vw, 54px)', fontWeight: 600,
            color: 'var(--dark)', letterSpacing: '-1px', lineHeight: 1.12,
          }}>
            The people we've worked with
          </h2>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="testi-cards">
          {testimonials.map((t, i) => (
            <div key={t.name} className="testi-card">
              <div>
                <div className="testi-quote-mark">"</div>
                <blockquote className="testi-blockquote">{t.quote}</blockquote>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="testi-avatar-wrap">
                 
                 
                  <div style={{
                    display: 'none', width: 52, height: 52, borderRadius: '50%',
                    background: 'var(--orange-pale)', border: '1px solid rgba(232,99,42,0.2)',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 600, color: 'var(--orange)',
                    fontFamily: 'var(--font-cormorant), Georgia, serif', flexShrink: 0,
                  }}>{t.initials}</div>
                </div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--muted-text)', marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}