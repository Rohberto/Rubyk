'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionLabel from './ui/SectionLabel'
import MagneticButton from './ui/MagneticButton'
import { CALENDLY_URL, EMAIL, LOGO_URL } from '@/data/content'

export default function CTA() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contact" ref={ref} style={{
      background: 'var(--dark)',
      padding: 'clamp(72px, 10vw, 140px) clamp(20px, 7vw, 96px)',
      textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      {/* Radial glow */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.6 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', top: '-220px', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,99,42,0.20) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}
        >
          <SectionLabel light>Get started</SectionLabel>
        </motion.div>

        <div style={{ overflow: 'hidden', marginBottom: 20 }}>
          <motion.h2
            initial={{ y: '105%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : {}}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(34px, 5vw, 68px)', fontWeight: 600,
              color: 'var(--cream)', letterSpacing: '-1.5px', lineHeight: 1.1,
              margin: '0 auto', maxWidth: 620,
            }}
          >
            Ready to tell your story?
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          style={{
            fontSize: 'clamp(15px, 2vw, 17px)', fontWeight: 300,
            color: 'rgba(253,250,246,0.52)', lineHeight: 1.78,
            maxWidth: 460, margin: '0 auto 52px',
          }}
        >
          Book a free 30-minute discovery call. No pitch, no pressure — just a conversation
          about where you are and where you want to go.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.48 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}
        >
          <MagneticButton href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            Book a free discovery call
          </MagneticButton>
          <MagneticButton href={`mailto:${EMAIL}`} variant="outline">
            Email us instead
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
          style={{
            marginTop: 72, paddingTop: 60,
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', justifyContent: 'center',
          }}
        >
          <img
            src={LOGO_URL} alt="Rubyk" style={{ height: 34 }}
            onError={(e) => {
              const img = e.currentTarget
              img.style.display = 'none'
              const fb = img.nextElementSibling as HTMLElement
              if (fb) fb.style.display = 'block'
            }}
          />
          <span style={{
            display: 'none', fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 26, fontWeight: 700, color: 'var(--orange)', letterSpacing: '-0.5px',
          }}>Rubyk</span>
        </motion.div>
      </div>
    </section>
  )
}