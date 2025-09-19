import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { LogEntry } from "../types/gameLog";
import { PlayerCard, InfectionCard } from "../types/cards";

export const GameLog: React.FC = () => {
  const {
    currentLog,
    isLogVisible,
    toggleLogVisibility,
    exportCurrentLog,
    getSavedLogs,
  } = useGameStore();

  const [showSavedLogs, setShowSavedLogs] = useState(false);

  if (!currentLog) return null;

  const getCardIcon = (card?: PlayerCard | InfectionCard) => {
    if (!card) return "📝";
    if (card.type === "epidemic") return "☠️";
    if (card.type === "event") return "⚡";
    if (card.type === "city") {
      switch (card.color) {
        case "red":
          return "🔴";
        case "blue":
          return "🔵";
        case "yellow":
          return "🟡";
        case "black":
          return "⚫";
      }
    }
    return "📋";
  };

  const getActionText = (entry: LogEntry) => {
    switch (entry.action) {
      case "GAME_START":
        return "Game Started";
      case "DRAW_PLAYER":
        return `Drew: ${entry.card?.name}`;
      case "DRAW_INFECTION":
        return `Infected: ${entry.card?.name}`;
      case "EPIDEMIC":
        return `EPIDEMIC! ${entry.card?.name}`;
      case "EVENT_PLAYED":
        return `Event: ${entry.card?.name}`;
      case "GAME_END":
        return "Game Ended";
      default:
        return entry.action;
    }
  };

  const getEntryColor = (entry: LogEntry) => {
    switch (entry.action) {
      case "EPIDEMIC":
        return "bg-red-900/30 border-red-500";
      case "EVENT_PLAYED":
        return "bg-purple-900/30 border-purple-500";
      case "DRAW_INFECTION":
        return "bg-yellow-900/30 border-yellow-500";
      case "DRAW_PLAYER":
        return "bg-blue-900/30 border-blue-500";
      case "GAME_START":
      case "GAME_END":
        return "bg-green-900/30 border-green-500";
      default:
        return "bg-gray-900/30 border-gray-500";
    }
  };

  const handleExport = () => {
    const logData = exportCurrentLog();
    if (logData) {
      const blob = new Blob([logData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pandemic-log-${currentLog.seed}-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const savedLogs = getSavedLogs();

  return (
    <div
      className={`fixed right-0 top-16 bottom-16 bg-gray-800 shadow-2xl transition-all duration-300 z-50 rounded-l-lg ${
        isLogVisible ? "w-80" : "w-0"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleLogVisibility}
        className="absolute left-0 top-4 -translate-x-full bg-gray-700 hover:bg-gray-600 rounded-l-lg p-2 transition-colors"
      >
        {isLogVisible ? "📋" : "📖"}
      </button>

      {isLogVisible && (
        <div className="h-full flex flex-col p-4">
          {/* Header */}
          <div className="border-b border-gray-700 pb-4 mb-4">
            <h3 className="text-lg font-bold text-center">Game Log</h3>
            <p className="text-sm text-gray-400 text-center">
              Seed: {currentLog.seed}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleExport}
                className="flex-1 text-xs py-1 px-2 bg-pandemic-blue hover:bg-blue-600 rounded transition-colors"
              >
                Export
              </button>
              <button
                onClick={() => setShowSavedLogs(!showSavedLogs)}
                className="flex-1 text-xs py-1 px-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >
                History ({savedLogs.length})
              </button>
            </div>
          </div>

          {/* Saved Logs Panel */}
          {showSavedLogs && (
            <div className="border border-gray-700 rounded-lg p-3 mb-4 max-h-40 overflow-y-auto">
              <h4 className="text-sm font-semibold mb-2">Previous Games</h4>
              {savedLogs.length === 0 ? (
                <p className="text-xs text-gray-500">No saved games yet</p>
              ) : (
                <div className="space-y-1">
                  {savedLogs.slice(0, 10).map((log) => (
                    <div
                      key={log.gameId}
                      className="text-xs p-2 bg-gray-900 rounded"
                    >
                      <div className="font-mono">{log.seed}</div>
                      <div className="text-gray-400">
                        {log.playerCount}P, {log.epidemicCount}E
                        {log.result && ` - ${log.result}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Current Game Log */}
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-semibold mb-2">Current Game</h4>
            <div className="h-full overflow-y-auto space-y-2">
              {currentLog.entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-2 rounded border-l-2 ${getEntryColor(entry)}`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{getCardIcon(entry.card)}</span>
                    <div className="flex-1">
                      <div className="font-medium">{getActionText(entry)}</div>
                      <div className="text-xs text-gray-400">
                        Turn {entry.turn} • {formatTime(entry.timestamp)}
                      </div>
                      {entry.metadata && (
                        <div className="text-xs text-gray-500 mt-1">
                          P:{entry.metadata.playerDeckCount} I:
                          {entry.metadata.infectionDeckCount} D:
                          {entry.metadata.infectionDiscardCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-700 pt-2 mt-2 text-xs text-gray-400">
            <div>Total Entries: {currentLog.entries.length}</div>
            <div>
              Game Duration:{" "}
              {Math.round((Date.now() - currentLog.startTime) / 60000)}m
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
