export type AngleMode = 'deg' | 'rad';

export type KeyType =
  | 'number'
  | 'operator'
  | 'function'
  | 'constant'
  | 'action'
  | 'equals';

export interface CalcKey {
  label: string;
  value: string;
  type: KeyType;
}

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}
