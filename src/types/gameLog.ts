import { PlayerCard, InfectionCard } from './cards';

export interface LogEntry {
  id: string;
  timestamp: number;
  turn: number;
  action: 'DRAW_PLAYER' | 'DRAW_INFECTION' | 'EPIDEMIC' | 'EVENT_PLAYED' | 'GAME_START' | 'GAME_END';
  card?: PlayerCard | InfectionCard;
  metadata?: {
    playerDeckCount?: number;
    infectionDeckCount?: number;
    infectionDiscardCount?: number;
    epidemicNumber?: number;
    eventEffect?: string;
    gameResult?: 'win' | 'lose' | 'abandoned';
    playerNumber?: number;
    infectionLevel?: number;
  };
}

export interface GameLog {
  gameId: string;
  seed: string;
  playerCount: number;
  epidemicCount: number;
  startTime: number;
  endTime?: number;
  entries: LogEntry[];
  result?: 'win' | 'lose' | 'abandoned';
}

export interface GameLogStore {
  currentLog: GameLog | null;
  savedLogs: GameLog[];
  isLogVisible: boolean;
}