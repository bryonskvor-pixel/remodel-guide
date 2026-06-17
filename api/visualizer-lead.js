// api/visualizer-lead.js
// Lead capture for the kitchen design visualizer.
// On submit:
//   1. Writes lead to Airtable (status: visualizer_lead)
//   2. Emails Bryon (alert with design selections)
//   3. Emails homeowner (confirmation)
//
// Required env vars: AIRTABLE_TOKEN, AIRTABLE_BASE_ID, RESEND_API_KEY

const AIRTABLE_API = 'https://api.airtable.com/v0'
const RESEND_API   = 'https://api.resend.com/emails'
const FROM_EMAIL   = 'Bryon at Remodel.Guide <bryon@remodel.guide>'
const BRYON_EMAIL  = 'bryon@remodel.guide'

function displayPhone(raw) {
  if (!raw) return ''
  const digits = raw.replace(/\D/g, '').slice(-10)
  if (digits.length === 10) {
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
  }
  return raw
}

async function writeToAirtable(fields) {
  const token  = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID
  if (!token || !baseId) {
    console.warn('Airtable env vars missing — skipping write')
    return null
  }
  const clean = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v != null && v !== '')
  )
  const res = await fetch(
    `${AIRTABLE_API}/${baseId}/${encodeURIComponent(process.env.AIRTABLE_TABLE || 'Homeowners')}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: clean, typecast: true }),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    console.error('Airtable write failed:', res.status, err)
    return null
  }
  const data = await res.json()
  return data.id
}

async function sendEmail({ to, subject, html, text }) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn('RESEND_API_KEY missing — skipping email')
    return null
  }
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html, text }),
  })
  if (!res.ok) {
    const err = await res.json()
    console.error('Resend error:', err)
    return null
  }
  return res.json()
}

function alertEmailHtml({ firstName, lastName, phone, email, smsOptIn, selections, submittedAt }) {
  const name = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown'
  const time = new Date(submittedAt || Date.now()).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York',
  })
  const selRows = [
    ['Cabinet Style',  selections.cabinetStyle],
    ['Cabinet Finish', selections.cabinetFinish],
    ['Countertop',     selections.countertop],
    ['Flooring',       selections.flooring],
    ['Wall Color',     selections.wallColor],
  ].map(([label, val]) => `
    <tr>
      <td style="font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;padding:6px 0;width:120px;">${label}</td>
      <td style="font-size:14px;color:#1F2623;padding:6px 0;">${val || '—'}</td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:#1F2623;padding:28px 36px;border-radius:8px 8px 0 0;">
    <div style="font-family:Georgia,serif;font-size:20px;color:#fff;margin-bottom:4px;">remodel.guide</div>
    <div style="font-size:11px;color:#B5904A;letter-spacing:0.14em;text-transform:uppercase;">New Visualizer Lead</div>
  </td></tr>
  <tr><td style="background:#B5904A;padding:14px 36px;">
    <div style="font-size:13px;font-weight:600;color:#1F2623;">Kitchen Design Visualizer · Completed a design</div>
  </td></tr>
  <tr><td style="background:#fff;padding:36px 36px 28px;">
    <div style="font-family:Georgia,serif;font-size:24px;color:#1F2623;margin-bottom:24px;">${name}</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;border-radius:6px;padding:20px 24px;margin-bottom:24px;">
      <tr>
        <td style="font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;padding:6px 0;width:120px;">Phone</td>
        <td style="font-size:15px;color:#1F2623;font-weight:600;padding:6px 0;">
          <a href="tel:${phone}" style="color:#1F2623;text-decoration:none;">${displayPhone(phone)}</a>
        </td>
      </tr>
      <tr>
        <td style="font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;padding:6px 0;">SMS opt-in</td>
        <td style="font-size:14px;color:#1F2623;padding:6px 0;">${smsOptIn ? '✓ Yes — OK to text' : 'No'}</td>
      </tr>
      <tr>
        <td style="font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;padding:6px 0;">Email</td>
        <td style="font-size:14px;color:#1F2623;padding:6px 0;">${email || '—'}</td>
      </tr>
      ${selRows}
      <tr>
        <td style="font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;padding:6px 0;">Submitted</td>
        <td style="font-size:14px;color:#1F2623;padding:6px 0;">${time} ET</td>
      </tr>
    </table>
    <p style="font-size:13px;color:#6B7280;line-height:1.65;margin:0;">
      This lead designed their kitchen — high intent. Respond within the hour.
    </p>
  </td></tr>
  <tr><td style="background:#F5F0E8;padding:18px 36px;border-radius:0 0 8px 8px;border-top:1px solid #E5E0D8;">
    <p style="margin:0;font-size:11px;color:#9CA3AF;text-align:center;">remodel.guide · Kitchen Design Visualizer</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

function confirmEmailHtml({ firstName, selections }) {
  const first = firstName || 'there'
  const selList = [
    ['Cabinet Style',  selections.cabinetStyle],
    ['Cabinet Finish', selections.cabinetFinish],
    ['Countertop',     selections.countertop],
    ['Flooring',       selections.flooring],
    ['Wall Color',     selections.wallColor],
  ].map(([label, val]) => `<li style="font-size:14px;color:#1F2623;line-height:2;">${label}: <strong>${val}</strong></li>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:#1F2623;padding:28px 36px;border-radius:8px 8px 0 0;">
    <div style="font-family:Georgia,serif;font-size:20px;color:#fff;margin-bottom:4px;">remodel.guide</div>
    <div style="font-size:11px;color:#B5904A;letter-spacing:0.14em;text-transform:uppercase;">Your Kitchen Design</div>
  </td></tr>
  <tr><td style="background:#fff;padding:40px 36px 32px;">
    <div style="font-family:Georgia,serif;font-size:26px;color:#1F2623;margin-bottom:8px;">Great taste, ${first}.</div>
    <p style="font-size:14px;color:#6B7280;margin:0 0 28px;line-height:1.65;">
      Here's the design you built in the remodel.guide Kitchen Visualizer.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;border-radius:6px;padding:24px;margin-bottom:28px;">
      <tr><td>
        <div style="font-size:11px;font-weight:600;color:#B5904A;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:16px;">Your design selections</div>
        <ul style="margin:0;padding:0 0 0 20px;">${selList}</ul>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E0D8;border-radius:6px;padding:22px 24px;">
      <tr><td>
        <div style="font-size:11px;font-weight:600;color:#B5904A;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:10px;">What happens next</div>
        <p style="font-size:14px;color:#1F2623;line-height:1.7;margin:0 0 16px;">
          <strong>Bryon Skvor</strong> will reach out within 24 hours. He'll help you bring this design to life — actual cabinets, countertops, and flooring from local suppliers, at real prices.
        </p>
        <p style="font-size:13px;color:#6B7280;margin:0;">Questions before then? Call or text: <a href="tel:+14402521053" style="color:#B5904A;">(440) 252-1053</a></p>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#F5F0E8;padding:18px 36px;border-radius:0 0 8px 8px;border-top:1px solid #E5E0D8;">
    <p style="margin:0;font-size:11px;color:#9CA3AF;text-align:center;line-height:1.6;">
      remodel.guide · Your information is never sold or shared.
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

export default async function handler(req, res) {
  const origin = req.headers.origin || ''
  const allowedOrigins = ['https://remodel.guide', 'http://localhost:3000', 'http://localhost:8080']
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : 'https://remodel.guide')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const {
    firstName    = '',
    lastName     = '',
    phone        = '',
    email        = '',
    sms_opt_in   = false,
    selections   = {},
  } = req.body || {}

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' })
  }

  const name = [firstName, lastName].filter(Boolean).join(' ') || 'New Lead'
  const now  = new Date().toISOString()

  const designSummary = [
    selections.cabinetStyle  && `Cabinet Style: ${selections.cabinetStyle}`,
    selections.cabinetFinish && `Cabinet Finish: ${selections.cabinetFinish}`,
    selections.countertop    && `Countertop: ${selections.countertop}`,
    selections.flooring      && `Flooring: ${selections.flooring}`,
    selections.wallColor     && `Wall Color: ${selections.wallColor}`,
  ].filter(Boolean).join(' · ')

  const results = { airtable: null, email_bryon: null, email_lead: null }

  try {
    results.airtable = await writeToAirtable({
      name,
      email:        email || null,
      phone,
      project_type: `Kitchen Visualizer — ${designSummary}`,
      status:       'visualizer_lead',
      source_city:  'visualizer',
      sms_opt_in:   sms_opt_in ? 'yes' : 'no',
      created_at:   now,
    })
  } catch (e) {
    console.error('Airtable error:', e.message)
  }

  try {
    results.email_bryon = await sendEmail({
      to:      BRYON_EMAIL,
      subject: `Visualizer lead — ${name} — designed a kitchen`,
      html:    alertEmailHtml({ firstName, lastName, phone, email, smsOptIn: sms_opt_in, selections, submittedAt: now }),
      text:    `New visualizer lead\n\n${name}\n${displayPhone(phone)}${sms_opt_in ? ' ✓ OK to text' : ''}\n${email || 'No email'}\n\n${designSummary}`,
    })
  } catch (e) {
    console.error('Resend alert error:', e.message)
  }

  if (email) {
    try {
      results.email_lead = await sendEmail({
        to:      email,
        subject: `Your kitchen design — ${firstName || 'here\'s what you built'}`,
        html:    confirmEmailHtml({ firstName, selections }),
        text:    `Hi ${firstName || 'there'} — here's your kitchen design:\n\n${designSummary}\n\nBryon Skvor will reach out within 24 hours. Questions? (440) 252-1053`,
      })
    } catch (e) {
      console.error('Resend confirmation error:', e.message)
    }
  }

  return res.status(200).json({ success: true, results })
}
