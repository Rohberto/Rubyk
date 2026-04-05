'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LETTERS = ['R', 'U', 'B', 'Y', 'K']

const spring = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 18,
  mass: 0.9,
}

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase]       = useState<'letters' | 'loading' | 'done'>('letters')
  const [visible, setVisible]   = useState(true)

  /* ── Progress bar ticker ───────────────────────────────────────── */
  useEffect(() => {
    if (phase !== 'loading') return
    const duration = 1900
    const start    = performance.now()
    let raf: number

    function tick(now: number) {
      const t   = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      setProgress(Math.round(eased * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setPhase('done'), 320)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  /* ── Start loading phase after letters land ────────────────────── */
  useEffect(() => {
    // letters take ~820ms to stagger in
    const t = setTimeout(() => setPhase('loading'), 820)
    return () => clearTimeout(t)
  }, [])

  /* ── Unmount after curtain has cleared ─────────────────────────── */
  useEffect(() => {
    if (phase !== 'done') return
    const t = setTimeout(() => {
      setVisible(false)
      onComplete()
    }, 900) // curtain transition = 850ms
    return () => clearTimeout(t)
  }, [phase, onComplete])

  if (!visible) return null

  return (
    <AnimatePresence>
      <div
        style={{
          position:   'fixed',
          inset:      0,
          zIndex:     9999,
          overflow:   'hidden',
          pointerEvents: phase === 'done' ? 'none' : 'all',
        }}
      >
        {/* ── Top curtain panel ──────────────────────────────── */}
        <motion.div
          animate={phase === 'done' ? { y: '-100%' } : { y: '0%' }}
          transition={phase === 'done' ? { duration: 0.85, ease: [0.76, 0, 0.24, 1] } : {}}
          style={{
            position:   'absolute',
            top:        0,
            left:       0,
            right:      0,
            height:     '50%',
            background: '#0F0A04',
          }}
        />

        {/* ── Bottom curtain panel ───────────────────────────── */}
        <motion.div
          animate={phase === 'done' ? { y: '100%' } : { y: '0%' }}
          transition={phase === 'done' ? { duration: 0.85, ease: [0.76, 0, 0.24, 1] } : {}}
          style={{
            position:   'absolute',
            bottom:     0,
            left:       0,
            right:      0,
            height:     '50%',
            background: '#0F0A04',
          }}
        />

        {/* ── Content (sits above both panels) ───────────────── */}
        <div
          style={{
            position:       'absolute',
            inset:          0,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            zIndex:         1,
          }}
        >
          {/* Letters */}
          <div style={{ display: 'flex', overflow: 'visible' }}>
            {LETTERS.map((char, i) => (
              <motion.span
                key={char}
                initial={{ y: -90, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...spring, delay: 0.1 + i * 0.08 }}
                style={{
                  fontFamily:    'var(--font-cormorant), Georgia, serif',
                  fontSize:      'clamp(72px, 12vw, 108px)',
                  fontWeight:    600,
                  color:         '#FDFAF6',
                  letterSpacing: '-3px',
                  lineHeight:    1,
                  display:       'inline-block',
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'loading' || phase === 'done' ? 0.4 : 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily:    'var(--font-outfit), system-ui, sans-serif',
              fontSize:      13,
              fontWeight:    300,
              color:         '#FDFAF6',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginTop:     20,
            }}
          >
            Stories that move
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'loading' || phase === 'done' ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ marginTop: 28 }}
          >
            <div
              style={{
                width:      140,
                height:     1,
                background: 'rgba(232,99,42,0.18)',
                overflow:   'hidden',
              }}
            >
              <div
                style={{
                  height:     '100%',
                  background: '#E8632A',
                  width:      `${progress}%`,
                  transition: 'width 0.04s linear',
                }}
              />
            </div>

            {/* Percentage */}
            <p
              style={{
                fontFamily:    'var(--font-outfit), system-ui, sans-serif',
                fontSize:      11,
                fontWeight:    400,
                color:         'rgba(232,99,42,0.5)',
                letterSpacing: '2px',
                textAlign:     'right',
                marginTop:     8,
              }}
            >
              {progress}
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}
