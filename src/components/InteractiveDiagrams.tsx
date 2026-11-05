import React, { useState } from 'react';
import { INTERACTIVE_DIAGRAMS } from '../data/olympiadData';
import { DiagramPoint, InteractiveDiagram } from '../types/olympiad';
import { CheckCircle2, XCircle, HelpCircle, Eye, Info, Sparkles } from 'lucide-react';

interface InteractiveDiagramsProps {
  onAskAiWithContext: (diagramTitle: string, questionPrompt: string) => void;
}

export const InteractiveDiagrams: React.FC<InteractiveDiagramsProps> = ({
  onAskAiWithContext,
}) => {
  const [activeDiagramId, setActiveDiagramId] = useState<string>(INTERACTIVE_DIAGRAMS[0].id);
  const [selectedPointId, setSelectedPointId] = useState<string>(
    INTERACTIVE_DIAGRAMS[0].points[0]?.id || ''
  );
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [quizPoint, setQuizPoint] = useState<DiagramPoint | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  const activeDiagram: InteractiveDiagram =
    INTERACTIVE_DIAGRAMS.find((d) => d.id === activeDiagramId) || INTERACTIVE_DIAGRAMS[0];

  const selectedPoint =
    activeDiagram.points.find((p) => p.id === selectedPointId) || activeDiagram.points[0];

  // Start a new quiz question
  const startQuizQuestion = (diagram: InteractiveDiagram) => {
    const randomPoint =
      diagram.points[Math.floor(Math.random() * diagram.points.length)];
    setQuizPoint(randomPoint);
    setQuizAnswered(null);
  };

  const handleDiagramChange = (id: string) => {
    setActiveDiagramId(id);
    const newDiagram = INTERACTIVE_DIAGRAMS.find((d) => d.id === id) || INTERACTIVE_DIAGRAMS[0];
    setSelectedPointId(newDiagram.points[0]?.id || '');
    if (quizMode) {
      startQuizQuestion(newDiagram);
    }
  };

  const handleToggleQuizMode = () => {
    if (!quizMode) {
      setQuizMode(true);
      startQuizQuestion(activeDiagram);
    } else {
      setQuizMode(false);
      setQuizPoint(null);
      setQuizAnswered(null);
    }
  };

  const handleQuizAnswer = (answeredPointId: string) => {
    if (quizAnswered) return;
    setQuizAnswered(answeredPointId);
    const isCorrect = answeredPointId === quizPoint?.id;
    setQuizScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  return (
    <section className="py-10 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span>2-БӨЛІМ: ИЛЛЮСТРАЦИЯЛАР МЕН ДИАГРАММАЛАР</span>
            <span aria-hidden="true">·</span>
            <span>ҒЫЛЫМИ АТЛАС</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Интерактивті олимпиадалық анатомия және цитология атласы
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Диаграммадағы белгілерді басу арқылы органеллалардың микроқұрылысын, ғылыми латын атауын 
            және олимпиадалық маңызын зерттеңіз немесе біліміңізді сынау үшін «Сынақ режимін» қосыңыз.
          </p>
        </div>

        {/* Mode switcher button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleQuizMode}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border transition-colors ${
              quizMode
                ? 'bg-amber-500 text-slate-950 font-semibold border-amber-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
            }`}
          >
            {quizMode ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Шолу режиміне оралу</span>
              </>
            ) : (
              <>
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Диаграммалық сынақты бастау</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diagram Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-800 scrollbar-none">
        {INTERACTIVE_DIAGRAMS.map((diag) => (
          <button
            key={diag.id}
            onClick={() => handleDiagramChange(diag.id)}
            className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              activeDiagramId === diag.id
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {diag.title}
          </button>
        ))}
      </div>

      {/* Main Two-Zone Sandbox Layout (per education-simulations guideline: 60-70% visual canvas + control deck) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visual Stage (Canvas Zone) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">{activeDiagram.title}</h3>
              <p className="text-xs text-slate-400">{activeDiagram.description}</p>
            </div>
            {quizMode && (
              <div className="text-xs font-mono text-amber-400 bg-amber-950/40 px-3 py-1 rounded-md border border-amber-800/50">
                Сынақ ұпайы: {quizScore.correct} / {quizScore.total}
              </div>
            )}
          </div>

          {/* Interactive Image Frame */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group">
            <img
              src={activeDiagram.imageSrc}
              alt={activeDiagram.title}
              className="w-full h-auto object-cover select-none"
              referrerPolicy="no-referrer"
            />

            {/* Pins on Diagram */}
            {!quizMode ? (
              // Normal Explore Mode: show all pins
              activeDiagram.points.map((pt, index) => {
                const isSelected = pt.id === selectedPoint?.id;
                return (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedPointId(pt.id)}
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all transform ${
                      isSelected
                        ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/30 scale-125 z-20'
                        : 'bg-slate-900/90 text-white border border-slate-600 hover:bg-emerald-500 hover:text-slate-950 hover:scale-110 z-10'
                    }`}
                    title={pt.nameKz}
                  >
                    {index + 1}
                  </button>
                );
              })
            ) : (
              // Quiz Mode: show target pin with pulsing animation
              quizPoint && (
                <div
                  style={{ left: `${quizPoint.x}%`, top: `${quizPoint.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs animate-bounce shadow-lg ring-4 ring-amber-400/40 z-30"
                >
                  ?
                </div>
              )
            )}
          </div>

          {/* Bottom helper legend */}
          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div>
              {quizMode
                ? 'Диаграммадағы сұрақ белгісі тұрған құрылымды оң жақтан таңдаңыз.'
                : 'Нөмірлерді немесе оң жақтағы тізімді басып толық ғылыми ақпаратты оқыңыз.'}
            </div>
            <div className="font-mono text-emerald-400 text-[11px]">
              {activeDiagram.grade} олимпиадалық стандарты
            </div>
          </div>
        </div>

        {/* Control and Concept Deck (Inspector Zone) */}
        <div className="lg:col-span-5 space-y-6">
          {!quizMode ? (
            /* EXPLORE MODE INSPECTOR */
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-6">
              {/* Point Quick Selector Pills */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Құрылымдар тізімі:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeDiagram.points.map((pt, idx) => (
                    <button
                      key={pt.id}
                      onClick={() => setSelectedPointId(pt.id)}
                      className={`px-2.5 py-1 text-xs rounded-lg transition-colors flex items-center gap-1.5 ${
                        pt.id === selectedPoint?.id
                          ? 'bg-emerald-500 text-slate-950 font-semibold'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="font-mono text-[10px] opacity-75">{idx + 1}.</span>
                      <span>{pt.nameKz}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Structure Profile */}
              {selectedPoint && (
                <div className="space-y-4 pt-2 border-t border-slate-800">
                  <div>
                    <h4 className="text-lg font-bold text-white leading-tight">
                      {selectedPoint.nameKz}
                    </h4>
                    <div className="text-xs font-mono text-slate-400 italic">
                      {selectedPoint.nameLatEn}
                    </div>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />
                        <span>Ультрақұрылысы:</span>
                      </div>
                      <p className="text-slate-300">{selectedPoint.structure}</p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="font-semibold text-sky-400 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Биохимиялық қызметі:</span>
                      </div>
                      <p className="text-slate-300">{selectedPoint.functionKz}</p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Олимпиадалық мәні (Campbell Test Point):</span>
                      </div>
                      <p className="text-slate-300">{selectedPoint.olympiadSignificance}</p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onAskAiWithContext(
                        activeDiagram.title,
                        `Маған «${selectedPoint.nameKz} (${selectedPoint.nameLatEn})» құрылымы мен қызметінің олимпиадада сұралатын күрделі биохимиялық механизмін талдап берші.`
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-emerald-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Осы құрылым бойынша AI-дан кеңес алу</span>
                  </button>
                </div>
              )}

              {/* Comparison Matrix for Plant vs Animal if available */}
              {activeDiagram.comparisonPoints && (
                <div className="pt-4 border-t border-slate-800">
                  <div className="text-xs font-semibold text-white mb-2">
                    Өсімдік және жануар жасушасын салыстыру:
                  </div>
                  <div className="space-y-2 text-xs">
                    {activeDiagram.comparisonPoints.map((cmp, i) => (
                      <div key={i} className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                        <div className="font-medium text-emerald-400 mb-0.5">{cmp.feature}</div>
                        <div className="text-slate-400 text-[11px]">{cmp.systemA}</div>
                        <div className="text-slate-300 text-[11px]">{cmp.systemB}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* QUIZ MODE INSPECTOR */
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                  Олимпиадалық диаграмма сынағы
                </div>
                <h4 className="text-base font-bold text-white">
                  Диаграммадағы «?» белгісімен көрсетілген құрылым қалай аталады?
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Дұрыс жауапты төмендегі нұсқалар арасынан белгілеңіз:
                </p>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5">
                {activeDiagram.points.map((pt) => {
                  const isAnswered = quizAnswered !== null;
                  const isThisPoint = pt.id === quizPoint?.id;
                  const isSelected = pt.id === quizAnswered;

                  let btnStyle = 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600';
                  if (isAnswered) {
                    if (isThisPoint) {
                      btnStyle = 'bg-emerald-950/80 text-emerald-200 border-emerald-500 font-semibold';
                    } else if (isSelected && !isThisPoint) {
                      btnStyle = 'bg-rose-950/80 text-rose-200 border-rose-500 font-semibold';
                    } else {
                      btnStyle = 'bg-slate-900/40 text-slate-500 border-slate-800/50 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={pt.id}
                      disabled={isAnswered}
                      onClick={() => handleQuizAnswer(pt.id)}
                      className={`w-full p-3 text-left text-xs rounded-xl border transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <div>
                        <div className="font-medium text-white">{pt.nameKz}</div>
                        <div className="text-[11px] opacity-75 font-mono italic">{pt.nameLatEn}</div>
                      </div>
                      {isAnswered && (
                        <div>
                          {isThisPoint && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {isSelected && !isThisPoint && <XCircle className="w-4 h-4 text-rose-400" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback after answer */}
              {quizAnswered && quizPoint && (
                <div className="space-y-4 pt-3 border-t border-slate-800">
                  <div
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      quizAnswered === quizPoint.id
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-800 text-rose-200'
                    }`}
                  >
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      {quizAnswered === quizPoint.id ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Дұрыс! Ғылыми анықтамасы:</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span>Қате! Дұрысы: {quizPoint.nameKz}</span>
                        </>
                      )}
                    </div>
                    <p className="text-slate-300">{quizPoint.functionKz}</p>
                    <div className="mt-2 text-amber-300 text-[11px]">
                      <strong>Олимпиадалық ескертпе:</strong> {quizPoint.olympiadSignificance}
                    </div>
                  </div>

                  <button
                    onClick={() => startQuizQuestion(activeDiagram)}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
                  >
                    Келесі сұраққа өту
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
