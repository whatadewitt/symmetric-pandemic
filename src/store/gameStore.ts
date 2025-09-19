import { create } from 'zustand';
import { GameState, GameConfig } from '../types/game';
import { PlayerCard, InfectionCard } from '../types/cards';
import { GameLog, LogEntry } from '../types/gameLog';
import { DeckBuilder } from '../utils/deckBuilder';
import { GameLogStorage } from '../utils/gameLogStorage';
import { SeededRandom } from '../utils/random';

interface GameStore extends GameState {
  initGame: (config: GameConfig) => void;
  dealInitialCards: () => void;
  drawInfectionLevel: (level: 3 | 2 | 1) => void;
  startGame: () => void;
  drawPlayerCard: () => PlayerCard | null;
  drawInfectionCard: () => InfectionCard | null;
  handleEpidemic: () => void;
  processEpidemicBottomCard: () => void;
  playOneQuietNight: () => void;
  playResilientPopulation: () => void;
  playForecast: () => void;
  skipInfectionPhase: () => void;
  setForecastCards: (cards: InfectionCard[]) => void;
  reorderForecastCards: (cards: InfectionCard[]) => void;
  removeFromInfectionDiscard: (card: InfectionCard) => void;
  resetGame: () => void;
  toggleLogVisibility: () => void;
  toggleEffectsVisibility: () => void;
  addLogEntry: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  exportCurrentLog: () => string | null;
  getSavedLogs: () => GameLog[];
}

const initialState: GameState = {
  config: {
    seed: '',
    playerCount: 4,
    epidemicCount: 5,
    expansions: {},
  },
  playerDeck: [],
  playerDiscard: [],
  playerHands: [],
  infectionDeck: [],
  infectionDiscard: [],
  drawnCards: [],
  initialInfections: [[], [], []],
  specialEffects: {},
  turnCount: 0,
  phase: 'setup',
  currentLog: null,
  isLogVisible: false,
  isEffectsVisible: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  initGame: (config: GameConfig) => {
    const builder = new DeckBuilder(config);
    const playerDeck = builder.buildPlayerDeck();
    const infectionDeck = builder.buildInfectionDeck();

    // Create new game log
    const gameLog: GameLog = {
      gameId: `${config.seed}_${Date.now()}`,
      seed: config.seed,
      playerCount: config.playerCount,
      epidemicCount: config.epidemicCount,
      startTime: Date.now(),
      entries: [{
        id: `${Date.now()}_start`,
        timestamp: Date.now(),
        turn: 0,
        action: 'GAME_START',
        metadata: {
          playerDeckCount: playerDeck.length,
          infectionDeckCount: infectionDeck.length,
          infectionDiscardCount: 0,
        }
      }]
    };

    // Initialize player hands and deal 2 cards to each player alternating
    const playerHands: PlayerCard[][] = Array(config.playerCount).fill(null).map(() => []);
    
    // Deal 2 cards to each player in round-robin fashion: 1-2-3-4-1-2-3-4
    for (let cardNum = 0; cardNum < 2; cardNum++) {
      for (let player = 0; player < config.playerCount; player++) {
        if (playerDeck.length > 0) {
          const card = playerDeck.shift()!;
          playerHands[player].push(card);
          
          // Log the card deal
          gameLog.entries.push({
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            turn: 0,
            action: 'DRAW_PLAYER',
            card,
            metadata: {
              playerDeckCount: playerDeck.length,
              infectionDeckCount: infectionDeck.length,
              infectionDiscardCount: 0,
              playerNumber: player + 1,
            }
          });
        }
      }
    }

    set({
      config,
      playerDeck,
      playerHands,
      infectionDeck,
      playerDiscard: [],
      infectionDiscard: [],
      drawnCards: [],
      initialInfections: [[], [], []],
      specialEffects: {},
      turnCount: 0,
      phase: 'initial-cards', // Show player hands first
      currentLog: gameLog,
      isLogVisible: false,
    });

    // Update URL with seed
    const url = new URL(window.location.href);
    url.searchParams.set('seed', config.seed);
    url.searchParams.set('players', config.playerCount.toString());
    url.searchParams.set('epidemics', config.epidemicCount.toString());
    window.history.replaceState({}, '', url.toString());
  },

  dealInitialCards: () => {
    const state = get();
    const newPlayerDeck = [...state.playerDeck];
    const newPlayerHands = [...state.playerHands];

    // Deal 2 cards to each player
    for (let player = 0; player < state.config.playerCount; player++) {
      for (let cardNum = 0; cardNum < 2; cardNum++) {
        if (newPlayerDeck.length > 0) {
          const card = newPlayerDeck.shift()!;
          newPlayerHands[player].push(card);
          
          // Log the card deal
          get().addLogEntry({
            turn: 0,
            action: 'DRAW_PLAYER',
            card,
            metadata: {
              playerDeckCount: newPlayerDeck.length,
              infectionDeckCount: state.infectionDeck.length,
              infectionDiscardCount: 0,
              playerNumber: player + 1,
            }
          });
        }
      }
    }

    set({
      playerDeck: newPlayerDeck,
      playerHands: newPlayerHands,
      phase: 'infection-level-1'
    });
  },

  drawInfectionLevel: (level: 3 | 2 | 1) => {
    const state = get();
    const newInfectionDeck = [...state.infectionDeck];
    const newInitialInfections = [...state.initialInfections];
    const levelIndex = 3 - level; // Convert 3,2,1 to 0,1,2

    // Draw 3 cards for this level
    for (let i = 0; i < 3; i++) {
      if (newInfectionDeck.length > 0) {
        const card = newInfectionDeck.shift()!;
        newInitialInfections[levelIndex].push(card);
        
        // Log the infection
        get().addLogEntry({
          turn: 0,
          action: 'DRAW_INFECTION',
          card,
          metadata: {
            playerDeckCount: state.playerDeck.length,
            infectionDeckCount: newInfectionDeck.length,
            infectionDiscardCount: 0,
            infectionLevel: level,
          }
        });
      }
    }

    // Determine next phase
    let nextPhase: typeof state.phase;
    if (level === 1) nextPhase = 'infection-level-2';
    else if (level === 2) nextPhase = 'infection-level-3';
    else nextPhase = 'ready-to-start'; // New phase for showing "Begin" button

    set({
      infectionDeck: newInfectionDeck,
      initialInfections: newInitialInfections,
      phase: nextPhase
    });
  },

  startGame: () => {
    const state = get();
    // Move all initial infection cards to discard pile
    const allInitialInfections = [...state.initialInfections[0], ...state.initialInfections[1], ...state.initialInfections[2]];
    set({ 
      phase: 'playing',
      infectionDiscard: allInitialInfections
    });
  },

  drawPlayerCard: () => {
    const state = get();
    if (state.playerDeck.length === 0) return null;

    const [card, ...remaining] = state.playerDeck;
    
    // Add log entry
    get().addLogEntry({
      turn: state.turnCount + 1,
      action: card.type === 'epidemic' ? 'EPIDEMIC' : 'DRAW_PLAYER',
      card,
      metadata: {
        playerDeckCount: remaining.length,
        infectionDeckCount: state.infectionDeck.length,
        infectionDiscardCount: state.infectionDiscard.length,
        epidemicNumber: card.type === 'epidemic' ? card.number : undefined,
      }
    });

    set({
      playerDeck: remaining,
      drawnCards: [...state.drawnCards, card],
      turnCount: state.turnCount + 1,
    });

    // Handle special event cards automatically
    if (card.type === 'epidemic') {
      get().handleEpidemic();
    } else if (card.type === 'event') {
      // Auto-activate certain events
      if (card.name === 'Resilient Population') {
        get().playResilientPopulation();
      } else if (card.name === 'One Quiet Night') {
        get().playOneQuietNight();
      } else if (card.name === 'Forecast') {
        get().playForecast();
      }
    }

    return card;
  },

  drawInfectionCard: () => {
    const state = get();
    
    // Check for One Quiet Night effect
    if (state.specialEffects.oneQuietNight) {
      get().skipInfectionPhase();
      return null;
    }

    if (state.infectionDeck.length === 0) return null;

    const [card, ...remaining] = state.infectionDeck;
    
    // Add log entry
    get().addLogEntry({
      turn: state.turnCount,
      action: 'DRAW_INFECTION',
      card,
      metadata: {
        playerDeckCount: state.playerDeck.length,
        infectionDeckCount: remaining.length,
        infectionDiscardCount: state.infectionDiscard.length + 1,
      }
    });

    set({
      infectionDeck: remaining,
      infectionDiscard: [card, ...state.infectionDiscard],
    });

    return card;
  },

  handleEpidemic: () => {
    const state = get();
    
    // Set phase to epidemic-waiting to require user interaction
    set({ phase: 'epidemic-waiting' });
    
    // Add log entry for epidemic handling
    get().addLogEntry({
      turn: state.turnCount,
      action: 'EPIDEMIC',
      metadata: {
        playerDeckCount: state.playerDeck.length,
        infectionDeckCount: state.infectionDeck.length,
        infectionDiscardCount: state.infectionDiscard.length,
      }
    });
  },

  processEpidemicBottomCard: () => {
    const currentState = get();
    
    // Set phase to epidemic during processing
    set({ phase: 'epidemic' });
    
    // Draw bottom card from infection deck
    const bottomCard = currentState.infectionDeck[currentState.infectionDeck.length - 1];
    if (!bottomCard) {
      set({ phase: 'playing' });
      return;
    }

    const newInfectionDeck = currentState.infectionDeck.slice(0, -1);
    
    // Add bottom card to discard
    const updatedDiscard = [...currentState.infectionDiscard, bottomCard];
    
    // Shuffle discard pile using seeded random
    const rng = new SeededRandom(currentState.config.seed + '_epidemic_' + currentState.turnCount);
    const shuffled = rng.shuffle(updatedDiscard);
    
    // Place shuffled cards on top of deck
    set({
      infectionDeck: [...shuffled, ...newInfectionDeck],
      infectionDiscard: [],
    });

    // Log the bottom card infection
    get().addLogEntry({
      turn: currentState.turnCount,
      action: 'DRAW_INFECTION',
      card: bottomCard,
      metadata: {
        playerDeckCount: currentState.playerDeck.length,
        infectionDeckCount: newInfectionDeck.length + shuffled.length,
        infectionDiscardCount: 0,
        eventEffect: 'Epidemic Bottom Card',
      }
    });

    // Return to playing phase after a delay
    setTimeout(() => set({ phase: 'playing' }), 1500);
  },

  playOneQuietNight: () => {
    set(state => ({
      specialEffects: { ...state.specialEffects, oneQuietNight: true }
    }));
  },

  playResilientPopulation: () => {
    set(state => ({
      specialEffects: { ...state.specialEffects, resilientPopulationActive: true },
      isEffectsVisible: true,
    }));
  },

  playForecast: () => {
    const state = get();
    // Take top 6 cards from infection deck
    const forecastCards = state.infectionDeck.slice(0, 6);
    get().setForecastCards(forecastCards);
    
    // Remove these cards from the deck temporarily
    set({
      infectionDeck: state.infectionDeck.slice(6),
    });
  },

  skipInfectionPhase: () => {
    set(state => ({
      specialEffects: { ...state.specialEffects, oneQuietNight: false }
    }));
  },

  setForecastCards: (cards: InfectionCard[]) => {
    set(state => ({
      specialEffects: { ...state.specialEffects, forecastPending: cards }
    }));
  },

  reorderForecastCards: (cards: InfectionCard[]) => {
    const state = get();
    set({
      infectionDeck: [...cards, ...state.infectionDeck],
      specialEffects: { ...state.specialEffects, forecastPending: undefined }
    });
  },

  removeFromInfectionDiscard: (card: InfectionCard) => {
    const state = get();
    set({
      infectionDiscard: state.infectionDiscard.filter(c => c.name !== card.name),
      specialEffects: { ...state.specialEffects, resilientPopulationActive: false },
      isEffectsVisible: false,
    });
  },

  resetGame: () => {
    const state = get();
    
    // Save current log if it exists
    if (state.currentLog) {
      const finalLog = {
        ...state.currentLog,
        endTime: Date.now(),
        result: 'abandoned' as const,
      };
      GameLogStorage.saveCurrentLog(finalLog);
    }
    
    set(initialState);
    window.history.replaceState({}, '', window.location.pathname);
  },

  toggleLogVisibility: () => {
    set(state => ({ isLogVisible: !state.isLogVisible }));
  },

  toggleEffectsVisibility: () => {
    set(state => ({ isEffectsVisible: !state.isEffectsVisible }));
  },

  addLogEntry: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const state = get();
    if (!state.currentLog) return;

    const newEntry: LogEntry = {
      ...entry,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    const updatedLog = {
      ...state.currentLog,
      entries: [newEntry, ...state.currentLog.entries],
    };

    set({ currentLog: updatedLog });
    
    // Auto-save to localStorage every few entries
    if (updatedLog.entries.length % 5 === 0) {
      GameLogStorage.saveCurrentLog(updatedLog);
    }
  },

  exportCurrentLog: () => {
    const state = get();
    if (!state.currentLog) return null;
    return GameLogStorage.exportLog(state.currentLog);
  },

  getSavedLogs: () => {
    return GameLogStorage.getSavedLogs();
  },
}));