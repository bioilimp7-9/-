import React from 'react';
import { Sparkles, Printer } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiTutor: () => void;
  onOpenPrintGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiTutor,
  onOpenPrintGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <div
          onClick={() => setActiveTab('hero')}
          className="cursor-pointer text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="text-emerald-400 font-mono">BioOlymp</span>
          <span className="text-slate-300 font-normal">7-9</span>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('theory')}
            className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'theory' ? 'text-emerald-400 font-semibold underline underline-offset-8 decoration-emerald-500' : ''
            }`}
          >
            Теория
          </button>
          <button
            onClick={() => setActiveTab('atlas')}
            className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'atlas' ? 'text-emerald-400 font-semibold underline underline-offset-8 decoration-emerald-500' : ''
            }`}
          >
            Атлас
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'quizzes' ? 'text-emerald-400 font-semibold underline underline-offset-8 decoration-emerald-500' : ''
            }`}
          >
            Тесттер
          </button>
          <button
            onClick={() => setActiveTab('calculators')}
            className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'calculators' ? 'text-emerald-400 font-semibold underline underline-offset-8 decoration-emerald-500' : ''
            }`}
          >
            Есептер
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'leaderboard' ? 'text-emerald-400 font-semibold underline underline-offset-8 decoration-emerald-500' : ''
            }`}
          >
            Рейтинг
          </button>
          <button
            onClick={() => setActiveTab('strategy')}
            className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'strategy' ? 'text-emerald-400 font-semibold underline underline-offset-8 decoration-emerald-500' : ''
            }`}
          >
            Стратегия
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenPrintGuide}
            title="Оқу құралын басып шығару немесе PDF түрінде сақтау"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Шпаргалка</span>
          </button>
          <button
            onClick={onOpenAiTutor}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Репетитор</span>
          </button>
        </div>
      </div>
    </header>
  );
};
