'use client'

import { useRef, useEffect } from 'react'
import MagneticButton from './ui/MagneticButton'

interface Props {
  headline:    string
  subheadline: string
}

export default function GuideBannerClient({ headline, subheadline }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const bannerRef  = useRef<HTMLDivElement>(null)
  const badgeRef   = useRef<HTMLDivElement>(null)
  const headRef    = useRef<HTMLHeadingElement>(null)
  const paraRef    = useRef<HTMLParagraphElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any
    const init = async () => {
      const gsap = (await import('gsap')).gsap
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            end: 'top 40%',
            toggleActions: 'play none none none',
          },
        })

        tl.fromTo(bannerRef.current,
          { y: 80, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power4.out' },
        )
        .fromTo(badgeRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
          '-=0.75',
        )
        .fromTo(headRef.current,
          { y: 48, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.85, ease: 'power4.out' },
          '-=0.45',
        )
        .fromTo(paraRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          '-=0.5',
        )
        .fromTo(ctaRef.current,
          { y: 16, opacity: 0, scale: 0.92 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' },
          '-=0.45',
        )

        gsap.to(bannerRef.current, {
          y: -8, duration: 3.2, ease: 'sine.inOut',
          repeat: -1, yoyo: true, delay: 1.2,
        })
      }, sectionRef)
    }

    init()
    return () => ctx?.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(48px, 6vw, 80px) clamp(20px, 7vw, 96px)',
        background: 'var(--cream)',
        borderTop: '1px solid rgba(61,46,30,0.07)',
        overflow: 'hidden',
      }}
    >
      <div
        ref={bannerRef}
        style={{
          background: 'var(--dark)', borderRadius: 20,
          padding: 'clamp(32px, 4vw, 56px)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 28,
          position: 'relative', overflow: 'hidden',
          opacity: 0, willChange: 'transform, opacity',
        }}
      >
        {/* Glow */}
        <div aria-hidden style={{
          position: 'absolute', right: '-60px', top: '-80px',
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,99,42,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden style={{
          position: 'absolute', right: '-40px', top: '50%',
          transform: 'translateY(-50%)',
          width: 280, height: 280, borderRadius: '50%',
          border: '1px solid rgba(232,99,42,0.08)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560 }}>
          <div ref={badgeRef} style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(232,99,42,0.15)',
            border: '1px solid rgba(232,99,42,0.25)',
            borderRadius: 100, padding: '4px 12px 4px 8px',
            fontSize: 11, fontWeight: 500,
            color: 'var(--orange-light)', marginBottom: 16,
            opacity: 0,
          }}>
            <span style={{ width: 5, height: 5, background: 'var(--orange)', borderRadius: '50%' }} />
            Free resource
          </div>

          <h2 ref={headRef} style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 600,
            color: 'var(--cream)', letterSpacing: '-0.5px',
            lineHeight: 1.2, marginBottom: 10, opacity: 0,
          }}>
            {headline}
          </h2>

          <p ref={paraRef} style={{
            fontSize: 'clamp(14px, 1.5vw, 16px)', fontWeight: 300,
            color: 'rgba(253,250,246,0.5)', lineHeight: 1.75, opacity: 0,
          }}>
            {subheadline}
          </p>
        </div>

        <div ref={ctaRef} style={{ position: 'relative', zIndex: 1, flexShrink: 0, opacity: 0 }}>
          <MagneticButton href="/guide">
            Get the free guide →
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}