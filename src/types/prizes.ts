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
  { id: 'voucher5',  name: 'Voucher 5% reducere', rarity: 'voucher',   dailyStock: 9999, image: '/img/voucher.jpg' },

  // rare
  { id: 'sapca',    name: 'Șapcă Hilook',        rarity: 'rare',      dailyStock: 7,    image: '/img/sapca.jpg' },
  { id: 'tricou',   name: 'Tricou Hilook',       rarity: 'rare',      dailyStock: 7,    image: '/img/tricou.jpg' },
  { id: 'manusi',   name: 'Mănuși Hikvision',    rarity: 'rare',      dailyStock: 5,    image: '/img/manusi.jpg' },
  { id: 'breloc',   name: 'Breloc Dahua',        rarity: 'rare',      dailyStock: 8,    image: '/img/breloc.jpg' },
  { id: 'pix',      name: 'Pix Dahua',           rarity: 'rare',      dailyStock: 8,    image: '/img/pix.jpg' },

  // epic
  { id: 'incarcator',  name: 'Încărcător 45W',      rarity: 'epic',      dailyStock: 12,   image: '/img/charger.jpg' },
  { id: 'stick',    name: 'Stick 16GB Dahua',    rarity: 'epic',      dailyStock: 8,    image: '/img/stick.jpg' },

  // legendary
  { id: 'kit',      name: 'Camera IP WI-FI', rarity: 'legendary', dailyStock: 1,    image: '/img/legendary.jpg' },
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
  voucher   : 0,
  rare      : 40,
  epic      : 60,
  legendary : 0,
};


/* …restul fişierului rămâne la fel … */

/** Participant complet – versiunea 2 */
export interface ParticipantData {
  /* date personale */
  firstName : string;
  lastName  : string;
  email     : string;
  age       : number;

  /* engagement social */
  likeFb : boolean;
  likeIg : boolean;
  likeYt : boolean;
  followsSocial : boolean;        //  ← ADĂUGAT

  newsletterConsent : boolean;

  prizes : Prize[];               // câştigurile din aceeaşi zi
  timestamp : number;
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
