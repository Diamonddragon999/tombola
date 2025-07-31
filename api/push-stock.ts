// api/push-stock.ts  –  în rădăcina repo-ului
import type { VercelRequest, VercelResponse } from '@vercel/node';

const N8N_URL =
  'https://n8n.cristalsrl.ro/webhook/1d14482c-1f0f-4316-ba40-ddb3feab9d0d';

function cors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'content-type, authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')    return res.status(405).end();

  /** Vercel NU parsează body-ul când îl trimiţi ca text brut */
  const rawBody = req.body
    ? typeof req.body === 'string'
      ? req.body
      : JSON.stringify(req.body)
    : await new Promise<string>((resolve) => {
        let buf = '';
        req.on('data', (c) => (buf += c));
        req.on('end', () => resolve(buf));
      });

  try {
    const fwd = await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: rawBody,
    });
    return res.status(fwd.status).end();
  } catch (err) {
    console.error(err);
    return res.status(502).end();
  }
}
