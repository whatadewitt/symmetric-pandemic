import { SeededRandom } from './random';
import { GameConfig } from '../types/game';
import { PlayerCard, InfectionCard, EpidemicCard } from '../types/cards';
import { getAllCities } from '../data/cities';
import { baseGameEvents, expansionEvents } from '../data/events';

export class DeckBuilder {
  private rng: SeededRandom;
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
    this.rng = new SeededRandom(config.seed);
  }

  buildPlayerDeck(): PlayerCard[] {
    const cities = getAllCities();
    const events = this.getAvailableEvents();
    
    // Select events for this game (2 per player for base game)
    const selectedEvents = this.rng.pick(events, this.config.playerCount * 2);
    
    // Create epidemic cards
    const epidemics: EpidemicCard[] = Array.from(
      { length: this.config.epidemicCount },
      (_, i) => ({
        type: 'epidemic',
        name: `Epidemic ${i + 1}`,
        number: i + 1
      })
    );

    // Shuffle city cards and events together
    let deck: PlayerCard[] = this.rng.shuffle([...cities, ...selectedEvents]);
    
    // Remove cards for initial hands (2 cards per player)
    const initialHandSize = this.config.playerCount * 2;
    const safeCards = deck.splice(0, initialHandSize);
    
    // Divide remaining deck into piles based on epidemic count
    const pileSize = Math.floor(deck.length / this.config.epidemicCount);
    const piles: PlayerCard[][] = [];
    
    for (let i = 0; i < this.config.epidemicCount; i++) {
      const pile = deck.splice(0, pileSize);
      // Add remaining cards to last pile
      if (i === this.config.epidemicCount - 1 && deck.length > 0) {
        pile.push(...deck);
      }
      // Add epidemic and shuffle pile
      pile.push(epidemics[i]);
      piles.push(this.rng.shuffle(pile));
    }
    
    // Combine all piles with safe cards on top
    return [...safeCards, ...piles.flat()];
  }

  buildInfectionDeck(): InfectionCard[] {
    const cities = getAllCities();
    return this.rng.shuffle(cities);
  }

  private getAvailableEvents(): PlayerCard[] {
    const events: PlayerCard[] = [...baseGameEvents];
    
    if (this.config.expansions.onTheBrink) {
      events.push(...expansionEvents.onTheBrink);
    }
    
    // Add more expansions here when ready
    
    return events;
  }
}