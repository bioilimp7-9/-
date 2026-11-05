import React from 'react';
import { STRATEGY_GUIDES } from '../data/olympiadData';
import {
  FlaskConical,
  BookOpen,
  Clock,
  ShieldCheck,
  Check,
  Sparkles,
  FileText,
  ExternalLink,
} from 'lucide-react';

interface StrategySectionProps {
  onAskAiWithContext: (title: string, prompt: string) => void;
  onOpenPrintGuide: () => void;
}

export const StrategySection: React.FC<StrategySectionProps> = ({
  onAskAiWithContext,
  onOpenPrintGuide,
}) => {
  return (
    <section className="py-10 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
          <span>5-БӨЛІМ: ОЛИМПИАДА ТАКТИКАСЫ МЕН ҒЫЛЫМИ СТАНДАРТ</span>
          <span aria-hidden="true">·</span>
          <span>ПРАКТИКАЛЫҚ КЕҢЕСТЕР</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Ғылыми дәлелдеме, гипотеза және олимпиада стратегиясы
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl">
          Олимпиадашыға тек теорияны жаттау аздық етеді. Тәжірибелік бақылау тобын (Control groups) құру, 
          графиктерді оқу және ғылыми сенімді көздерді саралау әдістемесі.
        </p>
      </div>

      {/* Scientific Rigor & 100% Proven Truth Callout */}
      <div className="mb-10 p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Ғылыми дәйектілік пен сенімділікті сақтау талаптары</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              «100% дәлелденген ақпарат» ұғымына сақтықпен қарау қағидасы
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Биология – қарқынды дамып жатқан эксперименттік ғылым. Бұрын ашылған кейбір қағидалар 
              (мысалы: "бір ген – бір нәруыз" постулаты баламалы сплайсинг ашылғаннан кейін өзгертілді) 
              жаңа технологиялармен жаңарады. Олимпиадаға дайындықта тек халықаралық рецензияланған 
              (peer-reviewed) ғылыми басылымдарға, Кэмпбелл, Тейлор, Грин және NCERT оқулықтарына сүйену қажет.
            </p>
          </div>
          <button
            onClick={onOpenPrintGuide}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Шпаргалканы басып шығару</span>
          </button>
        </div>
      </div>

      {/* Strategy Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {STRATEGY_GUIDES.map((guide) => (
          <div
            key={guide.id}
            className="p-6 bg-slate-800/40 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 mb-4">
                {guide.iconName === 'FlaskConical' ? (
                  <FlaskConical className="w-5 h-5" />
                ) : guide.iconName === 'BookOpen' ? (
                  <BookOpen className="w-5 h-5" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>
              <h4 className="text-base font-bold text-white leading-snug">{guide.title}</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{guide.description}</p>

              {/* Tips list */}
              <ul className="mt-4 space-y-2">
                {guide.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>

              {/* Methodology Case Study if available */}
              {guide.methodologyExample && (
                <div className="mt-4 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
                  <div className="font-bold text-emerald-400 font-mono">Тәжірибелік үлгі:</div>
                  <div className="text-slate-300">
                    <strong>Сценарий:</strong> {guide.methodologyExample.scenario}
                  </div>
                  <div className="text-slate-400">
                    <strong>Тәуелсіз айнымалы:</strong> {guide.methodologyExample.independentVar}
                  </div>
                  <div className="text-slate-400">
                    <strong>Тәуелді айнымалы:</strong> {guide.methodologyExample.dependentVar}
                  </div>
                  <div className="text-amber-300">
                    <strong>Бақылау:</strong> {guide.methodologyExample.controlGroup}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() =>
                onAskAiWithContext(
                  guide.title,
                  `«${guide.title}» бойынша олимпиадада жоғары нәтижеге жету үшін 7-9 сынып оқушысына тағы қандай құнды ғылыми лайфхактар мен тәжірибелік ұсыныстар бересіз?`
                )
              }
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-emerald-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI кеңесшісін шақыру</span>
            </button>
          </div>
        ))}
      </div>

      {/* Recommended Scientific Literature & Proven Source List */}
      <div className="p-6 bg-slate-800/40 border border-slate-800 rounded-2xl">
        <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>7-9 сынып олимпиадасына ұсынылатын ресми әдебиеттер мен ресурстар</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 pt-2">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div className="font-semibold text-white">1. Campbell Biology (Jane B. Reece et al.)</div>
            <div className="text-slate-400 text-[11px] mt-0.5">
              Халықаралық биология олимпиадасының (IBO) басты алтын стандарты. Цитология, генетика, өсімдіктер мен жануарлар физиологиясы толық қамтылған.
            </div>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div className="font-semibold text-white">2. Биология: Тейлор Д., Грин Н., Стаут У. (3 томдық)</div>
            <div className="text-slate-400 text-[11px] mt-0.5">
              Классикалық академиялық оқулық. Биохимия, физиология және экология заңдылықтары терең, жүйелі түрде баяндалған.
            </div>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div className="font-semibold text-white">3. NCERT Biology (Class 11 & 12)</div>
            <div className="text-slate-400 text-[11px] mt-0.5">
              Өсімдік анатомиясы, гүл құрылысы және таксономия бойынша өте нақты, қысқа сызбалар мен сұрақтар жинағы.
            </div>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div className="font-semibold text-white">4. «Дарын» РҒПО республикалық олимпиада тапсырмалары</div>
            <div className="text-slate-400 text-[11px] mt-0.5">
              Соңғы 10 жылдағы 7-9 сынып оқушыларына арналған аудандық, облыстық және республикалық биология олимпиадасының мұрағаты.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
