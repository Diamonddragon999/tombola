export type Rarity = 'rare' | 'epic' | 'legendary';

export interface Prize {
  id: string;
  name: string;
  rarity: Rarity;
  dailyStock: number;
}

export const PRIZES: Prize[] = [
  { id: 'sapca-tricou', name: 'Șapcă / Tricou Hilook', rarity: 'rare', dailyStock: 8 },
  { id: 'manusi', name: 'Mănuși Hikvision', rarity: 'rare', dailyStock: 8 },
  { id: 'breloc', name: 'Breloc Dahua', rarity: 'rare', dailyStock: 8 },
  { id: 'pix', name: 'Pix Dahua', rarity: 'rare', dailyStock: 8 },
  { id: 'incarcator', name: 'Încărcător 45 W', rarity: 'rare', dailyStock: 12 },
  { id: 'stick', name: 'Stick 16 GB Dahua', rarity: 'epic', dailyStock: 8 },
  { id: 'kit', name: 'Kit 2 Camere Hilook', rarity: 'legendary', dailyStock: 1 }
];

export const RARITY_COLORS: Record<Rarity | 'none', string> = {
  rare: '#4ade80',
  epic: '#8b5cf6',
  legendary: '#facc15',
  none: '#4b5563'
};

export const RARITY_WEIGHTS = {
  rare: 10,
  epic: 4,
  legendary: 1
};

export interface ParticipantData {
  firstName: string;
  lastName: string;
  email: string;
  followsSocial: boolean;
  newsletterConsent: boolean;
  timestamp: number;
}

export interface SpinResult {
  prize: Prize | null;
  firstName: string;
  timestamp: number;
}

export interface GameState {
  day: string;
  totalSpins: number;
  remainingStock: Record<string, number>;
  participants: ParticipantData[];
  spinResults: SpinResult[];
  isSpinning: boolean;
}