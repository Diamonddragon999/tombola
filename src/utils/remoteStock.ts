/* src/utils/remoteStock.ts */
import { PRIZES, UNLIMITED } from '@/types/prizes';

const GET_URL  = 'https://n8n.cristalsrl.ro/webhook/0de050b4-9b31-4c43-8a14-734845a0b9c9';
const POST_URL = 'https://tombola.cristalsrl.ro/api/push-stock';

export async function fetchRemoteStock() {
  const js   = await fetch(GET_URL).then(r => r.json()) as any[];
  const rows = js[0]?.data ?? [];
  const out: Record<string, number> = {};

  rows.forEach((r: any) => {
    const raw = (r['Today Stock'] as string).trim();
    out[r.ID] = raw.toUpperCase() === 'UNLIMITED' ? UNLIMITED : +raw;
  });
  return out;
}

/** ➜ trimitem ÎNTREGUL rând, dar cu stocul actualizat  */
export async function pushRemoteStock(stock: Record<string, number>) {
  /* refacem exact schema cerută de n8n */
  const payload = [{
    data: PRIZES.map(p => ({
      ID          : p.id,
      Descriere   : p.name,
      Rarity      : p.rarity,
      'Today Stock': stock[p.id]?.toString() ?? '0',
    }))
  }];

  await fetch(POST_URL, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(payload),
  });
}
