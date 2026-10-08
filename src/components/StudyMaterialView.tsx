import React from 'react';
import { GradeId, SubjectId } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import { MascotKiko } from './MascotKiko';
import { soundEngine } from '../utils/sound';
import { ArrowLeft, Play, Sparkles, Lightbulb, BookOpen, Volume2 } from 'lucide-react';

// Generated assets
import scienceLabImg from '../assets/images/science_nature_lab_1791464353890.jpg';
import galaxyMathImg from '../assets/images/galaxy_math_world_1791464364941.jpg';

interface StudyMaterialViewProps {
  gradeId: GradeId;
  subjectId: SubjectId;
  onBack: () => void;
  onStartQuiz: () => void;
}

export const StudyMaterialView: React.FC<StudyMaterialViewProps> = ({
  gradeId,
  subjectId,
  onBack,
  onStartQuiz,
}) => {
  const gradeCurriculum = CURRICULUM_DATA[gradeId];
  const subject = gradeCurriculum.subjects[subjectId];

  // Thematic banner graphic selection
  let themeHeroImg: string | null = null;
  if (subjectId === 'ipa') {
    themeHeroImg = scienceLabImg;
  } else if (subjectId === 'matematika') {
    themeHeroImg = galaxyMathImg;
  }

  const handleReadAloud = (textToRead: string) => {
    soundEngine.playClick();
    soundEngine.speakIndonesian(textToRead);
  };

  return (
    <article className="py-6 max-w-4xl mx-auto px-4">
      {/* Navigation and Title */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            soundEngine.playClick();
            onBack();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pelajaran</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1 rounded-xl">
          <span>{gradeCurriculum.title}</span>
          <span>•</span>
          <span>{subject.zoneName}</span>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className={`relative rounded-3xl border-3 ${subject.themeColor.border} bg-white p-6 shadow-md mb-6 overflow-hidden`}>
        {/* Top Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-2xl ${subject.themeColor.bg} flex items-center justify-center text-3xl shadow-sm border-2 ${subject.themeColor.border}`}>
            {subject.icon}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Rangkuman Materi
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 font-display">
              {subject.name}
            </h1>
          </div>
        </div>

        {/* Thematic Illustration if available */}
        {themeHeroImg && (
          <div className="relative w-full aspect-16/9 md:aspect-21/9 rounded-2xl overflow-hidden mb-6 border-2 border-slate-200 shadow-xs">
            <img
              src={themeHeroImg}
              alt={subject.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 right-2 bg-slate-900/70 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
              ✨ Zona Petualangan: {subject.zoneName}
            </div>
          </div>
        )}

        {/* Mascot companion note */}
        <div className="mb-6">
          <MascotKiko
            message={`Halo petualang! Yuk baca materi ${subject.name} di bawah ini bersama Kiko. Setelah paham, kita taklukkan kuis tantangannya ya!`}
            mood="happy"
            size="sm"
          />
        </div>

        {/* Material Sections */}
        <div className="space-y-6">
          {subject.materials.map((mat, idx) => (
            <div
              key={idx}
              className="rounded-2xl border-2 border-amber-100 bg-amber-50/40 p-5 relative"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{mat.icon}</span>
                  <h2 className="text-lg md:text-xl font-extrabold text-slate-800 font-display">
                    {mat.title}
                  </h2>
                </div>
                <button
                  onClick={() => handleReadAloud(`${mat.title}. ${mat.description}`)}
                  title="Dengarkan pembacaan materi"
                  className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors cursor-pointer"
                  aria-label="Bacakan materi"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm md:text-base text-slate-700 leading-relaxed mb-4">
                {mat.description}
              </p>

              {/* Key points checklist */}
              <div className="bg-white rounded-xl p-4 border border-amber-200/80 mb-4 shadow-2xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Poin Penting untuk Diingat:</span>
                </h3>
                <ul className="space-y-2">
                  {mat.keyPoints.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fun Fact Callout */}
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 rounded-xl p-3 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm font-medium text-amber-900">
                  <span className="font-bold">Fakta Seru: </span>
                  {mat.funFact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Quiz Bottom Bar */}
      <div className="text-center bg-white rounded-3xl border-3 border-amber-200 p-6 shadow-sm">
        <h3 className="text-xl font-extrabold text-slate-800 font-display mb-1">
          Sudah Siap Mencoba Tantangan? 🌟
        </h3>
        <p className="text-xs md:text-sm text-slate-600 mb-4">
          Kerjakan {subject.questions.length} soal interaktif untuk mengumpulkan Bintang dan Poin XP!
        </p>
        <button
          onClick={() => {
            soundEngine.playClick();
            onStartQuiz();
          }}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-base md:text-lg rounded-2xl btn-game-amber shadow-md cursor-pointer font-display"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Mulai Kuis Tantangan Sekarang!</span>
        </button>
      </div>
    </article>
  );
};
