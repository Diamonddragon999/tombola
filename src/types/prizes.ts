/* src/types/prizes.ts */

export type Rarity = 'voucher' | 'rare' | 'epic' | 'legendary';

export const UNLIMITED = 99_999;

/** Structura unui premiu */
export interface Prize {
  id: string;
  name: string;
  rarity: Rarity;
  dailyStock: number;   // 99_999 => afișăm „∞”
  image: string;
}

/** Lista de premii */
export const PRIZES: Readonly<Prize[]> = [
  // voucher
  { id: 'voucher',  name: 'Voucher 5% reducere', rarity: 'voucher',   dailyStock: 9999, image: '/img/voucher.jpg' },

  // rare
  { id: 'sapca',    name: 'Șapcă Hilook',        rarity: 'rare',      dailyStock: 4,    image: '/img/sapca.jpg' },
  { id: 'tricou',   name: 'Tricou Hilook',       rarity: 'rare',      dailyStock: 4,    image: '/img/tricou.jpg' },
  { id: 'manusi',   name: 'Mănuși Hikvision',    rarity: 'rare',      dailyStock: 8,    image: '/img/manusi.jpg' },
  { id: 'breloc',   name: 'Breloc Dahua',        rarity: 'rare',      dailyStock: 8,    image: '/img/breloc.jpg' },
  { id: 'pix',      name: 'Pix Dahua',           rarity: 'rare',      dailyStock: 8,    image: '/img/pix.jpg' },

  // epic
  { id: 'charger',  name: 'Încărcător 45W',      rarity: 'epic',      dailyStock: 12,   image: '/img/charger.jpg' },
  { id: 'stick',    name: 'Stick 16GB Dahua',    rarity: 'epic',      dailyStock: 8,    image: '/img/stick.jpg' },

  // legendary
  { id: 'kit',      name: 'Kit 2 Camere Hilook', rarity: 'legendary', dailyStock: 1,    image: '/img/legendary.jpg' },
] as const;

/** Culori pe rarități */
export const RARITY_COLORS: Record<Rarity, string> = {
  voucher   : '#6b7280',
  rare      : '#60a5fa',
  epic      : '#ef4444',
  legendary : '#facc15',
};

/** Ponderi pentru extragere (rămân aceleași) */
export const RARITY_WEIGHTS: Record<Rarity, number> = {
  voucher   : 54,
  rare      : 30,
  epic      : 15,
  legendary : 1,
};

export interface ParticipantData {
  firstName: string;
  lastName : string;
  email    : string;
  followsSocial: boolean;
  newsletterConsent: boolean;
  timestamp: number;
}

export interface SpinResult {
  prize: Prize;
  firstName: string;
  timestamp: number;
}

export interface GameState {
  day: string;
  totalSpins: number;
  remainingStock: Record<string, number>;
  participants: ParticipantData[];
  spinResults: SpinResult[];
  legendaryGiven: boolean;
  isSpinning: boolean;
}
