import { Prize, PRIZES, GameState, ParticipantData, SpinResult } from '../types/prizes';
const STORAGE_KEY = 'festival2025_game_state';

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getGameState(): GameState {
  const stored = localStorage.getItem(STORAGE_KEY);
  const today = getTodayString();
  
  if (!stored) {
    return initializeGameState();
  }
  
  const state: GameState = JSON.parse(stored);
  
  // Check if we need to reset for a new day
  if (state.day !== today) {
    return resetDailyStock(state);
  }
  
  return state;
}

export function saveGameState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function initializeGameState(): GameState {
  const state: GameState = {
    day: getTodayString(),
    totalSpins: 0,
    remainingStock: {},
    participants: [],
    spinResults: [],
    isSpinning: false
  };
  
  // Initialize stock
  PRIZES.forEach(prize => {
    state.remainingStock[prize.id] = prize.dailyStock;
  });
  
  saveGameState(state);
  return state;
}

function resetDailyStock(oldState: GameState): GameState {
  const newState: GameState = {
    ...oldState,
    day: getTodayString(),
    totalSpins: 0,
    remainingStock: {},
    spinResults: [],
    isSpinning: false
  };
  
  // Reset stock to daily limits
  PRIZES.forEach(prize => {
    newState.remainingStock[prize.id] = prize.dailyStock;
  });
  
  saveGameState(newState);
  return newState;
}

export function getAvailablePrizes(): Prize[] {
  const state = getGameState();
  return PRIZES.filter(prize => state.remainingStock[prize.id] > 0);
}

export function canSpinLegendary(): boolean {
  const state = getGameState();
  return state.totalSpins >= 10;
}

export function selectRandomPrize(): Prize | null {
  const availablePrizes = getAvailablePrizes();
  if (availablePrizes.length === 0) return null;
  
  // Filter out legendary prizes if rule not met
  const eligiblePrizes = availablePrizes.filter(prize => 
    prize.rarity !== 'legendary' || canSpinLegendary()
  );
  
  if (eligiblePrizes.length === 0) return null;
  
  // Probability distribution: legendary 1%, epic 19%, rare 40%, nothing 40%
  const random = Math.random() * 100;
  
  // 40% chance of nothing
  if (random < 40) {
    return null; // Nothing won
  }
  
  // 1% chance of legendary (if available and rules met)
  const legendaryPrizes = eligiblePrizes.filter(p => p.rarity === 'legendary');
  if (random >= 99 && legendaryPrizes.length > 0) {
    const state = getGameState();
    const availableLegendary = legendaryPrizes.find(p => state.remainingStock[p.id] > 0);
    if (availableLegendary) return availableLegendary;
  }
  
  // 19% chance of epic
  const epicPrizes = eligiblePrizes.filter(p => p.rarity === 'epic');
  if (random >= 80 && random < 99 && epicPrizes.length > 0) {
    const state = getGameState();
    const availableEpic = epicPrizes.find(p => state.remainingStock[p.id] > 0);
    if (availableEpic) return availableEpic;
  }
  
  // 40% chance of rare (remaining probability)
  const rarePrizes = eligiblePrizes.filter(p => p.rarity === 'rare');
  if (rarePrizes.length > 0) {
    const state = getGameState();
    const availableRare = rarePrizes.filter(p => state.remainingStock[p.id] > 0);
    if (availableRare.length > 0) {
      // Random selection from available rare prizes
      const randomIndex = Math.floor(Math.random() * availableRare.length);
      return availableRare[randomIndex];
    }
  }
  
  return null; // Nothing available
}

export function consumePrize(prizeId: string): boolean {
  const state = getGameState();
  
  if (state.remainingStock[prizeId] <= 0) {
    return false;
  }
  
  state.remainingStock[prizeId]--;
  state.totalSpins++;
  saveGameState(state);
  return true;
}

export function setSpinning(isSpinning: boolean): void {
  const state = getGameState();
  state.isSpinning = isSpinning;
  saveGameState(state);
}

export function addParticipant(participant: Omit<ParticipantData, 'timestamp'>): void {
  const state = getGameState();
  state.participants.push({
    ...participant,
    timestamp: Date.now()
  });
  saveGameState(state);
}

export function addSpinResult(result: Omit<SpinResult, 'timestamp'>): void {
  const state = getGameState();
  state.spinResults.push({
    ...result,
    timestamp: Date.now()
  });
  saveGameState(state);
}

export function exportGameData(): string {
  const state = getGameState();
  return JSON.stringify(state, null, 2);
}