'use client'

import { useRef, useEffect } from 'react'
import SectionLabel from './ui/SectionLabel'

const founders = [
  {
    initial: 'V', name: 'Victory', role: 'Narrative & Strategy',
    bio: "Content strategy, brand storytelling, and communications. Author of Nigeria's first report on the informal economy.",
    skills: ['Brand Messaging', 'Content Strategy', 'Communications'],
    dark: false,
  },
  {
    initial: 'A', name: 'Andrew', role: 'Strategy & Finance',
    bio: 'Programme management, strategy, and financial modelling — turning complex ideas into structured, executable plans.',
    skills: ['Financial Models', 'Programme Mgmt', 'Strategy'],
    dark: true,
  },
]

const STYLES = `
  .about-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(48px, 6vw, 80px);
    align-items: center;
  }
  @media (min-width: 1024px) {
    .about-layout {
      grid-template-columns: 1fr 1fr;
    }
  }

  /* Mobile: stacked cards */
  .founders-stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
  }

  /* Desktop: overlapping absolute layout */
  @media (min-width: 1024px) {
    .founders-stack {
      height: 520px;
      display: block;
    }
  }

  .founder-card {
    background: #fff;
    border: 1px solid rgba(61,46,30,0.10);
    border-radius: 20px;
    padding: 28px 28px 24px;
    box-shadow: 0 20px 52px rgba(61,46,30,0.07);
    position: relative;
    overflow: hidden;
    transition:
      transform 0.4s cubic-bezier(0.16,1,0.3,1),
      box-shadow 0.4s ease,
      border-color 0.35s ease;
  }
  @media (min-width: 1024px) {
    .founder-card {
      position: absolute;
      width: 76%;
    }
    .founder-card-0 {
      top: 0;
      left: 0;
    }
    .founder-card-1 {
      bottom: 0;
      right: 0;
    }
    .founder-card-0:hover { transform: translateY(-8px); }
    .founder-card-1:hover { transform: translateY(8px);  }
  }
  @media (max-width: 1023px) {
    .founder-card:hover { transform: translateY(-4px); }
  }

  .founder-card:hover {
    box-shadow: 0 28px 64px rgba(61,46,30,0.13);
    border-color: rgba(232,99,42,0.2);
  }

  .founder-card::after {
    content: "";
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: var(--orange);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .founder-card:hover::after { transform: scaleX(1); }

  .founder-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-cormorant), Georgia, serif;
    font-size: 20px; font-weight: 700;
    margin-bottom: 16px; flex-shrink: 0;
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease;
  }
  .founder-card:hover .founder-avatar {
    transform: scale(1.1);
    box-shadow: 0 0 0 6px rgba(232,99,42,0.15);
  }

  .founder-name {
    font-family: var(--font-cormorant), Georgia, serif;
    font-size: 22px; font-weight: 600;
    color: var(--dark); margin-bottom: 2px;
    transition: color 0.25s ease;
  }
  .founder-card:hover .founder-name { color: var(--orange); }

  .founder-tag {
    display: inline-block;
    background: var(--warm);
    border: 1px solid rgba(61,46,30,0.10);
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 11px;
    color: var(--muted-text);
    transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
  }
  .founder-card:hover .founder-tag {
    background: rgba(232,99,42,0.06);
    border-color: rgba(232,99,42,0.2);
    color: var(--orange);
  }

  .connector-circle {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 56px; height: 56px;
    border-radius: 50%;
    background: var(--orange);
    display: flex; align-items: center; justify-content: center;
    z-index: 10;
    animation: connectorPulse 2.8s ease-in-out infinite;
  }
  @media (max-width: 1023px) {
    .connector-circle { display: none; }
  }
  @keyframes connectorPulse {
    0%,100% { box-shadow: 0 0 0 10px rgba(232,99,42,0.12), 0 0 0 22px rgba(232,99,42,0.05); }
    50%      { box-shadow: 0 0 0 16px rgba(232,99,42,0.18), 0 0 0 30px rgba(232,99,42,0.07); }
  }

  .loc-pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--warm); border: 1px solid rgba(61,46,30,0.10);
    border-radius: 100px; padding: 8px 16px;
    font-size: 13px; font-weight: 400; color: var(--mid);
    transition: border-color 0.3s ease, background 0.3s ease;
  }
  .loc-pill:hover {
    border-color: rgba(232,99,42,0.25);
    background: rgba(232,99,42,0.05);
  }
  .loc-dot {
    width: 8px; height: 8px;
    background: #5A8A5A; border-radius: 50%; flex-shrink: 0;
    animation: locPulse 2s ease-in-out infinite;
  }
  @keyframes locPulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.6; transform: scale(0.8); }
  }
`

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const card0Ref   = useRef<HTMLDivElement>(null)
  const card1Ref   = useRef<HTMLDivElement>(null)
  const circleRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any
    ;(async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.set(leftRef.current, { opacity: 0, x: -36 })
        gsap.to(leftRef.current, {
          opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: leftRef.current, start: 'top 65%', once: true },
        })

        gsap.set(card0Ref.current, { opacity: 0, x: 48, y: -20 })
        gsap.to(card0Ref.current, {
          opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out',
          delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', once: true },
        })

        gsap.set(card1Ref.current, { opacity: 0, x: 48, y: 20 })
        gsap.to(card1Ref.current, {
          opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out',
          delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        })

        gsap.set(circleRef.current, { opacity: 0, scale: 0.4 })
        gsap.to(circleRef.current, {
          opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)',
          delay: 0.45,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        })
      }, sectionRef)
    })()

    return () => ctx?.revert()
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <section id="about" ref={sectionRef} style={{
        padding: 'clamp(64px, 8vw, 120px) clamp(20px, 7vw, 96px)',
        background: 'var(--cream)',
      }}>
        <div className="about-layout">

          {/* Left: copy */}
          <div ref={leftRef}>
            <SectionLabel>The team</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 600,
              color: 'var(--dark)', letterSpacing: '-1px', lineHeight: 1.12, marginBottom: 20,
            }}>
              Two people who've been doing this separately for years
            </h2>
            <p style={{
              fontSize: 16, fontWeight: 300, color: 'var(--muted-text)',
              lineHeight: 1.82, marginBottom: 16,
            }}>
              Victory pulls from five years of content strategy, brand storytelling, and
              communications — including Nigeria's first report on the informal economy.
              Andrew brings deep expertise in programme management, strategy, and financial modelling.
            </p>
            <p style={{
              fontSize: 16, fontWeight: 300, color: 'var(--muted-text)',
              lineHeight: 1.82, marginBottom: 32,
            }}>
              After months of informally collaborating — Victory pulling Andrew in for models,
              Andrew bringing Victory in for messaging — building something together felt
              inevitable. Rubyk was born from that.
            </p>
            <div className="loc-pill">
              <span className="loc-dot" />
              Based between Lagos & Toronto · Working globally
            </div>
          </div>

          {/* Right: founder cards */}
          <div className="founders-stack">
            <div ref={card0Ref} className="founder-card founder-card-0">
              <div className="founder-avatar" style={{
                background: 'var(--orange)', color: '#fff',
              }}>V</div>
              <div className="founder-name">Victory</div>
              <div style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '1.2px',
                color: 'var(--orange)', fontWeight: 500, marginBottom: 10,
              }}>Narrative & Strategy</div>
              <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--muted-text)', lineHeight: 1.68 }}>
                Content strategy, brand storytelling, and communications. Author of Nigeria's first report on the informal economy.
              </p>
              <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: '4px 6px' }}>
                {['Brand Messaging', 'Content Strategy', 'Communications'].map(sk => (
                  <span key={sk} className="founder-tag">{sk}</span>
                ))}
              </div>
            </div>

            <div ref={card1Ref} className="founder-card founder-card-1">
              <div className="founder-avatar" style={{
                background: 'var(--dark)', color: 'var(--orange)',
              }}>A</div>
              <div className="founder-name">Andrew</div>
              <div style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '1.2px',
                color: 'var(--orange)', fontWeight: 500, marginBottom: 10,
              }}>Strategy & Finance</div>
              <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--muted-text)', lineHeight: 1.68 }}>
                Programme management, strategy, and financial modelling — turning complex ideas into structured, executable plans.
              </p>
              <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: '4px 6px' }}>
                {['Financial Models', 'Programme Mgmt', 'Strategy'].map(sk => (
                  <span key={sk} className="founder-tag">{sk}</span>
                ))}
              </div>
            </div>

            <div ref={circleRef} className="connector-circle">
              <span style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-1px',
              }}>R</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}