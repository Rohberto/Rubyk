'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STARTUP_STAGES = [
  'Idea',
  'MVP',
  'Live but Pre-revenue',
  'Revenue (<2 years)',
  'Revenue (2 years +)',
]

const RAISING_OPTIONS = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Not currently raising, just exploring',
]

const RAISE_AMOUNTS = [
  'Under $50K',
  '$50K–$100K',
  '$100K–$250K',
  '$250K+',
  'Other',
]

const FINANCIAL_MODEL_OPTIONS = [
  "No, haven't started",
  'Yes, but it needs work',
  'Yes, and it\'s investor-ready',
]

const HEARD_FROM_OPTIONS = [
  'Referral',
  'LinkedIn',
  'Instagram',
  'Cohort or community',
  'Other',
]

interface FormData {
  fullName:        string
  email:           string
  whatsapp:        string
  nationality:     string
  startupName:     string
  role:            string
  startupStage:    string
  raising:         string
  raiseAmount:     string
  raiseAmountOther:string
  pitchDeckLink:   string
  revenueLine:     string
  financialModel:  string
  relevantLinks:   string
  heardFrom:       string
  heardFromOther:  string
  feedbackWanted:  string
}

const empty: FormData = {
  fullName: '', email: '', whatsapp: '', nationality: '',
  startupName: '', role: '', startupStage: '', raising: '',
  raiseAmount: '', raiseAmountOther: '', pitchDeckLink: '',
  revenueLine: '', financialModel: '', relevantLinks: '',
  heardFrom: '', heardFromOther: '', feedbackWanted: '',
}

type Status = 'idle' | 'sending' | 'error'

export default function FinModelForm() {
  const [form,   setForm]   = useState<FormData>(empty)
  const [status, setStatus] = useState<Status>('idle')
  const [errMsg, setErrMsg] = useState('')

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending'); setErrMsg('')

    const payload = {
      ...form,
      raiseAmount: form.raiseAmount === 'Other' && form.raiseAmountOther
        ? `Other: ${form.raiseAmountOther}` : form.raiseAmount,
      heardFrom: form.heardFrom === 'Other' && form.heardFromOther
        ? `Other: ${form.heardFromOther}` : form.heardFrom,
    }

    const res  = await fetch('/api/finmodel-contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    if (!res.ok) {
      setErrMsg(data.error ?? 'Something went wrong. Please try again.')
      setStatus('error')
      return
    }

    window.location.href = 'https://calendly.com/rubykco/30min'
  }

  const inp: React.CSSProperties = {
    width: '100%', background: '#fff',
    border: '1.5px solid rgba(61,46,30,0.14)', borderRadius: 8,
    padding: '13px 16px', fontSize: 15, color: 'var(--dark)', outline: 'none',
    fontFamily: 'var(--font-outfit), system-ui, sans-serif', transition: 'border-color 0.2s',
  }
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 500,
    color: 'var(--mid)', marginBottom: 8, letterSpacing: '0.1px',
  }
  const opt: React.CSSProperties = { color: 'var(--orange)', marginLeft: 2 }
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'var(--orange)')
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'rgba(61,46,30,0.14)')

  const RadioGroup = ({ name, value, options, onChange }: {
    name: string; value: string; options: string[]; onChange: (v: string) => void
  }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map(o => (
        <label key={o} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
          background: value === o ? 'var(--orange-pale)' : '#fff',
          border: `1.5px solid ${value === o ? 'rgba(232,99,42,0.4)' : 'rgba(61,46,30,0.12)'}`,
          borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
        }}>
          <input type="radio" name={name} value={o} required checked={value === o}
            onChange={() => onChange(o)}
            style={{ accentColor: 'var(--orange)', width: 16, height: 16, flexShrink: 0 }} />
          <span style={{ fontSize: 14, fontWeight: 300, color: 'var(--mid)' }}>{o}</span>
        </label>
      ))}
    </div>
  )

  const sectionLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 500, textTransform: 'uppercase',
    letterSpacing: '1.5px', color: 'var(--orange)', marginBottom: 20,
    paddingBottom: 10, borderBottom: '1px solid rgba(61,46,30,0.08)',
    display: 'block',
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        background: '#fff', border: '1px solid rgba(61,46,30,0.08)',
        borderRadius: 20, padding: 'clamp(32px, 4vw, 52px)',
        boxShadow: '0 4px 32px rgba(61,46,30,0.05)',
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>

        {/* ── About you ── */}
        <span style={sectionLabel}>About you</span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <label style={lbl}>Full name<span style={opt}>*</span></label>
            <input type="text" value={form.fullName} required
              onChange={e => set('fullName', e.target.value)}
              placeholder="Your full name" style={inp} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={lbl}>Email address<span style={opt}>*</span></label>
            <input type="email" value={form.email} required
              onChange={e => set('email', e.target.value)}
              placeholder="you@startup.com" style={inp} onFocus={focus} onBlur={blur} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <label style={lbl}>
              WhatsApp number
              <span style={{ fontSize: 11, color: 'var(--muted-text)', fontWeight: 400, marginLeft: 6 }}>(optional)</span>
            </label>
            <input type="tel" value={form.whatsapp}
              onChange={e => set('whatsapp', e.target.value)}
              placeholder="+234 800 000 0000" style={inp} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={lbl}>Nationality<span style={opt}>*</span></label>
            <input type="text" value={form.nationality} required
              onChange={e => set('nationality', e.target.value)}
              placeholder="e.g. Nigerian" style={inp} onFocus={focus} onBlur={blur} />
          </div>
        </div>

        {/* ── About your startup ── */}
        <span style={{ ...sectionLabel, marginTop: 8 }}>About your startup</span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <label style={lbl}>Startup Name<span style={opt}>*</span></label>
            <input type="text" value={form.startupName} required
              onChange={e => set('startupName', e.target.value)}
              placeholder="Your company name" style={inp} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={lbl}>Your Role<span style={opt}>*</span></label>
            <input type="text" value={form.role} required
              onChange={e => set('role', e.target.value)}
              placeholder="e.g. Founder, CEO" style={inp} onFocus={focus} onBlur={blur} />
          </div>
        </div>

        <div>
          <label style={lbl}>Stage of Startup<span style={opt}>*</span></label>
          <RadioGroup name="startupStage" value={form.startupStage}
            options={STARTUP_STAGES} onChange={v => set('startupStage', v)} />
        </div>

        {/* ── Fundraising ── */}
        <span style={{ ...sectionLabel, marginTop: 8 }}>Fundraising</span>

        <div>
          <label style={lbl}>What are you raising?<span style={opt}>*</span></label>
          <RadioGroup name="raising" value={form.raising}
            options={RAISING_OPTIONS} onChange={v => set('raising', v)} />
        </div>

        <div>
          <label style={lbl}>How much are you looking to raise?<span style={opt}>*</span></label>
          <RadioGroup name="raiseAmount" value={form.raiseAmount}
            options={RAISE_AMOUNTS} onChange={v => set('raiseAmount', v)} />
          <AnimatePresence>
            {form.raiseAmount === 'Other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden', marginTop: 10 }}
              >
                <input type="text" value={form.raiseAmountOther}
                  onChange={e => set('raiseAmountOther', e.target.value)}
                  placeholder="Please specify" style={inp} onFocus={focus} onBlur={blur} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Pitch deck & financials ── */}
        <span style={{ ...sectionLabel, marginTop: 8 }}>Pitch deck & financials</span>

        <div>
          <label style={lbl}>
            Pitch deck link
            <span style={{ fontSize: 11, color: 'var(--muted-text)', fontWeight: 400, marginLeft: 6 }}>(optional — Google Drive, Dropbox, etc.)</span>
          </label>
          <input type="url" value={form.pitchDeckLink}
            onChange={e => set('pitchDeckLink', e.target.value)}
            placeholder="https://drive.google.com/..." style={inp} onFocus={focus} onBlur={blur} />
        </div>

        <div>
          <label style={lbl}>
            In one line, what does your business actually make money from?
            <span style={{ fontSize: 11, color: 'var(--muted-text)', fontWeight: 400, marginLeft: 6 }}>(optional)</span>
          </label>
          <input type="text" value={form.revenueLine}
            onChange={e => set('revenueLine', e.target.value)}
            placeholder="e.g. We charge SMEs a monthly subscription to access our platform"
            style={inp} onFocus={focus} onBlur={blur} />
        </div>

        <div>
          <label style={lbl}>Do you currently have a financial model?<span style={opt}>*</span></label>
          <RadioGroup name="financialModel" value={form.financialModel}
            options={FINANCIAL_MODEL_OPTIONS} onChange={v => set('financialModel', v)} />
        </div>

        {/* ── Final details ── */}
        <span style={{ ...sectionLabel, marginTop: 8 }}>Final details</span>

        <div>
          <label style={lbl}>
            Any relevant links
            <span style={{ fontSize: 11, color: 'var(--muted-text)', fontWeight: 400, marginLeft: 6 }}>(optional — website, past decks, other context)</span>
          </label>
          <input type="text" value={form.relevantLinks}
            onChange={e => set('relevantLinks', e.target.value)}
            placeholder="https://..." style={inp} onFocus={focus} onBlur={blur} />
        </div>

        <div>
          <label style={lbl}>How did you hear about us?<span style={opt}>*</span></label>
          <RadioGroup name="heardFrom" value={form.heardFrom}
            options={HEARD_FROM_OPTIONS} onChange={v => set('heardFrom', v)} />
          <AnimatePresence>
            {form.heardFrom === 'Other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden', marginTop: 10 }}
              >
                <input type="text" value={form.heardFromOther}
                  onChange={e => set('heardFromOther', e.target.value)}
                  placeholder="Please tell us how" style={inp} onFocus={focus} onBlur={blur} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label style={lbl}>
            What's the one thing you'd want feedback on most?
            <span style={{ fontSize: 11, color: 'var(--muted-text)', fontWeight: 400, marginLeft: 6 }}>(optional)</span>
          </label>
          <textarea value={form.feedbackWanted}
            onChange={e => set('feedbackWanted', e.target.value)}
            placeholder="e.g. Our revenue projections, the clarity of our problem slide…"
            rows={3}
            style={{ ...inp, resize: 'vertical', lineHeight: 1.65, minHeight: 90, paddingTop: 12 } as React.CSSProperties}
            onFocus={focus} onBlur={blur} />
        </div>

        {status === 'error' && (
          <p style={{ fontSize: 13, color: '#e74c3c', margin: 0 }}>{errMsg}</p>
        )}

        <div style={{ borderTop: '1px solid rgba(61,46,30,0.08)', paddingTop: 8 }}>
          <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--muted-text)', marginBottom: 16 }}>
            <span style={opt}>*</span> Required · After submitting you'll be taken to book your 30-minute call.
          </p>
          <button type="submit" disabled={status === 'sending'} style={{
            width: '100%', background: status === 'sending' ? 'rgba(232,99,42,0.6)' : 'var(--orange)',
            color: '#fff', border: 'none', borderRadius: 10, padding: '16px',
            fontSize: 16, fontWeight: 500,
            cursor: status === 'sending' ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-outfit), system-ui, sans-serif',
            transition: 'background 0.2s', boxShadow: '0 8px 28px rgba(232,99,42,0.2)',
          }}
          onMouseEnter={e => { if (status !== 'sending') e.currentTarget.style.background = 'var(--dark)' }}
          onMouseLeave={e => { if (status !== 'sending') e.currentTarget.style.background = 'var(--orange)' }}
          >
            {status === 'sending' ? 'Submitting…' : 'Submit & Book My Call →'}
          </button>
        </div>
      </div>
    </form>
  )
}