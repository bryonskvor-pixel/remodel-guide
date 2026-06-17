// api/poll.js
// Proxies BFL result polling. Keeps BFL_API_KEY server-side.
// GET /api/poll?id={taskId}
// Returns BFL's result object: { status, result: { sample }, progress }

const BFL_API = 'https://api.bfl.ai/v1'

export default async function handler(req, res) {
  const origin = req.headers.origin || ''
  const allowedOrigins = ['https://remodel.guide', 'http://localhost:3000', 'http://localhost:8080']
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : 'https://remodel.guide')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'id is required' })

  const apiKey = process.env.BFL_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Service not configured' })

  let pollRes
  try {
    pollRes = await fetch(`${BFL_API}/get_result?id=${encodeURIComponent(id)}`, {
      headers: { 'x-key': apiKey },
    })
  } catch (e) {
    return res.status(502).json({ error: 'Poll request failed' })
  }

  if (!pollRes.ok) {
    return res.status(502).json({ error: 'Poll failed', status: pollRes.status })
  }

  const data = await pollRes.json()
  return res.status(200).json(data)
}
