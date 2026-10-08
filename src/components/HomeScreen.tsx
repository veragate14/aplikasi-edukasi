import React from 'react';
import { GradeId, SubjectId, UserProgressState } from '../types';
import { CURRICULUM_DATA, ADVENTURE_ZONES } from '../data/curriculum';
import { calculateLevel } from '../utils/storage';
import { MascotKiko } from './MascotKiko';
import { soundEngine } from '../utils/sound';
import {
  Sparkles,
  Star,
  Play,
  Compass,
  Award,
  BookOpen,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';

// Using generated high-fidelity asset
import mapBannerImg from '../assets/images/adventure_map_world_1791464341637.jpg';

interface HomeScreenProps {
  userProgress: UserProgressState;
  onStartLearning: () => void;
  onOpenMap: () => void;
  onOpenGrades: () => void;
  onOpenAchievements: () => void;
  onSelectGrade: (grade: GradeId) => void;
  onSelectSubject: (subjectId: SubjectId) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProgress,
  onStartLearning,
  onOpenMap,
  onOpenGrades,
  onOpenAchievements,
  onSelectGrade,
  onSelectSubject,
}) => {
  const currentGradeData = CURRICULUM_DATA[userProgress.selectedGrade];
  const levelInfo = calculateLevel(userProgress.totalXp);
  const grades: GradeId[] = [1, 2, 3, 4, 5, 6];

  return (
    <div className="py-6 max-w-6xl mx-auto px-4 space-y-8">
      {/* HERO SECTION */}
      <div className="relative rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-6 md:p-10 text-white shadow-xl overflow-hidden border-4 border-amber-300">
        {/* Playful background decorative clouds */}
        <div className="absolute top-2 right-12 w-28 h-10 bg-white/20 rounded-full blur-xs pointer-events-none" />
        <div className="absolute bottom-4 left-10 w-40 h-12 bg-white/15 rounded-full blur-xs pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Hero Content */}
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs md:text-sm font-extrabold mb-3">
              <Sparkles className="w-4 h-4 text-yellow-100" />
              <span>Petualangan Belajar Seru Kelas 1–6 SD</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-tight drop-shadow-xs mb-3">
              EduQuest
            </h1>

            <p className="text-base sm:text-lg font-bold text-amber-950/90 mb-6 leading-relaxed">
              Hai <span className="underline decoration-amber-200">{userProgress.playerName}</span>! 
              Yuk kumpulkan bintang, selesaikan misi ilmu pengetahuan, dan jadilah juara di setiap mata pelajaran!
            </p>

            {/* Big Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onStartLearning();
                }}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl btn-game-emerald shadow-lg flex items-center gap-2.5 cursor-pointer font-display transition-transform active:scale-95"
              >
                <Play className="w-6 h-6 fill-white" />
                <span>Mulai Belajar Sekarang!</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenMap();
                }}
                className="px-6 py-4 bg-white hover:bg-amber-50 text-amber-800 font-extrabold text-base rounded-2xl border-2 border-white/80 shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <Compass className="w-5 h-5 text-emerald-600" />
                <span>Buka Peta Petualangan</span>
              </button>
            </div>
          </div>

          {/* Right Hero Mascot Display */}
          <div className="w-full lg:w-auto shrink-0 flex justify-center">
            <div className="bg-white/30 backdrop-blur-md p-4 md:p-6 rounded-3xl border-3 border-white/40 shadow-lg text-slate-800 max-w-sm">
              <MascotKiko
                message={`Halo! Aku Kiko si Kancil Petualang! Sekarang kamu sedang belajar di ${currentGradeData.title}. Ayo klik tombol hijau untuk mulai!`}
                mood="cheering"
                size="md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATUS BAR: LEVEL, STARS, XP, BADGES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Level card */}
        <div
          onClick={() => {
            soundEngine.playClick();
            onOpenAchievements();
          }}
          className="bg-white border-2 border-amber-200 hover:border-amber-400 p-4 rounded-3xl shadow-xs transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl shrink-0">
            {levelInfo.badgeEmoji}
          </div>
          <div className="overflow-hidden">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Level Kamu</span>
            <p className="text-sm font-black text-slate-800 truncate font-display">
              {levelInfo.levelName}
            </p>
            <span className="text-[11px] text-amber-600 font-bold block mt-0.5">
              Level {levelInfo.levelNumber}
            </span>
          </div>
        </div>

        {/* Total Bintang card */}
        <div
          onClick={() => {
            soundEngine.playClick();
            onOpenAchievements();
          }}
          className="bg-white border-2 border-yellow-200 hover:border-yellow-400 p-4 rounded-3xl shadow-xs transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-2xl shrink-0">
            ⭐
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Bintang</span>
            <p className="text-xl font-black text-yellow-600 font-display tabular-nums">
              {userProgress.totalStars}
            </p>
            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
              Bintang Emas
            </span>
          </div>
        </div>

        {/* Total XP card */}
        <div
          onClick={() => {
            soundEngine.playClick();
            onOpenAchievements();
          }}
          className="bg-white border-2 border-purple-200 hover:border-purple-400 p-4 rounded-3xl shadow-xs transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl shrink-0">
            💎
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Energi XP</span>
            <p className="text-xl font-black text-purple-600 font-display tabular-nums">
              {userProgress.totalXp} XP
            </p>
            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
              Poin Petualangan
            </span>
          </div>
        </div>

        {/* Badges card */}
        <div
          onClick={() => {
            soundEngine.playClick();
            onOpenAchievements();
          }}
          className="bg-white border-2 border-emerald-200 hover:border-emerald-400 p-4 rounded-3xl shadow-xs transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl shrink-0">
            🏆
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Lencana</span>
            <p className="text-xl font-black text-emerald-600 font-display tabular-nums">
              {userProgress.unlockedBadges.length} Badge
            </p>
            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
              Lihat Prestasi ➔
            </span>
          </div>
        </div>
      </div>

      {/* GRADE SELECTOR CAROUSEL / TILES */}
      <div className="bg-white border-3 border-amber-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-600">
              Pilih Jenjang Sekolah
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 font-display">
              Tingkat Kelas SD
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenGrades();
            }}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Detail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {grades.map((grade) => {
            const data = CURRICULUM_DATA[grade];
            const isSelected = userProgress.selectedGrade === grade;

            return (
              <button
                key={grade}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectGrade(grade);
                }}
                className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-100/70 shadow-sm ring-3 ring-amber-300 scale-102'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                <span className="text-3xl mb-1">{data.mascotBadge}</span>
                <span className="text-base font-black text-slate-800 font-display">
                  {data.title}
                </span>
                <span className="text-[10px] font-bold text-slate-500 mt-0.5">
                  {data.recommendedAge}
                </span>
                {isSelected && (
                  <span className="mt-2 text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-full">
                    Aktif ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ADVENTURE MAP PREVIEW BANNER */}
      <div className="bg-white border-3 border-amber-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:w-5/12 aspect-16/9 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-sm">
            <img
              src={mapBannerImg}
              alt="Peta Petualangan EduQuest"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
              <span className="text-white text-xs font-black">
                🗺️ 6 Pulau Petualangan Nusantara
              </span>
            </div>
          </div>

          <div className="w-full md:w-7/12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black mb-2">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dunia Game Edukasi</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 font-display mb-2">
              Jelajahi Peta Petualangan EduQuest
            </h3>
            <p className="text-xs md:text-sm text-slate-600 mb-4 leading-relaxed">
              Mulai dari 🏫 Sekolah Pintar, masuk ke 🌳 Hutan Pengetahuan, bereksperimen di 🔬 Laboratorium Sains, membaca di 📚 Perpustakaan Ajaib, menyusuri 🌎 Dunia Nusantara, hingga meluncur ke 🚀 Galaksi Matematika!
            </p>

            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenMap();
              }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-xl btn-game-amber shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Buka Peta & Pilih Area Belajar</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK SUBJECT ACCESS GRID */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-600">
              Materi Terfavorit
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 font-display">
              Mata Pelajaran {currentGradeData.title}
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onStartLearning();
            }}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Semua Pelajaran</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.values(currentGradeData.subjects).map((subj) => {
            const quizKey = `${userProgress.selectedGrade}-${subj.id}`;
            const stats = userProgress.completedQuizzes[quizKey];
            const stars = stats?.starsEarned || 0;

            return (
              <button
                key={subj.id}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectSubject(subj.id);
                }}
                className="p-4 rounded-3xl bg-white border-2 border-slate-200 hover:border-amber-400 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{subj.icon}</span>
                    <div className="flex items-center text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="tabular-nums ml-0.5">{stars > 0 ? stars : '-'}</span>
                    </div>
                  </div>
                  <h4 className="text-base font-black text-slate-800 font-display leading-tight mb-1">
                    {subj.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {subj.zoneName}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                  <span>Mulai</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
