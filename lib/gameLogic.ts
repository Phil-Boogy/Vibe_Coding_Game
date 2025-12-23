import { TileState } from '@/types/game';

export function checkGuess(guess: string, solution: string): TileState[] {
  const guessArray = guess.toUpperCase().split('');
  const solutionArray = solution.toUpperCase().split('');
  const result: TileState[] = new Array(5).fill('absent');
  const solutionLetterCount: Record<string, number> = {};

  // Count letters in solution
  solutionArray.forEach(letter => {
    solutionLetterCount[letter] = (solutionLetterCount[letter] || 0) + 1;
  });

  // First pass: mark correct letters (green)
  guessArray.forEach((letter, i) => {
    if (letter === solutionArray[i]) {
      result[i] = 'correct';
      solutionLetterCount[letter]--;
    }
  });

  // Second pass: mark present letters (yellow)
  guessArray.forEach((letter, i) => {
    if (result[i] === 'absent' && solutionLetterCount[letter] > 0) {
      result[i] = 'present';
      solutionLetterCount[letter]--;
    }
  });

  return result;
}

export function getKeyboardState(
  guesses: string[],
  solution: string
): Map<string, TileState> {
  const keyboardState = new Map<string, TileState>();

  guesses.forEach(guess => {
    const guessResult = checkGuess(guess, solution);
    guess.split('').forEach((letter, index) => {
      const letterUpper = letter.toUpperCase();
      const currentState = keyboardState.get(letterUpper);
      const newState = guessResult[index];

      // Priority: correct > present > absent
      if (!currentState ||
          (newState === 'correct') ||
          (newState === 'present' && currentState !== 'correct')) {
        keyboardState.set(letterUpper, newState);
      }
    });
  });

  return keyboardState;
}

export function isGameWon(guesses: string[], solution: string): boolean {
  return guesses.some(guess => guess.toUpperCase() === solution.toUpperCase());
}

export function isGameLost(guesses: string[]): boolean {
  return guesses.length >= 6;
}

export function validateHardMode(
  guess: string,
  guesses: string[],
  solution: string
): { valid: boolean; error?: string } {
  if (guesses.length === 0) {
    return { valid: true };
  }

  const guessUpper = guess.toUpperCase();
  const revealedLetters = new Map<string, Set<number>>();
  const mustIncludeLetters = new Set<string>();

  // Analyze all previous guesses
  guesses.forEach(prevGuess => {
    const result = checkGuess(prevGuess, solution);
    prevGuess.split('').forEach((letter, index) => {
      const letterUpper = letter.toUpperCase();

      if (result[index] === 'correct') {
        // Must have this letter in this exact position
        if (!revealedLetters.has(letterUpper)) {
          revealedLetters.set(letterUpper, new Set());
        }
        revealedLetters.get(letterUpper)!.add(index);
      } else if (result[index] === 'present') {
        // Must include this letter somewhere
        mustIncludeLetters.add(letterUpper);
      }
    });
  });

  // Check if guess satisfies hard mode constraints
  for (const [letter, positions] of revealedLetters) {
    for (const position of positions) {
      if (guessUpper[position] !== letter) {
        return {
          valid: false,
          error: `Must use ${letter} in position ${position + 1}`,
        };
      }
    }
  }

  for (const letter of mustIncludeLetters) {
    if (!guessUpper.includes(letter)) {
      return {
        valid: false,
        error: `Guess must contain ${letter}`,
      };
    }
  }

  return { valid: true };
}
