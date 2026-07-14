'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import SectionLabel from './ui/SectionLabel'
import MagneticButton from './ui/MagneticButton'
import { services } from '@/data/content'

const STYLES = `
  .services-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(40px, 6vw, 80px);
    align-items: start;
  }
  .services-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(14px, 2vw, 20px);
  }
  @media (min-width: 1024px) {
    .services-layout { grid-template-columns: 340px 1fr; }
    .services-cards  { grid-template-columns: 1fr 1fr; }
  }
  .svc-card::after {
    content: "";
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: var(--orange);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .svc-card:hover::after { transform: scaleX(1); }
`

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const cardsRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any
    ;(async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.set(leftRef.current, { opacity: 0, y: 36 })
        const cards = cardsRef.current?.querySelectorAll('.svc-card')
        if (cards?.length) gsap.set(cards, { opacity: 0, y: 48 })

        gsap.to(leftRef.current, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: leftRef.current, start: 'top 65%', once: true },
        })

        if (cards?.length) {
          gsap.to(cards, {
            opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.1,
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

      <section id="services" ref={sectionRef} style={{
        padding: 'clamp(64px, 8vw, 120px) clamp(20px, 7vw, 96px)',
        background: 'var(--cream)',
      }}>
        <div className="services-layout">

          {/* Left column */}
          <div ref={leftRef}>
            <SectionLabel>What we do</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(30px, 3.5vw, 50px)', fontWeight: 600,
              color: 'var(--dark)', letterSpacing: '-1px', lineHeight: 1.12, marginBottom: 16,
            }}>
              Turning your ideas into stories that land
            </h2>
            <p style={{
              fontSize: 16, fontWeight: 300, color: 'var(--muted-text)',
              lineHeight: 1.8, marginBottom: 32,
            }}>
              We help founders find their voice and tell the story that gets them heard.
            </p>
            <MagneticButton href="/project">
              Not sure where to start? Let's talk →
            </MagneticButton>
          </div>

          {/* Cards */}
          <div ref={cardsRef} className="services-cards">
            {services.map((svc) => (
              <Link key={svc.num} href="/project" style={{ textDecoration: 'none' }}>
                <motion.div
                  className="svc-card"
                  whileHover={{ y: -5 }}
                  style={{
                    border: '1px solid rgba(61,46,30,0.10)', borderRadius: 16,
                    padding: 'clamp(20px, 3vw, 28px)', background: '#fff',
                    cursor: 'pointer', position: 'relative', overflow: 'hidden',
                    height: '100%',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: 'clamp(36px, 4vw, 44px)', fontWeight: 600,
                    color: 'var(--orange)', lineHeight: 1, marginBottom: 14, letterSpacing: '-1px',
                  }}>{svc.num}</div>
                  <h3 style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: 'clamp(17px, 2vw, 21px)', fontWeight: 600,
                    color: 'var(--dark)', marginBottom: 8, lineHeight: 1.3,
                  }}>{svc.title}</h3>
                  <p style={{
                    fontSize: 13, fontWeight: 300, color: 'var(--muted-text)',
                    lineHeight: 1.7, marginBottom: 16,
                  }}>{svc.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {svc.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: 11, color: 'var(--muted-text)', background: '#FAF3EB',
                        border: '1px solid rgba(61,46,30,0.10)', padding: '3px 9px', borderRadius: 20,
                      }}>{tag}</span>
                    ))}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}