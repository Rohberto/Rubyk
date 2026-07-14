import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, company, role, service, goal, additional } = body

  if (!name || !email || !phone || !company || !role || !service) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 })
  }

  const firstName = name.split(' ')[0]

  /* ── Save to Supabase ── */
  const { error: dbError } = await supabaseAdmin()
    .from('project_leads')
    .insert([{ name, email, phone, company, role, service, goal: goal || '', additional: additional || '' }])

  if (dbError) console.error('[Contact] DB error:', dbError.message)

  /* ── Notify team ── */
  const teamHtml = `
    <!DOCTYPE html><html><head><meta charset="utf-8"/></head>
    <body style="margin:0;padding:0;background:#FDFAF6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFAF6;padding:40px 24px;">
      <tr><td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr><td style="padding-bottom:24px;">
            <img src="https://rubyk.co/wp-content/uploads/2026/03/Rubyk-website-logo-scaled.png" alt="Rubyk" height="26" style="display:block;"/>
          </td></tr>
          <tr><td style="background:#1E1409;border-radius:16px;padding:32px;">
            <p style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:2px;color:#E8632A;margin:0 0 8px;">New project enquiry</p>
            <h2 style="font-family:Georgia,serif;font-size:24px;font-weight:600;color:#FDFAF6;margin:0 0 24px;letter-spacing:-0.3px;">
              ${name} wants to start a project
            </h2>
            ${[
              ['Name',       name],
              ['Email',      email],
              ['Phone',      phone],
              ['Company',    company],
              ['Role',       role],
              ['Service',    service],
              goal       ? ['Goal',       goal]       : null,
              additional ? ['Additional', additional] : null,
          ].filter(Boolean).map((item) => {
  const [k, v] = item as [string, string]
  return `
    <div style="border-top:1px solid rgba(255,255,255,0.07);padding:12px 0;">
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.35);margin:0 0 4px;">${k}</p>
      <p style="font-size:14px;font-weight:300;color:rgba(253,250,246,0.8);margin:0;line-height:1.6;">${v}</p>
    </div>
  `
}).join('')}
            <div style="margin-top:24px;">
              <a href="mailto:${email}" style="display:inline-block;background:#E8632A;color:#fff;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:500;text-decoration:none;">
                Reply to ${firstName} →
              </a>
            </div>
          </td></tr>
          <tr><td style="padding-top:24px;text-align:center;">
            <p style="font-size:12px;color:rgba(61,46,30,0.35);margin:0;">© 2026 Rubyk Co. · hello@rubyk.co</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
    </body></html>
  `

  /* ── Confirmation to user ── */
  const userHtml = `
    <!DOCTYPE html><html><head><meta charset="utf-8"/></head>
    <body style="margin:0;padding:0;background:#FDFAF6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFAF6;padding:48px 24px;">
      <tr><td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr><td style="padding-bottom:32px;">
            <img src="https://rubyk.co/wp-content/uploads/2026/03/Rubyk-website-logo-scaled.png" alt="Rubyk" height="28" style="display:block;"/>
          </td></tr>
          <tr><td style="background:#fff;border:1px solid rgba(61,46,30,0.10);border-radius:16px;padding:40px;">
            <p style="font-size:13px;font-weight:500;text-transform:uppercase;letter-spacing:2px;color:#E8632A;margin:0 0 12px;">We've received your message</p>
            <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:600;color:#1E1409;letter-spacing:-0.5px;line-height:1.2;margin:0 0 16px;">
              Thanks, ${firstName}. We'll be in touch soon.
            </h1>
            <p style="font-size:16px;font-weight:300;color:#7A6252;line-height:1.75;margin:0 0 24px;">
              We've received your project enquiry about <strong style="color:#1E1409;">${service}</strong>. 
              Our team will review your message and reach out within 1–2 business days to discuss next steps.
            </p>
            <div style="background:#FDF0E8;border:1px solid rgba(232,99,42,0.15);border-radius:10px;padding:16px 20px;margin-bottom:24px;">
              <p style="font-size:13px;font-weight:300;color:#7A6252;margin:0;line-height:1.65;">
                While you wait, feel free to explore our <a href="https://rubyk.co/blog" style="color:#E8632A;">latest thinking</a> or 
                take our <a href="https://rubyk.co/quiz" style="color:#E8632A;">free storytelling quiz</a> to get a head start.
              </p>
            </div>
            <p style="font-size:13px;font-weight:300;color:#7A6252;line-height:1.7;margin:0;">
              Questions in the meantime? Reply to this email or reach us at 
              <a href="mailto:hello@rubyk.co" style="color:#E8632A;">hello@rubyk.co</a>.
            </p>
          </td></tr>
          <tr><td style="padding-top:32px;text-align:center;">
            <p style="font-size:12px;color:rgba(61,46,30,0.35);margin:0;">© 2026 Rubyk Co. · hello@rubyk.co</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
    </body></html>
  `

  try {
    /* Send both emails in parallel */
    const [teamRes, userRes] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from:    'Rubyk Forms <hello@rubyk.co>',
          to:      ['hello@rubyk.co'],
          replyTo: email,
          subject: `New project enquiry from ${name} — ${service}`,
          html:    teamHtml,
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from:    'Rubyk <hello@rubyk.co>',
          to:      [email],
          subject: `We've received your project enquiry, ${firstName}`,
          html:    userHtml,
        }),
      }),
    ])

    if (!teamRes.ok) {
      const err = await teamRes.json()
      console.error('[Contact] Team email error:', err)
    }
    if (!userRes.ok) {
      const err = await userRes.json()
      console.error('[Contact] User email error:', err)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Contact] Error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}