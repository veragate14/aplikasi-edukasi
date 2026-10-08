import { GradeId, UserProgressState } from '../types';

const STORAGE_KEY = 'eduquest_save_data_v1';

export const DEFAULT_USER_PROGRESS: UserProgressState = {
  playerName: 'Sobat Pintar',
  selectedGrade: 1,
  totalXp: 30,
  totalStars: 2,
  completedQuizzes: {},
  unlockedBadges: [],
  unlockedPrizes: ['prize-compass'],
  soundEnabled: true,
  voiceEnabled: true,
};

export function loadUserProgress(): UserProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_USER_PROGRESS,
      ...parsed,
    };
  } catch {
    return DEFAULT_USER_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // LocalStorage quota or unavailable fallback
  }
}

export function calculateLevel(xp: number): {
  levelNumber: number;
  levelName: string;
  badgeEmoji: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  const levels = [
    { level: 1, name: 'Penjelajah Pemula', emoji: '🎒', min: 0, max: 60 },
    { level: 2, name: 'Bintang Cilik', emoji: '⭐', min: 60, max: 150 },
    { level: 3, name: 'Detektif Cerdas', emoji: '🔍', min: 150, max: 280 },
    { level: 4, name: 'Sahabat Pintar', emoji: '🌟', min: 280, max: 450 },
    { level: 5, name: 'Ksatria Pengetahuan', emoji: '🛡️', min: 450, max: 680 },
    { level: 6, name: 'Profesor Cilik', emoji: '🎓', min: 680, max: 950 },
    { level: 7, name: 'Juara Galaksi', emoji: '🚀', min: 950, max: 1500 },
  ];

  for (let i = 0; i < levels.length; i++) {
    const lvl = levels[i];
    if (xp < lvl.max || i === levels.length - 1) {
      const range = lvl.max - lvl.min;
      const progress = Math.min(100, Math.max(0, Math.round(((xp - lvl.min) / range) * 100)));
      return {
        levelNumber: lvl.level,
        levelName: lvl.name,
        badgeEmoji: lvl.emoji,
        currentLevelXp: xp,
        nextLevelXp: lvl.max,
        progressPercent: progress,
      };
    }
  }

  return {
    levelNumber: 7,
    levelName: 'Juara Galaksi',
    badgeEmoji: '🚀',
    currentLevelXp: xp,
    nextLevelXp: 1500,
    progressPercent: 100,
  };
}
