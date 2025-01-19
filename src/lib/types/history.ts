export interface HistoryItem {
  title: string;
  path: string;
  timestamp: string;
}

export type HistoryType = Record<string, HistoryItem>;
