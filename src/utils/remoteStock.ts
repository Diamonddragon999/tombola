import { UNLIMITED } from '@/types/prizes';

const GET_URL  = 'https://n8n.cristalsrl.ro/webhook/0de050b4-9b31-4c43-8a14-734845a0b9c9';
const POST_URL = '/api/push-stock';     // relativ la domeniul Vercel

/** Citeşte stocul live din n8n */
export async function fetchRemoteStock(): Promise<Record<string, number>> {
  const js = await fetch(GET_URL).then(r => r.json()) as any[];
  const rec: Record<string, number> = {};
  js[0].data.forEach((row: any) => {
    const raw = (row['Today Stock'] as string).trim();
    rec[row.ID] = raw.toUpperCase() === 'UNLIMITED' ? UNLIMITED : parseInt(raw, 10);
  });
  return rec;
}

/** Trimite stocul actualizat înapoi către n8n */
export async function pushRemoteStock(stock: Record<string, number>) {
  const payload = [{
    data: Object.entries(stock).map(([id, qty]) => ({
      ID: id,
      'Today Stock': qty.toString(),
    })),
  }];
  await fetch(POST_URL, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(payload),
  });
}
