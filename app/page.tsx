'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Grid from '@/components/Grid';
import Keyboard from '@/components/Keyboard';
import HelpModal from '@/components/HelpModal';
import StatsModal from '@/components/StatsModal';
import SettingsModal from '@/components/SettingsModal';
import { useGameState } from '@/hooks/useGameState';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Settings, Stats } from '@/types/game';
import { getKeyboardState } from '@/lib/gameLogic';
import { loadStats, saveStats, updateStats, resetStats } from '@/lib/stats';

export default function Home() {
  const [settings, setSettings] = useLocalStorage<Settings>('wordle-settings', {
    darkMode: false,
    hardMode: false,
    highContrast: false,
    dailyChallenge: false,
  });

  const [stats, setStats] = useState<Stats>(() => loadStats());
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const gameState = useGameState(settings);
  const keyboardState = getKeyboardState(gameState.guesses, gameState.solution);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showHelp || showStats || showSettings) return;

      if (e.key === 'Enter') {
        gameState.handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        gameState.handleKeyPress('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        gameState.handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, showHelp, showStats, showSettings]);

  useEffect(() => {
    if (gameState.gameStatus !== 'playing') {
      const newStats = updateStats(
        stats,
        gameState.gameStatus === 'won',
        gameState.guesses.length
      );
      setStats(newStats);
      saveStats(newStats);

      setTimeout(() => {
        setShowStats(true);
      }, 2000);
    }
  }, [gameState.gameStatus]);

  const handleResetStats = () => {
    const newStats = resetStats();
    setStats(newStats);
  };

  const handleNewGame = () => {
    gameState.startNewGame();
    setShowStats(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#121213]">
      <Header
        onHelpClick={() => setShowHelp(true)}
        onStatsClick={() => setShowStats(true)}
        onSettingsClick={() => setShowSettings(true)}
      />

      <main className="flex-1 flex flex-col items-center justify-between py-4">
        <div className="flex-1 flex items-center">
          <Grid
            guesses={gameState.guesses}
            currentGuess={gameState.currentGuess}
            solution={gameState.solution}
            currentRow={gameState.currentRow}
            shake={gameState.shake}
            highContrast={settings.highContrast}
          />
        </div>

        {gameState.error && (
          <div className="mb-4 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded font-semibold">
            {gameState.error}
          </div>
        )}

        {gameState.gameStatus === 'won' && !showStats && (
          <div className="mb-4 space-y-2 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              Great job!
            </div>
            <button
              onClick={handleNewGame}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition-colors"
            >
              New Game
            </button>
          </div>
        )}

        {gameState.gameStatus === 'lost' && !showStats && (
          <div className="mb-4 space-y-2 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              The word was: {gameState.solution}
            </div>
            <button
              onClick={handleNewGame}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition-colors"
            >
              New Game
            </button>
          </div>
        )}

        <Keyboard
          onKeyPress={gameState.handleKeyPress}
          keyboardState={keyboardState}
          disabled={gameState.gameStatus !== 'playing'}
          highContrast={settings.highContrast}
        />
      </main>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
        guesses={gameState.guesses}
        solution={gameState.solution}
        gameStatus={gameState.gameStatus}
        isDailyChallenge={settings.dailyChallenge}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
        onResetStats={handleResetStats}
      />
    </div>
  );
}
