'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SERVICES = [
  'Fundraising: Pitch Deck, Investor Materials, Financial Models',
  'Branding & Design',
  'PR and Thought Leadership',
  'Other',
]

interface FormData {
  name:        string
  email:       string
  phone:       string
  company:     string
  role:        string
  service:     string
  otherService:string
  goal:        string
  additional:  string
}

const empty: FormData = {
  name: '', email: '', phone: '', company: '',
  role: '', service: '', otherService: '', goal: '', additional: '',
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function StartForm() {
  const [form,   setForm]   = useState<FormData>(empty)
  const [status, setStatus] = useState<Status>('idle')
  const [errMsg, setErrMsg] = useState('')

  const set = (k: keyof FormData, v: string) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending'); setErrMsg('')

    const payload = {
      ...form,
      service: form.service === 'Other' && form.otherService
        ? `Other: ${form.otherService}`
        : form.service,
    }

    const res  = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    const data = await res.json()

    if (!res.ok) {
      setErrMsg(data.error ?? 'Something went wrong. Please try again.')
      setStatus('error')
    } else {
      // Redirect to Calendly after successful submission
      window.location.href = 'https://calendly.com/rubykco/rubyk-project-consultation'
    }
  }

  const inp: React.CSSProperties = {
    width:        '100%',
    background:   '#fff',
    border:       '1.5px solid rgba(61,46,30,0.14)',
    borderRadius: 8,
    padding:      '13px 16px',
    fontSize:     15,
    color:        'var(--dark)',
    outline:      'none',
    fontFamily:   'var(--font-outfit), system-ui, sans-serif',
    transition:   'border-color 0.2s',
  }
  const lbl: React.CSSProperties = {
    display:       'block',
    fontSize:      13,
    fontWeight:    500,
    color:         'var(--mid)',
    marginBottom:  8,
    letterSpacing: '0.1px',
  }
  const req: React.CSSProperties = { color: 'var(--orange)', marginLeft: 2 }
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'var(--orange)')
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'rgba(61,46,30,0.14)')

  /* ── Success state ── */
  if (status === 'success') return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: '#fff', border: '1px solid rgba(61,46,30,0.08)',
        borderRadius: 20, padding: 'clamp(40px, 5vw, 64px)',
        textAlign: 'center', boxShadow: '0 8px 40px rgba(61,46,30,0.06)',
      }}
    >
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'var(--orange-pale)', border: '1px solid rgba(232,99,42,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px', fontSize: 28,
      }}>✓</div>
      <h2 style={{
        fontFamily: 'var(--font-cormorant), Georgia, serif',
        fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 600,
        color: 'var(--dark)', letterSpacing: '-0.5px', marginBottom: 12,
      }}>
        We've got your details.
      </h2>
      <p style={{
        fontSize: 16, fontWeight: 300, color: 'var(--muted-text)',
        lineHeight: 1.75, maxWidth: 440, margin: '0 auto 8px',
      }}>
        Thank you for reaching out. We'll review your message and be in touch shortly to confirm next steps.
      </p>
      <p style={{ fontSize: 14, color: 'var(--muted-text)', fontWeight: 300 }}>
        Check your inbox — a confirmation has been sent to <strong style={{ color: 'var(--dark)', fontWeight: 500 }}>{form.email}</strong>.
      </p>
    </motion.div>
  )

  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        background: '#fff', border: '1px solid rgba(61,46,30,0.08)',
        borderRadius: 20, padding: 'clamp(32px, 4vw, 52px)',
        boxShadow: '0 4px 32px rgba(61,46,30,0.05)',
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>

        {/* Row: Name + Email */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <label style={lbl}>Name<span style={req}>*</span></label>
            <input
              type="text" value={form.name} required
              onChange={e => set('name', e.target.value)}
              placeholder="Your full name"
              style={inp} onFocus={focus} onBlur={blur}
            />
          </div>
          <div>
            <label style={lbl}>Email Address<span style={req}>*</span></label>
            <input
              type="email" value={form.email} required
              onChange={e => set('email', e.target.value)}
              placeholder="you@company.com"
              style={inp} onFocus={focus} onBlur={blur}
            />
          </div>
        </div>

        {/* Row: Phone + Company */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <label style={lbl}>Phone Number<span style={req}>*</span></label>
            <input
              type="tel" value={form.phone} required
              onChange={e => set('phone', e.target.value)}
              placeholder="+234 800 000 0000"
              style={inp} onFocus={focus} onBlur={blur}
            />
          </div>
          <div>
            <label style={lbl}>Company Name<span style={req}>*</span></label>
            <input
              type="text" value={form.company} required
              onChange={e => set('company', e.target.value)}
              placeholder="Your startup or company"
              style={inp} onFocus={focus} onBlur={blur}
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <label style={lbl}>Your Role<span style={req}>*</span></label>
          <input
            type="text" value={form.role} required
            onChange={e => set('role', e.target.value)}
            placeholder="e.g. Founder, CEO, Marketing Lead"
            style={inp} onFocus={focus} onBlur={blur}
          />
        </div>

        {/* Service — radio */}
        <div>
          <label style={lbl}>What service are you interested in?<span style={req}>*</span></label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SERVICES.map(svc => (
              <label
                key={svc}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          12,
                  padding:      '14px 16px',
                  background:   form.service === svc ? 'var(--orange-pale)' : '#fff',
                  border:       `1.5px solid ${form.service === svc ? 'rgba(232,99,42,0.4)' : 'rgba(61,46,30,0.12)'}`,
                  borderRadius: 8,
                  cursor:       'pointer',
                  transition:   'all 0.2s',
                }}
              >
                <input
                  type="radio" name="service" value={svc} required
                  checked={form.service === svc}
                  onChange={() => set('service', svc)}
                  style={{ accentColor: 'var(--orange)', width: 16, height: 16, flexShrink: 0 }}
                />
                <span style={{ fontSize: 14, fontWeight: 300, color: 'var(--mid)' }}>{svc}</span>
              </label>
            ))}
          </div>

          {/* Other text input */}
          <AnimatePresence>
            {form.service === 'Other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden', marginTop: 10 }}
              >
                <input
                  type="text" value={form.otherService}
                  onChange={e => set('otherService', e.target.value)}
                  placeholder="Please describe what you're looking for"
                  style={inp} onFocus={focus} onBlur={blur}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Goal */}
        <div>
          <label style={lbl}>
            Is there a specific goal you're working towards?
            <span style={{ fontSize: 11, color: 'var(--muted-text)', fontWeight: 400, marginLeft: 6 }}>(optional)</span>
          </label>
          <textarea
            value={form.goal}
            onChange={e => set('goal', e.target.value)}
            placeholder="e.g. Raise a seed round in Q3, launch brand in two markets, close first enterprise clients…"
            rows={3}
            style={{
              ...inp, resize: 'vertical', lineHeight: 1.65,
              minHeight: 90, paddingTop: 12,
            } as React.CSSProperties}
            onFocus={focus} onBlur={blur}
          />
        </div>

        {/* Additional info */}
        <div>
          <label style={lbl}>
            Anything else you'd like to share?
            <span style={{ fontSize: 11, color: 'var(--muted-text)', fontWeight: 400, marginLeft: 6 }}>(optional)</span>
          </label>
          <textarea
            value={form.additional}
            onChange={e => set('additional', e.target.value)}
            placeholder="Timeline, budget range, context about your company…"
            rows={3}
            style={{
              ...inp, resize: 'vertical', lineHeight: 1.65,
              minHeight: 90, paddingTop: 12,
            } as React.CSSProperties}
            onFocus={focus} onBlur={blur}
          />
        </div>

        {/* Error */}
        {status === 'error' && (
          <p style={{ fontSize: 13, color: '#e74c3c', margin: 0 }}>{errMsg}</p>
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(61,46,30,0.08)', paddingTop: 8 }}>
          <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--muted-text)', marginBottom: 16 }}>
            <span style={req}>*</span> Required fields
          </p>
          <button
            type="submit"
            disabled={status === 'sending'}
            style={{
              width:        '100%',
              background:   status === 'sending' ? 'rgba(232,99,42,0.6)' : 'var(--orange)',
              color:        '#fff',
              border:       'none',
              borderRadius: 10,
              padding:      '16px',
              fontSize:     16,
              fontWeight:   500,
              cursor:       status === 'sending' ? 'not-allowed' : 'pointer',
              fontFamily:   'var(--font-outfit), system-ui, sans-serif',
              transition:   'background 0.2s',
              boxShadow:    '0 8px 28px rgba(232,99,42,0.2)',
            }}
            onMouseEnter={e => { if (status !== 'sending') e.currentTarget.style.background = 'var(--dark)' }}
            onMouseLeave={e => { if (status !== 'sending') e.currentTarget.style.background = 'var(--orange)' }}
          >
            {status === 'sending' ? 'Submitting…' : 'Submit →'}
          </button>
        </div>
      </div>
    </form>
  )
}