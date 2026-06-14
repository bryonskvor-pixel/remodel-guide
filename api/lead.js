// api/lead.js
// Handles form submissions from remodel.guide city pages.
// On every submission:
//   1. Writes lead to Airtable (status: form_lead)
//   2. Texts Bryon via Twilio (instant alert)
//   3. Texts homeowner via Twilio (confirmation)
//   4. Emails Bryon via Resend (full detail)
//   5. Emails homeowner via Resend (if email provided)
//
// Required Vercel environment variables (set in remodel.guide project):
//   AIRTABLE_TOKEN
//   AIRTABLE_BASE_ID
//   AIRTABLE_TABLE          (default: "Homeowners")
//   RESEND_API_KEY
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_FROM_NUMBER      (set to: +18885158579)
//   BRYON_PHONE             (set to: +14402255974)

const AIRTABLE_API  = 'https://api.airtable.com/v0';
const RESEND_API    = 'https://api.resend.com/emails';
const FROM_EMAIL    = 'Bryon at Remodel.Guide <bryon@remodel.guide>';
const BRYON_EMAIL   = 'bryon@remodel.guide';
const REMI_URL      = 'https://remodelry.guide';

// ── HELPERS ────────────────────────────────────────────────────────────────

function airtableHeaders() {
  return {
    'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
    'Content-Type': 'application/json'
  };
}

function airtableUrl() {
  const base  = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE || 'Homeowners';
  return `${AIRTABLE_API}/${base}/${encodeURIComponent(table)}`;
}

// Format phone to E.164 for Twilio (+1XXXXXXXXXX)
function toE164(raw) {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

// Clean display format for text messages
function displayPhone(raw) {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '').slice(-10);
  if (digits.length === 10) {
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }
  return raw;
}

// City label from slug
function cityLabel(slug) {
  const map = {
    strongsville:      'Strongsville',
    broadview_heights: 'Broadview Heights',
    brunswick:         'Brunswick',
    medina:            'Medina',
    north_ridgeville:  'North Ridgeville',
    westlake:          'Westlake',
    rocky_river:       'Rocky River',
    bay_village:       'Bay Village',
    parma:             'Parma',
    north_olmsted:     'North Olmsted',
    olmsted_falls:     'Olmsted Falls',
  };
  return map[slug] || (slug ? slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Northeast Ohio');
}

// ── AIRTABLE WRITE ─────────────────────────────────────────────────────────

async function writeToAirtable(fields) {
  const token  = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!token || !baseId) {
    console.warn('Airtable env vars missing — skipping write');
    return null;
  }
  // Strip null/undefined so we never clobber existing cells
  const clean = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v != null && v !== '')
  );
  const res = await fetch(airtableUrl(), {
    method: 'POST',
    headers: airtableHeaders(),
    body: JSON.stringify({ fields: clean, typecast: true })
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('Airtable write failed:', res.status, err);
    return null;
  }
  const data = await res.json();
  return data.id;
}

// ── TWILIO SMS ─────────────────────────────────────────────────────────────

async function sendSMS(to, body) {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_FROM_NUMBER || '+18885158579';
  if (!sid || !token) {
    console.warn('Twilio env vars missing — skipping SMS');
    return null;
  }
  const toE164Num = toE164(to);
  if (!toE164Num) {
    console.warn('Invalid phone for SMS:', to);
    return null;
  }
  const params = new URLSearchParams({ From: from, To: toE164Num, Body: body });
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    }
  );
  if (!res.ok) {
    const err = await res.text();
    console.error('Twilio SMS failed:', res.status, err);
    return null;
  }
  const data = await res.json();
  return data.sid;
}

// ── RESEND EMAIL ───────────────────────────────────────────────────────────

async function sendEmail({ to, subject, html, text }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('RESEND_API_KEY missing — skipping email');
    return null;
  }
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html, text })
  });
  if (!res.ok) {
    const err = await res.json();
    console.error('Resend error:', err);
    return null;
  }
  return res.json();
}

// ── EMAIL TEMPLATES ────────────────────────────────────────────────────────

function alertEmailHtml({ firstName, lastName, phone, email, neighborhood, scope, timeline, city, submittedAt }) {
  const name    = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown';
  const cityLbl = cityLabel(city);
  const hood    = neighborhood || '—';
  const time    = submittedAt
    ? new Date(submittedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })
    : new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

      <!-- Header -->
      <tr><td style="background:#1F2623;padding:28px 36px;border-radius:8px 8px 0 0;">
        <div style="font-family:Georgia,serif;font-size:20px;color:#fff;margin-bottom:4px;">remodel.guide</div>
        <div style="font-size:11px;color:#B5904A;letter-spacing:0.14em;text-transform:uppercase;">New Kitchen Lead</div>
      </td></tr>

      <!-- Alert band -->
      <tr><td style="background:#B5904A;padding:14px 36px;">
        <div style="font-size:13px;font-weight:600;color:#1F2623;letter-spacing:0.04em;">
          ${cityLbl} · ${scope || 'Kitchen inquiry'}
        </div>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:#fff;padding:36px 36px 28px;">

        <div style="font-family:Georgia,serif;font-size:22px;color:#1F2623;margin-bottom:24px;">${name}</div>

        <!-- Contact block -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;border-radius:6px;padding:20px 24px;margin-bottom:24px;">
          <tr>
            <td style="font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;padding:5px 0;width:110px;">Phone</td>
            <td style="font-size:15px;color:#1F2623;font-weight:600;padding:5px 0;">
              <a href="tel:${phone}" style="color:#1F2623;text-decoration:none;">${displayPhone(phone)}</a>
            </td>
          </tr>
          <tr>
            <td style="font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;padding:5px 0;">Email</td>
            <td style="font-size:14px;color:#1F2623;padding:5px 0;">${email || '—'}</td>
          </tr>
          <tr>
            <td style="font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;padding:5px 0;">Neighborhood</td>
            <td style="font-size:14px;color:#1F2623;padding:5px 0;">${hood}</td>
          </tr>
          <tr>
            <td style="font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;padding:5px 0;">Looking for</td>
            <td style="font-size:14px;color:#1F2623;padding:5px 0;">${scope || '—'}</td>
          </tr>
          <tr>
            <td style="font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;padding:5px 0;">Timeline</td>
            <td style="font-size:14px;color:#1F2623;padding:5px 0;">${timeline || '—'}</td>
          </tr>
          <tr>
            <td style="font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;padding:5px 0;">Source</td>
            <td style="font-size:14px;color:#1F2623;padding:5px 0;">remodel.guide/kitchen/${city || ''}</td>
          </tr>
          <tr>
            <td style="font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;padding:5px 0;">Submitted</td>
            <td style="font-size:14px;color:#1F2623;padding:5px 0;">${time} ET</td>
          </tr>
        </table>

        <p style="font-size:13px;color:#6B7280;line-height:1.65;margin:0;">
          They submitted from the ${cityLbl} kitchen remodel page. 
          Respond within the hour when possible — speed to contact wins the appointment.
        </p>

      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#F5F0E8;padding:20px 36px;border-radius:0 0 8px 8px;border-top:1px solid #E5E0D8;">
        <p style="margin:0;font-size:11px;color:#9CA3AF;text-align:center;">
          remodel.guide · Northeast Ohio · 
          <a href="https://remodel.guide" style="color:#B5904A;text-decoration:none;">remodel.guide</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function confirmEmailHtml({ firstName, city }) {
  const first   = firstName || 'there';
  const cityLbl = cityLabel(city);

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

      <!-- Header -->
      <tr><td style="background:#1F2623;padding:28px 36px;border-radius:8px 8px 0 0;">
        <div style="font-family:Georgia,serif;font-size:20px;color:#fff;margin-bottom:4px;">remodel.guide</div>
        <div style="font-size:11px;color:#B5904A;letter-spacing:0.14em;text-transform:uppercase;">Kitchen Consultation Request</div>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:#fff;padding:40px 36px 32px;">

        <div style="font-family:Georgia,serif;font-size:26px;color:#1F2623;margin-bottom:8px;line-height:1.2;">
          Got it, ${first}.
        </div>
        <p style="font-size:14px;color:#6B7280;margin:0 0 28px;line-height:1.65;">
          Your request for a free kitchen consultation in ${cityLbl} is confirmed.
        </p>

        <!-- What happens next -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;border-radius:6px;padding:24px;margin-bottom:28px;">
          <tr><td>
            <div style="font-size:11px;font-weight:600;color:#B5904A;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:14px;">What happens next</div>
            <p style="font-size:14px;color:#1F2623;line-height:1.75;margin:0 0 10px;">
              <strong>Bryon Skvor</strong> will reach out within 24 hours to schedule your free in-home visit.
            </p>
            <p style="font-size:14px;color:#1F2623;line-height:1.75;margin:0;">
              He'll come to your home, look at your kitchen honestly, and walk you through every level of remodel — from a cabinet refresh to a full renovation. No showroom pressure.
            </p>
          </td></tr>
        </table>

        <!-- Direct contact -->
        <p style="font-size:14px;color:#6B7280;line-height:1.65;margin:0 0 6px;">
          Questions before then? Reach Bryon directly:
        </p>
        <p style="font-size:16px;font-weight:600;color:#1F2623;margin:0 0 28px;">
          <a href="tel:+14402521053" style="color:#1F2623;text-decoration:none;">(440) 252-1053</a>
        </p>

        <!-- Remi invite -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E0D8;border-radius:6px;padding:22px 24px;margin-bottom:8px;">
          <tr><td>
            <div style="font-size:11px;font-weight:600;color:#B5904A;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:10px;">Want a head start?</div>
            <p style="font-size:14px;color:#1F2623;line-height:1.7;margin:0 0 16px;">
              Talk to Remi before the visit — upload photos of your kitchen and get an instant First Look with design ideas and realistic scope. Bryon reviews it before he calls, so the visit goes deeper faster.
            </p>
            <a href="${REMI_URL}" style="display:inline-block;background:#B5904A;color:#1F2623;padding:12px 24px;border-radius:4px;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.02em;">
              Talk to Remi →
            </a>
            <div style="font-size:11px;color:#9CA3AF;margin-top:8px;">Free · No account required · Takes about 10 minutes</div>
          </td></tr>
        </table>

      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#F5F0E8;padding:20px 36px;border-radius:0 0 8px 8px;border-top:1px solid #E5E0D8;">
        <p style="margin:0;font-size:11px;color:#9CA3AF;text-align:center;line-height:1.6;">
          remodel.guide · Northeast Ohio · 
          <a href="https://remodel.guide" style="color:#B5904A;text-decoration:none;">remodel.guide</a><br>
          Your information is never sold or shared.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ── MAIN HANDLER ───────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // CORS — allow remodel.guide pages to POST here
  res.setHeader('Access-Control-Allow-Origin', 'https://remodel.guide');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    firstName   = '',
    lastName    = '',
    phone       = '',
    email       = '',
    neighborhood = '',
    scope       = '',
    timeline    = '',
    source_city = '',
    sms_opt_in  = false
  } = req.body || {};

  // Phone is required — reject if missing
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const name    = [firstName, lastName].filter(Boolean).join(' ') || 'New Lead';
  const city    = source_city || 'unknown';
  const cityLbl = cityLabel(city);
  const now     = new Date().toISOString();

  const results = {
    airtable:      null,
    twilio_bryon:  null,
    twilio_lead:   null,
    email_bryon:   null,
    email_lead:    null
  };

  // 1. ── AIRTABLE ────────────────────────────────────────────────────
  try {
    results.airtable = await writeToAirtable({
      name,
      email:        email || null,
      phone,
      address:      neighborhood ? `${neighborhood}, ${cityLbl}, OH` : `${cityLbl}, OH`,
      project_type: scope || 'Kitchen remodel inquiry',
      status:       'form_lead',
      source_city:  city,
      created_at:   now
    });
  } catch (e) {
    console.error('Airtable error:', e.message);
  }

  // 2. ── TEXT TO BRYON ───────────────────────────────────────────────
  const bryonPhone = process.env.BRYON_PHONE || '+14402255974';
  const bryonSMS = [
    `New kitchen lead — ${name}`,
    `${displayPhone(phone)}${email ? ' · ' + email : ''}`,
    `${cityLbl}${neighborhood ? ' · ' + neighborhood : ''}`,
    `${scope || 'Kitchen inquiry'}${timeline ? ' · ' + timeline : ''}`,
    `remodel.guide/kitchen/${city}`
  ].join('\n');

  try {
    results.twilio_bryon = await sendSMS(bryonPhone, bryonSMS);
  } catch (e) {
    console.error('Twilio Bryon SMS error:', e.message);
  }

  // 3. ── TEXT TO HOMEOWNER (only if opted in) ───────────────────────
  if (sms_opt_in) {
    const leadSMS = [
      `Hi ${firstName || 'there'} — Bryon Skvor here from remodel.guide.`,
      `Got your request for a free kitchen consultation in ${cityLbl}.`,
      `I'll reach out within 24 hours to schedule your visit.`,
      `Questions? Call or text me at (440) 252-1053.`
    ].join(' ');

    try {
      results.twilio_lead = await sendSMS(phone, leadSMS);
    } catch (e) {
      console.error('Twilio lead SMS error:', e.message);
    }
  }

  // 4. ── EMAIL TO BRYON ──────────────────────────────────────────────
  try {
    results.email_bryon = await sendEmail({
      to:      BRYON_EMAIL,
      subject: `New lead — ${name} — ${cityLbl}`,
      html:    alertEmailHtml({ firstName, lastName, phone, email, neighborhood, scope, timeline, city, submittedAt: now }),
      text:    `New kitchen lead\n\n${name}\n${displayPhone(phone)}\n${email || ''}\n${neighborhood || ''}, ${cityLbl}\n${scope || ''}\n${timeline || ''}\nremodel.guide/kitchen/${city}`
    });
  } catch (e) {
    console.error('Resend Bryon email error:', e.message);
  }

  // 5. ── EMAIL TO HOMEOWNER (only if email provided) ─────────────────
  if (email) {
    try {
      results.email_lead = await sendEmail({
        to:      email,
        subject: `Got your request, ${firstName || 'there'} — Bryon will be in touch`,
        html:    confirmEmailHtml({ firstName, city }),
        text:    `Hi ${firstName || 'there'} — your request for a free kitchen consultation in ${cityLbl} is confirmed. Bryon Skvor will reach out within 24 hours at ${displayPhone(phone)}. Questions? Call or text (440) 252-1053. Want a head start? Talk to Remi at ${REMI_URL}`
      });
    } catch (e) {
      console.error('Resend lead email error:', e.message);
    }
  }

  return res.status(200).json({ success: true, results });
}
