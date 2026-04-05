'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useSiteReady } from '../SiteReadyContext'

interface AnimatedCounterProps {
  val:   string
  label: string
  delay?: number
}

export default function AnimatedCounter({ val, label, delay = 0 }: AnimatedCounterProps) {
  const ready    = useSiteReady()
  const ref      = useRef(null)
  const inView   = useInView(ref, { once: true, margin: '-60px' })
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (inView && ready && !shown) {
      const t = setTimeout(() => setShown(true), delay)
      return () => clearTimeout(t)
    }
  }, [inView, ready, shown, delay])

  return (
    <div
      ref={ref}
      style={{
        opacity:   shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(16px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <div
        style={{
          fontFamily:    'var(--font-cormorant), Georgia, serif',
          fontSize:      'clamp(28px, 3vw, 38px)',
          fontWeight:    600,
          color:         'var(--dark)',
          letterSpacing: '-1px',
          lineHeight:    1,
        }}
      >
        {val}
      </div>
      <div
        style={{
          fontSize:       11,
          fontWeight:     400,
          color:          'var(--muted-text)',
          textTransform:  'uppercase',
          letterSpacing:  '1.2px',
          marginTop:      6,
        }}
      >
        {label}
      </div>
    </div>
  )
}