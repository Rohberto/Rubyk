import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { name, email, score, tier, headline } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.error('[Quiz] RESEND_API_KEY is missing')
    return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 })
  }

  const firstName = name.split(' ')[0]

  /* Save lead to Supabase */
  const { error: dbError } = await supabaseAdmin()
    .from('quiz_leads')
    .insert([{ name, email, score, tier }])

  if (dbError) console.error('[Quiz] DB insert error:', dbError.message)

  /* Send email */
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
    <body style="margin:0;padding:0;background:#FDFAF6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFAF6;padding:48px 24px;">
        <tr><td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

            <tr><td style="padding-bottom:32px;">
              <img src="https://rubyk.co/wp-content/uploads/2026/03/Rubyk-website-logo-scaled.png"
                alt="Rubyk" height="28" style="display:block;" />
            </td></tr>

            <tr><td style="background:#fff;border:1px solid rgba(61,46,30,0.10);border-radius:16px;padding:40px;">
              <p style="font-size:13px;font-weight:500;text-transform:uppercase;letter-spacing:2px;color:#E8632A;margin:0 0 12px;">
                Your quiz results
              </p>
              <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:600;color:#1E1409;letter-spacing:-0.5px;line-height:1.2;margin:0 0 8px;">
                ${firstName}, here are your results.
              </h1>
              <p style="font-size:15px;font-weight:300;color:#7A6252;line-height:1.7;margin:0 0 28px;">
                You completed the Rubyk Founder Storytelling Quiz.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#1E1409;border-radius:12px;padding:28px;text-align:center;">
                    <p style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.4);margin:0 0 8px;">Your score</p>
                    <p style="font-family:Georgia,serif;font-size:52px;font-weight:600;color:#E8632A;line-height:1;margin:0 0 4px;">
                      ${score}<span style="font-size:22px;color:rgba(255,255,255,0.3)">/30</span>
                    </p>
                    <p style="font-size:13px;font-weight:500;color:#E8632A;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px;">${tier}</p>
                    <p style="font-size:15px;font-weight:300;color:rgba(255,255,255,0.6);line-height:1.65;margin:0;">${headline}</p>
                  </td>
                </tr>
              </table>

              <p style="font-size:15px;font-weight:300;color:#7A6252;line-height:1.75;margin:0 0 28px;">
                Head back to your results page to see your full breakdown — strengths, gaps, and exactly where to focus next.
              </p>

              <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#E8632A;border-radius:8px;">
                    <a href="https://rubyk.co/quiz" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:500;color:#fff;text-decoration:none;">
                      View full results →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;font-weight:300;color:#7A6252;line-height:1.7;margin:0;">
                Want help improving your story?
                <a href="https://calendly.com/victory-rubyk" style="color:#E8632A;">Book a free 30-min call</a>
                and we'll walk through exactly where to start.
              </p>
            </td></tr>

            <tr><td style="padding-top:28px;text-align:center;">
              <p style="font-size:12px;color:rgba(61,46,30,0.35);margin:0;">© 2026 Rubyk Co. · hello@rubyk.co</p>
            </td></tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `

  const resendRes = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from:    'Rubyk <hello@rubyk.co>',
      to:      [email],
      subject: `Your Rubyk Quiz Results — ${tier} (${score}/30)`,
      html:    htmlBody,
    }),
  })

  const resendData = await resendRes.json()

  if (!resendRes.ok) {
    console.error('[Quiz] Resend error:', JSON.stringify(resendData))
    return NextResponse.json({
      error: `Email failed: ${resendData?.message ?? resendData?.name ?? 'Unknown Resend error'}`,
    }, { status: 500 })
  }

  console.log('[Quiz] Email sent successfully, id:', resendData.id)
  return NextResponse.json({ success: true })
}