import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FinModelForm from './FinModelForm'

/* ── noindex — hidden page, direct link only ── */
export const metadata: Metadata = {
  title:  'Financial Model & Pitch Deck Walkthrough — Rubyk',
  description: 'Apply for a free 30-minute pitch deck and financial model walkthrough session.',
  robots: { index: false, follow: false },
}

export default function FinModelPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--cream)', minHeight: '100vh', paddingTop: 90 }}>

        {/* Hero banner */}
        <div style={{
          background:  'var(--dark)',
          padding:     'clamp(72px, 8vw, 110px) clamp(20px, 7vw, 96px) clamp(48px, 5vw, 72px)',
          position:    'relative',
          overflow:    'hidden',
        }}>
          <div aria-hidden style={{
            position:   'absolute', top: '-140px', right: '20%',
            width:      500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,99,42,0.14) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 680 }}>
            <div style={{
              display:      'inline-flex', alignItems: 'center', gap: 8,
              background:   'rgba(232,99,42,0.15)',
              border:       '1px solid rgba(232,99,42,0.25)',
              borderRadius: 100, padding: '5px 14px 5px 9px',
              fontSize:     12, fontWeight: 500, color: 'var(--orange-light)', marginBottom: 22,
            }}>
              <span style={{ width: 6, height: 6, background: 'var(--orange)', borderRadius: '50%' }} />
              Free 30-minute session · Limited spots
            </div>
            <h1 style={{
              fontFamily:    'var(--font-cormorant), Georgia, serif',
              fontSize:      'clamp(34px, 4.5vw, 58px)', fontWeight: 600,
              color:         'var(--cream)', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16,
            }}>
              Financial Model & Pitch Deck Walkthrough
            </h1>
            <p style={{
              fontSize:   'clamp(15px, 1.8vw, 17px)', fontWeight: 300,
              color:      'rgba(253,250,246,0.55)', lineHeight: 1.78, maxWidth: 540,
            }}>
              We're offering a free 30-minute call to a select number of founders currently raising.
              We'll walk through your business model together and talk through the importance of an
              investor-ready financial model and pitch deck, and what it needs to show.
            </p>
          </div>
        </div>

        {/* Form */}
        <div style={{
          maxWidth: 720, margin: '0 auto',
          padding:  'clamp(48px, 6vw, 80px) clamp(20px, 7vw, 96px)',
        }}>
          <FinModelForm />
        </div>

      </main>
      <Footer />
    </>
  )
}