import React, { useState } from 'react';
import { OLYMPIAD_QUESTIONS } from '../data/olympiadData';
import {
  OlympiadQuestion,
  SingleChoiceQuestion,
  MatchingQuestion,
  SequenceQuestion,
  ProblemQuestion,
} from '../types/olympiad';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Award,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizSectionProps {
  selectedGrade: string;
  onAskAiWithContext: (questionTitle: string, questionPrompt: string) => void;
  onViewLeaderboard?: (currentScore: number, totalQuestions: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  selectedGrade,
  onAskAiWithContext,
  onViewLeaderboard,
}) => {
  const [activeFilterGrade, setActiveFilterGrade] = useState<string>(selectedGrade);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, unknown>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [matchingSelections, setMatchingSelections] = useState<Record<string, string>>({}); // leftId -> rightId
  const [sequenceOrders, setSequenceOrders] = useState<Record<string, string[]>>({}); // questionId -> stepId[]
  const [score, setScore] = useState<number>(0);

  // Filter questions based on activeFilterGrade
  const questions = OLYMPIAD_QUESTIONS.filter(
    (q) => activeFilterGrade === 'all' || q.grade === activeFilterGrade
  );

  const currentQ: OlympiadQuestion = questions[currentIndex] || questions[0];
  const isSubmitted = currentQ ? Boolean(submittedQuestions[currentQ.id]) : false;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmittedQuestions({});
    setMatchingSelections({});
    setSequenceOrders({});
    setScore(0);
    setCurrentIndex(0);
  };

  // Single choice selection
  const handleSelectSingle = (optionId: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
  };

  // Submit answer & grade
  const handleSubmitCurrent = () => {
    if (isSubmitted || !currentQ) return;

    let isCorrect = false;

    if (currentQ.type === 'single') {
      const selected = userAnswers[currentQ.id] as string;
      isCorrect = selected === (currentQ as SingleChoiceQuestion).correctAnswerId;
    } else if (currentQ.type === 'matching') {
      const q = currentQ as MatchingQuestion;
      const allCorrect = q.correctPairs.every(
        (pair) => matchingSelections[pair.leftId] === pair.rightId
      );
      isCorrect = allCorrect;
    } else if (currentQ.type === 'sequence') {
      const q = currentQ as SequenceQuestion;
      const currentOrder = sequenceOrders[q.id] || q.steps.map((s) => s.id);
      const isExactMatch =
        currentOrder.length === q.correctOrder.length &&
        currentOrder.every((id, idx) => id === q.correctOrder[idx]);
      isCorrect = isExactMatch;
    } else if (currentQ.type === 'problem') {
      // problem is self-reviewed with model answer
      isCorrect = true;
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }

    setSubmittedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
  };

  // Matching handler
  const handlePairSelection = (leftId: string, rightId: string) => {
    if (isSubmitted) return;
    setMatchingSelections((prev) => ({
      ...prev,
      [leftId]: rightId,
    }));
  };

  // Sequence handlers
  const handleMoveStep = (stepIndex: number, direction: 'up' | 'down') => {
    if (isSubmitted || !currentQ || currentQ.type !== 'sequence') return;
    const q = currentQ as SequenceQuestion;
    const currentOrder = sequenceOrders[q.id] || q.steps.map((s) => s.id);
    const newOrder = [...currentOrder];
    const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;

    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[stepIndex];
    newOrder[stepIndex] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setSequenceOrders((prev) => ({
      ...prev,
      [q.id]: newOrder,
    }));
  };

  return (
    <section className="py-10 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span>3-БӨЛІМ: ТЕСТ ТАПСЫРМАЛАРЫ МЕН ЕСЕПТЕР</span>
            <span aria-hidden="true">·</span>
            <span>ОЛИМПИАДА СЫНАҒЫ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Олимпиадалық тесттер мен жауаптар негіздемесі
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Бір дұрыс жауапты тесттер, сәйкестендіру, реттілік және есептер. 
            Әрбір сұрақтың артында Кэмпбелл стандарты мен толық ғылыми түсіндірмесі берілген.
          </p>
        </div>

        {/* Score & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-xs font-mono text-emerald-400">
            <Award className="w-4 h-4" />
            <span>
              Ұпай: {score} / {questions.length}
            </span>
          </div>
          {onViewLeaderboard && (
            <button
              onClick={() => onViewLeaderboard(score, questions.length)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-white border border-amber-500/30 rounded-lg text-xs font-medium transition-colors"
              title="Нәтижені олимпиадалық рейтинг тақтасында көру"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Рейтингке өту</span>
            </button>
          )}
          <button
            onClick={handleReset}
            title="Тестті қайта бастау"
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grade Selector Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          {(['all', '7', '8', '9'] as const).map((gr) => (
            <button
              key={gr}
              onClick={() => {
                setActiveFilterGrade(gr);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeFilterGrade === gr
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {gr === 'all' ? 'Барлық сұрақтар' : `${gr}-сынып тапсырмалары`}
            </button>
          ))}
        </div>

        {/* Question Counter */}
        <div className="text-xs font-mono text-slate-400 whitespace-nowrap">
          Сұрақ {currentIndex + 1} / {questions.length}
        </div>
      </div>

      {/* Active Question Card */}
      {currentQ ? (
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Question Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-emerald-400 font-semibold">{currentQ.grade}-сынып</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Деңгейі: {currentQ.difficulty}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 capitalize">
                {currentQ.type === 'single'
                  ? 'Бір дұрыс жауап'
                  : currentQ.type === 'matching'
                  ? 'Сәйкестендіру'
                  : currentQ.type === 'sequence'
                  ? 'Реттілік'
                  : 'Генетикалық есеп'}
              </span>
            </div>

            <button
              onClick={() =>
                onAskAiWithContext(
                  `Сұрақ #${currentIndex + 1}: ${currentQ.question}`,
                  `Осы олимпиадалық сұрақты талдап, неліктен қалған нұсқалар қате екенін және оқушылар қандай қақпанға түсетінін ғылыми тұрғыдан түсіндіріп берші.`
                )
              }
              className="flex items-center gap-1.5 px-3 py-1 text-xs text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Түсіндірмесі</span>
            </button>
          </div>

          {/* Question Prompt */}
          <div className="text-base sm:text-lg font-semibold text-white leading-relaxed">
            {currentQ.question}
          </div>

          {/* QUESTION TYPE 1: SINGLE CHOICE */}
          {currentQ.type === 'single' && (
            <div className="space-y-3 pt-2">
              {(currentQ as SingleChoiceQuestion).options.map((opt) => {
                const isSelected = userAnswers[currentQ.id] === opt.id;
                const isCorrect = (currentQ as SingleChoiceQuestion).correctAnswerId === opt.id;

                let optStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                if (isSubmitted) {
                  if (isCorrect) {
                    optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-semibold';
                  } else {
                    optStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-600 opacity-50';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-emerald-950/60 border-emerald-500 text-white font-medium';
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isSubmitted}
                    onClick={() => handleSelectSingle(opt.id)}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start justify-between gap-3 ${optStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono uppercase font-bold text-slate-400">
                        {opt.id})
                      </span>
                      <span>{opt.text}</span>
                    </div>
                    {isSubmitted && (
                      <div className="shrink-0 mt-0.5">
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* QUESTION TYPE 2: MATCHING */}
          {currentQ.type === 'matching' && (
            <div className="space-y-4 pt-2">
              <div className="text-xs text-slate-400 italic">
                Сол жақтағы әрбір ұғымға оң жақтағы сәйкес сипаттаманы таңдаңыз:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left side */}
                <div className="space-y-2.5">
                  {(currentQ as MatchingQuestion).leftItems.map((left) => {
                    const selectedRightId = matchingSelections[left.id];
                    const correctPair = (currentQ as MatchingQuestion).correctPairs.find(
                      (p) => p.leftId === left.id
                    );
                    const isCorrect = isSubmitted && selectedRightId === correctPair?.rightId;

                    return (
                      <div
                        key={left.id}
                        className={`p-3 rounded-xl border text-xs ${
                          isSubmitted
                            ? isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                              : 'bg-rose-950/40 border-rose-500 text-rose-200'
                            : 'bg-slate-900 border-slate-800 text-white'
                        }`}
                      >
                        <div className="font-semibold">{left.text}</div>
                        <div className="mt-2">
                          <label className="text-[11px] text-slate-400 block mb-1">Сәйкес нұсқа:</label>
                          <select
                            disabled={isSubmitted}
                            value={selectedRightId || ''}
                            onChange={(e) => handlePairSelection(left.id, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="">Таңдаңыз...</option>
                            {(currentQ as MatchingQuestion).rightItems.map((right) => (
                              <option key={right.id} value={right.id}>
                                {right.text}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right side reference legend */}
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase font-mono">
                    Сипаттамалар:
                  </div>
                  {(currentQ as MatchingQuestion).rightItems.map((right) => (
                    <div key={right.id} className="text-xs text-slate-300 leading-relaxed">
                      {right.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* QUESTION TYPE 3: SEQUENCE */}
          {currentQ.type === 'sequence' && (
            <div className="space-y-3 pt-2">
              <div className="text-xs text-slate-400 italic">
                Оң жақтағы бағыттауыш батырмалар арқылы қадамдарды дұрыс реттілікпен орналастырыңыз:
              </div>
              <div className="space-y-2">
                {(() => {
                  const q = currentQ as SequenceQuestion;
                  const currentOrder = sequenceOrders[q.id] || q.steps.map((s) => s.id);

                  return currentOrder.map((stepId, index) => {
                    const stepObj = q.steps.find((s) => s.id === stepId);
                    const isCorrectPosition = isSubmitted && q.correctOrder[index] === stepId;

                    return (
                      <div
                        key={stepId}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${
                          isSubmitted
                            ? isCorrectPosition
                              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                              : 'bg-rose-950/60 border-rose-500 text-rose-200'
                            : 'bg-slate-900 border-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                            {index + 1}
                          </span>
                          <span>{stepObj?.text}</span>
                        </div>

                        {!isSubmitted && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              disabled={index === 0}
                              onClick={() => handleMoveStep(index, 'up')}
                              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              disabled={index === currentOrder.length - 1}
                              onClick={() => handleMoveStep(index, 'down')}
                              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* QUESTION TYPE 4: PROBLEM / CALCULATION */}
          {currentQ.type === 'problem' && (
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <div className="font-semibold text-emerald-400 mb-1">
                  Есепті дәптерге шығарып, төмендегі батырманы басып өзіңіздің шығару жолыңыз бен жауабыңызды тексеріңіз:
                </div>
                <div>ДНҚ геометриясы, Чаргафф заңы және сутектік байланыстар формулаларын қолданыңыз.</div>
              </div>

              {isSubmitted && (
                <div className="p-4 bg-purple-950/30 border border-purple-800/60 rounded-xl text-xs space-y-3">
                  <div className="font-bold text-purple-300 text-sm">
                    Үлгілі академиялық шығару жолы:
                  </div>
                  <ul className="space-y-1.5 text-slate-300">
                    {(currentQ as ProblemQuestion).calculationSteps.map((step, idx) => (
                      <li key={idx} className="font-mono">
                        {step}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 border-t border-purple-800/40 font-bold text-white">
                    Соңғы жауабы: {(currentQ as ProblemQuestion).modelAnswer}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Action Button */}
          {!isSubmitted ? (
            <button
              onClick={handleSubmitCurrent}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Жауапты тексеру
            </button>
          ) : (
            /* Detailed Explanation & Campbell Reference */
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 text-xs leading-relaxed">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Ғылыми негіздемесі мен түсіндірмесі:</span>
              </div>
              <p className="text-slate-300">{currentQ.explanation}</p>
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-slate-400">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-white">Дереккөз:</strong> {currentQ.campbellReference}
                </span>
              </div>
            </div>
          )}

          {/* Pagination Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors disabled:opacity-40"
            >
              Алдыңғы сұрақ
            </button>
            <div className="text-xs text-slate-400 font-mono">
              {currentIndex + 1} / {questions.length}
            </div>
            <button
              disabled={currentIndex === questions.length - 1}
              onClick={handleNext}
              className="px-4 py-2 text-xs font-medium bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors disabled:opacity-40"
            >
              Келесі сұрақ
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 bg-slate-800/40 rounded-xl">
          Сұрақтар табылмады.
        </div>
      )}
    </section>
  );
};
