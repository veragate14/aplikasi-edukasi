import React, { useState } from 'react';
import { ADVENTURE_ZONES, CURRICULUM_DATA } from '../data/curriculum';
import { GradeId, SubjectId, UserProgressState } from '../types';
import { soundEngine } from '../utils/sound';
import { Compass, Sparkles, Star, ArrowRight, BookOpen, Lock } from 'lucide-react';

// High-fidelity generated adventure map
import mapWorldImg from '../assets/images/adventure_map_world_1791464341637.jpg';

interface AdventureMapViewProps {
  currentGrade: GradeId;
  userProgress: UserProgressState;
  onSelectSubject: (subjectId: SubjectId) => void;
}

export const AdventureMapView: React.FC<AdventureMapViewProps> = ({
  currentGrade,
  userProgress,
  onSelectSubject,
}) => {
  const [activeZoneId, setActiveZoneId] = useState<string>('galaksi-matematika');
  const gradeCurriculum = CURRICULUM_DATA[currentGrade];

  const activeZone = ADVENTURE_ZONES.find((z) => z.id === activeZoneId) || ADVENTURE_ZONES[0];

  // Map pin hotspot coordinates relative to map visual
  const pinPositions: Record<string, { top: string; left: string }> = {
    'sekolah-pintar': { top: '48%', left: '49%' },
    'hutan-pengetahuan': { top: '20%', left: '33%' },
    'laboratorium-sains': { top: '30%', left: '76%' },
    'perpustakaan-ajaib': { top: '56%', left: '22%' },
    'dunia-nusantara': { top: '75%', left: '47%' },
    'galaksi-matematika': { top: '75%', left: '84%' },
  };

  return (
    <section className="py-6 max-w-6xl mx-auto px-4">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold mb-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Peta Petualangan Nusantara • {gradeCurriculum.title}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-display">
            Peta Dunia Petualangan EduQuest
          </h2>
          <p className="text-xs md:text-sm text-slate-600">
            Jelajahi pulau-pulau ajaib! Sentuh setiap lokasi untuk membuka mata pelajaran rahasia.
          </p>
        </div>

        {/* Grade Badge indicator */}
        <div className="bg-white border-2 border-amber-200 rounded-2xl px-4 py-2 shadow-xs flex items-center gap-3">
          <span className="text-2xl">{gradeCurriculum.mascotBadge}</span>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Jenjang Aktif</p>
            <p className="text-sm font-extrabold text-slate-800">{gradeCurriculum.title}</p>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage & Concept Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Stage (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white border-3 border-amber-200 rounded-3xl p-3 shadow-md overflow-hidden relative">
          <div className="relative w-full aspect-16/9 rounded-2xl overflow-hidden bg-sky-200 select-none">
            {/* Map Background */}
            <img
              src={mapWorldImg}
              alt="Peta Petualangan EduQuest"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Subtle Map Overlay Tint */}
            <div className="absolute inset-0 bg-sky-900/10 pointer-events-none" />

            {/* Clickable Island Hotspots */}
            {ADVENTURE_ZONES.map((zone) => {
              const pos = pinPositions[zone.id] || { top: '50%', left: '50%' };
              const isSelected = zone.id === activeZoneId;

              return (
                <button
                  key={zone.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveZoneId(zone.id);
                  }}
                  style={{ top: pos.top, left: pos.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform duration-150 focus:outline-none`}
                  title={zone.title}
                >
                  {/* Pin button */}
                  <div className="relative flex flex-col items-center">
                    {/* Glowing pulse ring if selected */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-yellow-400/60 animate-ping" />
                    )}

                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-lg border-2 border-white transition-all ${
                        isSelected
                          ? 'bg-amber-500 scale-115 ring-4 ring-amber-300'
                          : 'bg-white hover:bg-amber-100 hover:scale-105'
                      }`}
                    >
                      {zone.emoji}
                    </div>

                    {/* Zone name chip on map */}
                    <div className="mt-1 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-xs text-[10px] md:text-xs font-bold text-white whitespace-nowrap shadow-xs">
                      {zone.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 text-center text-xs text-slate-500">
            💡 Sentuh ikon pulau pada peta di atas untuk melihat misi rahasia!
          </div>
        </div>

        {/* Zone Detail Deck (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white border-3 border-amber-200 rounded-3xl p-5 shadow-md">
          {/* Active Island Card */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-xs">
              {activeZone.emoji}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {activeZone.tag}
              </span>
              <h3 className="text-xl font-black text-slate-800 font-display mt-0.5">
                {activeZone.title}
              </h3>
            </div>
          </div>

          <p className="text-xs md:text-sm text-slate-600 mb-5 leading-relaxed bg-amber-50/60 p-3 rounded-xl border border-amber-100">
            {activeZone.description}
          </p>

          {/* Subjects in this Zone */}
          <div className="space-y-3 mb-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mata Pelajaran di Area Ini:
            </h4>

            {activeZone.subjectIds.map((subjId) => {
              const subj = gradeCurriculum.subjects[subjId];
              if (!subj) return null;

              // Check if completed
              const quizKey = `${currentGrade}-${subjId}`;
              const completed = userProgress.completedQuizzes[quizKey];
              const stars = completed?.starsEarned || 0;

              return (
                <div
                  key={subjId}
                  className="p-3 rounded-2xl border-2 border-slate-200 hover:border-amber-400 bg-slate-50/70 hover:bg-amber-50/50 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{subj.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{subj.name}</p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{stars > 0 ? `${stars} Bintang` : 'Belum selesai'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      onSelectSubject(subjId);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs btn-game-amber cursor-pointer whitespace-nowrap"
                  >
                    Mulai Belajar
                  </button>
                </div>
              );
            })}
          </div>

          {/* Zone Status */}
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zona ini aktif dan siap untuk dijelajahi olehmu!</span>
          </div>
        </div>
      </div>
    </section>
  );
};
