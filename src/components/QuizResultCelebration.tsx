import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GradeId, SubjectId } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import { soundEngine } from '../utils/sound';
import { MascotKiko } from './MascotKiko';
import { Star, Trophy, Sparkles, RotateCcw, BookOpen, Compass, Award } from 'lucide-react';

interface QuizResultCelebrationProps {
  gradeId: GradeId;
  subjectId: SubjectId;
  score: number;
  correctCount: number;
  totalQuestions: number;
  xpGained: number;
  starsEarned: number;
  newBadgesUnlocked: string[];
  onRetryQuiz: () => void;
  onGoToSubjects: () => void;
  onGoToMap: () => void;
  onGoToAchievements: () => void;
}

export const QuizResultCelebration: React.FC<QuizResultCelebrationProps> = ({
  gradeId,
  subjectId,
  score,
  correctCount,
  totalQuestions,
  xpGained,
  starsEarned,
  newBadgesUnlocked,
  onRetryQuiz,
  onGoToSubjects,
  onGoToMap,
  onGoToAchievements,
}) => {
  const gradeCurriculum = CURRICULUM_DATA[gradeId];
  const subject = gradeCurriculum.subjects[subjectId];
  const wrongCount = totalQuestions - correctCount;

  useEffect(() => {
    // Play celebratory sound fanfare
    soundEngine.playFanfare();

    // Trigger confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
      });
    } catch {
      // Fallback
    }
  }, []);

  let resultTitle = 'Petualangan Selesai!';
  let resultMsg = 'Kerja yang luar biasa! Kamu sudah belajar hal baru hari ini.';
  if (score >= 100) {
    resultTitle = 'Sempurna! Kamu Jenius! 🌟';
    resultMsg = 'Luar biasa! Semua jawabanmu tepat tanpa cela! Kiko bangga sekali!';
  } else if (score >= 75) {
    resultTitle = 'Hebat Sekali! Nilai Sangat Bagus! 🚀';
    resultMsg = 'Kamu hebat! Pemahaman materimu sudah sangat mantap!';
  }

  return (
    <div className="py-6 max-w-2xl mx-auto px-4">
      {/* Celebration Main Card */}
      <div className="bg-white border-3 border-amber-300 rounded-3xl p-6 md:p-8 shadow-xl text-center relative overflow-hidden mb-6">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-200/50 blur-3xl -z-10 rounded-full" />

        {/* Badge header */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-black uppercase tracking-wider mb-3">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>Hasil Kuis • {subject.name}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-slate-800 font-display mb-2">
          {resultTitle}
        </h1>
        <p className="text-sm md:text-base text-slate-600 mb-6 max-w-md mx-auto">
          {resultMsg}
        </p>

        {/* 3-Star Rating Animation Display */}
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-6">
          {[1, 2, 3].map((starIdx) => {
            const isFilled = starIdx <= starsEarned;
            return (
              <div
                key={starIdx}
                className={`relative transition-all duration-300 transform ${
                  isFilled ? 'scale-110' : 'scale-90 opacity-40'
                }`}
              >
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border-3 shadow-md ${
                    isFilled
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 border-amber-500 text-white'
                      : 'bg-slate-100 border-slate-300 text-slate-300'
                  }`}
                >
                  <Star className={`w-10 h-10 md:w-12 md:h-12 ${isFilled ? 'fill-white' : ''}`} />
                </div>
                {isFilled && (
                  <span className="absolute -top-1 -right-1 text-xs">✨</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Score & Rewards Capsule Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* Nilai */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Nilai</span>
            <span className="text-2xl md:text-3xl font-black text-amber-600 font-display tabular-nums">
              {score}
            </span>
          </div>

          {/* Jawaban Benar */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Benar</span>
            <span className="text-2xl md:text-3xl font-black text-emerald-600 font-display tabular-nums">
              {correctCount}
            </span>
          </div>

          {/* Bintang Diperoleh */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Bintang</span>
            <span className="text-2xl md:text-3xl font-black text-yellow-600 font-display flex items-center justify-center gap-1 tabular-nums">
              +{starsEarned} ⭐
            </span>
          </div>

          {/* Total XP Diperoleh */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Bonus XP</span>
            <span className="text-2xl md:text-3xl font-black text-purple-600 font-display flex items-center justify-center gap-1 tabular-nums">
              +{xpGained} 💎
            </span>
          </div>
        </div>

        {/* Badge Unlocked Notification if any */}
        {newBadgesUnlocked.length > 0 && (
          <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-2 border-amber-400 rounded-2xl p-4 mb-6 text-left flex items-center gap-3.5 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-white flex items-center justify-center text-2xl shadow-xs">
              🎖️
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                Pencapaian Baru Terbuka!
              </span>
              <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                Selamat! Kamu membuka badge baru di Rapor Petualanganmu!
              </p>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onGoToAchievements();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs btn-game-amber cursor-pointer shrink-0"
            >
              Lihat Badge
            </button>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              onRetryQuiz();
            }}
            className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs md:text-sm border-2 border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Ulangi Kuis Ini</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onGoToSubjects();
            }}
            className="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs md:text-sm btn-game-amber flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>Pilih Pelajaran Lain</span>
          </button>
        </div>

        {/* Secondary Navigation */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs font-bold text-slate-500">
          <button
            onClick={() => {
              soundEngine.playClick();
              onGoToMap();
            }}
            className="hover:text-amber-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Buka Peta Petualangan</span>
          </button>
          <span>•</span>
          <button
            onClick={() => {
              soundEngine.playClick();
              onGoToAchievements();
            }}
            className="hover:text-amber-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-purple-600" />
            <span>Lihat Rapor Belajar</span>
          </button>
        </div>
      </div>

      {/* Mascot note */}
      <MascotKiko
        message={`Kamu hebat sekali! Setiap soal yang kamu kerjakan menambah ilmu dan energimu di EduQuest! Ayo lanjutkan ke tantangan berikutnya!`}
        mood="celebrating"
        size="sm"
      />
    </div>
  );
};
