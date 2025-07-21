/* ------------- PREMII ------------------------------------------------ */
export type Rarity = 'voucher' | 'rare' | 'epic' | 'legendary';

export interface Prize {
  id: string;
  name: string;
  rarity: Rarity;
  dailyStock: number;           // voucher = Infinity
}

export const PRIZES: Prize[] = [
  { id: 'voucher5',      name: 'Voucher 5 % reducere', rarity: 'voucher',   dailyStock: Infinity },
  { id: 'sapca-tricou',  name: 'Șapcă / Tricou Hilook',rarity: 'rare',      dailyStock: 8 },
  { id: 'manusi',        name: 'Mănuși Hikvision',     rarity: 'rare',      dailyStock: 8 },
  { id: 'breloc',        name: 'Breloc Dahua',         rarity: 'rare',      dailyStock: 8 },
  { id: 'pix',           name: 'Pix Dahua',            rarity: 'rare',      dailyStock: 8 },
  { id: 'incarcator',    name: 'Încărcător 45 W',      rarity: 'rare',      dailyStock: 12 },
  { id: 'stick',         name: 'Stick 16 GB Dahua',    rarity: 'epic',      dailyStock: 8 },
  { id: 'kit',           name: 'Kit 2 Camere Hilook',  rarity: 'legendary', dailyStock: 1 },
];

/* ------------- AFIŞARE PE FELIE ------------------------------------- */
export const RARITY_COLORS: Record<Rarity, string> = {
  voucher   : '#6b7280',
  rare      : '#4ade80',
  epic      : '#8b5cf6',
  legendary : '#facc15',
};

/* ------------- GREUTĂŢI LA EXTRAGERE -------------------------------- */
export const RARITY_WEIGHTS = {
  voucher   : 40,
  rare      : 40,
  epic      : 19,
  legendary : 1,
};

/* ------------- ALTE TIPURI ------------------------------------------ */
export interface ParticipantData {
  firstName: string;  lastName: string;  email: string;
  followsSocial: boolean;  newsletterConsent: boolean;
  timestamp: number;
}

export interface SpinResult {
  prize: Prize;                  // niciodată null – tot timpul câştigi ceva
  firstName: string;
  timestamp: number;
}

export interface GameState {
  day: string;
  totalSpins: number;
  remainingStock: Record<string, number>;
  participants: ParticipantData[];
  spinResults : SpinResult[];
  legendaryGiven: boolean;       // asigură 1 × legendary / zi
  isSpinning: boolean;           // UX local (telefon + desktop)
}
