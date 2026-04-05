'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionLabel from './ui/SectionLabel'
import { testimonials } from '@/data/content'

export default function Testimonials() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} style={{
      padding: 'clamp(64px, 8vw, 120px) clamp(20px, 7vw, 96px)',
      background: 'var(--orange-pale)',
      borderTop: '1px solid rgba(232,99,42,0.12)',
      borderBottom: '1px solid rgba(232,99,42,0.12)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 52 }}
      >
        <SectionLabel>What founders say</SectionLabel>
        <h2 style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: 'clamp(30px, 3.5vw, 54px)', fontWeight: 600,
          color: 'var(--dark)', letterSpacing: '-1px', lineHeight: 1.12,
        }}>
          The people we've worked with
        </h2>
      </motion.div>

      <div className="grid-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 44 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.14 }}
            whileHover={{ y: -5, boxShadow: '0 22px 52px rgba(61,46,30,0.11)' }}
            style={{
              background: '#fff', border: '1px solid rgba(61,46,30,0.08)',
              borderRadius: 20, padding: 'clamp(24px, 3vw, 36px)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: '0 2px 12px rgba(61,46,30,0.04)',
            }}
          >
            <div>
              <div style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 52, color: 'var(--orange)', lineHeight: 0.85,
                marginBottom: 18, opacity: 0.7,
              }}>"</div>
              <blockquote style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(15px, 1.8vw, 17px)', fontStyle: 'italic',
                color: 'var(--dark)', lineHeight: 1.78, marginBottom: 28, fontWeight: 400,
              }}>{t.quote}</blockquote>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={t.img} alt={t.name} width={52} height={52}
                  style={{
                    width: 52, height: 52, borderRadius: '50%', objectFit: 'cover',
                    border: '2px solid rgba(232,99,42,0.2)', display: 'block',
                  }}
                  onError={(e) => {
                    const img = e.currentTarget
                    img.style.display = 'none'
                    const fb = img.nextElementSibling as HTMLElement
                    if (fb) fb.style.display = 'flex'
                  }}
                />
                <div style={{
                  display: 'none', width: 52, height: 52, borderRadius: '50%',
                  background: 'var(--orange-pale)', border: '1px solid rgba(232,99,42,0.2)',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 600, color: 'var(--orange)',
                  fontFamily: 'var(--font-cormorant), Georgia, serif', flexShrink: 0,
                }}>{t.initials}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dark)' }}>{t.name}</div>
                <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--muted-text)', marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}