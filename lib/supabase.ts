import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!url || !anon) {
  console.warn('[Rubyk] Supabase env vars missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
}

export const supabase = url && anon ? createClient(url, anon) : null as any

export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  if (!url || !serviceKey) throw new Error('Supabase admin env vars missing.')
  return createClient(url, serviceKey)
}

export interface BlogPost {
  id:           string
  title:        string
  slug:         string
  excerpt:      string
  content:      string
  author:       string
  tags:         string[]
  read_time:    string
  published:    boolean
  cover_image:  string
  created_at:   string
  updated_at:   string
}