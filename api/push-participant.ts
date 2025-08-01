// /api/push-participant.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

/*  Webhook-ul n8n care salvează participanţii în Google Sheet  */
const N8N_URL =
  'https://n8n.cristalsrl.ro/webhook/a0b2194c-ff88-4710-ae0c-c2aa3c7f25ad';

/* =========================================================================
   Proxy: primeşte POST din front-end (same-origin → fără CORS) şi îl relay-uieşte
   ========================================================================= */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();           // Method Not Allowed
  if (!req.body || typeof req.body !== 'object') return res.status(400).end(); // Invalid JSON

  try {
    const r = await fetch(N8N_URL, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(req.body),
    });

    return res.status(r.status).end();                               // forward status-ul
  } catch (e) {
    console.error('push-participant error:', e);
    return res.status(502).end();                                    // Bad Gateway
  }
}
