// api/push-stock.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const N8N_URL =
  'https://n8n.cristalsrl.ro/webhook-test/1d14482c-1f0f-4316-ba40-ddb3feab9d0d';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ① Acceptă OPTIONS pentru pre-flight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    return res.status(204).end();               // no-content
  }

  // ② Restricţionează la POST după pre-flight
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const r = await fetch(N8N_URL, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(req.body),
    });

    // ③ Mic CORS pentru browser (same-origin e OK, dar nu strică)
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(r.status).end();
  } catch (e) {
    console.error(e);
    return res.status(502).end();
  }
}
