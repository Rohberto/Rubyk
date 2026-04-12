'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import MagneticButton from './ui/MagneticButton'
import { useSiteReady } from './SiteReadyContext'
import { CALENDLY_URL, LOGO_URL } from '@/data/content'

const links: { label: string; href: string; highlight?: boolean }[] = [
  { label: 'Home',       href: '/' },
  { label: 'Services',   href: '/#services' },
  { label: 'Work',       href: '/#work' },
  { label: 'About',      href: '/#about' },
  { label: 'Blog',       href: '/blog' },
  { label: 'Free guide', href: '/guide', highlight: true },
  { label: 'Quiz',       href: '/quiz',  highlight: false },
]

export default function Navbar() {
  const ready               = useSiteReady()
  const { scrollY }         = useScroll()
  const [hidden, setHidden] = useState(false)
  const [atTop,  setAtTop]  = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const prev = useRef(0)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setAtTop(latest < 30)
    if (latest > prev.current && latest > 100) {
      setHidden(true)
      setMenuOpen(false)
    } else {
      setHidden(false)
    }
    prev.current = latest
  })

  const Logo = () => (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
      <img
        src='/rubyk.png'
        alt="Rubyk"
        style={{ height: 28 }}
        onError={(e) => {
          const img = e.currentTarget
          img.style.display = 'none'
          const fb = img.nextElementSibling as HTMLElement
          if (fb) fb.style.display = 'block'
        }}
      />
      <span style={{
        display: 'none',
        fontFamily: 'var(--font-cormorant), Georgia, serif',
        fontSize: 22, fontWeight: 700,
        color: 'var(--orange)', letterSpacing: '-0.5px',
      }}>
        Rubyk
      </span>
    </Link>
  )

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={
          ready
            ? hidden ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }
            : { y: -20, opacity: 0 }
        }
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          height: 68,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(20px, 5vw, 72px)',
          background:     atTop && !menuOpen ? 'transparent' : 'rgba(253,250,246,0.95)',
          backdropFilter: atTop && !menuOpen ? 'none'        : 'blur(20px)',
          borderBottom:   atTop && !menuOpen ? '1px solid transparent' : '1px solid rgba(61,46,30,0.08)',
          transition: 'background 0.35s, backdrop-filter 0.35s, border-color 0.35s',
        }}
      >
        <Logo />

        {/* ── Desktop nav ── */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {links.map((l, i) => (
            <motion.div
              key={l.label}
              initial={{ opacity: 0, y: -8 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.06 }}
            >
              {l.highlight ? (
                <Link href={l.href} style={{
                  fontSize: 12, fontWeight: 500,
                  color: 'var(--orange)', textDecoration: 'none',
                  border: '1px solid rgba(232,99,42,0.4)',
                  borderRadius: 20, padding: '5px 13px',
                  transition: 'all 0.2s', letterSpacing: '0.2px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--orange)'
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.borderColor = 'var(--orange)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--orange)'
                  e.currentTarget.style.borderColor = 'rgba(232,99,42,0.4)'
                }}
                >
                  {l.label}
                </Link>
              ) : (
                <Link href={l.href} style={{
                  fontSize: 14, fontWeight: 400,
                  color: 'var(--mid)', textDecoration: 'none',
                  letterSpacing: '0.1px', transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--orange)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--mid)')}
                >
                  {l.label}
                </Link>
              )}
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.42 }}
          >
            <MagneticButton href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              Book a call
            </MagneticButton>
          </motion.div>
        </div>

        {/* ── Hamburger ── */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="hamburger-btn"
          style={{
            display: 'none', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', gap: 5,
            width: 40, height: 40, background: 'none',
            border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6,
          }}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'block', width: 22, height: 1.5, background: 'var(--dark)', borderRadius: 2, transformOrigin: 'center' }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'block', width: 22, height: 1.5, background: 'var(--dark)', borderRadius: 2 }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'block', width: 22, height: 1.5, background: 'var(--dark)', borderRadius: 2, transformOrigin: 'center' }}
          />
        </button>
      </motion.nav>

      {/* ── Mobile menu overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', top: 68, left: 0, right: 0, zIndex: 199,
              background: 'rgba(253,250,246,0.97)', backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(61,46,30,0.08)',
              padding: '28px clamp(20px, 5vw, 40px) 36px',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}
          >
            {links.map((l, i) => (
              <motion.div
                key={l.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              >
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    fontFamily: l.highlight ? 'var(--font-outfit), system-ui, sans-serif' : 'var(--font-cormorant), Georgia, serif',
                    fontSize: l.highlight ? 16 : 32,
                    fontWeight: l.highlight ? 500 : 600,
                    color: l.highlight ? 'var(--orange)' : 'var(--dark)',
                    textDecoration: 'none',
                    letterSpacing: l.highlight ? '0.2px' : '-0.5px',
                    lineHeight: 1.3,
                    padding: l.highlight ? '10px 0' : '6px 0',
                    borderBottom: '1px solid rgba(61,46,30,0.07)',
                    transition: 'color 0.2s',
                  }}
                >
                  {l.highlight ? `↓ ${l.label}` : l.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
              style={{ marginTop: 20 }}
            >
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'inline-block',
                  background: 'var(--orange)', color: '#fff',
                  padding: '13px 28px', borderRadius: 8,
                  fontSize: 15, fontWeight: 500, textDecoration: 'none',
                }}
              >
                Book a free call
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav   { display: flex !important; }
          .hamburger-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav   { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}