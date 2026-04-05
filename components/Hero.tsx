'use client'

import { motion } from 'framer-motion'
import AnimatedCounter from './ui/AnimatedCounter'
import MagneticButton from './ui/MagneticButton'
import { CALENDLY_URL, metrics } from '@/data/content'
import { useSiteReady } from './SiteReadyContext'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
}
const lineUp = {
  hidden:  { y: '108%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  const ready = useSiteReady()

  return (
    <section
      style={{
        position:   'relative',
        minHeight:  '100vh',
        display:    'flex',
        alignItems: 'center',
        padding:    'clamp(100px, 10vw, 130px) clamp(24px, 7vw, 96px) 80px',
        overflow:   'hidden',
        background: 'var(--cream)',
      }}
    >
      {/* Radial glow */}
      <div
        aria-hidden
        style={{
          position:      'absolute',
          right:         '-80px',
          top:           '50%',
          transform:     'translateY(-50%)',
          width:         700,
          height:        700,
          background:    'radial-gradient(circle at center, rgba(232,99,42,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Orbital SVG */}
      <div
        aria-hidden
        style={{
          position:      'absolute',
          right:         'clamp(-200px, -5vw, -60px)',
          top:           '50%',
          transform:     'translateY(-50%)',
          pointerEvents: 'none',
          zIndex:        0,
        }}
      >
        <svg width="700" height="700" viewBox="0 0 700 700" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
          <g style={{ transformOrigin: '350px 350px', animation: 'rotateCCW 50s linear infinite' }}>
            <circle cx="350" cy="350" r="310" fill="none" stroke="rgba(232,99,42,0.09)" strokeWidth="1" strokeDasharray="5 18" />
            <line x1="350" y1="36"  x2="350" y2="50"  stroke="rgba(232,99,42,0.14)" strokeWidth="1" />
            <line x1="350" y1="650" x2="350" y2="664" stroke="rgba(232,99,42,0.14)" strokeWidth="1" />
            <line x1="36"  y1="350" x2="50"  y2="350" stroke="rgba(232,99,42,0.14)" strokeWidth="1" />
            <line x1="650" y1="350" x2="664" y2="350" stroke="rgba(232,99,42,0.14)" strokeWidth="1" />
          </g>
          <g style={{ transformOrigin: '350px 350px', animation: 'rotateCW 32s linear infinite' }}>
            <circle cx="350" cy="350" r="210" fill="none" stroke="rgba(232,99,42,0.18)" strokeWidth="1" />
            <circle cx="350" cy="140" r="5"  fill="var(--orange)" opacity="0.9" />
            <circle cx="350" cy="140" r="12" fill="rgba(232,99,42,0.18)" />
            <circle cx="350" cy="140" r="20" fill="rgba(232,99,42,0.06)" />
            <circle cx="350" cy="560" r="3"  fill="rgba(232,99,42,0.45)" />
            <circle cx="350" cy="560" r="8"  fill="rgba(232,99,42,0.10)" />
          </g>
          <g style={{ transformOrigin: '350px 350px', animation: 'rotateCCW 68s linear infinite' }}>
            <circle cx="350" cy="350" r="120" fill="none" stroke="rgba(232,99,42,0.07)" strokeWidth="1" strokeDasharray="3 10" />
          </g>
          <circle cx="350" cy="350" r="4"   fill="none" stroke="rgba(232,99,42,0.2)" strokeWidth="1" />
          <circle cx="350" cy="350" r="1.5" fill="rgba(232,99,42,0.4)" />
          <line x1="350" y1="342" x2="350" y2="358" stroke="rgba(232,99,42,0.15)" strokeWidth="0.8" />
          <line x1="342" y1="350" x2="358" y2="350" stroke="rgba(232,99,42,0.15)" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 680, position: 'relative', zIndex: 1 }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          8,
            background:   'var(--orange-pale)',
            border:       '1px solid rgba(232,99,42,0.25)',
            borderRadius: 100,
            padding:      '6px 16px 6px 10px',
            fontSize:     12,
            fontWeight:   500,
            color:        'var(--orange)',
            marginBottom: 32,
          }}
        >
          <span style={{ width: 6, height: 6, background: 'var(--orange)', borderRadius: '50%' }} />
          For African founders, everywhere
        </motion.div>

        {/* Headline — line-by-line clip reveal */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate={ready ? 'visible' : 'hidden'}
          style={{
            fontFamily:    'var(--font-cormorant), Georgia, serif',
            fontSize:      'clamp(48px, 5.8vw, 80px)',
            fontWeight:    600,
            lineHeight:    1.04,
            letterSpacing: '-2px',
            color:         'var(--dark)',
            marginBottom:  28,
          }}
        >
          {[
            { text: 'Stories that move',    italic: false },
            { text: 'investors, customers', italic: true  },
            { text: 'and partners.',         italic: false },
          ].map(({ text, italic }) => (
            <span key={text} style={{ display: 'block', overflow: 'hidden' }}>
              <motion.span
                variants={lineUp}
                style={{
                  display:   'block',
                  fontStyle: italic ? 'italic' : 'normal',
                  color:     italic ? 'var(--orange)' : 'var(--dark)',
                }}
              >
                {text}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          style={{
            fontSize:     18,
            fontWeight:   300,
            color:        'var(--muted-text)',
            lineHeight:   1.8,
            maxWidth:     520,
            marginBottom: 48,
          }}
        >
          Rubyk turns your ideas into narratives that cut through the noise — pitch decks,
          brand identity, and content strategy built for founders who are ready to be heard.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          24,
            marginBottom: 60,
            flexWrap:     'wrap',
          }}
        >
          <MagneticButton href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            Book a free discovery call
          </MagneticButton>
          <MagneticButton href="#work" variant="ghost">
            See our work →
          </MagneticButton>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
          style={{
            display:    'flex',
            gap:        'clamp(28px, 5vw, 52px)',
            paddingTop: 36,
            borderTop:  '1px solid rgba(61,46,30,0.10)',
            flexWrap:   'wrap',
          }}
        >
          {metrics.map((m, i) => (
            <AnimatedCounter key={m.label} val={m.val} label={m.label} delay={i * 120} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}