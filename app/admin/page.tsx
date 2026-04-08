'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/blog')
    } else {
      setError('Wrong password. Try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--dark)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: '#1a0f06', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: 'clamp(32px, 5vw, 52px)',
        width: '100%', maxWidth: 400,
      }}>
        <div style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: 28, fontWeight: 700, color: 'var(--orange)',
          letterSpacing: '-0.5px', marginBottom: 8,
        }}>
          Rubyk
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 36 }}>
          Admin — Blog Editor
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required autoFocus
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, padding: '13px 16px',
              fontSize: 15, color: '#fff', outline: 'none',
              fontFamily: 'var(--font-outfit), system-ui, sans-serif',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--orange)')}
            onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
          {error && <p style={{ fontSize: 13, color: '#e74c3c', margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{
            background: loading ? 'rgba(232,99,42,0.5)' : 'var(--orange)',
            color: '#fff', border: 'none', borderRadius: 8,
            padding: '13px', fontSize: 15, fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-outfit), system-ui, sans-serif',
            transition: 'background 0.2s', marginTop: 4,
          }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}