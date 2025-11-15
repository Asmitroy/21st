import { Letter } from '../types';

const parseAbsoluteLocal = (isoDate: string): Date => {
  const [y, m, d] = isoDate.split('-').map((v) => parseInt(v, 10));
  return new Date(y, m - 1, d);
};

export const generateUserIdentifier = (): string => {
  const stored = localStorage.getItem('user_identifier');
  if (stored) return stored;

  const newId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  localStorage.setItem('user_identifier', newId);
  return newId;
};

export const getFirstVisitDate = (): Date => {
  const stored = localStorage.getItem('first_visit_date');
  if (stored) return new Date(stored);

  const now = new Date();
  localStorage.setItem('first_visit_date', now.toISOString());
  return now;
};

export const isLetterUnlocked = (letter: Letter, firstVisitDate?: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (letter.unlock_type === 'absolute') {
    const unlockDate = parseAbsoluteLocal(letter.unlock_date);
    unlockDate.setHours(0, 0, 0, 0);
    return today >= unlockDate;
  }

  if (letter.unlock_type === 'relative') {
    const visitDate = firstVisitDate || getFirstVisitDate();
    const daysToUnlock = parseInt(letter.unlock_date, 10);
    const unlockDate = new Date(visitDate);
    unlockDate.setDate(unlockDate.getDate() + daysToUnlock + 2);
    unlockDate.setHours(0, 0, 0, 0);
    return today >= unlockDate;
  }

  return false;
};

export const getDaysUntilUnlock = (letter: Letter, firstVisitDate?: Date): number | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (letter.unlock_type === 'absolute') {
    const unlockDate = parseAbsoluteLocal(letter.unlock_date);
    unlockDate.setHours(0, 0, 0, 0);
    const diffTime = unlockDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  }

  if (letter.unlock_type === 'relative') {
    const visitDate = firstVisitDate || getFirstVisitDate();
    const daysToUnlock = parseInt(letter.unlock_date, 10);
    const unlockDate = new Date(visitDate);
    unlockDate.setDate(unlockDate.getDate() + daysToUnlock + 2);
    unlockDate.setHours(0, 0, 0, 0);
    const diffTime = unlockDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  }

  return null;
};

export const formatUnlockDate = (letter: Letter, firstVisitDate?: Date): string => {
  if (letter.unlock_type === 'absolute') {
    const date = parseAbsoluteLocal(letter.unlock_date);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  if (letter.unlock_type === 'relative') {
    const visitDate = firstVisitDate || getFirstVisitDate();
    const daysToUnlock = parseInt(letter.unlock_date, 10);
    const unlockDate = new Date(visitDate);
    unlockDate.setDate(unlockDate.getDate() + daysToUnlock + 2);
    return unlockDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  return '';
};
