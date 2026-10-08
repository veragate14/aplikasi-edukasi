import React, { useState } from 'react';
import { GradeId, Question, SubjectId } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import { soundEngine } from '../utils/sound';
import { MascotKiko } from './MascotKiko';
import {
  Volume2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle,
  HelpCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface QuizPlayerViewProps {
  gradeId: GradeId;
  subjectId: SubjectId;
  onFinishQuiz: (score: number, correctCount: number, totalQuestions: number) => void;
  onQuitQuiz: () => void;
}

export const QuizPlayerView: React.FC<QuizPlayerViewProps> = ({
  gradeId,
  subjectId,
  onFinishQuiz,
  onQuitQuiz,
}) => {
  const gradeCurriculum = CURRICULUM_DATA[gradeId];
  const subject = gradeCurriculum.subjects[subjectId];
  const questions: Question[] = subject.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [streak, setStreak] = useState(0);

  // For Matching Type questions
  const [matchedPairs, setMatchedPairs] = useState<{ [left: string]: string }>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // For Ordering Type questions
  const currentQ = questions[currentIndex];
  const [currentOrder, setCurrentOrder] = useState<string[]>(
    currentQ.type === 'ordering' && currentQ.itemsToOrder ? [...currentQ.itemsToOrder] : []
  );

  // Reset local state when moving to next question
  const resetQuestionState = (nextIndex: number) => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setIsCorrect(false);
    setSelectedLeft(null);
    setMatchedPairs({});
    const nextQ = questions[nextIndex];
    if (nextQ.type === 'ordering' && nextQ.itemsToOrder) {
      setCurrentOrder([...nextQ.itemsToOrder]);
    } else {
      setCurrentOrder([]);
    }
  };

  const handleReadQuestion = () => {
    soundEngine.playClick();
    soundEngine.speakIndonesian(currentQ.question);
  };

  // Submit Answer Check
  const handleSubmitAnswer = () => {
    soundEngine.playClick();
    let correct = false;

    if (currentQ.type === 'multiple_choice' || currentQ.type === 'true_false' || currentQ.type === 'visual_guess') {
      if (!selectedOption) return;
      correct = selectedOption === currentQ.correctAnswer;
    } else if (currentQ.type === 'matching') {
      if (!currentQ.matchingPairs) return;
      // Check if all pairs match
      correct = currentQ.matchingPairs.every((pair) => matchedPairs[pair.left] === pair.right);
    } else if (currentQ.type === 'ordering') {
      if (!currentQ.correctOrder) return;
      correct = currentOrder.every((val, idx) => val === currentQ.correctOrder![idx]);
    }

    setHasSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      soundEngine.playCorrect();
      setCorrectAnswersCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      soundEngine.playTryAgain();
      setStreak(0);
    }
  };

  // Move to next question or complete quiz
  const handleNextOrFinish = () => {
    soundEngine.playClick();
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      resetQuestionState(nextIdx);
    } else {
      // Calculate final score
      const finalCorrect = correctAnswersCount + (isCorrect ? 1 : 0);
      const score = Math.round((finalCorrect / questions.length) * 100);
      onFinishQuiz(score, finalCorrect, questions.length);
    }
  };

  // Re-try current question on mistake
  const handleTryAgain = () => {
    soundEngine.playClick();
    setHasSubmitted(false);
    setIsCorrect(false);
  };

  // Ordering helper
  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    soundEngine.playClick();
    const newItems = [...currentOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setCurrentOrder(newItems);
  };

  // Matching helper
  const handleSelectMatchingLeft = (leftItem: string) => {
    soundEngine.playClick();
    setSelectedLeft(leftItem);
  };

  const handleSelectMatchingRight = (rightItem: string) => {
    if (!selectedLeft) return;
    soundEngine.playClick();
    setMatchedPairs((prev) => ({
      ...prev,
      [selectedLeft]: rightItem,
    }));
    setSelectedLeft(null);
  };

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="py-6 max-w-3xl mx-auto px-4">
      {/* Top Bar: Quit, Progress, Streak */}
      <div className="bg-white border-2 border-amber-200 rounded-3xl p-4 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => {
            soundEngine.playClick();
            onQuitQuiz();
          }}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors px-3 py-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
        >
          ✕ Batal
        </button>

        {/* Question Counter Progress */}
        <div className="flex-1 max-w-xs mx-auto">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
            <span>Soal {currentIndex + 1} dari {questions.length}</span>
            <span className="text-amber-600 font-extrabold">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden p-0.5 border border-amber-200">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Streak Counter */}
        {streak > 1 && (
          <div className="flex items-center gap-1 bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-xl text-xs font-extrabold text-orange-700 animate-bounce">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600" />
            <span>Streak {streak}x 🔥</span>
          </div>
        )}
      </div>

      {/* Main Question Card */}
      <div className="bg-white border-3 border-amber-200 rounded-3xl p-6 md:p-8 shadow-md relative mb-6">
        {/* Subject and Zone kicker */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
            <span>{subject.icon}</span>
            <span>{subject.name}</span>
          </span>

          <button
            onClick={handleReadQuestion}
            title="Dengarkan soal dibacakan"
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span>Bacakan Soal</span>
          </button>
        </div>

        {/* Emoji illustration if available */}
        {currentQ.illustrationEmoji && (
          <div className="text-center mb-4">
            <span className="text-5xl md:text-6xl inline-block drop-shadow-sm transition-transform hover:scale-110">
              {currentQ.illustrationEmoji}
            </span>
          </div>
        )}

        {/* Question Text */}
        <h2 className="text-xl md:text-2xl font-black text-slate-800 text-center mb-6 font-display leading-snug">
          {currentQ.question}
        </h2>

        {/* INTERACTION AREA BY QUESTION TYPE */}

        {/* 1. Multiple Choice / Visual Guess */}
        {(currentQ.type === 'multiple_choice' || currentQ.type === 'visual_guess') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
            {currentQ.options?.map((option, idx) => {
              const isSelected = selectedOption === option;
              let btnStyle = 'border-slate-200 bg-slate-50/60 hover:bg-amber-50 hover:border-amber-300 text-slate-700';

              if (isSelected) {
                btnStyle = 'border-amber-500 bg-amber-100/80 text-amber-900 ring-3 ring-amber-300 font-bold';
              }
              if (hasSubmitted) {
                if (option === currentQ.correctAnswer) {
                  btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-900 ring-3 ring-emerald-300 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-rose-300 bg-rose-50 text-rose-700 opacity-75';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasSubmitted}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedOption(option);
                  }}
                  className={`p-4 rounded-2xl border-2 text-left font-semibold text-base transition-all duration-150 flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                >
                  <span>{option}</span>
                  {hasSubmitted && option === currentQ.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. True / False */}
        {currentQ.type === 'true_false' && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {['Benar', 'Salah'].map((val) => {
              const isSelected = selectedOption === val;
              const isTrueBtn = val === 'Benar';
              let style = isTrueBtn
                ? 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800'
                : 'border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-800';

              if (isSelected) {
                style = isTrueBtn
                  ? 'border-emerald-500 bg-emerald-200 ring-3 ring-emerald-400 font-bold'
                  : 'border-rose-500 bg-rose-200 ring-3 ring-rose-400 font-bold';
              }

              return (
                <button
                  key={val}
                  disabled={hasSubmitted}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedOption(val);
                  }}
                  className={`p-5 rounded-2xl border-3 text-center text-lg font-black transition-all cursor-pointer ${style}`}
                >
                  <span className="text-3xl block mb-1">{isTrueBtn ? '👍' : '👎'}</span>
                  <span>{val}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. Matching Pairs */}
        {currentQ.type === 'matching' && currentQ.matchingPairs && (
          <div className="mb-6 space-y-4">
            <p className="text-xs text-center font-bold text-slate-500">
              Sentuh kotak di sisi kiri, lalu sentuh pasangannya di sisi kanan!
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-2.5">
                {currentQ.matchingPairs.map((pair, idx) => {
                  const isLeftSelected = selectedLeft === pair.left;
                  const isPaired = Boolean(matchedPairs[pair.left]);

                  return (
                    <button
                      key={idx}
                      disabled={hasSubmitted}
                      onClick={() => handleSelectMatchingLeft(pair.left)}
                      className={`w-full p-3 rounded-2xl border-2 text-left font-bold text-sm transition-all cursor-pointer ${
                        isLeftSelected
                          ? 'border-amber-500 bg-amber-100 ring-2 ring-amber-300'
                          : isPaired
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{pair.left}</span>
                      {isPaired && <span className="text-xs text-emerald-600 block mt-0.5">➔ {matchedPairs[pair.left]}</span>}
                    </button>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className="space-y-2.5">
                {currentQ.matchingPairs.map((pair, idx) => {
                  return (
                    <button
                      key={idx}
                      disabled={hasSubmitted}
                      onClick={() => handleSelectMatchingRight(pair.right)}
                      className={`w-full p-3 rounded-2xl border-2 text-left font-bold text-sm transition-all cursor-pointer border-slate-200 bg-sky-50/50 hover:bg-sky-100 text-sky-900`}
                    >
                      <span>{pair.right}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. Ordering */}
        {currentQ.type === 'ordering' && currentQ.itemsToOrder && (
          <div className="mb-6 space-y-3">
            <p className="text-xs text-center font-bold text-slate-500">
              Gunakan tombol panah ⬆️ dan ⬇️ untuk menyusun urutan yang benar!
            </p>

            {currentOrder.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-amber-200 bg-amber-50/60"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-amber-400 text-white font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-extrabold text-slate-800 text-base">{item}</span>
                </div>

                {!hasSubmitted && (
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveOrder(idx, 'up')}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={idx === currentOrder.length - 1}
                      onClick={() => handleMoveOrder(idx, 'down')}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom Action Submit Button */}
        {!hasSubmitted && (
          <div className="text-center">
            <button
              onClick={handleSubmitAnswer}
              disabled={
                (currentQ.type === 'multiple_choice' || currentQ.type === 'true_false' || currentQ.type === 'visual_guess') &&
                !selectedOption
              }
              className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-extrabold text-base rounded-2xl btn-game-amber shadow-md cursor-pointer font-display transition-all"
            >
              Cek Jawaban Saya! 🎯
            </button>
          </div>
        )}

        {/* FEEDBACK OVERLAY WHEN ANSWERED */}
        {hasSubmitted && (
          <div
            className={`mt-6 p-5 rounded-3xl border-3 animate-fade-in ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            {/* Mascot reaction */}
            <div className="flex items-start gap-4 mb-3">
              <span className="text-3xl">{isCorrect ? '🌟' : '💡'}</span>
              <div>
                <h3 className="text-lg font-black font-display">
                  {isCorrect
                    ? 'Hebat Sekali! Jawabanmu Benar!'
                    : 'Hampir tepat! Ayo ingat penjelasannya:'}
                </h3>
                <p className="text-sm font-medium mt-1 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            </div>

            {/* Feedback Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-200/40">
              {!isCorrect && (
                <button
                  onClick={handleTryAgain}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-amber-800 font-bold text-xs border border-amber-300 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Coba Lagi</span>
                </button>
              )}

              <button
                onClick={handleNextOrFinish}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs md:text-sm btn-game-amber flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>{currentIndex < questions.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Kuis! 🏆'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mascot encouragement note below question */}
      <div className="max-w-xl mx-auto">
        <MascotKiko
          message={
            hasSubmitted
              ? isCorrect
                ? 'Luar biasa! Kamu semakin pintar dan bersemangat!'
                : 'Jangan berkecil hati ya! Belajar dari kesalahan membuat kita semakin hebat!'
              : 'Baca soalnya perlahan-lahan ya! Kiko yakin kamu pasti bisa menyelesaikannya!'
          }
          mood={isCorrect ? 'celebrating' : 'happy'}
          size="sm"
        />
      </div>
    </div>
  );
};
