import { GameLog } from '../types/gameLog';

const STORAGE_KEY = 'symmetric-pandemic-logs';
const MAX_STORED_LOGS = 50; // Keep last 50 games

export class GameLogStorage {
  static saveCurrentLog(log: GameLog): void {
    const saved = this.getSavedLogs();
    
    // Remove existing log with same gameId if it exists
    const filtered = saved.filter(l => l.gameId !== log.gameId);
    
    // Add current log to beginning
    filtered.unshift(log);
    
    // Keep only the most recent logs
    const trimmed = filtered.slice(0, MAX_STORED_LOGS);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.warn('Failed to save game log to localStorage:', error);
      // If storage is full, remove older logs and try again
      const reduced = trimmed.slice(0, 10);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
      } catch (retryError) {
        console.error('Failed to save game log after cleanup:', retryError);
      }
    }
  }

  static getSavedLogs(): GameLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load game logs from localStorage:', error);
      return [];
    }
  }

  static getLogBySeed(seed: string): GameLog | null {
    const logs = this.getSavedLogs();
    return logs.find(log => log.seed === seed) || null;
  }

  static deleteLog(gameId: string): void {
    const logs = this.getSavedLogs();
    const filtered = logs.filter(log => log.gameId !== gameId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  static clearAllLogs(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  static exportLog(log: GameLog): string {
    const exportData = {
      ...log,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(exportData, null, 2);
  }

  static exportAllLogs(): string {
    const logs = this.getSavedLogs();
    const exportData = {
      logs,
      exportedAt: new Date().toISOString(),
      version: '1.0',
      totalGames: logs.length
    };
    return JSON.stringify(exportData, null, 2);
  }

  static getStorageStats(): { totalLogs: number; storageUsed: string } {
    const logs = this.getSavedLogs();
    const storageData = localStorage.getItem(STORAGE_KEY) || '';
    const sizeInKB = Math.round(storageData.length / 1024 * 100) / 100;
    
    return {
      totalLogs: logs.length,
      storageUsed: `${sizeInKB} KB`
    };
  }
}