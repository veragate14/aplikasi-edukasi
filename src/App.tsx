/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GradeId, SubjectId, UserProgressState } from './types';
import {
  loadUserProgress,
  saveUserProgress,
  DEFAULT_USER_PROGRESS,
} from './utils/storage';
import { soundEngine } from './utils/sound';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { GradeSelector } from './components/GradeSelector';
import { AdventureMapView } from './components/AdventureMapView';
import { SubjectCardGrid } from './components/SubjectCardGrid';
import { StudyMaterialView } from './components/StudyMaterialView';
import { QuizPlayerView } from './components/QuizPlayerView';
import { QuizResultCelebration } from './components/QuizResultCelebration';
import { AchievementsReportView } from './components/AchievementsReportView';
import { Home, Compass, BookOpen, Award, Layers } from 'lucide-react';

type ActiveView =
  | 'home'
  | 'grades'
  | 'map'
  | 'subjects'
  | 'study'
  | 'quiz'
  | 'quiz_result'
  | 'achievements';

export default function App() {
  const [userProgress, setUserProgress] = useState<UserProgressState>(() => loadUserProgress());
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [activeSubject, setActiveSubject] = useState<SubjectId>('matematika');

  // Quiz result state
  const [quizResult, setQuizResult] = useState<{
    score: number;
    correctCount: number;
    totalQuestions: number;
    xpGained: number;
    starsEarned: number;
    newBadges: string[];
  }>({
    score: 0,
    correctCount: 0,
    totalQuestions: 0,
    xpGained: 0,
    starsEarned: 0,
    newBadges: [],
  });

  // Sync sound settings with soundEngine
  useEffect(() => {
    soundEngine.enabled = userProgress.soundEnabled;
    soundEngine.voiceEnabled = userProgress.voiceEnabled;
  }, [userProgress.soundEnabled, userProgress.voiceEnabled]);

  // Persist state updates to localStorage
  const updateProgress = (updater: (prev: UserProgressState) => UserProgressState) => {
    setUserProgress((prev) => {
      const next = updater(prev);
      saveUserProgress(next);
      return next;
    });
  };

  const handleToggleSound = () => {
    updateProgress((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  const handleToggleVoice = () => {
    updateProgress((prev) => ({
      ...prev,
      voiceEnabled: !prev.voiceEnabled,
    }));
  };

  const handleSelectGrade = (grade: GradeId) => {
    updateProgress((prev) => ({
      ...prev,
      selectedGrade: grade,
    }));
  };

  const handleSelectSubjectMaterial = (subjId: SubjectId) => {
    setActiveSubject(subjId);
    setCurrentView('study');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubjectQuiz = (subjId: SubjectId) => {
    setActiveSubject(subjId);
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishQuiz = (score: number, correctCount: number, totalQuestions: number) => {
    // Calculate rewards
    const gainedXp = correctCount * 25 + (score >= 80 ? 30 : 10);
    let earnedStars = 1;
    if (score >= 90) earnedStars = 3;
    else if (score >= 60) earnedStars = 2;

    const quizKey = `${userProgress.selectedGrade}-${activeSubject}`;
    const previousScore = userProgress.completedQuizzes[quizKey]?.score || 0;
    const previousStars = userProgress.completedQuizzes[quizKey]?.starsEarned || 0;

    // Badges check
    const newlyUnlockedBadges: string[] = [];
    const checkBadge = (badgeId: string, condition: boolean) => {
      if (condition && !userProgress.unlockedBadges.includes(badgeId)) {
        newlyUnlockedBadges.push(badgeId);
      }
    };

    checkBadge('badge-first-step', true);
    checkBadge('badge-math-wizard', activeSubject === 'matematika');
    checkBadge('badge-young-scientist', activeSubject === 'ipa');
    checkBadge('badge-book-worm', activeSubject === 'bahasa-indonesia');
    checkBadge('badge-nusantara-hero', activeSubject === 'ppkn' || activeSubject === 'ips');
    checkBadge('badge-global-explorer', activeSubject === 'bahasa-inggris');
    checkBadge('badge-perfect-score', score === 100);

    const updatedTotalStars = userProgress.totalStars + Math.max(0, earnedStars - previousStars);
    const updatedTotalXp = userProgress.totalXp + gainedXp;

    checkBadge('badge-star-collector', updatedTotalStars >= 6);
    checkBadge('badge-xp-sultan', updatedTotalXp >= 150);

    // Save progress
    updateProgress((prev) => ({
      ...prev,
      totalXp: updatedTotalXp,
      totalStars: updatedTotalStars,
      completedQuizzes: {
        ...prev.completedQuizzes,
        [quizKey]: {
          score: Math.max(previousScore, score),
          starsEarned: Math.max(previousStars, earnedStars),
          attempts: (prev.completedQuizzes[quizKey]?.attempts || 0) + 1,
          lastCompletedDate: new Date().toISOString(),
        },
      },
      unlockedBadges: Array.from(new Set([...prev.unlockedBadges, ...newlyUnlockedBadges])),
    }));

    setQuizResult({
      score,
      correctCount,
      totalQuestions,
      xpGained: gainedXp,
      starsEarned: earnedStars,
      newBadges: newlyUnlockedBadges,
    });

    setCurrentView('quiz_result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlockPrize = (prizeId: string, cost: number) => {
    updateProgress((prev) => ({
      ...prev,
      totalStars: prev.totalStars - cost,
      unlockedPrizes: Array.from(new Set([...prev.unlockedPrizes, prizeId])),
    }));
  };

  const handleUpdatePlayerName = (name: string) => {
    updateProgress((prev) => ({
      ...prev,
      playerName: name,
    }));
  };

  const handleResetProgress = () => {
    setUserProgress(DEFAULT_USER_PROGRESS);
    saveUserProgress(DEFAULT_USER_PROGRESS);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        currentTab={
          currentView === 'home'
            ? 'home'
            : currentView === 'grades'
            ? 'grades'
            : currentView === 'map'
            ? 'map'
            : currentView === 'achievements'
            ? 'achievements'
            : 'subjects'
        }
        onSelectTab={(tab) => {
          setCurrentView(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userProgress={userProgress}
        onToggleSound={handleToggleSound}
        onToggleVoice={handleToggleVoice}
      />

      {/* Main Screen Router */}
      <main className="flex-1 pb-20 md:pb-12">
        {currentView === 'home' && (
          <HomeScreen
            userProgress={userProgress}
            onStartLearning={() => setCurrentView('subjects')}
            onOpenMap={() => setCurrentView('map')}
            onOpenGrades={() => setCurrentView('grades')}
            onOpenAchievements={() => setCurrentView('achievements')}
            onSelectGrade={(g) => {
              handleSelectGrade(g);
              setCurrentView('subjects');
            }}
            onSelectSubject={(s) => handleSelectSubjectMaterial(s)}
          />
        )}

        {currentView === 'grades' && (
          <GradeSelector
            currentGrade={userProgress.selectedGrade}
            onSelectGrade={handleSelectGrade}
            onContinue={() => setCurrentView('subjects')}
          />
        )}

        {currentView === 'map' && (
          <AdventureMapView
            currentGrade={userProgress.selectedGrade}
            userProgress={userProgress}
            onSelectSubject={(s) => handleSelectSubjectMaterial(s)}
          />
        )}

        {currentView === 'subjects' && (
          <SubjectCardGrid
            currentGrade={userProgress.selectedGrade}
            userProgress={userProgress}
            onSelectSubjectMaterial={handleSelectSubjectMaterial}
            onSelectSubjectQuiz={handleSelectSubjectQuiz}
            onChangeGrade={() => setCurrentView('grades')}
          />
        )}

        {currentView === 'study' && (
          <StudyMaterialView
            gradeId={userProgress.selectedGrade}
            subjectId={activeSubject}
            onBack={() => setCurrentView('subjects')}
            onStartQuiz={() => setCurrentView('quiz')}
          />
        )}

        {currentView === 'quiz' && (
          <QuizPlayerView
            gradeId={userProgress.selectedGrade}
            subjectId={activeSubject}
            onFinishQuiz={handleFinishQuiz}
            onQuitQuiz={() => setCurrentView('subjects')}
          />
        )}

        {currentView === 'quiz_result' && (
          <QuizResultCelebration
            gradeId={userProgress.selectedGrade}
            subjectId={activeSubject}
            score={quizResult.score}
            correctCount={quizResult.correctCount}
            totalQuestions={quizResult.totalQuestions}
            xpGained={quizResult.xpGained}
            starsEarned={quizResult.starsEarned}
            newBadgesUnlocked={quizResult.newBadges}
            onRetryQuiz={() => setCurrentView('quiz')}
            onGoToSubjects={() => setCurrentView('subjects')}
            onGoToMap={() => setCurrentView('map')}
            onGoToAchievements={() => setCurrentView('achievements')}
          />
        )}

        {currentView === 'achievements' && (
          <AchievementsReportView
            userProgress={userProgress}
            onUpdatePlayerName={handleUpdatePlayerName}
            onUnlockPrize={handleUnlockPrize}
            onResetProgress={handleResetProgress}
            onStartLearning={() => setCurrentView('subjects')}
          />
        )}
      </main>

      {/* Mobile Bottom Thumb Bar for Touch Screens (Phones & Tablets) */}
      <nav
        aria-label="Navigasi Bawah"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-amber-200 px-3 py-2 z-40 flex items-center justify-around shadow-lg"
      >
        <button
          onClick={() => {
            soundEngine.playClick();
            setCurrentView('home');
          }}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-bold p-1 rounded-xl cursor-pointer ${
            currentView === 'home' ? 'text-amber-600 font-black' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Beranda</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setCurrentView('grades');
          }}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-bold p-1 rounded-xl cursor-pointer ${
            currentView === 'grades' ? 'text-amber-600 font-black' : 'text-slate-500'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Kelas</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setCurrentView('map');
          }}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-bold p-1 rounded-xl cursor-pointer ${
            currentView === 'map' ? 'text-amber-600 font-black' : 'text-slate-500'
          }`}
        >
          <Compass className="w-5 h-5 text-emerald-600" />
          <span>Peta</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setCurrentView('subjects');
          }}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-bold p-1 rounded-xl cursor-pointer ${
            currentView === 'subjects' || currentView === 'study' || currentView === 'quiz'
              ? 'text-amber-600 font-black'
              : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-5 h-5 text-sky-600" />
          <span>Pelajaran</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setCurrentView('achievements');
          }}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-bold p-1 rounded-xl cursor-pointer ${
            currentView === 'achievements' ? 'text-amber-600 font-black' : 'text-slate-500'
          }`}
        >
          <Award className="w-5 h-5 text-purple-600" />
          <span>Rapor</span>
        </button>
      </nav>
    </div>
  );
}
