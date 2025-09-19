import { PlayerCard, InfectionCard, SpecialEventEffect } from './cards';
import { GameLog, LogEntry } from './gameLog';

export interface GameConfig {
  seed: string;
  playerCount: 2 | 3 | 4 | 5;
  epidemicCount: 4 | 5 | 6 | 7;
  expansions: {
    onTheBrink?: boolean;
    inTheLab?: boolean;
    stateOfEmergency?: boolean;
  };
}

export interface GameState {
  config: GameConfig;
  playerDeck: PlayerCard[];
  playerDiscard: PlayerCard[];
  playerHands: PlayerCard[][];
  infectionDeck: InfectionCard[];
  infectionDiscard: InfectionCard[];
  drawnCards: PlayerCard[];
  initialInfections: InfectionCard[][];
  specialEffects: SpecialEventEffect;
  turnCount: number;
  phase: 'setup' | 'initial-cards' | 'infection-level-3' | 'infection-level-2' | 'infection-level-1' | 'ready-to-start' | 'playing' | 'epidemic' | 'epidemic-waiting' | 'finished';
  currentLog: GameLog | null;
  isLogVisible: boolean;
  isEffectsVisible: boolean;
}

export interface GameAction {
  type: 'DRAW_PLAYER' | 'DRAW_INFECTION' | 'EPIDEMIC' | 'PLAY_EVENT' | 'FORECAST_REORDER' | 'RESILIENT_REMOVE';
  payload?: any;
  timestamp: number;
}