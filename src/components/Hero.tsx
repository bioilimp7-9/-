import React from 'react';
import { ArrowRight, BookOpen, Layers, CheckCircle2, Calculator } from 'lucide-react';

interface HeroProps {
  onSelectTab: (tab: string) => void;
  selectedGrade: string;
  setSelectedGrade: (grade: '7' | '8' | '9' | 'all') => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectTab,
  selectedGrade,
  setSelectedGrade,
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Heading and Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Clean unboxed metadata separator */}
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span>Campbell Biology Standard</span>
              <span aria-hidden="true">·</span>
              <span>7-9 сыныптар</span>
              <span aria-hidden="true">·</span>
              <span>Республикалық және IBO деңгейі</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
              7-9 сынып биология олимпиадасына дайындық оқу құралы
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Терең ғылыми теория, жасуша мен ұлпалардың ультрақұрылымдық интерактивті атласы, 
              олимпиадалық тесттер мен генетикалық есептер калькуляторы. Толықтай ғылыми дәлелденген 
              халықаралық биология стандарты бойынша.
            </p>

            {/* Grade Filter Segmented Control */}
            <div className="pt-2">
              <div className="text-xs text-slate-400 mb-2 font-medium">Сыныбыңызды таңдаңыз:</div>
              <div className="inline-flex p-1 bg-slate-800 rounded-lg border border-slate-700/60">
                {(['all', '7', '8', '9'] as const).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                      selectedGrade === grade
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {grade === 'all' ? 'Барлық сыныптар' : `${grade}-сынып`}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTab('theory')}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Теориялық базаны оқу</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectTab('atlas')}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Интерактивті атлас</span>
              </button>
              <button
                onClick={() => onSelectTab('quizzes')}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Олимпиадалық тесттер</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950 group">
              <img
                src="/src/assets/images/hero_biology_olympiad_1793877387785.jpg"
                alt="Биология олимпиадасына дайындық және зертханалық зерттеулер"
                className="w-full h-80 sm:h-96 object-cover transform transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-300 pointer-events-none">
                <div className="font-semibold text-white text-sm">Олимпиадалық зертханалық орта</div>
                <div className="text-slate-400">Цитология, молекулалық ДНҚ репликациясы және өсімдіктер физиологиясы</div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Metric Strip below the hero split */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">6 тарау</div>
            <div className="text-xs text-slate-400 mt-1">Цитологиядан бастап генетикаға дейінгі толық оқу курсы</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-sky-400 tabular-nums">3D атлас</div>
            <div className="text-xs text-slate-400 mt-1">Органеллалар, жапырақ анатомиясы, ДНҚ шанышқысы</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">4 түрлі тест</div>
            <div className="text-xs text-slate-400 mt-1">Сәйкестендіру, реттілік, бір таңдау және есептер</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-purple-400 tabular-nums">3 калькулятор</div>
            <div className="text-xs text-slate-400 mt-1">Пеннет торы, кодон трансляциясы, Чаргафф ережесі</div>
          </div>
        </div>
      </div>
    </div>
  );
};
