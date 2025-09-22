import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { InfectionCard } from '../types/cards';

export const SpecialEffects: React.FC = () => {
  const {
    specialEffects,
    infectionDiscard,
    reorderForecastCards,
    removeFromInfectionDiscard,
  } = useGameStore();

  const [forecastOrder, setForecastOrder] = useState<InfectionCard[]>([]);
  const [selectedDiscard, setSelectedDiscard] = useState<InfectionCard | null>(null);

  React.useEffect(() => {
    if (specialEffects.forecastPending) {
      setForecastOrder(specialEffects.forecastPending);
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
  };

  const confirmRemoveDiscard = () => {
    if (selectedDiscard) {
      removeFromInfectionDiscard(selectedDiscard);
      setSelectedDiscard(null);
    }
  };

  if (!specialEffects.forecastPending && infectionDiscard.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-bold mb-4 text-pandemic-purple">Special Effects Active</h3>
      

      {/* Forecast */}
      {specialEffects.forecastPending && forecastOrder.length > 0 && (
        <div className="p-3 bg-purple-900/30 rounded-lg mb-3">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🔮</span>
            <p className="font-semibold">Forecast - Rearrange Top 6 Infection Cards</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
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
                className={`px-3 py-2 bg-${card.color === 'red' ? 'red' : card.color === 'blue' ? 'blue' : card.color === 'yellow' ? 'yellow' : 'gray'}-600 rounded cursor-move text-sm`}
              >
                {index + 1}. {card.name}
              </div>
            ))}
          </div>
          <button
            onClick={confirmForecastOrder}
            className="px-4 py-2 bg-pandemic-purple hover:bg-purple-600 rounded-lg transition-colors text-sm"
          >
            Confirm Order
          </button>
        </div>
      )}

      {/* Resilient Population */}
      {infectionDiscard.length > 0 && (
        <div className="p-3 bg-green-900/30 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🛡️</span>
            <p className="font-semibold">Resilient Population - Remove from Infection Discard</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3 max-h-32 overflow-y-auto">
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
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
            >
              Remove {selectedDiscard.name}
            </button>
          )}
        </div>
      )}
    </div>
  );
};