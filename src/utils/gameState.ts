import {
  Prize, PRIZES, GameState, ParticipantData, SpinResult,
  RARITY_WEIGHTS, UNLIMITED,
} from '@/types/prizes';

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
  PRIZES.forEach(p => (gs.remainingStock[p.id] = p.dailyStock));
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
  return PRIZES.filter(p => gs.remainingStock[p.id] > 0);
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
export function addSpinResult(r: Omit<SpinResult,'timestamp'>) {
  const gs = getGameState();
  gs.spinResults.push({ ...r, timestamp: Date.now() }); save(gs);
}

/* --------------- export ---------------------- */
export function exportGameData(): string {
  const gs = getGameState();
  return JSON.stringify({
    date: gs.day,
    totalSpins: gs.totalSpins,
    remainingStock: gs.remainingStock,
    participants: gs.participants,
    spinResults: gs.spinResults,
  }, null, 2);
}

export function exportGameDataCsv(): string {
  const gs = getGameState()
  const rows = [
    ['Prenume','Nume','Email','Social','Newsletter','Timp'],
    ...gs.participants.map(p=>[
      p.firstName, p.lastName, p.email,
      p.followsSocial?'da':'nu',
      p.newsletterConsent?'da':'nu',
      new Date(p.timestamp).toLocaleString()
    ])
  ]
  return rows.map(r=>r.join(',')).join('\n')
}