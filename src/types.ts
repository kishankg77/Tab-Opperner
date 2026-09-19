export interface LaunchSettings {
  limit: number;
  autoOpenOnPaste: boolean;
  staggerDelayMs: number; // 0 for instant, or 100, 250, 500ms
  newWindowInsteadOfTab: boolean;
}

export interface LaunchResult {
  id: string;
  url: string;
  requestedCount: number;
  openedCount: number;
  blockedCount: number;
  timestamp: number;
  status: 'idle' | 'running' | 'completed' | 'blocked' | 'cancelled';
}

export interface HistoryEntry {
  id: string;
  url: string;
  tabLimit: number;
  timestamp: number;
}
