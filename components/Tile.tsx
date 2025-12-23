'use client';

import { TileState } from '@/types/game';

interface TileProps {
  letter: string;
  state: TileState;
  position: number;
  highContrast?: boolean;
}

export default function Tile({ letter, state, position, highContrast = false }: TileProps) {
  const getBackgroundColor = () => {
    if (state === 'correct') {
      return highContrast ? 'bg-[#f5793a]' : 'bg-[#6aaa64]';
    }
    if (state === 'present') {
      return highContrast ? 'bg-[#85c0f9]' : 'bg-[#c9b458]';
    }
    if (state === 'absent') {
      return 'bg-[#787c7e] dark:bg-[#3a3a3c]';
    }
    return letter ? 'bg-white dark:bg-[#121213] border-[#787c7e]' : 'bg-white dark:bg-[#121213]';
  };

  const getBorderColor = () => {
    if (state !== 'empty' && state !== 'tbd' && letter) {
      return 'border-transparent';
    }
    if (letter) {
      return 'border-[#787c7e] dark:border-[#565758]';
    }
    return 'border-[#d3d6da] dark:border-[#3a3a3c]';
  };

  const getTextColor = () => {
    if (state !== 'empty' && state !== 'tbd' && letter) {
      return 'text-white';
    }
    return 'text-black dark:text-white';
  };

  const getAnimation = () => {
    if (state !== 'empty' && state !== 'tbd' && letter) {
      return 'animate-flip';
    }
    if (letter && state === 'tbd') {
      return 'animate-pop';
    }
    return '';
  };

  return (
    <div
      className={`
        w-14 h-14 sm:w-16 sm:h-16 border-2 flex items-center justify-center
        font-bold text-3xl sm:text-4xl uppercase transition-colors
        ${getBackgroundColor()}
        ${getBorderColor()}
        ${getTextColor()}
        ${getAnimation()}
      `}
      style={{
        animationDelay: state !== 'empty' && state !== 'tbd' ? `${position * 0.1}s` : '0s',
      }}
    >
      {letter}
    </div>
  );
}
