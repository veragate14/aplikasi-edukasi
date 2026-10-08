import React from 'react';
import { GradeId } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import { soundEngine } from '../utils/sound';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface GradeSelectorProps {
  currentGrade: GradeId;
  onSelectGrade: (grade: GradeId) => void;
  onContinue: () => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  currentGrade,
  onSelectGrade,
  onContinue,
}) => {
  const gradeList: GradeId[] = [1, 2, 3, 4, 5, 6];

  const gradeThemes: Record<GradeId, { bgGradient: string; borderColor: string; iconBg: string }> = {
    1: { bgGradient: 'from-amber-100 to-yellow-50', borderColor: 'border-amber-300', iconBg: 'bg-amber-400' },
    2: { bgGradient: 'from-emerald-100 to-teal-50', borderColor: 'border-emerald-300', iconBg: 'bg-emerald-400' },
    3: { bgGradient: 'from-sky-100 to-blue-50', borderColor: 'border-sky-300', iconBg: 'bg-sky-400' },
    4: { bgGradient: 'from-purple-100 to-indigo-50', borderColor: 'border-purple-300', iconBg: 'bg-purple-400' },
    5: { bgGradient: 'from-rose-100 to-pink-50', borderColor: 'border-rose-300', iconBg: 'bg-rose-400' },
    6: { bgGradient: 'from-orange-100 to-amber-50', borderColor: 'border-orange-300', iconBg: 'bg-orange-400' },
  };

  return (
    <section className="py-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Langkah 1: Tentukan Jenjang Belajarmu</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight font-display mb-2">
          Pilih Jenjang Kelas SD
        </h2>
        <p className="text-sm md:text-base text-slate-600">
          Materi dan soal petualangan akan disesuaikan otomatis dengan tingkat kemampuanmu.
        </p>
      </div>

      {/* Grade Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto px-4">
        {gradeList.map((grade) => {
          const info = CURRICULUM_DATA[grade];
          const isSelected = currentGrade === grade;
          const theme = gradeThemes[grade];

          return (
            <div
              key={grade}
              onClick={() => {
                soundEngine.playClick();
                onSelectGrade(grade);
              }}
              className={`relative rounded-3xl p-5 border-3 transition-all duration-200 cursor-pointer text-left bg-gradient-to-br ${theme.bgGradient} ${
                isSelected
                  ? `${theme.borderColor} shadow-lg ring-4 ring-amber-400/30 -translate-y-1`
                  : 'border-slate-200/80 hover:border-amber-300 hover:shadow-md'
              }`}
            >
              {/* Active Badge */}
              {isSelected && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1 rounded-full shadow-sm flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              {/* Header with Mascot & Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} text-white flex items-center justify-center text-3xl shadow-sm border-2 border-white`}>
                  {info.mascotBadge}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 font-display">
                    {info.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {info.recommendedAge}
                  </p>
                </div>
              </div>

              {/* Subtitle & Tag */}
              <p className="text-sm font-bold text-slate-700 mb-2">
                {info.subTitle}
              </p>
              <div className="text-xs text-slate-600 mb-4 bg-white/70 rounded-xl p-2.5 border border-slate-200/50">
                ✨ 7 Mata Pelajaran Lengkap (Matematika, IPA, B. Indonesia, IPS, PPKn, Inggris, Umum)
              </div>

              {/* Selection button */}
              <button
                type="button"
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-white btn-game-amber shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                }`}
              >
                <span>{isSelected ? 'Kelas Terpilih' : 'Pilih Kelas Ini'}</span>
                {isSelected && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Action Next Step */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            soundEngine.playClick();
            onContinue();
          }}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-base md:text-lg rounded-2xl btn-game-amber shadow-md cursor-pointer font-display"
        >
          <span>Lanjut ke Petualangan Belajar!</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
