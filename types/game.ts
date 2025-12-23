export type TileState = 'empty' | 'tbd' | 'correct' | 'present' | 'absent';

export type GameStatus = 'playing' | 'won' | 'lost';

export type GameMode = 'daily' | 'freeplay';

export interface GameState {
  guesses: string[];
  currentGuess: string;
  gameStatus: GameStatus;
  solution: string;
  currentRow: number;
  shake: boolean;
  error: string | null;
  mode: GameMode;
}

export interface KeyboardKeyState {
  key: string;
  state: TileState;
}

export interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[]; // index 0 = 1 guess, index 1 = 2 guesses, etc.
}

export interface Settings {
  darkMode: boolean;
  hardMode: boolean;
  highContrast: boolean;
  dailyChallenge: boolean;
}

export interface DailyProgress {
  lastPlayedDate: string;
  lastDailySolution: string;
  hasPlayedToday: boolean;
}
