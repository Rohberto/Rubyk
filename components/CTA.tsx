'use client'

import { useRef, useEffect } from 'react'
import SectionLabel from './ui/SectionLabel'
import MagneticButton from './ui/MagneticButton'
import { CALENDLY_URL, EMAIL } from '@/data/content'

const STYLES = `
  .cta-glow {
    position: absolute;
    top: -220px; left: 50%;
    transform: translateX(-50%);
    width: 700px; height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(232,99,42,0.20) 0%, transparent 68%);
    pointer-events: none;
  }

  /* each headline line clips from below */
  .cta-line-wrap {
    overflow: hidden;
    display: block;
  }
  .cta-line {
    display: block;
    will-change: transform;
  }

  /* floating orbs */
  .cta-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    animation: orbFloat 6s ease-in-out infinite;
  }
  @keyframes orbFloat {
    0%,100% { transform: translateY(0px) scale(1); }
    50%      { transform: translateY(-24px) scale(1.06); }
  }

  /* email button special hover */
  .cta-email-btn {
    position: relative;
    overflow: hidden;
  }
  .cta-email-btn::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--orange);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
    border-radius: inherit;
    z-index: 0;
  }
  .cta-email-btn:hover::before { transform: scaleX(1); }
  .cta-email-btn span { position: relative; z-index: 1; }

  /* grid lines background */
  .cta-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(232,99,42,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(232,99,42,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.6s ease;
  }
`

export default function CTA() {
  const sectionRef  = useRef<HTMLElement>(null)
  const glowRef     = useRef<HTMLDivElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)
  const labelRef    = useRef<HTMLDivElement>(null)
  const line1Ref    = useRef<HTMLSpanElement>(null)
  const line2Ref    = useRef<HTMLSpanElement>(null)
  const paraRef     = useRef<HTMLParagraphElement>(null)
  const btnsRef     = useRef<HTMLDivElement>(null)
  const orb1Ref     = useRef<HTMLDivElement>(null)
  const orb2Ref     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any
    ;(async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            once: true,
          },
        })

        // glow expands in
        gsap.set(glowRef.current, { opacity: 0, scale: 0.6 })
        tl.to(glowRef.current, {
          opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out',
        }, 0)

        // grid fades in
        tl.to(gridRef.current, { opacity: 1, duration: 1, ease: 'power2.out' }, 0.2)

        // orbs float in
        gsap.set([orb1Ref.current, orb2Ref.current], { opacity: 0, scale: 0.4 })
        tl.to(orb1Ref.current, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, 0.3)
        tl.to(orb2Ref.current, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, 0.45)

        // label
        gsap.set(labelRef.current, { opacity: 0, y: 24 })
        tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.1)

        // headline lines clip up one by one
        gsap.set([line1Ref.current, line2Ref.current], { yPercent: 110, opacity: 0 })
        tl.to(line1Ref.current, {
          yPercent: 0, opacity: 1, duration: 1, ease: 'power4.out',
        }, 0.2)
        tl.to(line2Ref.current, {
          yPercent: 0, opacity: 1, duration: 1, ease: 'power4.out',
        }, 0.34)

        // paragraph
        gsap.set(paraRef.current, { opacity: 0, y: 20 })
        tl.to(paraRef.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.5)

        // buttons
        gsap.set(btnsRef.current, { opacity: 0, y: 20 })
        tl.to(btnsRef.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.62)

      }, sectionRef)
    })()

    return () => ctx?.revert()
  }, [])

  // mailto with Rubyk email prefilled
  const mailtoHref = `mailto:${EMAIL}?subject=Let's%20work%20together&body=Hi%20Rubyk%2C%0A%0AI%27d%20love%20to%20chat%20about...`

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <section
        id="contact"
        ref={sectionRef}
        style={{
          background: 'var(--dark)',
          padding: 'clamp(72px, 10vw, 140px) clamp(20px, 7vw, 96px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid lines */}
        <div ref={gridRef} className="cta-grid" />

        {/* Radial glow */}
        <div ref={glowRef} className="cta-glow" />

        {/* Floating orbs */}
        <div
          ref={orb1Ref}
          className="cta-orb"
          style={{
            width: 180, height: 180,
            background: 'radial-gradient(circle, rgba(232,99,42,0.12), transparent 70%)',
            left: '8%', top: '20%',
            animationDuration: '7s',
          }}
        />
        <div
          ref={orb2Ref}
          className="cta-orb"
          style={{
            width: 120, height: 120,
            background: 'radial-gradient(circle, rgba(232,99,42,0.09), transparent 70%)',
            right: '10%', bottom: '25%',
            animationDuration: '5.5s',
            animationDelay: '1s',
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Label */}
          <div
            ref={labelRef}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}
          >
            <SectionLabel light>Get started</SectionLabel>
          </div>

          {/* Headline — two lines, each clipped */}
          <div style={{ marginBottom: 20 }}>
            <span className="cta-line-wrap">
              <span
                ref={line1Ref}
                className="cta-line"
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 'clamp(34px, 5vw, 68px)', fontWeight: 600,
                  color: 'var(--cream)', letterSpacing: '-1.5px', lineHeight: 1.1,
                }}
              >
                Your story matters. 

              </span>
            </span>
            <span className="cta-line-wrap">
              <span
                ref={line2Ref}
                className="cta-line"
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 'clamp(34px, 5vw, 68px)', fontWeight: 600,
                  color: 'var(--orange)', letterSpacing: '-1.5px', lineHeight: 1.1,
                  fontStyle: 'italic',
                }}
              >
                Let's tell it right.
              </span>
            </span>
          </div>

          {/* Paragraph */}
          <p
            ref={paraRef}
            style={{
              fontSize: 'clamp(15px, 2vw, 17px)', fontWeight: 300,
              color: 'rgba(253,250,246,0.52)', lineHeight: 1.78,
              maxWidth: 460, margin: '0 auto 52px',
            }}
          >
          Book a free 30-minute discovery call. No pressure, just a conversation about where you are and where you want to go.

          </p>

          {/* Buttons */}
          <div
            ref={btnsRef}
            style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}
          >
            <MagneticButton href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              Book a free discovery call
            </MagneticButton>
            {/* mailto opens user's email app with Rubyk's email + subject prefilled */}
            <MagneticButton href={mailtoHref} variant="outline">
              Email us instead
            </MagneticButton>
          </div>
        </div>
      </section>
    </>
  )
}