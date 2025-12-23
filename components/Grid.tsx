'use client';

import Tile from './Tile';
import { checkGuess } from '@/lib/gameLogic';
import { TileState } from '@/types/game';
import { MAX_GUESSES, WORD_LENGTH } from '@/lib/constants';

interface GridProps {
  guesses: string[];
  currentGuess: string;
  solution: string;
  currentRow: number;
  shake: boolean;
  highContrast?: boolean;
}

export default function Grid({
  guesses,
  currentGuess,
  solution,
  currentRow,
  shake,
  highContrast = false,
}: GridProps) {
  const rows = [];

  for (let i = 0; i < MAX_GUESSES; i++) {
    if (i < guesses.length) {
      // Previous guess - show with colors
      const guess = guesses[i];
      const states = checkGuess(guess, solution);
      rows.push(
        <div key={i} className="flex gap-1.5">
          {guess.split('').map((letter, j) => (
            <Tile
              key={j}
              letter={letter}
              state={states[j]}
              position={j}
              highContrast={highContrast}
            />
          ))}
        </div>
      );
    } else if (i === currentRow && currentGuess) {
      // Current guess being typed
      const letters = currentGuess.split('');
      const row = [];
      for (let j = 0; j < WORD_LENGTH; j++) {
        row.push(
          <Tile
            key={j}
            letter={letters[j] || ''}
            state="tbd"
            position={j}
            highContrast={highContrast}
          />
        );
      }
      rows.push(
        <div
          key={i}
          className={`flex gap-1.5 ${shake ? 'animate-shake' : ''}`}
        >
          {row}
        </div>
      );
    } else {
      // Empty row
      const row = [];
      for (let j = 0; j < WORD_LENGTH; j++) {
        row.push(
          <Tile
            key={j}
            letter=""
            state="empty"
            position={j}
            highContrast={highContrast}
          />
        );
      }
      rows.push(
        <div key={i} className="flex gap-1.5">
          {row}
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col gap-1.5 p-4">
      {rows}
    </div>
  );
}
