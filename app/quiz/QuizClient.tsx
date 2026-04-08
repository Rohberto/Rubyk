'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions, getResult, CALENDLY_URL, GUIDE_URL } from '@/data/quiz'

type Phase = 'intro' | 'quiz' | 'results'

const ease = [0.16, 1, 0.3, 1] as const

/* ── shared styles ───────────────────────────────────────── */
const section: React.CSSProperties = {
  background:     'var(--cream)',
  minHeight:      '100vh',
  paddingTop:     90,
  display:        'flex',
  flexDirection:  'column',
  alignItems:     'center',
  justifyContent: 'center',
  padding:        'clamp(96px, 10vw, 140px) clamp(20px, 7vw, 96px) clamp(64px, 8vw, 96px)',
}

export default function QuizClient() {
  const [phase,      setPhase]      = useState<Phase>('intro')
  const [current,    setCurrent]    = useState(0)
  const [answers,    setAnswers]    = useState<number[]>([])
  const [selected,   setSelected]   = useState<number | null>(null)
  const [direction,  setDirection]  = useState(1)

  const totalScore  = answers.reduce((s, a) => s + a, 0)
  const result      = getResult(totalScore)
  const progress    = ((current) / questions.length) * 100
  const q           = questions[current]

  const choose = (score: number, idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    setTimeout(() => {
      setDirection(1)
      const next = [...answers, score]
      setAnswers(next)
      if (current + 1 < questions.length) {
        setCurrent(c => c + 1)
        setSelected(null)
      } else {
        setPhase('results')
      }
    }, 520)
  }

  const restart = () => {
    setPhase('intro')
    setCurrent(0)
    setAnswers([])
    setSelected(null)
    setDirection(1)
  }

  const slideVariants = {
    enter:  (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  }

  /* ─────────────────────────── INTRO ─────────────────────── */
  if (phase === 'intro') return (
    <main style={section}>
      <div style={{ maxWidth: 680, width: '100%', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          style={{
            display:      'inline-flex', alignItems: 'center', gap: 8,
            background:   'var(--orange-pale)',
            border:       '1px solid rgba(232,99,42,0.25)',
            borderRadius: 100, padding: '5px 16px 5px 10px',
            fontSize:     12, fontWeight: 500, color: 'var(--orange)',
            marginBottom: 28,
          }}
        >
          <span style={{ width: 6, height: 6, background: 'var(--orange)', borderRadius: '50%' }} />
          Free · 2 minutes · 10 questions
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease, delay: 0.1 }}
          style={{
            fontFamily:    'var(--font-cormorant), Georgia, serif',
            fontSize:      'clamp(40px, 5.5vw, 72px)',
            fontWeight:    600,
            color:         'var(--dark)',
            letterSpacing: '-2px',
            lineHeight:    1.06,
            marginBottom:  20,
          }}
        >
          How strong is your<br />
          <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>founder story?</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.22 }}
          style={{
            fontSize:     18,
            fontWeight:   300,
            color:        'var(--muted-text)',
            lineHeight:   1.78,
            marginBottom: 48,
            maxWidth:     520,
            margin:       '0 auto 48px',
          }}
        >
          Answer 10 questions about your pitch, brand, and messaging.
          Get a personalised score and a clear picture of where your narrative
          is working — and where it's costing you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.35 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
        >
          <button
            onClick={() => setPhase('quiz')}
            style={{
              background:   'var(--orange)', color: '#fff',
              border:       'none', borderRadius: 10,
              padding:      '16px 40px', fontSize: 16, fontWeight: 500,
              cursor:       'pointer',
              fontFamily:   'var(--font-outfit), system-ui, sans-serif',
              transition:   'all 0.2s',
              boxShadow:    '0 8px 28px rgba(232,99,42,0.22)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--dark)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--orange)')}
          >
            Start the quiz →
          </button>
          <p style={{ fontSize: 12, color: 'var(--muted-text)', fontWeight: 300 }}>
            No email required · Results shown immediately
          </p>
        </motion.div>

        {/* Category tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{
            display:        'flex',
            flexWrap:       'wrap',
            justifyContent: 'center',
            gap:            8,
            marginTop:      56,
            paddingTop:     40,
            borderTop:      '1px solid rgba(61,46,30,0.08)',
          }}
        >
          {['Clarity', 'Origin Story', 'Investor Narrative', 'Customer Messaging',
            'Differentiation', 'Brand Voice', 'Thought Leadership', 'Vision', 'Proof Points', 'Resonance',
          ].map(cat => (
            <span key={cat} style={{
              fontSize:     11, fontWeight: 400, color: 'var(--muted-text)',
              background:   'var(--warm)',
              border:       '1px solid rgba(61,46,30,0.09)',
              borderRadius: 20, padding: '4px 12px',
            }}>{cat}</span>
          ))}
        </motion.div>
      </div>
    </main>
  )

  /* ─────────────────────────── QUIZ ──────────────────────── */
  if (phase === 'quiz') return (
    <main style={{ ...section, justifyContent: 'flex-start' }}>
      <div style={{ maxWidth: 720, width: '100%' }}>

        {/* Progress bar */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            marginBottom:   10,
          }}>
            <span style={{ fontSize: 12, color: 'var(--muted-text)', fontWeight: 400 }}>
              Question {current + 1} of {questions.length}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 500, textTransform: 'uppercase',
              letterSpacing: '1px', color: 'var(--orange)',
            }}>
              {q.category}
            </span>
          </div>
          <div style={{
            height: 3, background: 'rgba(61,46,30,0.10)', borderRadius: 2, overflow: 'hidden',
          }}>
            <motion.div
              style={{ height: '100%', background: 'var(--orange)', borderRadius: 2 }}
              initial={{ width: `${((current) / questions.length) * 100}%` }}
              animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease }}
          >
            <h2 style={{
              fontFamily:    'var(--font-cormorant), Georgia, serif',
              fontSize:      'clamp(24px, 3vw, 36px)',
              fontWeight:    600,
              color:         'var(--dark)',
              letterSpacing: '-0.5px',
              lineHeight:    1.3,
              marginBottom:  36,
            }}>
              {q.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {q.options.map((opt, i) => {
                const isSelected  = selected === i
                const isDeselected = selected !== null && selected !== i

                return (
                  <motion.button
                    key={i}
                    onClick={() => choose(opt.score, i)}
                    disabled={selected !== null}
                    whileHover={selected === null ? { x: 4 } : {}}
                    transition={{ duration: 0.2 }}
                    style={{
                      display:       'flex',
                      alignItems:    'flex-start',
                      gap:           16,
                      background:    isSelected ? 'var(--orange)' : '#fff',
                      border:        `1.5px solid ${isSelected ? 'var(--orange)' : 'rgba(61,46,30,0.10)'}`,
                      borderRadius:  12,
                      padding:       '18px 20px',
                      cursor:        selected !== null ? 'default' : 'pointer',
                      textAlign:     'left',
                      width:         '100%',
                      opacity:       isDeselected ? 0.4 : 1,
                      transition:    'all 0.25s ease',
                      fontFamily:    'var(--font-outfit), system-ui, sans-serif',
                    }}
                  >
                    {/* Letter badge */}
                    <span style={{
                      width:          28,
                      height:         28,
                      borderRadius:   '50%',
                      background:     isSelected ? 'rgba(255,255,255,0.25)' : 'var(--warm)',
                      border:         `1px solid ${isSelected ? 'transparent' : 'rgba(61,46,30,0.10)'}`,
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      fontSize:       12,
                      fontWeight:     600,
                      color:          isSelected ? '#fff' : 'var(--orange)',
                      flexShrink:     0,
                      marginTop:      1,
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>

                    <span style={{
                      fontSize:   15,
                      fontWeight: 300,
                      color:      isSelected ? '#fff' : 'var(--mid)',
                      lineHeight: 1.65,
                    }}>
                      {opt.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )

  /* ─────────────────────────── RESULTS ───────────────────── */
  return (
    <main style={{ ...section, justifyContent: 'flex-start' }}>
      <div style={{ maxWidth: 720, width: '100%' }}>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
          >
            {/* Score card */}
            <div style={{
              background:    'var(--dark)',
              borderRadius:  20,
              padding:       'clamp(32px, 5vw, 52px)',
              marginBottom:  28,
              position:      'relative',
              overflow:      'hidden',
            }}>
              {/* Glow */}
              <div aria-hidden style={{
                position:   'absolute', top: '-100px', right: '-100px',
                width:      400, height: 400, borderRadius: '50%',
                background: `radial-gradient(circle, ${result.color}33 0%, transparent 65%)`,
                pointerEvents: 'none',
              }} />

              <div style={{
                display:        'flex',
                alignItems:     'flex-start',
                justifyContent: 'space-between',
                flexWrap:       'wrap',
                gap:            24,
                position:       'relative',
                zIndex:         1,
              }}>
                <div>
                  <p style={{
                    fontSize:      11, fontWeight: 500,
                    textTransform: 'uppercase', letterSpacing: '2px',
                    color:         'rgba(255,255,255,0.35)', marginBottom: 12,
                  }}>
                    Your storytelling tier
                  </p>
                  <div style={{
                    display:      'inline-flex',
                    alignItems:   'center',
                    gap:          10,
                    background:   `${result.color}22`,
                    border:       `1px solid ${result.color}55`,
                    borderRadius: 100,
                    padding:      '6px 18px 6px 10px',
                    marginBottom: 20,
                  }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: result.color, display: 'inline-block',
                    }} />
                    <span style={{
                      fontSize:   13, fontWeight: 500,
                      color:      result.color, letterSpacing: '0.3px',
                    }}>
                      {result.tier}
                    </span>
                  </div>

                  <h2 style={{
                    fontFamily:    'var(--font-cormorant), Georgia, serif',
                    fontSize:      'clamp(26px, 3vw, 38px)',
                    fontWeight:    600,
                    color:         'var(--cream)',
                    letterSpacing: '-0.5px',
                    lineHeight:    1.2,
                    maxWidth:      420,
                  }}>
                    {result.headline}
                  </h2>
                </div>

                {/* Score circle */}
                <div style={{
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     'center',
                  justifyContent: 'center',
                  width:          96,
                  height:         96,
                  borderRadius:   '50%',
                  border:         `2px solid ${result.color}`,
                  background:     `${result.color}15`,
                  flexShrink:     0,
                }}>
                  <span style={{
                    fontFamily:    'var(--font-cormorant), Georgia, serif',
                    fontSize:      32,
                    fontWeight:    600,
                    color:         result.color,
                    lineHeight:    1,
                  }}>
                    {totalScore}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                    / 30
                  </span>
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontSize:    16,
                fontWeight:  300,
                color:       'rgba(253,250,246,0.6)',
                lineHeight:  1.78,
                marginTop:   24,
                position:    'relative',
                zIndex:      1,
              }}>
                {result.description}
              </p>
            </div>

            {/* Strengths + Gaps */}
            <div style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap:                 16,
              marginBottom:        28,
            }}>
              {/* Strengths */}
              <div style={{
                background:   '#fff',
                border:       '1px solid rgba(61,46,30,0.08)',
                borderRadius: 16,
                padding:      28,
              }}>
                <div style={{
                  fontSize:      11, fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '1.5px',
                  color:         '#1a9e6e', marginBottom: 16,
                  display:       'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: 'rgba(26,158,110,0.12)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10,
                  }}>✓</span>
                  What's working
                </div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.strengths.map((s, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#1a9e6e', flexShrink: 0, marginTop: 5,
                      }} />
                      <span style={{ fontSize: 14, fontWeight: 300, color: 'var(--mid)', lineHeight: 1.6 }}>
                        {s}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gaps */}
              <div style={{
                background:   '#fff',
                border:       '1px solid rgba(61,46,30,0.08)',
                borderRadius: 16,
                padding:      28,
              }}>
                <div style={{
                  fontSize:      11, fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '1.5px',
                  color:         'var(--orange)', marginBottom: 16,
                  display:       'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: 'rgba(232,99,42,0.12)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: 'var(--orange)',
                  }}>→</span>
                  Where to focus next
                </div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.gaps.map((g, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: 'var(--orange)', flexShrink: 0, marginTop: 5,
                      }} />
                      <span style={{ fontSize: 14, fontWeight: 300, color: 'var(--mid)', lineHeight: 1.6 }}>
                        {g}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Per-question breakdown */}
            <div style={{
              background:   '#fff',
              border:       '1px solid rgba(61,46,30,0.08)',
              borderRadius: 16,
              padding:      28,
              marginBottom: 28,
            }}>
              <p style={{
                fontSize: 11, fontWeight: 500, textTransform: 'uppercase',
                letterSpacing: '1.5px', color: 'var(--muted-text)', marginBottom: 20,
              }}>
                Question breakdown
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {questions.map((q, i) => {
                  const score = answers[i] ?? 0
                  const pct   = ((score - 1) / 2) * 100
                  return (
                    <div key={i}>
                      <div style={{
                        display:        'flex',
                        justifyContent: 'space-between',
                        alignItems:     'center',
                        marginBottom:   5,
                      }}>
                        <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--mid)' }}>
                          {q.category}
                        </span>
                        <span style={{
                          fontSize:   11,
                          color:      score === 3 ? '#1a9e6e' : score === 2 ? 'var(--orange)' : 'var(--muted-text)',
                          fontWeight: 500,
                        }}>
                          {score === 3 ? 'Strong' : score === 2 ? 'Developing' : 'Needs work'}
                        </span>
                      </div>
                      <div style={{
                        height: 4, background: 'var(--warm)',
                        borderRadius: 2, overflow: 'hidden',
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease, delay: i * 0.05 }}
                          style={{
                            height:     '100%',
                            background: score === 3 ? '#1a9e6e' : score === 2 ? 'var(--orange)' : '#B4B2A9',
                            borderRadius: 2,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CTAs */}
            <div style={{
              background:   'var(--orange-pale)',
              border:       '1px solid rgba(232,99,42,0.14)',
              borderRadius: 16,
              padding:      28,
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'space-between',
              flexWrap:     'wrap',
              gap:          20,
            }}>
              <div>
                <h3 style={{
                  fontFamily:    'var(--font-cormorant), Georgia, serif',
                  fontSize:      22, fontWeight: 600,
                  color:         'var(--dark)', letterSpacing: '-0.3px', marginBottom: 4,
                }}>
                  Ready to level up?
                </h3>
                <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--muted-text)' }}>
                  {totalScore <= 22
                    ? 'Book a free 30-min call — we\'ll walk through exactly where to start.'
                    : 'Download our free guide to sharpen what\'s already working.'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a
                  href={totalScore <= 22 ? CALENDLY_URL : GUIDE_URL}
                  target={totalScore <= 22 ? '_blank' : undefined}
                  rel={totalScore <= 22 ? 'noopener noreferrer' : undefined}
                  style={{
                    background:     'var(--orange)', color: '#fff',
                    textDecoration: 'none', borderRadius: 8,
                    padding:        '12px 22px', fontSize: 14, fontWeight: 500,
                    fontFamily:     'var(--font-outfit), system-ui, sans-serif',
                    transition:     'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--dark)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--orange)')}
                >
                  {result.cta}
                </a>
                <button
                  onClick={restart}
                  style={{
                    background:   'transparent',
                    border:       '1px solid rgba(61,46,30,0.15)',
                    color:        'var(--muted-text)',
                    borderRadius: 8, padding: '12px 22px',
                    fontSize:     14, cursor: 'pointer',
                    fontFamily:   'var(--font-outfit), system-ui, sans-serif',
                    transition:   'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.color = 'var(--orange)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(61,46,30,0.15)'; e.currentTarget.style.color = 'var(--muted-text)' }}
                >
                  Retake quiz
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}