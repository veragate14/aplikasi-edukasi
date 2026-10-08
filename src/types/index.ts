export type GradeId = 1 | 2 | 3 | 4 | 5 | 6;

export type SubjectId =
  | 'matematika'
  | 'bahasa-indonesia'
  | 'ipa'
  | 'ips'
  | 'ppkn'
  | 'bahasa-inggris'
  | 'pengetahuan-umum';

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'visual_guess'
  | 'matching'
  | 'ordering';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  illustrationEmoji?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  // For matching type
  matchingPairs?: { left: string; right: string }[];
  // For ordering type
  itemsToOrder?: string[];
  correctOrder?: string[];
}

export interface MaterialSection {
  title: string;
  icon: string;
  description: string;
  keyPoints: string[];
  funFact: string;
}

export interface SubjectModule {
  id: SubjectId;
  name: string;
  shortName: string;
  icon: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    btn: string;
  };
  zoneId: string;
  zoneName: string;
  zoneEmoji: string;
  description: string;
  materials: MaterialSection[];
  questions: Question[];
}

export interface GradeCurriculum {
  grade: GradeId;
  title: string;
  subTitle: string;
  themeTag: string;
  mascotBadge: string;
  recommendedAge: string;
  subjects: Record<SubjectId, SubjectModule>;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredXp?: number;
  requiredStars?: number;
  category: 'quiz' | 'xp' | 'exploration' | 'perfection';
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface VirtualPrize {
  id: string;
  name: string;
  emoji: string;
  description: string;
  costStars: number;
  unlocked: boolean;
}

export interface UserProgressState {
  playerName: string;
  selectedGrade: GradeId;
  totalXp: number;
  totalStars: number;
  completedQuizzes: Record<string, {
    score: number;
    starsEarned: number;
    attempts: number;
    lastCompletedDate: string;
  }>;
  unlockedBadges: string[];
  unlockedPrizes: string[];
  soundEnabled: boolean;
  voiceEnabled: boolean;
}
