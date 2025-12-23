import { Stats } from '@/types/game';

const STATS_KEY = 'wordle-stats';

export function loadStats(): Stats {
  if (typeof window === 'undefined') {
    return getDefaultStats();
  }

  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) {
      return getDefaultStats();
    }
    return JSON.parse(stored);
  } catch {
    return getDefaultStats();
  }
}

export function saveStats(stats: Stats): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
}

export function updateStats(
  stats: Stats,
  won: boolean,
  guessCount: number
): Stats {
  const newStats: Stats = {
    gamesPlayed: stats.gamesPlayed + 1,
    gamesWon: won ? stats.gamesWon + 1 : stats.gamesWon,
    currentStreak: won ? stats.currentStreak + 1 : 0,
    maxStreak: won
      ? Math.max(stats.currentStreak + 1, stats.maxStreak)
      : stats.maxStreak,
    guessDistribution: [...stats.guessDistribution],
  };

  if (won && guessCount > 0 && guessCount <= 6) {
    newStats.guessDistribution[guessCount - 1]++;
  }

  return newStats;
}

export function calculateWinPercentage(stats: Stats): number {
  if (stats.gamesPlayed === 0) return 0;
  return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
}

export function resetStats(): Stats {
  const defaultStats = getDefaultStats();
  saveStats(defaultStats);
  return defaultStats;
}

function getDefaultStats(): Stats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
  };
}

export function generateShareText(
  guesses: string[],
  solution: string,
  won: boolean,
  dayNumber?: number
): string {
  const title = dayNumber
    ? `Wordle ${dayNumber} ${won ? guesses.length : 'X'}/6`
    : `Wordle ${won ? guesses.length : 'X'}/6`;

  const grid = guesses
    .map(guess => {
      return guess
        .split('')
        .map((letter, index) => {
          const solutionLetter = solution[index];
          if (letter === solutionLetter) {
            return '🟩';
          } else if (solution.includes(letter)) {
            return '🟨';
          } else {
            return '⬛';
          }
        })
        .join('');
    })
    .join('\n');

  return `${title}\n\n${grid}`;
}
