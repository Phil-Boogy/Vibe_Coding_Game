import { useState, useCallback, useEffect } from 'react';
import { GameStatus, Settings, DailyProgress } from '@/types/game';
import { isValidWord, getRandomWord } from '@/lib/words';
import { isGameWon, isGameLost, validateHardMode } from '@/lib/gameLogic';
import { getDailyWord, isSameDay } from '@/lib/dailyWord';
import { useLocalStorage } from './useLocalStorage';

export function useGameState(settings: Settings) {
  const [dailyProgress, setDailyProgress] = useLocalStorage<DailyProgress>(
    'daily-progress',
    {
      lastPlayedDate: '',
      lastDailySolution: '',
      hasPlayedToday: false,
    }
  );

  const initializeGame = useCallback(() => {
    if (settings.dailyChallenge) {
      const dailyWord = getDailyWord();
      const today = new Date().toDateString();

      if (
        dailyProgress.hasPlayedToday &&
        dailyProgress.lastPlayedDate === today
      ) {
        return {
          solution: dailyProgress.lastDailySolution,
          hasPlayedToday: true,
        };
      }

      return { solution: dailyWord, hasPlayedToday: false };
    }
    return { solution: getRandomWord(), hasPlayedToday: false };
  }, [settings.dailyChallenge, dailyProgress]);

  const [solution, setSolution] = useState(initializeGame().solution);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [shake, setShake] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    setShake(true);
    setTimeout(() => {
      setShake(false);
      setError(null);
    }, 500);
  };

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameStatus !== 'playing') return;

      if (key === 'ENTER') {
        if (currentGuess.length !== 5) {
          showError('Not enough letters');
          return;
        }

        if (!isValidWord(currentGuess)) {
          showError('Not in word list');
          return;
        }

        if (settings.hardMode) {
          const validation = validateHardMode(currentGuess, guesses, solution);
          if (!validation.valid) {
            showError(validation.error || 'Invalid guess');
            return;
          }
        }

        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess('');

        if (isGameWon(newGuesses, solution)) {
          setGameStatus('won');
          if (settings.dailyChallenge) {
            setDailyProgress({
              lastPlayedDate: new Date().toDateString(),
              lastDailySolution: solution,
              hasPlayedToday: true,
            });
          }
        } else if (isGameLost(newGuesses)) {
          setGameStatus('lost');
          if (settings.dailyChallenge) {
            setDailyProgress({
              lastPlayedDate: new Date().toDateString(),
              lastDailySolution: solution,
              hasPlayedToday: true,
            });
          }
        }
      } else if (key === 'BACKSPACE') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [
      currentGuess,
      gameStatus,
      guesses,
      solution,
      settings.hardMode,
      settings.dailyChallenge,
      setDailyProgress,
    ]
  );

  const startNewGame = useCallback(() => {
    if (settings.dailyChallenge) {
      const today = new Date().toDateString();
      if (
        dailyProgress.hasPlayedToday &&
        dailyProgress.lastPlayedDate === today
      ) {
        return;
      }
      setSolution(getDailyWord());
    } else {
      setSolution(getRandomWord());
    }
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setError(null);
  }, [settings.dailyChallenge, dailyProgress]);

  const resetGame = useCallback(() => {
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setError(null);
    setSolution(settings.dailyChallenge ? getDailyWord() : getRandomWord());
  }, [settings.dailyChallenge]);

  useEffect(() => {
    startNewGame();
  }, [settings.dailyChallenge]);

  return {
    solution,
    guesses,
    currentGuess,
    gameStatus,
    shake,
    error,
    currentRow: guesses.length,
    handleKeyPress,
    startNewGame,
    resetGame,
  };
}
