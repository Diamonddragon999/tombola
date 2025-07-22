export type Rarity = 'voucher' | 'rare' | 'epic' | 'legendary';

export interface Prize {
  id: string;
  name: string;
  rarity: Rarity;
  dailyStock: number;                //  99 999 ⇒ “∞” în UI
}

export const UNLIMITED = 99_999;     // folosit în logică + UI

export const PRIZES: Prize[] = [
  { id: 'voucher5',   name: 'Voucher 5 % reducere', rarity: 'voucher',   dailyStock: UNLIMITED },
  { id: 'sapca-tricou', name: 'Șapcă / Tricou Hilook', rarity: 'rare',  dailyStock: 8 },
  { id: 'manusi',     name: 'Mănuși Hikvision',      rarity: 'rare',    dailyStock: 8 },
  { id: 'breloc',     name: 'Breloc Dahua',          rarity: 'rare',    dailyStock: 8 },
  { id: 'pix',        name: 'Pix Dahua',             rarity: 'rare',    dailyStock: 8 },
  { id: 'incarcator', name: 'Încărcător 45 W',       rarity: 'epic',    dailyStock: 12 },
  { id: 'stick',      name: 'Stick 16 GB Dahua',     rarity: 'epic',    dailyStock: 8 },
  { id: 'kit',        name: 'Kit 2 Camere Hilook',   rarity: 'legendary', dailyStock: 1 },
];

export const RARITY_COLORS: Record<Rarity, string> = {
  voucher   : '#6b7280', // gri – comun
  rare      : '#60a5fa', // albastru “spălăcit”
  epic      : '#ef4444', // roșu
  legendary : '#facc15', // galben
};


export const RARITY_WEIGHTS = {
  voucher   : 44,
  rare      : 40,
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
  prize: Prize
  firstName: string
  timestamp: number
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
