'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface RevealTextProps {
  children:  React.ReactNode
  delay?:    number
  className?: string
  as?:       'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span'
}

const line = {
  hidden:  { y: '108%', opacity: 0 },
  visible: (delay: number) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

export default function RevealText({
  children, delay = 0, className, as: Tag = 'div',
}: RevealTextProps) {
  const ref     = useRef(null)
  const inView  = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        className={className}
        variants={line}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={delay}
      >
        {/* @ts-ignore dynamic tag */}
        <Tag style={{ margin: 0 }}>{children}</Tag>
      </motion.div>
    </div>
  )
}

/** Fade-up reveal — use for paragraphs / supporting copy */
export function FadeUp({
  children, delay = 0, className,
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
