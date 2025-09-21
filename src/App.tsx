import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { GameSetup } from './components/GameSetup';
import { GameBoard } from './components/GameBoard';

function App() {
  const { phase, initGame } = useGameStore();

  useEffect(() => {
    // Check URL params on load
    const params = new URLSearchParams(window.location.search);
    const seed = params.get('seed');
    const players = params.get('players');
    const epidemics = params.get('epidemics');

    if (seed && players && epidemics) {
      initGame({
        seed,
        playerCount: parseInt(players) as 2 | 3 | 4 | 5,
        epidemicCount: parseInt(epidemics) as 4 | 5 | 6 | 7,
        expansions: {},
      });
    }
  }, [initGame]);

  return phase === 'setup' ? <GameSetup /> : <GameBoard />;
}

export default App;