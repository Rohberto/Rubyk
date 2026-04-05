'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
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

export default function About() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" ref={ref} style={{
      padding: 'clamp(64px, 8vw, 120px) clamp(20px, 7vw, 96px)',
      background: 'var(--cream)',
    }}>
      <div className="grid-sidebar about-layout">

        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
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
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--warm)', border: '1px solid rgba(61,46,30,0.10)',
            borderRadius: 100, padding: '8px 16px',
            fontSize: 13, fontWeight: 400, color: 'var(--mid)',
          }}>
            <span className="loc-pulse" style={{
              width: 8, height: 8, background: '#5A8A5A',
              borderRadius: '50%', display: 'inline-block', flexShrink: 0,
            }} />
            Based between Lagos & Toronto · Working globally
          </div>
        </motion.div>

        {/* Right: founder cards */}
        {/* Desktop: absolute positioned overlap. Mobile: stacked via CSS class */}
        <div className="founders-stack" style={{ position: 'relative', height: 480 }}>
          {founders.map((f, i) => (
            <motion.div
              key={f.name}
              className="founder-card"
              initial={{ opacity: 0, x: 48, y: i === 0 ? -20 : 20 }}
              animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.12 }}
              whileHover={{ y: i === 0 ? -6 : 6, boxShadow: '0 28px 64px rgba(61,46,30,0.12)' }}
              style={{
                position: 'absolute',
                ...(i === 0 ? { top: 0, left: 0 } : { bottom: 0, right: 0 }),
                background: '#fff', border: '1px solid rgba(61,46,30,0.10)',
                borderRadius: 20, padding: '28px 28px 24px', width: 280,
                boxShadow: '0 20px 52px rgba(61,46,30,0.07)',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: f.dark ? 'var(--dark)' : 'var(--orange)',
                color: f.dark ? 'var(--orange)' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 20, fontWeight: 700, marginBottom: 16, flexShrink: 0,
              }}>{f.initial}</div>
              <div style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 22, fontWeight: 600, color: 'var(--dark)', marginBottom: 2,
              }}>{f.name}</div>
              <div style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '1.2px',
                color: 'var(--orange)', fontWeight: 500, marginBottom: 10,
              }}>{f.role}</div>
              <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--muted-text)', lineHeight: 1.68 }}>
                {f.bio}
              </p>
              <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: '4px 6px' }}>
                {f.skills.map((sk) => (
                  <span key={sk} style={{
                    display: 'inline-block', background: 'var(--warm)',
                    border: '1px solid rgba(61,46,30,0.10)', borderRadius: 20,
                    padding: '3px 10px', fontSize: 11, color: 'var(--muted-text)',
                  }}>{sk}</span>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Connector — hidden on mobile via CSS */}
          <motion.div
            className="connector-circle"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 60, height: 60, borderRadius: '50%',
              background: 'var(--orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 5, boxShadow: '0 0 0 12px rgba(232,99,42,0.12), 0 0 0 24px rgba(232,99,42,0.05)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-1px',
            }}>R</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}