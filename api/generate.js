// api/generate.js
// Proxies image generation requests to BFL FLUX Kontext Pro.
// Accepts: { imageBase64, prompt }
// Returns: { taskId }
//
// Required env var: BFL_API_KEY

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

const BFL_API = 'https://api.bfl.ai/v1'

export default async function handler(req, res) {
  const origin = req.headers.origin || ''
  const allowedOrigins = ['https://remodel.guide', 'http://localhost:3000', 'http://localhost:8080']
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : 'https://remodel.guide')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { imageBase64, prompt } = req.body || {}

  if (!imageBase64 || !prompt) {
    return res.status(400).json({ error: 'imageBase64 and prompt are required' })
  }

  const apiKey = process.env.BFL_API_KEY
  if (!apiKey) {
    console.error('BFL_API_KEY not configured')
    return res.status(500).json({ error: 'Service not configured' })
  }

  let bflRes
  try {
    bflRes = await fetch(`${BFL_API}/flux-kontext-pro`, {
      method: 'POST',
      headers: {
        'x-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        input_image: imageBase64,
        output_format: 'jpeg',
        safety_tolerance: 6,
      }),
    })
  } catch (e) {
    console.error('BFL fetch error:', e.message)
    return res.status(502).json({ error: 'Failed to reach image service' })
  }

  if (!bflRes.ok) {
    const errText = await bflRes.text()
    console.error('BFL API error:', bflRes.status, errText)
    return res.status(502).json({ error: 'Image generation failed', details: errText })
  }

  const data = await bflRes.json()
  return res.status(200).json({ taskId: data.id })
}
