export type CardColor = 'red' | 'blue' | 'yellow' | 'black';
export type CardType = 'city' | 'event' | 'epidemic';

export interface CityCard {
  type: 'city';
  name: string;
  color: CardColor;
  population?: number;
  image?: string;
}

export interface EventCard {
  type: 'event';
  name: string;
  description: string;
  requiresState?: boolean;
  handler?: string;
  image?: string;
}

export interface EpidemicCard {
  type: 'epidemic';
  name: string;
  number: number;
}

export type PlayerCard = CityCard | EventCard | EpidemicCard;
export type InfectionCard = CityCard;

export interface SpecialEventEffect {
  forecastPending?: InfectionCard[];
  resilientPopulationActive?: boolean;
}