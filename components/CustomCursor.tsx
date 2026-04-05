'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springX = useSpring(cursorX, { stiffness: 600, damping: 40 })
  const springY = useSpring(cursorY, { stiffness: 600, damping: 40 })
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const onEnter = () => setHovered(true)
    const onLeave = () => setHovered(false)

    window.addEventListener('mousemove', move)

    const addListeners = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    // Initial pass + re-run on any DOM change
    addListeners()
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', move)
      observer.disconnect()
    }
  }, [cursorX, cursorY])

  if (!mounted) return null

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        style={{
          position: 'fixed',
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
          pointerEvents: 'none',
          zIndex: 9998,
          width: hovered ? 44 : 28,
          height: hovered ? 44 : 28,
          border: `1.5px solid ${hovered ? 'rgba(232,99,42,0.7)' : 'rgba(232,99,42,0.35)'}`,
          borderRadius: '50%',
          transition: 'width 0.25s ease, height 0.25s ease, border-color 0.25s ease',
        }}
      />
      {/* Inner dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: cursorX,
          top: cursorY,
          x: '-50%',
          y: '-50%',
          pointerEvents: 'none',
          zIndex: 9999,
          width: hovered ? 6 : 8,
          height: hovered ? 6 : 8,
          background: 'var(--orange)',
          borderRadius: '50%',
          transition: 'width 0.15s ease, height 0.15s ease',
        }}
      />
    </>
  )
}
