import React from 'react';
import { GradeId, SubjectId, UserProgressState } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import { soundEngine } from '../utils/sound';
import { Star, Sparkles, BookOpen, Play, CheckCircle2, Trophy } from 'lucide-react';

interface SubjectCardGridProps {
  currentGrade: GradeId;
  userProgress: UserProgressState;
  onSelectSubjectMaterial: (subjectId: SubjectId) => void;
  onSelectSubjectQuiz: (subjectId: SubjectId) => void;
  onChangeGrade: () => void;
}

export const SubjectCardGrid: React.FC<SubjectCardGridProps> = ({
  currentGrade,
  userProgress,
  onSelectSubjectMaterial,
  onSelectSubjectQuiz,
  onChangeGrade,
}) => {
  const gradeCurriculum = CURRICULUM_DATA[currentGrade];
  const subjectKeys: SubjectId[] = [
    'matematika',
    'bahasa-indonesia',
    'ipa',
    'ips',
    'ppkn',
    'bahasa-inggris',
    'pengetahuan-umum',
  ];

  return (
    <section className="py-6 max-w-6xl mx-auto px-4">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Mata Pelajaran • {gradeCurriculum.title}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight font-display">
            Pilih Mata Pelajaran
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Pelajari rangkuman materi singkat lalu uji kemampuanmu dengan kuis seru!
          </p>
        </div>

        {/* Change grade button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onChangeGrade();
          }}
          className="bg-white hover:bg-amber-50 text-amber-800 border-2 border-amber-300 px-4 py-2 rounded-2xl font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Ganti Jenjang ({gradeCurriculum.title})</span>
          <span>✏️</span>
        </button>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {subjectKeys.map((subjId) => {
          const subj = gradeCurriculum.subjects[subjId];
          const quizKey = `${currentGrade}-${subjId}`;
          const quizStats = userProgress.completedQuizzes[quizKey];
          const starsEarned = quizStats?.starsEarned || 0;
          const isCompleted = starsEarned > 0;

          return (
            <div
              key={subjId}
              className={`relative rounded-3xl border-3 ${subj.themeColor.border} bg-white p-5 shadow-sm hover:shadow-md transition-all duration-150 flex flex-col justify-between`}
            >
              <div>
                {/* Zone Tag & Stars */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <span>{subj.zoneEmoji}</span>
                    <span className="truncate max-w-[110px]">{subj.zoneName}</span>
                  </span>

                  {/* Star rating preview */}
                  <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3.5 h-3.5 ${
                          starIdx <= starsEarned
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-200 fill-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Big Subject Icon and Title */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div
                    className={`w-14 h-14 rounded-2xl ${subj.themeColor.bg} flex items-center justify-center text-3xl shadow-xs border-2 ${subj.themeColor.border}`}
                  >
                    {subj.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 font-display leading-tight">
                      {subj.name}
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">
                      {subj.questions.length} Soal Interaktif
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {subj.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onSelectSubjectMaterial(subjId);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                  <span>Pelajari Materi</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onSelectSubjectQuiz(subjId);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-white font-bold text-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                    subj.themeColor.btn
                  } shadow-sm`}
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Mulai Kuis Tantangan</span>
                </button>
              </div>

              {/* Status footer pill */}
              {isCompleted && (
                <div className="mt-2 text-center text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Selesai • Skor: {quizStats.score}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
