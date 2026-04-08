'use client'

import { useRouter } from 'next/navigation'

export default function AdminLogout() {
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <button
      onClick={logout}
      style={{
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.4)',
        borderRadius: 8, padding: '9px 16px',
        fontSize: 13, cursor: 'pointer',
        fontFamily: 'var(--font-outfit), system-ui, sans-serif',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
        e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
        e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
      }}
    >
      Sign out
    </button>
  )
}