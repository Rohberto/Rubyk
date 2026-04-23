// app/api/blog/upload/route.ts

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role key so it can bypass RLS
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WEBP and GIF are allowed' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
    }

    const ext      = file.name.split('.').pop()
    const filename = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer   = Buffer.from(await file.arrayBuffer())

    const { error } = await supabase.storage
      .from('images') // your bucket name — change if different
      .upload(filename, buffer, { contentType: file.type, upsert: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}