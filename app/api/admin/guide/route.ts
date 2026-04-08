import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'

function isAdmin() {
  return cookies().get('rubyk_admin')?.value === process.env.ADMIN_PASSWORD
}

export async function GET() {
  const { data, error } = await supabase
    .from('guide_config')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ config: data })
}

export async function PUT(req: NextRequest) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabaseAdmin()
    .from('guide_config')
    .update({
      badge:        body.badge,
      headline:     body.headline,
      subheadline:  body.subheadline,
      highlights:   body.highlights,
      download_url: body.download_url,
      cover_image:  body.cover_image,
      form_heading: body.form_heading,
      cta_label:    body.cta_label,
      disclaimer:   body.disclaimer,
    })
    .eq('id', 1)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ config: data })
}