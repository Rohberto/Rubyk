"use client"
import Link from 'next/link'
import { LOGO_URL, EMAIL, INSTAGRAM_URL, LINKEDIN_URL } from '@/data/content'

const navLinks = [
  { label: 'Services', href: '/#services' },
  { label: 'Work',     href: '/#work' },
  { label: 'About',   href: '/#about' },
  { label: 'Blog',    href: '/blog' },
  { label: 'Contact', href: 'mailto:hello@rubyk.co?subject=Let%27s%20work%20together&body=Hi%20Rubyk%2C%0A%0AI%27d%20love%20to%20chat%20about...', external: true },
]

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--black)',
      padding: 'clamp(24px, 3vw, 40px) clamp(20px, 7vw, 96px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div className="footer-inner">

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src='/rubyk.png' alt="Rubyk" style={{ height: 24 }}
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
            fontSize: 18, fontWeight: 700,
            color: 'var(--orange)', letterSpacing: '-0.3px',
          }}>Rubyk</span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '14px 24px', flexWrap: 'wrap', alignItems: 'center' }}>
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="footer-link"
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noopener noreferrer' : undefined}
              style={{
                fontSize: 13, color: 'rgba(255,255,255,0.65)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Copyright + socials */}
        <div style={{
          fontSize: 12, color: 'rgba(255,255,255,0.45)',
          display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <span>© 2026 Rubyk Co.</span>
          <span>·</span>
          <a href={`mailto:${EMAIL}`} className="footer-link"
            style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
          >{EMAIL}</a>
          <span>·</span>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
            className="footer-social"
            style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
          >Instagram</a>
          <span>·</span>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"
            className="footer-social"
            style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
          >LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}