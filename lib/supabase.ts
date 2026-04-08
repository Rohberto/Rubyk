import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/** Public client — reads only, respects RLS */
export const supabase = createClient(url, anon)

/** Admin client — service role key, bypasses RLS. Server-side only. */
export function supabaseAdmin() {
  return createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export interface BlogPost {
  id:         string
  title:      string
  slug:       string
  excerpt:    string
  content:    string
  author:     string
  tags:       string[]
  read_time:  string
  published:  boolean
  created_at: string
  updated_at: string
}