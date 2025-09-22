import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { InfectionCard } from '../types/cards';

export const EffectsPanel: React.FC = () => {
  const {
    specialEffects,
    infectionDiscard,
    isEffectsVisible,
    toggleEffectsVisibility,
    reorderForecastCards,
    removeFromInfectionDiscard,
  } = useGameStore();

  const [forecastOrder, setForecastOrder] = useState<InfectionCard[]>([]);
  const [selectedDiscard, setSelectedDiscard] = useState<InfectionCard | null>(null);

  React.useEffect(() => {
    if (specialEffects.forecastPending) {
      setForecastOrder(specialEffects.forecastPending);
      toggleEffectsVisibility();
    }
  }, [specialEffects.forecastPending]);

  const handleForecastReorder = (fromIndex: number, toIndex: number) => {
    const newOrder = [...forecastOrder];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    setForecastOrder(newOrder);
  };

  const confirmForecastOrder = () => {
    reorderForecastCards(forecastOrder);
    setForecastOrder([]);
    toggleEffectsVisibility();
  };

  const confirmRemoveDiscard = () => {
    if (selectedDiscard) {
      removeFromInfectionDiscard(selectedDiscard);
      setSelectedDiscard(null);
    }
  };

  // Only show panel if there's an active effect
  const hasActiveEffect = specialEffects.forecastPending || 
                         specialEffects.resilientPopulationActive;

  if (!hasActiveEffect) return null;

  return (
    <>
      {/* Toggle Button - Always visible when effects are active */}
      <button
        onClick={toggleEffectsVisibility}
        className="fixed left-0 top-20 z-50 bg-pandemic-purple hover:bg-purple-600 text-white rounded-r-lg p-2 transition-all shadow-lg"
      >
        <span className="text-lg">{isEffectsVisible ? '◀' : '▶'}</span>
        <span className="text-xs block">Effects</span>
      </button>

      {/* Effects Panel */}
      <div className={`fixed left-0 top-16 bottom-16 bg-gray-800 shadow-2xl transition-all duration-300 z-50 ${
        isEffectsVisible ? 'w-80' : 'w-0'
      } overflow-hidden rounded-r-lg`}>
        {isEffectsVisible && (
          <div className="h-full flex flex-col p-4">
            {/* Header */}
            <div className="border-b border-gray-700 pb-4 mb-4">
              <h3 className="text-lg font-bold text-center text-pandemic-purple">Active Effects</h3>
            </div>


            {/* Forecast */}
            {specialEffects.forecastPending && forecastOrder.length > 0 && (
              <div className="p-3 bg-purple-900/30 rounded-lg mb-3 border border-purple-500/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🔮</span>
                  <p className="font-semibold">Forecast</p>
                </div>
                <p className="text-xs mb-3 opacity-75">Drag to reorder top 6 infection cards:</p>
                <div className="space-y-1 mb-3">
                  {forecastOrder.map((card, index) => (
                    <div
                      key={card.name}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('fromIndex', index.toString())}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const fromIndex = parseInt(e.dataTransfer.getData('fromIndex'));
                        handleForecastReorder(fromIndex, index);
                      }}
                      className="px-3 py-2 bg-gray-700 rounded cursor-move text-sm hover:bg-gray-600 transition-colors"
                    >
                      {index + 1}. {card.name}
                    </div>
                  ))}
                </div>
                <button
                  onClick={confirmForecastOrder}
                  className="w-full px-3 py-2 bg-pandemic-purple hover:bg-purple-600 rounded-lg transition-colors text-sm"
                >
                  Confirm Order
                </button>
              </div>
            )}

            {/* Resilient Population - Only when activated */}
            {specialEffects.resilientPopulationActive && infectionDiscard.length > 0 && (
              <div className="p-3 bg-green-900/30 rounded-lg border border-green-500/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🛡️</span>
                  <p className="font-semibold">Resilient Population</p>
                </div>
                <p className="text-xs mb-3 opacity-75">Remove one card from infection discard:</p>
                <div className="grid grid-cols-2 gap-1 mb-3 max-h-48 overflow-y-auto">
                  {infectionDiscard.map((card) => (
                    <button
                      key={card.name}
                      onClick={() => setSelectedDiscard(card)}
                      className={`px-2 py-1 text-xs rounded transition-all ${
                        selectedDiscard?.name === card.name
                          ? 'bg-green-600 ring-2 ring-green-400'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {card.name}
                    </button>
                  ))}
                </div>
                {selectedDiscard && (
                  <button
                    onClick={confirmRemoveDiscard}
                    className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
                  >
                    Remove {selectedDiscard.name}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};