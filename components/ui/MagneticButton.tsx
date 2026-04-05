'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  href:      string
  children:  React.ReactNode
  variant?:  'primary' | 'outline' | 'ghost'
  target?:   string
  rel?:      string
  style?:    React.CSSProperties
  className?: string
}

export default function MagneticButton({
  href, children, variant = 'primary', target, rel, style, className,
}: MagneticButtonProps) {
  const ref  = useRef<HTMLAnchorElement>(null)
  const x    = useMotionValue(0)
  const y    = useMotionValue(0)
  const sx   = useSpring(x, { stiffness: 260, damping: 28 })
  const sy   = useSpring(y, { stiffness: 260, damping: 28 })

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - (rect.left + rect.width  / 2)) * 0.25)
    y.set((e.clientY - (rect.top  + rect.height / 2)) * 0.25)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  const baseStyle: React.CSSProperties =
    variant === 'primary'
      ? {
          display:        'inline-block',
          background:     'var(--orange)',
          color:          '#fff',
          padding:        '14px 30px',
          borderRadius:   8,
          fontSize:       15,
          fontWeight:     500,
          textDecoration: 'none',
          border:         '1.5px solid transparent',
        }
      : variant === 'outline'
      ? {
          display:        'inline-block',
          background:     'transparent',
          color:          'rgba(255,255,255,0.8)',
          padding:        '14px 30px',
          borderRadius:   8,
          fontSize:       15,
          fontWeight:     400,
          textDecoration: 'none',
          border:         '1.5px solid rgba(255,255,255,0.2)',
        }
      : {
          display:        'inline-flex',
          alignItems:     'center',
          gap:            6,
          fontSize:       14,
          color:          'var(--mid)',
          fontWeight:     400,
          textDecoration: 'none',
          borderBottom:   '1px solid rgba(61,46,30,0.18)',
          paddingBottom:  2,
          background:     'none',
        }

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      style={{ ...baseStyle, x: sx, y: sy, ...style }}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={
        variant === 'primary'
          ? { backgroundColor: 'var(--dark)', boxShadow: '0 14px 36px rgba(232,99,42,0.22)' }
          : variant === 'outline'
          ? { borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }
          : { color: 'var(--orange)', borderColor: 'var(--orange)' }
      }
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.a>
  )
}
