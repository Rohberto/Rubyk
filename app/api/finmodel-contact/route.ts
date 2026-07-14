import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    fullName, email, whatsapp, nationality, startupName, role,
    startupStage, raising, raiseAmount, pitchDeckLink,
    revenueLine, financialModel, relevantLinks, heardFrom, feedbackWanted,
  } = body

  if (!fullName || !email || !nationality || !startupName || !role ||
      !startupStage || !raising || !raiseAmount || !financialModel || !heardFrom) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 })
  }

  const firstName = fullName.split(' ')[0]

  /* ── Save to Supabase ── */
  const { error: dbError } = await supabaseAdmin()
    .from('finmodel_leads')
    .insert([{
      full_name:              fullName,
      email,
      whatsapp:               whatsapp    || '',
      nationality,
      startup_name:           startupName,
      role,
      startup_stage:          startupStage,
      raising,
      raise_amount:           raiseAmount,
      pitch_deck_link:        pitchDeckLink   || '',
      revenue_line:           revenueLine     || '',
      financial_model:        financialModel,
      relevant_links:         relevantLinks   || '',
      heard_from:             heardFrom,
      feedback_wanted:        feedbackWanted  || '',
    }])

  if (dbError) console.error('[FinModel] DB error:', dbError.message)

  const fields: [string, string][] = [
    ['Full Name',        fullName],
    ['Email',            email],
    ...(whatsapp    ? [['WhatsApp',    whatsapp]    as [string,string]] : []),
    ['Nationality',      nationality],
    ['Startup Name',     startupName],
    ['Role',             role],
    ['Startup Stage',    startupStage],
    ['Raising',          raising],
    ['Raise Amount',     raiseAmount],
    ...(pitchDeckLink   ? [['Pitch Deck Link',     pitchDeckLink]   as [string,string]] : []),
    ...(revenueLine     ? [['Revenue Line',        revenueLine]     as [string,string]] : []),
    ['Financial Model',  financialModel],
    ...(relevantLinks   ? [['Relevant Links',      relevantLinks]   as [string,string]] : []),
    ['Heard From',       heardFrom],
    ...(feedbackWanted  ? [['Feedback Wanted',     feedbackWanted]  as [string,string]] : []),
  ]

  /* ── Team notification ── */
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
            <p style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:2px;color:#E8632A;margin:0 0 8px;">
              Pitch Deck & Financial Model Walkthrough
            </p>
            <h2 style="font-family:Georgia,serif;font-size:24px;font-weight:600;color:#FDFAF6;margin:0 0 24px;letter-spacing:-0.3px;">
              New application — ${fullName} (${startupName})
            </h2>
            ${fields.map(([k, v]) => `
              <div style="border-top:1px solid rgba(255,255,255,0.07);padding:12px 0;">
                <p style="font-size:11px;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.35);margin:0 0 4px;">${k}</p>
                <p style="font-size:14px;font-weight:300;color:rgba(253,250,246,0.8);margin:0;line-height:1.6;">${v}</p>
              </div>
            `).join('')}
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

  /* ── User confirmation ── */
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
            <p style="font-size:13px;font-weight:500;text-transform:uppercase;letter-spacing:2px;color:#E8632A;margin:0 0 12px;">Application received</p>
            <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:600;color:#1E1409;letter-spacing:-0.5px;line-height:1.2;margin:0 0 16px;">
              Thanks, ${firstName}. You're in.
            </h1>
            <p style="font-size:16px;font-weight:300;color:#7A6252;line-height:1.75;margin:0 0 24px;">
              We've received your application for the <strong style="color:#1E1409;">Financial Model & Pitch Deck Walkthrough</strong>.
              You should have just been redirected to book your 30-minute call — if not, use the button below.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#E8632A;border-radius:8px;">
                  <a href="https://calendly.com/rubykco/30min"
                    style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:500;color:#fff;text-decoration:none;">
                    Book your 30-min call →
                  </a>
                </td>
              </tr>
            </table>
            <p style="font-size:13px;font-weight:300;color:#7A6252;line-height:1.7;margin:0;">
              Questions? Reach us at <a href="mailto:hello@rubyk.co" style="color:#E8632A;">hello@rubyk.co</a>
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
    await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Rubyk Forms <hello@rubyk.co>', to: ['hello@rubyk.co'],
          replyTo: email,
          subject: `Walkthrough application — ${fullName} · ${startupName} · ${startupStage}`,
          html: teamHtml,
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Rubyk <hello@rubyk.co>', to: [email],
          subject: `Your Pitch Deck Walkthrough application, ${firstName}`,
          html: userHtml,
        }),
      }),
    ])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[FinModel] Email error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}