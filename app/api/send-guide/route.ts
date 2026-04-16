import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { guide } from '@/data/guide'

export async function POST(req: NextRequest) {
  const { name, email } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 })
  }

  const firstName = name.split(' ')[0]

  /* ── Fetch latest download URL from Supabase ── */
  const { data: config } = await supabaseAdmin()
    .from('guide_config')
    .select('download_url, headline')
    .eq('id', 1)
    .single()

  const downloadUrl = config?.download_url || guide.downloadUrl
  const headline    = config?.headline    || guide.headline

  /* ── Save lead to Supabase ── */
  await supabaseAdmin()
    .from('guide_leads')
    .insert([{ name, email }])

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body style="margin:0;padding:0;background:#FDFAF6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFAF6;padding:48px 24px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

              <!-- Logo -->
              <tr>
                <td style="padding-bottom:40px;">
                  <img src="https://rubyk.co/wp-content/uploads/2026/03/Rubyk-website-logo-scaled.png"
                    alt="Rubyk" height="28" style="display:block;" />
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="background:#fff;border:1px solid rgba(61,46,30,0.10);border-radius:16px;padding:40px;">
                  <p style="font-size:13px;font-weight:500;text-transform:uppercase;letter-spacing:2px;
                    color:#E8632A;margin:0 0 16px;">Your free guide</p>

                  <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:600;color:#1E1409;
                    letter-spacing:-0.5px;line-height:1.2;margin:0 0 16px;">
                    Here's your guide, ${firstName}.
                  </h1>

                  <p style="font-size:16px;font-weight:300;color:#7A6252;line-height:1.75;margin:0 0 32px;">
                    Thanks for downloading <em>${headline}</em>.
                    Click the button below to access your copy.
                  </p>

                  <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                    <tr>
                      <td style="background:#E8632A;border-radius:8px;">
                        <a href="${downloadUrl}"
                          style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:500;
                          color:#fff;text-decoration:none;letter-spacing:0.2px;">
                          Download the guide →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:13px;font-weight:300;color:#7A6252;line-height:1.7;margin:0;">
                    If the button doesn't work, copy and paste this link into your browser:<br/>
                    <a href="${downloadUrl}" style="color:#E8632A;word-break:break-all;">
                      ${downloadUrl}
                    </a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding-top:32px;text-align:center;">
                  <p style="font-size:12px;color:rgba(61,46,30,0.35);margin:0;">
                    © 2026 Rubyk Co. · hello@rubyk.co
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'Rubyk <hello@rubyk.co>',
        to:      [email],
        subject: `Your copy of "${headline}"`,
        html:    htmlBody,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('Resend error:', err)
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Send guide error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}