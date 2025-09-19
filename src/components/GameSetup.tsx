import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameConfig } from '../types/game';

export const GameSetup: React.FC = () => {
  const initGame = useGameStore(state => state.initGame);
  
  const [seed, setSeed] = useState('');
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4 | 5>(4);
  const [epidemicCount, setEpidemicCount] = useState<4 | 5 | 6 | 7>(5);
  const [expansions, setExpansions] = useState({
    onTheBrink: false,
    inTheLab: false,
    stateOfEmergency: false,
  });

  const handleStartGame = () => {
    const finalSeed = seed || Math.random().toString(36).substring(7);
    const config: GameConfig = {
      seed: finalSeed,
      playerCount,
      epidemicCount,
      expansions,
    };
    initGame(config);
  };

  const generateRandomSeed = () => {
    setSeed(Math.random().toString(36).substring(2, 9).toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full animate-slide-up">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pandemic-red to-pandemic-yellow bg-clip-text text-transparent">
          SYMMETRIC PANDEMIC
        </h1>
        
        <div className="space-y-6">
          {/* Seed Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Game Seed</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value.toUpperCase())}
                placeholder="Enter seed or generate"
                className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pandemic-blue focus:outline-none"
              />
              <button
                onClick={generateRandomSeed}
                className="px-4 py-2 bg-pandemic-blue hover:bg-blue-600 rounded-lg transition-colors"
              >
                🎲
              </button>
            </div>
          </div>

          {/* Expansions */}
          <div>
            <label className="block text-sm font-medium mb-2">Expansions</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={!expansions.onTheBrink && !expansions.inTheLab && !expansions.stateOfEmergency}
                  onChange={() => setExpansions({
                    onTheBrink: false,
                    inTheLab: false,
                    stateOfEmergency: false,
                  })}
                  className="mr-2 rounded"
                />
                Base Game Only
              </label>
              <label className="flex items-center opacity-50">
                <input
                  type="checkbox"
                  checked={expansions.onTheBrink}
                  onChange={(e) => setExpansions({...expansions, onTheBrink: e.target.checked})}
                  className="mr-2 rounded"
                  disabled
                />
                On The Brink (Coming Soon)
              </label>
              <label className="flex items-center opacity-50">
                <input
                  type="checkbox"
                  checked={expansions.inTheLab}
                  onChange={(e) => setExpansions({...expansions, inTheLab: e.target.checked})}
                  className="mr-2 rounded"
                  disabled
                />
                In The Lab (Coming Soon)
              </label>
              <label className="flex items-center opacity-50">
                <input
                  type="checkbox"
                  checked={expansions.stateOfEmergency}
                  onChange={(e) => setExpansions({...expansions, stateOfEmergency: e.target.checked})}
                  className="mr-2 rounded"
                  disabled
                />
                State of Emergency (Coming Soon)
              </label>
            </div>
          </div>

          {/* Player Count */}
          <div>
            <label className="block text-sm font-medium mb-2">Players</label>
            <div className="flex gap-2">
              {([2, 3, 4, 5] as const).map(count => (
                <button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    playerCount === count
                      ? 'bg-pandemic-blue text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty (Epidemics)</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 4, label: '4 - Easy' },
                { value: 5, label: '5 - Normal' },
                { value: 6, label: '6 - Heroic' },
                { value: 7, label: '7 - Legendary' },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setEpidemicCount(value)}
                  className={`py-2 px-3 rounded-lg transition-all text-sm ${
                    epidemicCount === value
                      ? 'bg-pandemic-red text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartGame}
            className="w-full py-3 bg-gradient-to-r from-pandemic-blue to-pandemic-purple hover:from-blue-600 hover:to-purple-600 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
          >
            START GAME
          </button>
        </div>
      </div>
    </div>
  );
};