/* src/types/prizes.ts */
export type Rarity = 'voucher' | 'rare' | 'epic' | 'legendary';

export const UNLIMITED = 99_999;

export interface Prize {
  id: string;
  name: string;
  rarity: Rarity;
  dailyStock: number;
  image: string;
}

export const PRIZES: Prize[] = [
  { id: 'voucher',  name: 'Voucher 5% reducere',   rarity: 'voucher',   dailyStock: 9999, image: '/img/voucher.png' },
  { id: 'sapca',    name: 'Șapcă / Tricou Hilook', rarity: 'rare',      dailyStock: 8,    image: '/img/sapca.png' },
  { id: 'manusi',   name: 'Mănuși Hikvision',      rarity: 'rare',      dailyStock: 8,    image: '/img/manusi.png' },
  { id: 'breloc',   name: 'Breloc Dahua',          rarity: 'rare',      dailyStock: 8,    image: '/img/breloc.png' },
  { id: 'pix',      name: 'Pix Dahua',             rarity: 'rare',      dailyStock: 8,    image: '/img/pix.png' },
  { id: 'charger',  name: 'Încărcător 45W',        rarity: 'epic',      dailyStock: 12,   image: '/img/charger.png' },
  { id: 'stick',    name: 'Stick 16GB Dahua',      rarity: 'epic',      dailyStock: 8,    image: '/img/stick.png' },
  { id: 'kit',      name: 'Kit 2 Camere Hilook',   rarity: 'legendary', dailyStock: 1,    image: '/img/legendary.png' },
];

export const RARITY_COLORS: Record<Rarity, string> = {
  voucher   : '#6b7280',
  rare      : '#60a5fa',
  epic      : '#ef4444',
  legendary : '#facc15',
};

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
