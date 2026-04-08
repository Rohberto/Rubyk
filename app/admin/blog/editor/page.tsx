import { Suspense } from 'react'
import BlogEditor from './BlogEditor'

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>Loading editor…</p>
      </div>
    }>
      <BlogEditor />
    </Suspense>
  )
}