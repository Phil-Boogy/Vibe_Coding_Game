import { ANSWER_WORDS } from './words';

const EPOCH = new Date('2024-01-01'); // Starting date for daily words

export function getDailyWord(): string {
  const now = new Date();
  const daysSinceEpoch = Math.floor(
    (now.getTime() - EPOCH.getTime()) / (1000 * 60 * 60 * 24)
  );
  const wordIndex = daysSinceEpoch % ANSWER_WORDS.length;
  return ANSWER_WORDS[wordIndex].toUpperCase();
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getNextMidnight(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

export function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = getNextMidnight();
  const diff = midnight.getTime() - now.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
