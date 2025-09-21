import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { CardDisplay } from "./CardDisplay";
import { EffectsPanel } from "./EffectsPanel";
import { GameLog } from "./GameLog";
import { PlayerCard } from "../types/cards";

export const GameBoard: React.FC = () => {
  const {
    config,
    playerDeck,
    playerHands,
    infectionDeck,
    infectionDiscard,
    initialInfections,
    phase,
    drawPlayerCard,
    drawInfectionCard,
    drawInfectionLevel,
    startGame,
    processEpidemicBottomCard,
    resetGame,
  } = useGameStore();

  const [currentCard, setCurrentCard] = useState<PlayerCard | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDrawPlayer = () => {
    if (isDrawing || phase === "epidemic") return;

    setIsDrawing(true);
    setIsAnimating(true);
    const card = drawPlayerCard();
    if (card) {
      setCurrentCard(card);
      setTimeout(() => setIsAnimating(false), 500);
    }
    // Prevent double-clicks
    setTimeout(() => setIsDrawing(false), 1000);
  };

  const handleDrawInfection = () => {
    if (isDrawing || phase === "epidemic") return;

    // Handle epidemic-waiting phase
    if (phase === "epidemic-waiting") {
      processEpidemicBottomCard();
      return;
    }

    setIsDrawing(true);
    setIsAnimating(true);
    const card = drawInfectionCard();
    if (card) {
      setCurrentCard(card as PlayerCard);
      setTimeout(() => setIsAnimating(false), 500);
    }
    // Prevent double-clicks
    setTimeout(() => setIsDrawing(false), 1000);
  };

  const shareGame = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Game URL copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Main content area - fixed width, no margin adjustments */}
      <div className="min-h-screen p-4 pt-8 pb-16 flex flex-col">
        {/* Header - Always visible */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pandemic-red to-pandemic-yellow bg-clip-text text-transparent">
              SYMMETRIC PANDEMIC
            </h1>
            <div className="flex gap-2">
              <button
                onClick={shareGame}
                className="px-3 py-1 bg-pandemic-blue hover:bg-blue-600 rounded-lg transition-colors text-sm"
              >
                Share
              </button>
              <button
                onClick={resetGame}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
              >
                New
              </button>
            </div>
          </div>
        </div>

        {/* Initialization Setup Phase */}
        {(phase === "initial-cards" ||
          phase.startsWith("infection-level") ||
          phase === "ready-to-start") && (
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-4">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Game Setup</h2>

              {/* Player Hands Display - Show during initial-cards phase */}
              {playerHands.length > 0 &&
                phase === "initial-cards" && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Player Starting Hands
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {playerHands.map((hand, playerIndex) => (
                        <div
                          key={playerIndex}
                          className="bg-gray-700 rounded-lg p-3"
                        >
                          <h4 className="font-semibold mb-2">
                            Player {playerIndex + 1}
                          </h4>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {hand.map((card, cardIndex) => (
                              <CardDisplay
                                key={cardIndex}
                                card={card}
                                size="small"
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Current Infection Level Display */}
              {initialInfections[2].length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-yellow-400">
                    Level 1 Infections (1 cube each)
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {initialInfections[2].map((card, cardIndex) => (
                      <div key={cardIndex} className="relative">
                        <CardDisplay card={card} size="small" />
                        <div className="absolute -top-1 -right-1 bg-yellow-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          1
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {initialInfections[1].length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-orange-400">
                    Level 2 Infections (2 cubes each)
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {initialInfections[1].map((card, cardIndex) => (
                      <div key={cardIndex} className="relative">
                        <CardDisplay card={card} size="small" />
                        <div className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          2
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {initialInfections[0].length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-red-400">
                    Level 3 Infections (3 cubes each)
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {initialInfections[0].map((card, cardIndex) => (
                      <div key={cardIndex} className="relative">
                        <CardDisplay card={card} size="small" />
                        <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          3
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main game area - Fills available height */}
        <div className="flex-1 flex flex-col">
          {/* Card Display - Main focus */}
          {phase === "playing" && (
            <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-4">
              <CardDisplay card={currentCard} isAnimating={isAnimating} />
            </div>
          )}

          {/* Setup Phase Buttons */}

          {phase === "initial-cards" && (
            <div className="grid grid-cols-1 gap-3 mb-4">
              <button
                onClick={() => drawInfectionLevel(1)}
                className="py-4 sm:py-6 rounded-xl font-bold text-base sm:text-lg transition-all bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
              >
                <div>🟡 DRAW INFECTION LEVEL 1</div>
                <div className="text-xs opacity-75">
                  3 cities get 1 cube each
                </div>
              </button>
            </div>
          )}

          {phase === "infection-level-1" && (
            <div className="grid grid-cols-1 gap-3 mb-4">
              <button
                onClick={() => drawInfectionLevel(1)}
                className="py-4 sm:py-6 rounded-xl font-bold text-base sm:text-lg transition-all bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
              >
                <div>🟡 DRAW INFECTION LEVEL 1</div>
                <div className="text-xs opacity-75">
                  3 cities get 1 cube each
                </div>
              </button>
            </div>
          )}

          {phase === "infection-level-2" && (
            <div className="grid grid-cols-1 gap-3 mb-4">
              <button
                onClick={() => drawInfectionLevel(2)}
                className="py-4 sm:py-6 rounded-xl font-bold text-base sm:text-lg transition-all bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
              >
                <div>🟠 DRAW INFECTION LEVEL 2</div>
                <div className="text-xs opacity-75">
                  3 cities get 2 cubes each
                </div>
              </button>
            </div>
          )}

          {phase === "infection-level-3" && (
            <div className="grid grid-cols-1 gap-3 mb-4">
              <button
                onClick={() => drawInfectionLevel(3)}
                className="py-4 sm:py-6 rounded-xl font-bold text-base sm:text-lg transition-all bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                <div>🔴 DRAW INFECTION LEVEL 3</div>
                <div className="text-xs opacity-75">
                  3 cities get 3 cubes each
                </div>
              </button>
            </div>
          )}

          {phase === "ready-to-start" && (
            <div className="grid grid-cols-1 gap-3 mb-4">
              <button
                onClick={startGame}
                className="py-4 sm:py-6 rounded-xl font-bold text-base sm:text-lg transition-all bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <div>🎯 BEGIN GAME</div>
              </button>
            </div>
          )}

          {/* Game Action Buttons */}
          {(phase === "playing" || phase === "epidemic" || phase === "epidemic-waiting") && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <button
                onClick={handleDrawPlayer}
                disabled={
                  playerDeck.length === 0 ||
                  isDrawing ||
                  phase === "epidemic" ||
                  phase === "epidemic-waiting"
                }
                className={`relative py-4 sm:py-6 rounded-xl font-bold text-base sm:text-lg transition-all ${
                  phase === "epidemic" || phase === "epidemic-waiting"
                    ? "bg-gray-700 opacity-50 cursor-not-allowed"
                    : playerDeck.length > 0 && !isDrawing
                      ? "bg-gradient-to-r from-pandemic-blue to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      : "bg-gray-700 opacity-50 cursor-not-allowed"
                }`}
              >
                <div>
                  {phase === "epidemic" || phase === "epidemic-waiting"
                    ? "⏸️ PAUSED"
                    : "PLAYER"}
                </div>
                <div className="text-xs opacity-75">
                  {phase === "epidemic" || phase === "epidemic-waiting"
                    ? "Epidemic!"
                    : `(${playerDeck.length})`}
                </div>
              </button>

              <button
                onClick={handleDrawInfection}
                disabled={
                  infectionDeck.length === 0 ||
                  isDrawing ||
                  phase === "epidemic"
                }
                className={`relative py-4 sm:py-6 rounded-xl font-bold text-base sm:text-lg transition-all ${
                  phase === "epidemic"
                    ? "bg-gradient-to-r from-red-600 to-red-800 animate-pulse text-white"
                    : phase === "epidemic-waiting"
                      ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white animate-pulse"
                      : infectionDeck.length > 0 && !isDrawing
                        ? "bg-gradient-to-r from-pandemic-yellow to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900"
                        : "bg-gray-700 opacity-50 cursor-not-allowed"
                }`}
              >
                <div>
                  {phase === "epidemic"
                    ? "⚠️ BOTTOM"
                    : phase === "epidemic-waiting"
                      ? "⚠️ CLICK TO DRAW"
                      : "INFECTION"}
                </div>
                <div className="text-xs opacity-75">
                  {phase === "epidemic"
                    ? "Drawing..."
                    : phase === "epidemic-waiting"
                      ? "Bottom Card"
                      : `(${infectionDeck.length})`}
                </div>
              </button>

              <button
                disabled={true}
                className={`relative py-4 sm:py-6 rounded-xl font-bold text-base sm:text-lg transition-all ${
                  phase === "epidemic"
                    ? "bg-gradient-to-r from-pandemic-red to-red-700 animate-pulse"
                    : "bg-gray-700 opacity-50 cursor-not-allowed"
                }`}
              >
                <div>{phase === "epidemic" ? "☠️ EPIDEMIC" : "STATUS"}</div>
                <div className="text-xs opacity-75">
                  {phase === "epidemic" ? "Processing" : "Normal"}
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Game Info - Bottom bar, can scroll to see */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-3 mt-auto">
          <div className="flex flex-wrap gap-3 text-xs sm:text-sm justify-center">
            <div>
              <span className="text-gray-400">Seed:</span>{" "}
              <span className="font-mono font-bold text-pandemic-blue">
                {config.seed}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Players:</span>{" "}
              <span className="font-bold">{config.playerCount}</span>
            </div>
            <div>
              <span className="text-gray-400">Epidemics:</span>{" "}
              <span className="font-bold text-pandemic-red">
                {config.epidemicCount}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Discard:</span>{" "}
              <span className="font-bold text-pandemic-yellow">
                {infectionDiscard.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Effects Panel - Left side */}
      <EffectsPanel />

      {/* Game Log - Right side */}
      <GameLog />
    </div>
  );
};
