'use client';

import { TileState } from '@/types/game';
import { KEYS_ROW_1, KEYS_ROW_2, KEYS_ROW_3 } from '@/lib/constants';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardState: Map<string, TileState>;
  disabled?: boolean;
  highContrast?: boolean;
}

export default function Keyboard({
  onKeyPress,
  keyboardState,
  disabled = false,
  highContrast = false,
}: KeyboardProps) {
  const getKeyColor = (key: string) => {
    const state = keyboardState.get(key);
    if (state === 'correct') {
      return highContrast
        ? 'bg-[#f5793a] text-white'
        : 'bg-[#6aaa64] text-white';
    }
    if (state === 'present') {
      return highContrast
        ? 'bg-[#85c0f9] text-white'
        : 'bg-[#c9b458] text-white';
    }
    if (state === 'absent') {
      return 'bg-[#787c7e] text-white dark:bg-[#3a3a3c]';
    }
    return 'bg-[#d3d6da] text-black dark:bg-[#818384] dark:text-white';
  };

  const renderKey = (key: string) => {
    const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
    const keyContent = key === 'BACKSPACE' ? '←' : key;

    return (
      <button
        key={key}
        onClick={() => !disabled && onKeyPress(key)}
        disabled={disabled}
        className={`
          ${isSpecial ? 'px-3 sm:px-4 text-xs sm:text-sm' : 'text-sm sm:text-base'}
          ${!isSpecial && 'w-8 sm:w-10'}
          h-12 sm:h-14 rounded font-bold uppercase
          ${getKeyColor(key)}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 active:scale-95'}
          transition-all flex items-center justify-center
        `}
      >
        {keyContent}
      </button>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto px-2 pb-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-center gap-1.5">
          {KEYS_ROW_1.map(renderKey)}
        </div>
        <div className="flex justify-center gap-1.5 px-4">
          {KEYS_ROW_2.map(renderKey)}
        </div>
        <div className="flex justify-center gap-1.5">
          {KEYS_ROW_3.map(renderKey)}
        </div>
      </div>
    </div>
  );
}
