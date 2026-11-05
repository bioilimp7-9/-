import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, Award, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialPrompt?: string;
  grade?: string;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
  initialTopic = 'Жалпы биология',
  initialPrompt = '',
  grade = '8',
}) => {
  const [activeTab, setActiveTab] = useState<'ask' | 'evaluate'>('ask');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [studentQuestion, setStudentQuestion] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    verdict: string;
    feedback: string;
    missedKeyPoints: string[];
    correctModelAnswer: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const samplePrompts = [
    'Эндосимбиоз теориясының 4 басты дәлелін түсіндір.',
    'Неліктен С4 өсімдіктерінде фототыныс алу (photorespiration) байқалмайды?',
    'ДНҚ репликациясында Оказаки фрагменттері неліктен тек кешігуші тізбекте түзіледі?',
    'Олимпиадалық тәжірибеде оң және теріс бақылау тобын қалай таңдайды?',
    'Бор эффектісінің мәні неде және гемоглобинге қалай әсер етеді?',
  ];

  const handleAskTutor = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          grade,
          topic: initialTopic,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Серверден қате келді.');
      }

      setResponse(data.answer);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'AI жауабын өңдеуде қате орын алды.');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!studentQuestion.trim() || !studentAnswer.trim()) return;

    setLoading(true);
    setError(null);
    setEvaluation(null);

    try {
      const res = await fetch('/api/gemini/evaluate-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: studentQuestion,
          studentAnswer,
          grade,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Бағалау сәтсіз аяқталды.');
      }

      setEvaluation(data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Бағалау кезінде қате орын алды.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Олимпиадалық AI Репетитор (Campbell AI Coach)
              </h3>
              <div className="text-xs text-slate-400 font-mono">
                {grade}-сынып олимпиадалық биологиясы · Gemini 3.8 Flash
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/40">
          <button
            onClick={() => {
              setActiveTab('ask');
              setError(null);
            }}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'ask'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Сұрақ қою & Механизмді талдау
          </button>
          <button
            onClick={() => {
              setActiveTab('evaluate');
              setError(null);
            }}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'evaluate'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Оқушының жауабын/шешімін бағалау (0-100 балл)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'ask' ? (
            /* TAB 1: ASK TUTOR */
            <div className="space-y-4">
              {/* Sample Chips */}
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                  Жылдам сұрақтар (Олимпиада тақырыптары):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {samplePrompts.map((sp, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPrompt(sp);
                        handleAskTutor(sp);
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input field */}
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Биология олимпиадасына қатысты кез келген сұрағыңызды немесе терминді жазыңыз..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <div className="flex justify-end">
                  <button
                    disabled={loading || !prompt.trim()}
                    onClick={() => handleAskTutor()}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors disabled:opacity-40"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Талдануда...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Жауап алу</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Answer Box */}
              {response && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ғылыми олимпиадалық жауап:</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                    {response}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: EVALUATE STUDENT ANSWER */
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Олимпиадалық есептің немесе сұрақтың шартын және өзіңіздің тұжырымдаған жауабыңызды жазыңыз. 
                AI олимпиада қазылар алқасының критерийімен бағалап, жіберілген қателерді анықтайды.
              </p>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Олимпиадалық сұрақ / Кейс:
                </label>
                <input
                  type="text"
                  value={studentQuestion}
                  onChange={(e) => setStudentQuestion(e.target.value)}
                  placeholder="Мысалы: Неге эритроциттерде митохондрия болмайды және олар АТФ-ты қалай алады?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Сіздің жауабыңыз:
                </label>
                <textarea
                  rows={4}
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="Өз жауабыңыз бен биологиялық дәлелдеріңізді толық жазыңыз..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  disabled={loading || !studentQuestion.trim() || !studentAnswer.trim()}
                  onClick={handleEvaluate}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors disabled:opacity-40"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Бағалануда...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-3.5 h-3.5" />
                      <span>Жауапты бағалау</span>
                    </>
                  )}
                </button>
              </div>

              {/* Evaluation Output */}
              {evaluation && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="text-xs text-slate-400">Қазылар бағасы:</div>
                      <div className="text-lg font-bold text-white">{evaluation.verdict}</div>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500 text-emerald-400 font-mono font-bold text-lg">
                      {evaluation.score} / 100 балл
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed">
                    <strong>Пікір:</strong> {evaluation.feedback}
                  </div>

                  {evaluation.missedKeyPoints && evaluation.missedKeyPoints.length > 0 && (
                    <div className="p-3 bg-amber-950/30 border border-amber-800/60 rounded-xl text-xs space-y-1.5">
                      <div className="font-semibold text-amber-300">
                        Оқушы жауабында ескерілмеген маңызды ғылыми кілт сөздер:
                      </div>
                      <ul className="list-disc list-inside text-slate-300">
                        {evaluation.missedKeyPoints.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Олимпиадалық эталон жауап:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {evaluation.correctModelAnswer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
