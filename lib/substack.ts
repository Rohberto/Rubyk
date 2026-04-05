export interface SubstackPost {
  title:       string
  link:        string
  pubDate:     string
  description: string
  thumbnail?:  string
}

/** Fetch the latest N posts from a Substack RSS feed. Returns [] on any error. */
export async function getSubstackPosts(handle: string, limit = 3): Promise<SubstackPost[]> {
  try {
    const res = await fetch(`https://${handle}.substack.com/feed`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const xml = await res.text()
    return parseRSS(xml, limit)
  } catch {
    return []
  }
}

function parseRSS(xml: string, limit: number): SubstackPost[] {
  const itemMatches = xml.split('<item>').slice(1, limit + 1)
  return itemMatches.map((item) => ({
    title:       cleanCDATA(extractTag(item, 'title')),
    link:        cleanCDATA(extractTag(item, 'link')),
    pubDate:     cleanCDATA(extractTag(item, 'pubDate')),
    description: stripAndTruncate(cleanCDATA(extractTag(item, 'description')), 140),
    thumbnail:   extractAttr(item, 'media:thumbnail', 'url') ?? extractAttr(item, 'enclosure', 'url'),
  }))
}

function extractTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return m ? m[1] : ''
}

function extractAttr(xml: string, tag: string, attr: string): string | undefined {
  const m = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, 'i'))
  return m ? m[1] : undefined
}

function cleanCDATA(s: string): string {
  return s.replace(/<!\[CDATA\[|\]\]>/g, '').trim()
}

function stripAndTruncate(html: string, max: number): string {
  const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  return text.length > max ? text.slice(0, max) + '…' : text
}

/** Format a pubDate string to a readable date. */
export function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
      new Date(dateStr),
    )
  } catch {
    return dateStr
  }
}
