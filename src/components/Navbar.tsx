import React from 'react';
import { Volume2, VolumeX, Sparkles, Star, Award, Compass, BookOpen } from 'lucide-react';
import { soundEngine } from '../utils/sound';
import { UserProgressState } from '../types';

interface NavbarProps {
  currentTab: 'home' | 'grades' | 'map' | 'subjects' | 'achievements';
  onSelectTab: (tab: 'home' | 'grades' | 'map' | 'subjects' | 'achievements') => void;
  userProgress: UserProgressState;
  onToggleSound: () => void;
  onToggleVoice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  userProgress,
  onToggleSound,
  onToggleVoice,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, single line text element wordmark */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onSelectTab('home');
          }}
          className="text-2xl font-bold tracking-tight text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1.5 cursor-pointer font-display"
        >
          <span className="text-2xl">🎒</span>
          <span>EduQuest</span>
        </button>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectTab('home');
            }}
            className={`transition-colors hover:text-amber-600 py-1 ${
              currentTab === 'home' ? 'text-amber-600 border-b-2 border-amber-500' : ''
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectTab('grades');
            }}
            className={`transition-colors hover:text-amber-600 py-1 ${
              currentTab === 'grades' ? 'text-amber-600 border-b-2 border-amber-500' : ''
            }`}
          >
            Pilih Kelas
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectTab('map');
            }}
            className={`transition-colors hover:text-amber-600 py-1 flex items-center gap-1 ${
              currentTab === 'map' ? 'text-amber-600 border-b-2 border-amber-500' : ''
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Peta Petualangan</span>
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectTab('subjects');
            }}
            className={`transition-colors hover:text-amber-600 py-1 flex items-center gap-1 ${
              currentTab === 'subjects' ? 'text-amber-600 border-b-2 border-amber-500' : ''
            }`}
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Mata Pelajaran</span>
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectTab('achievements');
            }}
            className={`transition-colors hover:text-amber-600 py-1 flex items-center gap-1 ${
              currentTab === 'achievements' ? 'text-amber-600 border-b-2 border-amber-500' : ''
            }`}
          >
            <Award className="w-4 h-4 text-purple-600" />
            <span>Pencapaian & Rapor</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Quick Stats Capsule */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold">
            <span className="flex items-center gap-1 text-amber-700">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500 inline" />
              <span className="tabular-nums">{userProgress.totalStars}</span>
            </span>
            <span className="text-amber-300">|</span>
            <span className="flex items-center gap-1 text-purple-700">
              <Sparkles className="w-3.5 h-3.5 text-purple-500 inline" />
              <span className="tabular-nums">{userProgress.totalXp} XP</span>
            </span>
          </div>

          {/* Sound Effect Toggle */}
          <button
            onClick={onToggleSound}
            title={userProgress.soundEnabled ? 'Efek Suara Aktif' : 'Efek Suara Mati'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle Sound"
          >
            {userProgress.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
