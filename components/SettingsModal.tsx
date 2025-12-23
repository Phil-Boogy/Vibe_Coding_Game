'use client';

import Modal from './Modal';
import { Settings } from '@/types/game';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onResetStats: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onResetStats,
}: SettingsModalProps) {
  const toggleSetting = (key: keyof Settings) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  const handleResetStats = () => {
    if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
      onResetStats();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                Hard Mode
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Any revealed hints must be used in subsequent guesses
              </div>
            </div>
            <button
              onClick={() => toggleSetting('hardMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.hardMode ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.hardMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                Dark Mode
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Change the appearance
              </div>
            </div>
            <button
              onClick={() => toggleSetting('darkMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.darkMode ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                High Contrast Mode
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                For improved color vision
              </div>
            </div>
            <button
              onClick={() => toggleSetting('highContrast')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.highContrast ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                Daily Challenge
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Same word for everyone each day
              </div>
            </div>
            <button
              onClick={() => toggleSetting('dailyChallenge')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dailyChallenge ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dailyChallenge ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleResetStats}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-colors"
          >
            Reset Statistics
          </button>
        </div>
      </div>
    </Modal>
  );
}
