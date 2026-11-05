import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TheorySection } from './components/TheorySection';
import { InteractiveDiagrams } from './components/InteractiveDiagrams';
import { QuizSection } from './components/QuizSection';
import { CalculatorsSection } from './components/CalculatorsSection';
import { StrategySection } from './components/StrategySection';
import { Leaderboard } from './components/Leaderboard';
import { AiTutorModal } from './components/AiTutorModal';
import { PrintStudyGuide } from './components/PrintStudyGuide';
import { BookOpen, Layers, CheckCircle2, Calculator, Sparkles, Printer, Trophy } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('hero');
  const [selectedGrade, setSelectedGrade] = useState<'7' | '8' | '9' | 'all'>('all');
  const [lastQuizResult, setLastQuizResult] = useState<{ score: number; total: number }>({
    score: 0,
    total: 0,
  });

  // AI Tutor Modal State
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [tutorContext, setTutorContext] = useState<{ topic: string; prompt: string }>({
    topic: 'Жалпы биология',
    prompt: '',
  });

  // Print Guide Modal State
  const [isPrintGuideOpen, setIsPrintGuideOpen] = useState(false);

  const handleOpenAiWithContext = (topic: string, prompt: string) => {
    setTutorContext({ topic, prompt });
    setIsAiTutorOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top 3-zone Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiTutor={() => {
          setTutorContext({
            topic: 'Жалпы биология',
            prompt: 'Маған 7-9 сынып биология олимпиадасының ең өзекті тақырыптарын түсіндір.',
          });
          setIsAiTutorOpen(true);
        }}
        onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section (Always shown on top or when hero tab is selected) */}
        {activeTab === 'hero' ? (
          <>
            <Hero
              onSelectTab={(tab) => setActiveTab(tab)}
              selectedGrade={selectedGrade}
              setSelectedGrade={setSelectedGrade}
            />

            {/* Quick Feature Previews on Home */}
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
              {/* Theory Preview Card Strip */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                  onClick={() => setActiveTab('theory')}
                  className="p-6 bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">1. Теориялық блок</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Цитология, ботаника, генетика және физиология бойынша Кэмпбелл стандартындағы толық ғылыми база.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('atlas')}
                  className="p-6 bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">2. Интерактивті атлас</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Жасуша органеллалары, өсімдік жапырағы мен ДНҚ репликациялық шанышқысын интерактивті зерттеу.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('quizzes')}
                  className="p-6 bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">3. Олимпиадалық тесттер</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Сәйкестендіру, реттілік және есептер. Әр жауаптың артындағы қателіктер мен Кэмпбелл дәлелі.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('calculators')}
                  className="p-6 bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">4. Био-Калькуляторлар</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Пеннет торы (моно/дигибридті), ДНҚ-дан аминқышқылдарға трансляция және Чаргафф ережесі.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('leaderboard')}
                  className="p-6 bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 group sm:col-span-2 lg:col-span-4 xl:col-span-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                          <span>БӘСЕКЕЛІ ОҚУ</span>
                          <span aria-hidden="true">·</span>
                          <span>ТОП-10 ОЛИМПИАДАШЫЛАР</span>
                        </div>
                        <h3 className="text-base font-bold text-white">5. Олимпиадалық рейтинг және прогресс тақтасы (Leaderboard)</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Сынып бойынша үздік олимпиадашылармен жарысыңыз, дәлдік көрсеткішін көтеріп, республикалық деңгейге көтеріліңіз.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('leaderboard');
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
                    >
                      Рейтингті көру
                    </button>
                  </div>
                </div>
              </div>

              {/* Theory Quick Section */}
              <TheorySection
                selectedGrade={selectedGrade}
                onAskAiWithContext={handleOpenAiWithContext}
              />
            </div>
          </>
        ) : activeTab === 'theory' ? (
          <TheorySection
            selectedGrade={selectedGrade}
            onAskAiWithContext={handleOpenAiWithContext}
          />
        ) : activeTab === 'atlas' ? (
          <InteractiveDiagrams onAskAiWithContext={handleOpenAiWithContext} />
        ) : activeTab === 'quizzes' ? (
          <QuizSection
            selectedGrade={selectedGrade}
            onAskAiWithContext={handleOpenAiWithContext}
            onViewLeaderboard={(score, total) => {
              setLastQuizResult({ score, total });
              setActiveTab('leaderboard');
            }}
          />
        ) : activeTab === 'calculators' ? (
          <CalculatorsSection />
        ) : activeTab === 'leaderboard' ? (
          <Leaderboard
            onStartQuiz={() => setActiveTab('quizzes')}
            quizScore={lastQuizResult.score}
            totalQuestions={lastQuizResult.total}
          />
        ) : (
          <StrategySection
            onAskAiWithContext={handleOpenAiWithContext}
            onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">БиоОлимп 7-9</span>
            <span aria-hidden="true">·</span>
            <span>7-9 сыныптарға арналған биология олимпиадасының ғылыми оқу құралы</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Campbell Biology 12th Edition Standard</span>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className="hover:text-emerald-400 transition-colors"
            >
              Олимпиадалық рейтинг
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsPrintGuideOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              Шпаргалканы басып шығару
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                setTutorContext({
                  topic: 'Олимпиада стратегиясы',
                  prompt: 'Олимпиадаға дайындықты қалай жүйелі жоспарлауға болады?',
                });
                setIsAiTutorOpen(true);
              }}
              className="hover:text-emerald-400 transition-colors"
            >
              AI Ментор
            </button>
          </div>
        </div>
      </footer>

      {/* Gemini AI Olympiad Coach Modal */}
      <AiTutorModal
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        initialTopic={tutorContext.topic}
        initialPrompt={tutorContext.prompt}
        grade={selectedGrade === 'all' ? '8' : selectedGrade}
      />

      {/* Printable Study Guide Modal */}
      <PrintStudyGuide
        isOpen={isPrintGuideOpen}
        onClose={() => setIsPrintGuideOpen(false)}
      />
    </div>
  );
}
