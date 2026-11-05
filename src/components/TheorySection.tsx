import React, { useState } from 'react';
import { THEORY_TOPICS } from '../data/olympiadData';
import { TheoryTopic, SubjectCategory } from '../types/olympiad';
import { Search, BookOpen, Sparkles, AlertTriangle, Lightbulb, Calculator, Check, ArrowRight } from 'lucide-react';

interface TheorySectionProps {
  selectedGrade: string;
  onAskAiWithContext: (topicTitle: string, questionPrompt: string) => void;
}

export const TheorySection: React.FC<TheorySectionProps> = ({
  selectedGrade,
  onAskAiWithContext,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SubjectCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopicId, setActiveTopicId] = useState<string>(THEORY_TOPICS[0].id);

  // Filter topics
  const filteredTopics = THEORY_TOPICS.filter((topic) => {
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    const matchesGrade =
      selectedGrade === 'all' || topic.grades.includes(selectedGrade as '7' | '8' | '9');
    const matchesSearch =
      searchQuery === '' ||
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.keyConcepts.some((c) => c.term.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesGrade && matchesSearch;
  });

  const activeTopic =
    THEORY_TOPICS.find((t) => t.id === activeTopicId) || filteredTopics[0] || THEORY_TOPICS[0];

  return (
    <section className="py-10 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
          <span>1-БӨЛІМ: ТЕОРИЯЛЫҚ БЛОК</span>
          <span aria-hidden="true">·</span>
          <span>КЭМПБЕЛЛ БИОЛОГИЯСЫ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          7-9 сынып олимпиадалық теориясы мен заңдылықтары
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl">
          Әрбір тақырып олимпиадада сұралатын күрделі биохимиялық және цитологиялық механизмдерді, 
          дәл анықтамаларды және қателік тудыратын олимпиадалық қақпандарды қамтиды.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8 pb-4 border-b border-slate-800">
        {/* Category Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            Барлық бөлімдер
          </button>
          <button
            onClick={() => setSelectedCategory('cytology')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'cytology'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            Цитология
          </button>
          <button
            onClick={() => setSelectedCategory('botany')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'botany'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            Ботаника
          </button>
          <button
            onClick={() => setSelectedCategory('genetics')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'genetics'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            Генетика
          </button>
          <button
            onClick={() => setSelectedCategory('anatomy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'anatomy'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            Анатомия
          </button>
          <button
            onClick={() => setSelectedCategory('methodology')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'methodology'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            Ғылыми әдістеме
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Термин немесе тақырыпты іздеу..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Main Grid: Sidebar List + Deep Topic Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left List of Topics */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Тақырыптар тізімі ({filteredTopics.length})
          </div>
          {filteredTopics.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400 bg-slate-800/40 rounded-xl border border-slate-800">
              Іздеу бойынша тақырып табылмады. Басқа кілт сөзді енгізіп көріңіз.
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const isActive = topic.id === activeTopic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-slate-800 border-emerald-500/60 shadow-md shadow-emerald-950/30'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-medium text-emerald-400">{topic.categoryNameKz}</span>
                    <span className="font-mono text-slate-400">{topic.grades.join(', ')}-сынып</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white leading-snug">{topic.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{topic.summary}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Deep Topic Content Viewer */}
        <div className="lg:col-span-8 bg-slate-800/40 border border-slate-800 rounded-2xl p-6 sm:p-8">
          {activeTopic && (
            <div className="space-y-8">
              {/* Header & Campbell Citation */}
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono mb-2">
                  <span className="text-emerald-400 font-semibold">{activeTopic.categoryNameKz}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeTopic.grades.join(', ')}-сыныптар стандарты</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{activeTopic.title}</h3>
                <div className="text-xs font-mono text-slate-400 italic mt-0.5">{activeTopic.titleEn}</div>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">{activeTopic.summary}</p>

                {/* Campbell Biology Source Proof */}
                <div className="mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong className="text-white">Ғылыми негіз:</strong> {activeTopic.campbellReference}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      onAskAiWithContext(
                        activeTopic.title,
                        `Маған «${activeTopic.title}» бойынша олимпиадада ең жиі кездесетін 3 күрделі сұрақты талдап түсіндіріп берші.`
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI-дан тереңірек сұрау</span>
                  </button>
                </div>
              </div>

              {/* Key Scientific Concepts Grid */}
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide uppercase font-mono text-emerald-400 mb-3">
                  Негізгі олимпиадалық ұғымдар мен терминдер
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeTopic.keyConcepts.map((concept, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-900/90 rounded-xl border border-slate-800/90 flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-semibold text-white text-sm">{concept.term}</div>
                        {concept.latinOrEn && (
                          <div className="text-xs font-mono text-slate-400 italic mb-1.5">
                            {concept.latinOrEn}
                          </div>
                        )}
                        <p className="text-xs text-slate-300 leading-relaxed">{concept.definition}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-800/80 text-xs text-emerald-400/90">
                        <span className="font-semibold text-slate-400">Олимпиадалық мәні:</span>{' '}
                        {concept.importance}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Sections & Tables */}
              <div className="space-y-6">
                {activeTopic.detailedSections.map((sec, secIdx) => (
                  <div key={secIdx} className="space-y-4">
                    <h4 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                      {sec.heading}
                    </h4>
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-sm text-slate-300 leading-relaxed">
                        {p}
                      </p>
                    ))}

                    {/* Table if present */}
                    {sec.table && (
                      <div className="overflow-x-auto rounded-xl border border-slate-800 my-4">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900 text-slate-300 uppercase font-mono">
                            <tr>
                              {sec.table.headers.map((h, hIdx) => (
                                <th key={hIdx} className="p-3 border-b border-slate-800">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                            {sec.table.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`p-3 text-slate-300 ${
                                      cIdx === 0 ? 'font-semibold text-white' : ''
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Callout box if present */}
                    {sec.callout && (
                      <div
                        className={`p-4 rounded-xl border text-xs leading-relaxed ${
                          sec.callout.type === 'olympiad-pitfall'
                            ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                            : sec.callout.type === 'formula'
                            ? 'bg-purple-950/30 border-purple-800/60 text-purple-200'
                            : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                        }`}
                      >
                        <div className="font-bold mb-1 flex items-center gap-1.5">
                          {sec.callout.type === 'olympiad-pitfall' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          ) : sec.callout.type === 'formula' ? (
                            <Calculator className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Lightbulb className="w-4 h-4 text-emerald-400" />
                          )}
                          <span>{sec.callout.title}</span>
                        </div>
                        <div>{sec.callout.text}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Olympiad Key Takeaway Points */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 font-mono">
                  Олимпиадашының жадынамасы (High-Yield Facts):
                </div>
                <ul className="space-y-2">
                  {activeTopic.olympiadNotes.map((note, nIdx) => (
                    <li key={nIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
