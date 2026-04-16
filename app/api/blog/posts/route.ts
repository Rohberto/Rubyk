import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'

function isAdmin() {
  return cookies().get('rubyk_admin')?.value === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id)  return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data: post, error } = await supabaseAdmin()
    .from('blog_posts').select('*').eq('id', id).single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ post })
}

export async function POST(req: NextRequest) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db   = supabaseAdmin()

  const { data, error } = await db
    .from('blog_posts')
    .insert([{
      title:       body.title,
      slug:        body.slug,
      excerpt:     body.excerpt     ?? '',
      content:     body.content     ?? '',
      author:      body.author      ?? 'Rubyk',
      tags:        body.tags        ?? [],
      read_time:   body.read_time   ?? '5 min read',
      published:   body.published   ?? false,
      cover_image: body.cover_image ?? '',
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ post: data })
}