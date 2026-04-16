import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'

function isAdmin() {
  return cookies().get('rubyk_admin')?.value === process.env.ADMIN_PASSWORD
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db   = supabaseAdmin()

  const { data, error } = await db
    .from('blog_posts')
    .update({
      title:       body.title,
      slug:        body.slug,
      excerpt:     body.excerpt,
      content:     body.content,
      author:      body.author,
      tags:        body.tags,
      read_time:   body.read_time,
      published:   body.published,
      cover_image: body.cover_image ?? '',
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ post: data })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabaseAdmin()
    .from('blog_posts')
    .delete()
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}