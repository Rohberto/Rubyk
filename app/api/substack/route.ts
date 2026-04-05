import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://rubykco.substack.com/feed', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)

    const xml = await res.text()

    // Debug: log a slice so you can see the real RSS structure
    console.log('[Substack RSS] First 800 chars:\n', xml.slice(0, 800))

    return new NextResponse(xml, {
      headers: { 'Content-Type': 'application/xml' },
    })
  } catch (err) {
    console.error('[Substack RSS] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 })
  }
}