// TypeScript type definitions for the Pandemic deck manager

export interface Card {
  id: string;
  name: string;
  type: 'city' | 'epidemic' | 'event';
}

export interface CityCard extends Card {
  type: 'city';
  color: 'red' | 'blue' | 'yellow' | 'black';
  population: number;
}

export interface EpidemicCard extends Card {
  type: 'epidemic';
}

export interface EventCard extends Card {
  type: 'event';
  description: string;
}

export interface DeckState {
  playerDeck: Card[];
  discardPile: Card[];
  infectionDeck: CityCard[];
  infectionDiscard: CityCard[];
  drawnCards: Card[];
}

export interface GameSettings {
  difficulty: 'introductory' | 'normal' | 'heroic';
  epidemicCards: number;
  players: number;
  seed?: string;
}