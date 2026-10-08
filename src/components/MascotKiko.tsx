import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../utils/sound';

// Using generated high-fidelity asset
import mascotImg from '../assets/images/mascot_kiko_explorer_1791464330565.jpg';

interface MascotKikoProps {
  message: string;
  mood?: 'happy' | 'thinking' | 'celebrating' | 'cheering';
  size?: 'sm' | 'md' | 'lg';
  showSpeech?: boolean;
}

export const MascotKiko: React.FC<MascotKikoProps> = ({
  message,
  mood = 'happy',
  size = 'md',
  showSpeech = true,
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = React.useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playClick();
    if (isPlayingVoice) {
      soundEngine.stopSpeaking();
      setIsPlayingVoice(false);
    } else {
      setIsPlayingVoice(true);
      soundEngine.speakIndonesian(message);
      setTimeout(() => {
        setIsPlayingVoice(false);
      }, Math.max(3000, message.length * 80));
    }
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 md:w-28 md:h-28',
    lg: 'w-32 h-32 md:w-36 md:h-36',
  };

  return (
    <div className="flex items-center gap-3 md:gap-4 select-none">
      {/* Mascot Avatar Container */}
      <div className="relative group shrink-0">
        <div className={`relative ${sizeClasses[size]} rounded-2xl overflow-hidden border-4 border-amber-300 shadow-md bg-amber-100 transition-transform hover:scale-105 active:scale-95`}>
          <img
            src={mascotImg}
            alt="Kiko si Kancil Petualang"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {mood === 'celebrating' && (
            <div className="absolute inset-0 bg-yellow-400/20 animate-pulse pointer-events-none" />
          )}
        </div>
        <div className="absolute -bottom-2 -right-1 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm flex items-center gap-1">
          <span>Kiko</span>
          <span>🎒</span>
        </div>
      </div>

      {/* Speech Bubble */}
      {showSpeech && (
        <div className="relative flex-1 bg-white border-2 border-amber-200 rounded-2xl p-3 md:p-4 shadow-sm">
          {/* Bubble Arrow */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 bg-white border-l-2 border-b-2 border-amber-200 rotate-45" />

          <div className="flex items-start justify-between gap-2">
            <p className="text-sm md:text-base font-medium text-slate-800 leading-snug">
              {message}
            </p>
            <button
              onClick={handleSpeak}
              title="Dengarkan Kiko berbicara"
              className="p-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors shrink-0 flex items-center justify-center cursor-pointer"
              aria-label="Dengarkan suara Kiko"
            >
              {isPlayingVoice ? (
                <VolumeX className="w-4 h-4 text-rose-500 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-700" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
