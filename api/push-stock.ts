// api/push-stock.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const N8N_URL =
  'https://n8n.cristalsrl.ro/webhook/1d14482c-1f0f-4316-ba40-ddb3feab9d0d';

function allow(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'content-type, authorization',
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  allow(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')    return res.status(405).end();

  try {
    const forward = await fetch(N8N_URL, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(req.body),
    });
    return res.status(forward.status).end();
  } catch (e) {
    console.error(e);
    return res.status(502).end();
  }
}
