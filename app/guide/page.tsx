import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GuideForm from '@/components/GuideForm'
import { supabase } from '@/lib/supabase'
import { guide as fallback } from '@/data/guide'

export const revalidate = 60

export async function generateMetadata() {
  const config = await getConfig()
  return {
    title: `${config.headline} — Rubyk`,
    description: config.subheadline,
  }
}

async function getConfig() {
  const { data } = await supabase
    .from('guide_config')
    .select('*')
    .eq('id', 1)
    .single()

  if (!data) return fallback
  return {
    badge:        data.badge        || fallback.badge,
    headline:     data.headline     || fallback.headline,
    subheadline:  data.subheadline  || fallback.subheadline,
    highlights:   data.highlights?.length ? data.highlights : fallback.highlights,
    downloadUrl:  data.download_url || fallback.downloadUrl,
    coverImage:   data.cover_image  || fallback.coverImage,
    coverAlt:     fallback.coverAlt,
    formHeading:  data.form_heading || fallback.formHeading,
    ctaLabel:     data.cta_label    || fallback.ctaLabel,
    disclaimer:   data.disclaimer   || fallback.disclaimer,
  }
}

export default async function GuidePage() {
  const config = await getConfig()

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
        {/* Hero banner */}
        <div style={{
          background: 'var(--dark)',
          padding: 'clamp(100px, 10vw, 140px) clamp(20px, 7vw, 96px) clamp(48px, 6vw, 80px)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div aria-hidden style={{
            position: 'absolute', top: '-160px', left: '30%',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,99,42,0.15) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(232,99,42,0.15)',
              border: '1px solid rgba(232,99,42,0.25)',
              borderRadius: 100, padding: '5px 14px 5px 9px',
              fontSize: 12, fontWeight: 500, color: 'var(--orange-light)', marginBottom: 24,
            }}>
              <span style={{ width: 6, height: 6, background: 'var(--orange)', borderRadius: '50%' }} />
              {config.badge}
            </div>
            <h1 style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(32px, 4.5vw, 58px)', fontWeight: 600,
              color: 'var(--cream)', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 20,
            }}>{config.headline}</h1>
            <p style={{
              fontSize: 'clamp(15px, 1.8vw, 17px)', fontWeight: 300,
              color: 'rgba(253,250,246,0.55)', lineHeight: 1.78,
            }}>{config.subheadline}</p>
          </div>
        </div>

        {/* Body */}
        <div style={{
          padding: 'clamp(40px, 6vw, 80px) clamp(20px, 7vw, 96px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(36px, 5vw, 72px)', alignItems: 'start',
        }}>
          <div>
            <p style={{
              fontSize: 11, fontWeight: 500, textTransform: 'uppercase',
              letterSpacing: '2px', color: 'var(--orange)', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ display: 'block', width: 24, height: 1.5, background: 'var(--orange)' }} />
              What's inside
            </p>
            <h2 style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 600,
              color: 'var(--dark)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 28,
            }}>
              Everything you need to tell stories that actually work
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {config.highlights.map((point: string, i: number) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--orange-pale)', border: '1px solid rgba(232,99,42,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 600, color: 'var(--orange)', flexShrink: 0, marginTop: 2,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 16, fontWeight: 300, color: 'var(--mid)', lineHeight: 1.65 }}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            {config.coverImage && (
              <div style={{
                borderRadius: 16, overflow: 'hidden',
                border: '1px solid rgba(61,46,30,0.08)',
                boxShadow: '0 20px 48px rgba(61,46,30,0.08)', maxWidth: 320,
              }}>
                <img src={config.coverImage} alt={config.coverAlt} style={{ width: '100%', display: 'block' }} />
              </div>
            )}
          </div>
          <GuideForm formHeading={config.formHeading} ctaLabel={config.ctaLabel} disclaimer={config.disclaimer} />
        </div>
      </main>
      <Footer />
    </>
  )
}