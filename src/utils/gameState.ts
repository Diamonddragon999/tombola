import {
  Prize, PRIZES, GameState,
  ParticipantData, SpinResult,
  RARITY_WEIGHTS,
} from '@/types/prizes';

const KEY = 'festival2025_game_state';
const today = () => new Date().toISOString().split('T')[0];

/* ================== PERSISTENŢĂ ==================================== */
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
    day: today(),
    totalSpins: 0,
    remainingStock: {},
    participants: [],
    spinResults: [],
    legendaryGiven: false,
    isSpinning: false,
  };
  PRIZES.forEach(p => (gs.remainingStock[p.id] = p.dailyStock));
  save(gs);
  return gs;
}

function resetDaily(prev: GameState): GameState {
  const gs = initState();
  /* participanţii din aceeaşi zi (dacă refresh‑ezi la miezul nopţii) */
  gs.participants = prev.participants.filter(
    p => new Date(p.timestamp).toISOString().split('T')[0] === today(),
  );
  save(gs);
  return gs;
}

/* ================== LOGICĂ PREMII ================================== */
export function getAvailablePrizes(): Prize[] {
  const gs = getGameState();
  return PRIZES.filter(p => gs.remainingStock[p.id] > 0);
}

/** returnează întotdeauna un premiu; voucher dacă altceva nu e pe stoc */
export function pickPrize(): Prize {
  const gs = getGameState();

  // 1️⃣ filtrăm cele cu stoc
  let pool = PRIZES.filter(p => gs.remainingStock[p.id] > 0);

  // 2️⃣ restricţie legendary
  pool = pool.filter(
    p =>
      p.rarity !== 'legendary'
      || (!gs.legendaryGiven && gs.totalSpins >= 10),
  );

  if (!pool.length) return PRIZES[0]; // voucher fallback

  // 3️⃣ weighted random
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
  if (gs.remainingStock[id] !== Infinity) gs.remainingStock[id]--;
  gs.totalSpins++;
  if (id === 'kit') gs.legendaryGiven = true;
  save(gs);
}

/* ================== FLAG LOCALE PENTRU “SPINNING” ================== */
export function setSpinning(v: boolean) {
  const gs = getGameState();
  gs.isSpinning = v;
  save(gs);
}

/* ================== PARTICIPANŢI & REZULTATE ======================= */
export function addParticipant(p: Omit<ParticipantData, 'timestamp'>) {
  const gs = getGameState();
  gs.participants.push({ ...p, timestamp: Date.now() });
  save(gs);
}

export function addSpinResult(r: Omit<SpinResult, 'timestamp'>) {
  const gs = getGameState();
  gs.spinResults.push({ ...r, timestamp: Date.now() });
  save(gs);
}
