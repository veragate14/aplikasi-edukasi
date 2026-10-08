import React, { useState } from 'react';
import { UserProgressState } from '../types';
import { INITIAL_ACHIEVEMENTS, VIRTUAL_PRIZES, CURRICULUM_DATA } from '../data/curriculum';
import { calculateLevel } from '../utils/storage';
import { soundEngine } from '../utils/sound';
import { MascotKiko } from './MascotKiko';
import {
  Trophy,
  Star,
  Sparkles,
  Award,
  Gift,
  CheckCircle2,
  Lock,
  Unlock,
  User,
  RotateCcw,
} from 'lucide-react';

interface AchievementsReportViewProps {
  userProgress: UserProgressState;
  onUpdatePlayerName: (name: string) => void;
  onUnlockPrize: (prizeId: string, cost: number) => void;
  onResetProgress: () => void;
  onStartLearning: () => void;
}

export const AchievementsReportView: React.FC<AchievementsReportViewProps> = ({
  userProgress,
  onUpdatePlayerName,
  onUnlockPrize,
  onResetProgress,
  onStartLearning,
}) => {
  const [activeTab, setActiveTab] = useState<'report' | 'badges' | 'prizes'>('report');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProgress.playerName);

  const levelInfo = calculateLevel(userProgress.totalXp);
  const completedEntries = Object.entries(userProgress.completedQuizzes);
  const totalCompletedQuizzes = completedEntries.length;

  const totalPossibleQuestions = completedEntries.length * 4; // approx
  const totalScoreAvg =
    completedEntries.length > 0
      ? Math.round(
          completedEntries.reduce((acc, [, val]) => acc + val.score, 0) /
            completedEntries.length
        )
      : 0;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      soundEngine.playClick();
      onUpdatePlayerName(nameInput.trim());
      setEditingName(false);
    }
  };

  return (
    <div className="py-6 max-w-5xl mx-auto px-4">
      {/* Profile & Level Header Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-3xl p-6 md:p-8 text-white shadow-lg mb-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Avatar and Player Info */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xs border-3 border-white/40 flex items-center justify-center text-4xl shadow-md">
              {levelInfo.badgeEmoji}
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                {editingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-3 py-1 bg-white text-slate-800 rounded-xl text-sm font-bold focus:outline-none"
                      maxLength={20}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-slate-900 text-white rounded-xl text-xs font-bold"
                    >
                      Simpan
                    </button>
                  </form>
                ) : (
                  <>
                    <h1 className="text-2xl md:text-3xl font-black font-display drop-shadow-xs">
                      {userProgress.playerName}
                    </h1>
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-lg font-bold"
                    >
                      Ubah ✏️
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs md:text-sm font-bold text-amber-950/80 mt-0.5">
                Level {levelInfo.levelNumber}: {levelInfo.levelName}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-white/25 px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>{userProgress.totalStars} Bintang</span>
                </span>
                <span className="bg-white/25 px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{userProgress.totalXp} XP</span>
                </span>
              </div>
            </div>
          </div>

          {/* Level Progress Bar to next level */}
          <div className="w-full md:w-64 bg-white/20 backdrop-blur-xs p-4 rounded-2xl border border-white/30">
            <div className="flex justify-between text-xs font-black mb-1.5 drop-shadow-2xs">
              <span>Menuju Level {Math.min(7, levelInfo.levelNumber + 1)}</span>
              <span>{levelInfo.progressPercent}%</span>
            </div>
            <div className="w-full h-3.5 bg-black/15 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-white/90 text-right mt-1 font-semibold">
              {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Rapor Belajar, Koleksi Badge, Peti Hadiah */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-white border-2 border-amber-200 rounded-2xl max-w-md mx-auto mb-6 shadow-xs">
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('report');
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'report'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Rapor Belajar</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('badges');
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'badges'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Badge ({userProgress.unlockedBadges.length})</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('prizes');
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'prizes'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Peti Hadiah</span>
        </button>
      </div>

      {/* TAB 1: RAPOR BELAJAR */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border-2 border-amber-200 p-4 rounded-2xl text-center shadow-xs">
              <span className="text-xs font-bold text-slate-400 block mb-1">Kuis Diselesaikan</span>
              <span className="text-3xl font-black text-slate-800 font-display tabular-nums">
                {totalCompletedQuizzes}
              </span>
              <span className="text-[11px] text-amber-600 font-semibold block mt-1">Misi Selesai</span>
            </div>

            <div className="bg-white border-2 border-emerald-200 p-4 rounded-2xl text-center shadow-xs">
              <span className="text-xs font-bold text-slate-400 block mb-1">Rata-Rata Nilai</span>
              <span className="text-3xl font-black text-emerald-600 font-display tabular-nums">
                {totalScoreAvg || 0}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Poin Rapor</span>
            </div>

            <div className="bg-white border-2 border-yellow-200 p-4 rounded-2xl text-center shadow-xs">
              <span className="text-xs font-bold text-slate-400 block mb-1">Bintang Terkumpul</span>
              <span className="text-3xl font-black text-yellow-600 font-display tabular-nums">
                {userProgress.totalStars}
              </span>
              <span className="text-[11px] text-yellow-600 font-semibold block mt-1">Bintang Emas ⭐</span>
            </div>

            <div className="bg-white border-2 border-purple-200 p-4 rounded-2xl text-center shadow-xs">
              <span className="text-xs font-bold text-slate-400 block mb-1">Energi Belajar</span>
              <span className="text-3xl font-black text-purple-600 font-display tabular-nums">
                {userProgress.totalXp}
              </span>
              <span className="text-[11px] text-purple-600 font-semibold block mt-1">Total Poin XP 💎</span>
            </div>
          </div>

          {/* Subject Mastery Progress Breakdown */}
          <div className="bg-white border-3 border-amber-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 font-display mb-4">
              Penguasaan Mata Pelajaran ({CURRICULUM_DATA[userProgress.selectedGrade].title})
            </h3>

            <div className="space-y-4">
              {Object.values(CURRICULUM_DATA[userProgress.selectedGrade].subjects).map((subj) => {
                const quizKey = `${userProgress.selectedGrade}-${subj.id}`;
                const stat = userProgress.completedQuizzes[quizKey];
                const score = stat?.score || 0;
                const stars = stat?.starsEarned || 0;

                return (
                  <div key={subj.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{subj.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{subj.name}</p>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {subj.zoneName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-xs text-amber-600 font-bold">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= stars ? 'fill-amber-400 text-amber-500' : 'text-slate-200 fill-slate-100'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-black text-slate-700 w-12 text-right tabular-nums">
                          {score > 0 ? `${score} Poin` : '0%'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KOLEKSI BADGE */}
      {activeTab === 'badges' && (
        <div className="bg-white border-3 border-amber-200 rounded-3xl p-6 shadow-sm">
          <div className="text-center max-w-md mx-auto mb-6">
            <h3 className="text-2xl font-black text-slate-800 font-display">
              Lencana & Prestasi Petualang
            </h3>
            <p className="text-xs md:text-sm text-slate-600">
              Kumpulkan semua lencana kehormatan dengan menyelesaikan soal di setiap mata pelajaran!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {INITIAL_ACHIEVEMENTS.map((badge) => {
              const isUnlocked = userProgress.unlockedBadges.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                    isUnlocked
                      ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-2xs ${
                      isUnlocked ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? badge.icon : '🔒'}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black text-slate-800 leading-tight">
                        {badge.title}
                      </h4>
                      {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PETI HADIAH VIRTUAL */}
      {activeTab === 'prizes' && (
        <div className="bg-white border-3 border-amber-200 rounded-3xl p-6 shadow-sm">
          <div className="text-center max-w-md mx-auto mb-6">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-black mb-2">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-600" />
              <span>Bintang Tersedia: {userProgress.totalStars} ⭐</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 font-display">
              Peti Hadiah & Perlengkapan Petualang
            </h3>
            <p className="text-xs md:text-sm text-slate-600">
              Gunakan bintang emas yang kamu kumpulkan untuk membuka hadiah virtual istimewa!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {VIRTUAL_PRIZES.map((prize) => {
              const isUnlocked = userProgress.unlockedPrizes.includes(prize.id);
              const canAfford = userProgress.totalStars >= prize.costStars;

              return (
                <div
                  key={prize.id}
                  className={`p-5 rounded-3xl border-3 text-center flex flex-col justify-between transition-all ${
                    isUnlocked
                      ? 'border-emerald-300 bg-emerald-50/50 shadow-xs'
                      : 'border-amber-200 bg-amber-50/30'
                  }`}
                >
                  <div>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-3 bg-white border-2 border-amber-200 flex items-center justify-center text-4xl shadow-xs">
                      {prize.emoji}
                    </div>
                    <h4 className="text-base font-black text-slate-800 font-display mb-1">
                      {prize.name}
                    </h4>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      {prize.description}
                    </p>
                  </div>

                  <div>
                    {isUnlocked ? (
                      <div className="py-2 px-3 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Koleksi Terbuka</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (canAfford) {
                            soundEngine.playFanfare();
                            onUnlockPrize(prize.id, prize.costStars);
                          } else {
                            soundEngine.playTryAgain();
                          }
                        }}
                        disabled={!canAfford}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-600 text-white btn-game-amber shadow-sm'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Buka ({prize.costStars} ⭐)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Mascot and Reset */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-amber-200">
        <MascotKiko
          message="Terus kumpulkan bintang dan jelajahi ilmu baru setiap hari! Kiko selalu menemanimu!"
          mood="happy"
          size="sm"
        />

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundEngine.playClick();
              onStartLearning();
            }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl btn-game-amber cursor-pointer"
          >
            Lanjut Belajar 🚀
          </button>

          <button
            onClick={() => {
              if (window.confirm('Yakin ingin mereset progress belajar dan mulai petualangan baru?')) {
                soundEngine.playClick();
                onResetProgress();
              }
            }}
            title="Reset progress"
            className="p-2.5 rounded-xl border border-slate-300 text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
