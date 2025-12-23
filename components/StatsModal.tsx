'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { Stats, GameStatus } from '@/types/game';
import { calculateWinPercentage, generateShareText } from '@/lib/stats';
import { getTimeUntilMidnight } from '@/lib/dailyWord';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: Stats;
  guesses: string[];
  solution: string;
  gameStatus: GameStatus;
  isDailyChallenge: boolean;
}

export default function StatsModal({
  isOpen,
  onClose,
  stats,
  guesses,
  solution,
  gameStatus,
  isDailyChallenge,
}: StatsModalProps) {
  const [copied, setCopied] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState('');

  useEffect(() => {
    if (isDailyChallenge && isOpen) {
      const updateTimer = () => {
        setTimeUntilNext(getTimeUntilMidnight());
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [isDailyChallenge, isOpen]);

  const handleShare = () => {
    const shareText = generateShareText(
      guesses,
      solution,
      gameStatus === 'won',
      isDailyChallenge ? undefined : undefined
    );
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const winPercentage = calculateWinPercentage(stats);
  const maxGuessCount = Math.max(...stats.guessDistribution, 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Statistics">
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.gamesPlayed}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Played
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {winPercentage}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Win %
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.currentStreak}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Current Streak
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.maxStreak}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Max Streak
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">
            Guess Distribution
          </h3>
          <div className="space-y-1">
            {stats.guessDistribution.map((count, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 text-sm text-gray-700 dark:text-gray-300">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div
                    className="bg-gray-400 dark:bg-gray-600 text-white text-xs font-bold px-2 py-1 text-right min-w-[2rem]"
                    style={{
                      width: count > 0 ? `${(count / maxGuessCount) * 100}%` : '7%',
                    }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {gameStatus !== 'playing' && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={handleShare}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition-colors"
            >
              {copied ? 'Copied!' : 'Share Results'}
            </button>
          </div>
        )}

        {isDailyChallenge && gameStatus !== 'playing' && (
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <div>Next puzzle in</div>
            <div className="font-bold text-lg text-gray-900 dark:text-white">
              {timeUntilNext}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
