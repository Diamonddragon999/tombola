import {
  Prize, PRIZES, GameState, ParticipantData, SpinResult,
  RARITY_WEIGHTS, UNLIMITED,
} from '@/types/prizes';
import { fetchRemoteStock, pushRemoteStock } from './remoteStock';

const KEY = 'festival2025_game_state';
const today = () => new Date().toISOString().split('T')[0];

/* ---------------- persistenţă ---------------- */
function save(gs: GameState) {
  localStorage.setItem(KEY, JSON.stringify(gs));
}
export function getGameState(): GameState {
  const raw = localStorage.getItem(KEY);
  if (!raw) return initState();
  const gs: GameState = JSON.parse(raw);
  return gs.day === today() ? gs : resetDaily(gs);
}
function initState(): GameState {
  const gs: GameState = {
    day: today(), totalSpins: 0, legendaryGiven: false, isSpinning: false,
    remainingStock: {}, participants: [], spinResults: [],
  };
   PRIZES.forEach(p => (gs.remainingStock[p.id] = p.dailyStock));   // fallback
  // suprascriem cu stocul real de pe server (async fire-and-forget)
  fetchRemoteStock().then(remote => {
     Object.assign(gs.remainingStock, remote);
     save(gs);
  });
  save(gs); return gs;
}
function resetDaily(prev: GameState): GameState {
  const gs = initState();
  gs.participants = prev.participants.filter(
    p => new Date(p.timestamp).toISOString().split('T')[0] === today(),
  );
  save(gs); return gs;
}

/* --------------- premii ---------------------- */
export function getAvailablePrizes(): Prize[] {
  const gs = getGameState();
  return PRIZES.filter(p => (gs.remainingStock[p.id] ?? 0) > 0);
}
export function pickPrize(): Prize {                       // garantat != null
  const gs = getGameState();

  let pool = PRIZES.filter(p => gs.remainingStock[p.id] > 0);

  pool = pool.filter(
    p =>
      p.rarity !== 'legendary'
      || (!gs.legendaryGiven && gs.totalSpins >= 10),
  );
  if (!pool.length) return PRIZES[0];                      // voucher

  const total = pool.reduce((s, p) => s + RARITY_WEIGHTS[p.rarity], 0);
  let r = Math.random() * total;
  for (const p of pool) {
    r -= RARITY_WEIGHTS[p.rarity];
    if (r <= 0) return p;
  }
  return PRIZES[0];
}
export function consumePrize(id: string) {
  const gs = getGameState();
  if (gs.remainingStock[id] !== UNLIMITED) gs.remainingStock[id]--;
  gs.totalSpins++;
  if (id === 'kit') gs.legendaryGiven = true;
  save(gs);
  //trimitem stocul nou - nu blocam UI
  pushRemoteStock(gs.remainingStock).catch(console.error);  
}

/* --------------- flag spinning --------------- */
export function setSpinning(v: boolean) {
  const gs = getGameState(); gs.isSpinning = v; save(gs);
}

/* --------------- participanţi --------------- */
export function addParticipant(p: Omit<ParticipantData,'timestamp'>) {
  const gs = getGameState();
  gs.participants.push({ ...p, timestamp: Date.now() }); save(gs);
}
export function addSpinResult(res: Omit<SpinResult,'timestamp'>): void {
  const st = getGameState();

  /* 1️⃣  log global */
  st.spinResults.push({ ...res, timestamp: Date.now() });

  /* 2️⃣  adaugă premiul şi în array‑ul participantului  */
  const p = st.participants.find(pp => pp.firstName === res.firstName);
  if (p) p.prizes.push(res.prize);

  save(st); 
}

/* ---------- export JSON (structura completă) ---------- */
export function exportGameData(): string {
  const st = getGameState();
  return JSON.stringify(st, null, 2);
}

/* ---------- export CSV conform cerinţei ---------- */
export function exportGameDataCsv(): string {
  const st   = getGameState();
  const rows = [
    ['Prenume','Nume','Email','Vârsta','Like FB','Like IG','Like YT',
     'Premii câştigate','Moment']
  ];

  st.participants.forEach(p => {
    rows.push([
      p.firstName,
      p.lastName,
      p.email,
      String(p.age),
      p.likeFb ? 'da' : 'nu',
      p.likeIg ? 'da' : 'nu',
      p.likeYt ? 'da' : 'nu',
      (p.prizes ?? []).map(pr => pr.name).join('|'),
      new Date(p.timestamp).toLocaleString()
    ]);
  });

  return rows.map(r => r.join(',')).join('\n');
}