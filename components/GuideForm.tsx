'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'


type Status = 'idle' | 'loading' | 'success' | 'error'

interface GuideFormProps { formHeading: string; ctaLabel: string; disclaimer: string }

export default function GuideForm({ formHeading, ctaLabel, disclaimer }: GuideFormProps) {
  const [name,   setName]   = useState('')
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errMsg, setErrMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrMsg('')

    try {
      const res = await fetch('/api/send-guide', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrMsg(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width:       '100%',
    padding:     '13px 16px',
    fontSize:    15,
    fontWeight:  300,
    fontFamily:  'var(--font-outfit), system-ui, sans-serif',
    color:       'var(--dark)',
    background:  'var(--cream)',
    border:      '1px solid rgba(61,46,30,0.14)',
    borderRadius: 8,
    outline:     'none',
    transition:  'border-color 0.2s',
  }

  return (
    <div style={{
      background:   '#fff',
      border:       '1px solid rgba(61,46,30,0.10)',
      borderRadius: 20,
      padding:      'clamp(28px, 4vw, 44px)',
      boxShadow:    '0 24px 64px rgba(61,46,30,0.09)',
      position:     'sticky',
      top:          88,
    }}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          /* ── Success state ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', padding: '16px 0' }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'var(--orange-pale)',
              border: '1px solid rgba(232,99,42,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: 22,
            }}>
              ✓
            </div>
            <h3 style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 24, fontWeight: 600, color: 'var(--dark)',
              letterSpacing: '-0.5px', marginBottom: 10,
            }}>
              Check your inbox
            </h3>
            <p style={{
              fontSize: 15, fontWeight: 300, color: 'var(--muted-text)', lineHeight: 1.7,
            }}>
              We've sent your copy of the guide to <strong style={{ color: 'var(--dark)', fontWeight: 500 }}>{email}</strong>.
              Check your spam folder if it doesn't arrive within a minute.
            </p>
          </motion.div>
        ) : (
          /* ── Form state ── */
          <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 style={{
              fontFamily:    'var(--font-cormorant), Georgia, serif',
              fontSize:      'clamp(22px, 2.5vw, 28px)',
              fontWeight:    600,
              color:         'var(--dark)',
              letterSpacing: '-0.5px',
              marginBottom:  6,
            }}>
              {formHeading}
            </h3>
            <p style={{
              fontSize: 14, fontWeight: 300,
              color: 'var(--muted-text)', marginBottom: 24, lineHeight: 1.6,
            }}>
              Drop your name and email, we'll send the guide straight to your inbox.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e)  => (e.currentTarget.style.borderColor = 'var(--orange)')}
                onBlur={(e)   => (e.currentTarget.style.borderColor = 'rgba(61,46,30,0.14)')}
              />
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e)  => (e.currentTarget.style.borderColor = 'var(--orange)')}
                onBlur={(e)   => (e.currentTarget.style.borderColor = 'rgba(61,46,30,0.14)')}
              />

              {errMsg && (
                <p style={{ fontSize: 13, color: '#c0392b', margin: '0' }}>{errMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  marginTop:    4,
                  background:   status === 'loading' ? 'rgba(232,99,42,0.6)' : 'var(--orange)',
                  color:        '#fff',
                  border:       'none',
                  borderRadius: 8,
                  padding:      '14px',
                  fontSize:     15,
                  fontWeight:   500,
                  fontFamily:   'var(--font-outfit), system-ui, sans-serif',
                  cursor:       status === 'loading' ? 'not-allowed' : 'pointer',
                  transition:   'background 0.2s',
                  width:        '100%',
                }}
                onMouseEnter={(e) => {
                  if (status !== 'loading') e.currentTarget.style.background = 'var(--dark)'
                }}
                onMouseLeave={(e) => {
                  if (status !== 'loading') e.currentTarget.style.background = 'var(--orange)'
                }}
              >
                {status === 'loading' ? 'Sending…' : ctaLabel}
              </button>
            </form>

            <p style={{
              fontSize: 12, fontWeight: 300, color: 'var(--muted-text)',
              textAlign: 'center', marginTop: 14,
            }}>
              {disclaimer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}