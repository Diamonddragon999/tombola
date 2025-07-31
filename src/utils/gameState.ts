/* utils/gameState.ts */
import mitt from 'mitt';
import {
  PRIZES, Prize, RARITY_WEIGHTS,
  UNLIMITED, GameState, ParticipantData,
} from '@/types/prizes';
import { fetchRemoteStock, pushRemoteStock } from './remoteStock';

/* ───────── event bus ───────── */
type Events = { stock_change: GameState; spinning: boolean };
const bus = mitt<Events>();

/* ───────── state global ─────── */
let gs: GameState = {
  day : new Date().toLocaleDateString('ro-RO'),
  totalSpins : 0,
  remainingStock: {},
  participants : [],
  spinResults  : [],
  legendaryGiven: false,
  isSpinning : false,
};

/* ───────── init: stock din n8n ───────── */
export async function initGameState() {
  const remote = await fetchRemoteStock();
  PRIZES.forEach(p => {
    gs.remainingStock[p.id] =
      remote[p.id] ?? (p.dailyStock >= UNLIMITED ? UNLIMITED : p.dailyStock);
  });
  bus.emit('stock_change', gs);
}

/* ───────── expunere helpers ───────── */
export const getGameState = () => gs;
export const listen   = bus.on;
export const unlisten = bus.off;

export function setSpinning(v: boolean) {
  gs.isSpinning = v;
  bus.emit('spinning', v);
}

/* ───────── premii ───────── */
export function pickPrize(): Prize {
  const pool: Prize[] = [];
  PRIZES.forEach(p => {
    const left = gs.remainingStock[p.id] ?? 0;
    if (left === 0) return;
    pool.push(...Array(RARITY_WEIGHTS[p.rarity]).fill(p));
  });
  return pool.length ? pool[Math.random()*pool.length|0] : PRIZES[0];
}

export function consumePrize(id: string) {
  if (gs.remainingStock[id] > 0 && gs.remainingStock[id] < UNLIMITED) {
    gs.remainingStock[id]--;
  }
  gs.totalSpins++;
  bus.emit('stock_change', gs);
  pushRemoteStock(gs.remainingStock).catch(console.error);
}

export function addSpinResult(r: { prize: Prize; firstName: string }) {
  gs.spinResults.push({ ...r, timestamp: Date.now() });
}

/* ───────── participanţi ───────── */
export interface ParticipantInput {
  firstName : string; lastName : string; email : string;
  age?: number;
  likeFb?: boolean; likeIg?: boolean; likeYt?: boolean;
  newsletterConsent: boolean;
}

export function addParticipant(p: ParticipantInput) {
  const full: ParticipantData = {
    firstName : p.firstName,
    lastName  : p.lastName,
    email     : p.email,
    age       : p.age ?? 0,
    likeFb    : p.likeFb ?? false,
    likeIg    : p.likeIg ?? false,
    likeYt    : p.likeYt ?? false,
    followsSocial: Boolean(p.likeFb || p.likeIg || p.likeYt),
    newsletterConsent: p.newsletterConsent,
    prizes    : [],
    timestamp : Date.now(),
  };
  gs.participants.push(full);
}

/* ───────── boot ───────── */
initGameState().catch(console.error);
