import React, { useState } from 'react';
import { Calculator, Dna, Grid, Sparkles, RefreshCw } from 'lucide-react';

export const CalculatorsSection: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<'punnett' | 'dna' | 'chargaff'>('punnett');

  // Punnett Square State
  const [crossType, setCrossType] = useState<'monohybrid' | 'dihybrid'>('monohybrid');
  const [parent1, setParent1] = useState('Aa');
  const [parent2, setParent2] = useState('Aa');

  // DNA Translator State
  const [dnaInput, setDnaInput] = useState('TACGGCCTTAATACT');

  // Chargaff Calculator State
  const [totalBp, setTotalBp] = useState<number>(1000);
  const [adenineCount, setAdenineCount] = useState<number>(280);

  // --- PUNNETT COMPUTATION ---
  const solvePunnett = () => {
    if (crossType === 'monohybrid') {
      const p1 = parent1.padEnd(2, 'a').slice(0, 2);
      const p2 = parent2.padEnd(2, 'a').slice(0, 2);
      const g1 = [p1[0], p1[1]];
      const g2 = [p2[0], p2[1]];

      const matrix: string[][] = [];
      const counts: Record<string, number> = {};

      for (const a1 of g1) {
        const row: string[] = [];
        for (const a2 of g2) {
          // Normalize genotype order (uppercase first)
          const sorted = [a1, a2].sort().join('');
          const norm = sorted[0].toUpperCase() === sorted[0] ? sorted : sorted.split('').reverse().join('');
          row.push(norm);
          counts[norm] = (counts[norm] || 0) + 1;
        }
        matrix.push(row);
      }

      return { gametes1: g1, gametes2: g2, matrix, counts, total: 4 };
    } else {
      // Dihybrid cross AaBb x AaBb
      const p1 = parent1.length >= 4 ? parent1 : 'AaBb';
      const p2 = parent2.length >= 4 ? parent2 : 'AaBb';

      const getDihybridGametes = (gen: string) => {
        const a1 = gen[0], a2 = gen[1];
        const b1 = gen[2], b2 = gen[3];
        return [a1 + b1, a1 + b2, a2 + b1, a2 + b2];
      };

      const g1 = getDihybridGametes(p1);
      const g2 = getDihybridGametes(p2);

      const matrix: string[][] = [];
      const counts: Record<string, number> = {};

      for (const gm1 of g1) {
        const row: string[] = [];
        for (const gm2 of g2) {
          const aAlleles = [gm1[0], gm2[0]].sort().join('');
          const bAlleles = [gm1[1], gm2[1]].sort().join('');
          const normA = aAlleles[0].toUpperCase() === aAlleles[0] ? aAlleles : aAlleles.split('').reverse().join('');
          const normB = bAlleles[0].toUpperCase() === bAlleles[0] ? bAlleles : bAlleles.split('').reverse().join('');
          const combined = normA + normB;
          row.push(combined);
          counts[combined] = (counts[combined] || 0) + 1;
        }
        matrix.push(row);
      }

      return { gametes1: g1, gametes2: g2, matrix, counts, total: 16 };
    }
  };

  const punnettResult = solvePunnett();

  // --- DNA & CODON TRANSLATION ---
  const GENETIC_CODE: Record<string, { aa: string; name: string }> = {
    AUG: { aa: 'Met', name: 'Метионин (СТАРТ)' },
    UUU: { aa: 'Phe', name: 'Фенилаланин' },
    UUC: { aa: 'Phe', name: 'Фенилаланин' },
    UUA: { aa: 'Leu', name: 'Лейцин' },
    UUG: { aa: 'Leu', name: 'Лейцин' },
    CUU: { aa: 'Leu', name: 'Лейцин' },
    CUC: { aa: 'Leu', name: 'Лейцин' },
    CUA: { aa: 'Leu', name: 'Лейцин' },
    CUG: { aa: 'Leu', name: 'Лейцин' },
    AUU: { aa: 'Ile', name: 'Изолейцин' },
    AUC: { aa: 'Ile', name: 'Изолейцин' },
    AUA: { aa: 'Ile', name: 'Изолейцин' },
    GUU: { aa: 'Val', name: 'Валин' },
    GUC: { aa: 'Val', name: 'Валин' },
    GUA: { aa: 'Val', name: 'Валин' },
    GUG: { aa: 'Val', name: 'Валин' },
    UCU: { aa: 'Ser', name: 'Серин' },
    UCC: { aa: 'Ser', name: 'Серин' },
    UCA: { aa: 'Ser', name: 'Серин' },
    UCG: { aa: 'Ser', name: 'Серин' },
    CCU: { aa: 'Pro', name: 'Пролин' },
    CCC: { aa: 'Pro', name: 'Пролин' },
    CCA: { aa: 'Pro', name: 'Пролин' },
    CCG: { aa: 'Pro', name: 'Пролин' },
    ACU: { aa: 'Thr', name: 'Треонин' },
    ACC: { aa: 'Thr', name: 'Треонин' },
    ACA: { aa: 'Thr', name: 'Треонин' },
    ACG: { aa: 'Thr', name: 'Треонин' },
    GCU: { aa: 'Ala', name: 'Аланин' },
    GCC: { aa: 'Ala', name: 'Аланин' },
    GCA: { aa: 'Ala', name: 'Аланин' },
    GCG: { aa: 'Ala', name: 'Аланин' },
    UAU: { aa: 'Tyr', name: 'Тирозин' },
    UAC: { aa: 'Tyr', name: 'Тирозин' },
    UAA: { aa: 'STOP', name: 'СТОП (Ochre)' },
    UAG: { aa: 'STOP', name: 'СТОП (Amber)' },
    UGA: { aa: 'STOP', name: 'СТОП (Opal)' },
    CAU: { aa: 'His', name: 'Гистидин' },
    CAC: { aa: 'His', name: 'Гистидин' },
    CAA: { aa: 'Gln', name: 'Глутамин' },
    CAG: { aa: 'Gln', name: 'Глутамин' },
    AAU: { aa: 'Asn', name: 'Аспарагин' },
    AAC: { aa: 'Asn', name: 'Аспарагин' },
    AAA: { aa: 'Lys', name: 'Лизин' },
    AAG: { aa: 'Lys', name: 'Лизин' },
    GAU: { aa: 'Asp', name: 'Аспартат' },
    GAC: { aa: 'Asp', name: 'Аспартат' },
    GAA: { aa: 'Glu', name: 'Глутамат' },
    GAG: { aa: 'Glu', name: 'Глутамат' },
    UGU: { aa: 'Cys', name: 'Цистеин' },
    UGC: { aa: 'Cys', name: 'Цистеин' },
    UGG: { aa: 'Trp', name: 'Триптофан' },
    CGU: { aa: 'Arg', name: 'Аргинин' },
    CGC: { aa: 'Arg', name: 'Аргинин' },
    CGA: { aa: 'Arg', name: 'Аргинин' },
    CGG: { aa: 'Arg', name: 'Аргинин' },
    AGU: { aa: 'Ser', name: 'Серин' },
    AGC: { aa: 'Ser', name: 'Серин' },
    AGA: { aa: 'Arg', name: 'Аргинин' },
    AGG: { aa: 'Arg', name: 'Аргинин' },
    GGU: { aa: 'Gly', name: 'Глицин' },
    GGC: { aa: 'Gly', name: 'Глицин' },
    GGA: { aa: 'Gly', name: 'Глицин' },
    GGG: { aa: 'Gly', name: 'Глицин' },
  };

  // Clean DNA input
  const cleanDna = dnaInput.toUpperCase().replace(/[^ATGC]/g, '');

  // Transcribe to mRNA: A->U, T->A, G->C, C->G (complementary)
  const transcribe = (dna: string) => {
    return dna
      .split('')
      .map((n) => {
        if (n === 'A') return 'U';
        if (n === 'T') return 'A';
        if (n === 'G') return 'C';
        if (n === 'C') return 'G';
        return '';
      })
      .join('');
  };

  const mrna = transcribe(cleanDna);

  // Group into triplets & translate
  const triplets: string[] = [];
  for (let i = 0; i < mrna.length; i += 3) {
    if (i + 3 <= mrna.length) {
      triplets.push(mrna.slice(i, i + 3));
    }
  }

  const translatedAAs = triplets.map((codon) => {
    return GENETIC_CODE[codon] || { aa: '???', name: 'Белгісіз' };
  });

  // Calculate GC content
  const gcCount = cleanDna.split('').filter((n) => n === 'G' || n === 'C').length;
  const gcPercentage = cleanDna.length > 0 ? ((gcCount / cleanDna.length) * 100).toFixed(1) : '0';

  // --- CHARGAFF COMPUTATION ---
  const validTotal = Math.max(2, totalBp);
  const safeAdenine = Math.min(validTotal / 2, Math.max(0, adenineCount));
  const thymine = safeAdenine;
  const remainingBp = validTotal - safeAdenine * 2;
  const guanine = remainingBp / 2;
  const cytosine = guanine;

  const aPct = ((safeAdenine / validTotal) * 100).toFixed(1);
  const tPct = aPct;
  const gPct = ((guanine / validTotal) * 100).toFixed(1);
  const cPct = gPct;

  const hydrogenBonds = safeAdenine * 2 + guanine * 3;
  const dnaLengthNm = (validTotal * 0.34).toFixed(1);
  const helicalTurns = (validTotal / 10).toFixed(1);

  return (
    <section className="py-10 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
          <span>4-БӨЛІМ: БИО-КАЛЬКУЛЯТОРЛАР МЕН ТРЕНАЖЕРЛАР</span>
          <span aria-hidden="true">·</span>
          <span>ГЕНЕТИКАЛЫҚ МОДЕЛДЕУ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Олимпиадалық есептер мен молекулалық симулятор
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl">
          Мендель заңдары бойынша Пеннет торын моделдеу, ДНҚ-дан аминқышқылдық тізбекке дейінгі 
          трансляция және Чаргафф ережесі бойынша параметрлерді лезде есептеу құралы.
        </p>
      </div>

      {/* Calculator Mode Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-slate-800">
        <button
          onClick={() => setActiveCalc('punnett')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
            activeCalc === 'punnett'
              ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Пеннет торы (Мендель есептері)</span>
        </button>
        <button
          onClick={() => setActiveCalc('dna')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
            activeCalc === 'dna'
              ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Dna className="w-4 h-4" />
          <span>ДНҚ & Кодон трансляторы</span>
        </button>
        <button
          onClick={() => setActiveCalc('chargaff')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
            activeCalc === 'chargaff'
              ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Чаргафф ережесі & ДНҚ параметрлері</span>
        </button>
      </div>

      {/* 1. PUNNETT SQUARE CALCULATOR */}
      {activeCalc === 'punnett' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Шағылыстыру параметрлері</h3>
              <p className="text-xs text-slate-400 mt-1">
                Моногибридті (1 жұп белгі) немесе Дигибридті (2 жұп белгі) таңдап, ата-аналардың генотипін көрсетіңіз.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCrossType('monohybrid');
                  setParent1('Aa');
                  setParent2('Aa');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  crossType === 'monohybrid'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                Моногибридті (3:1 / 1:2:1)
              </button>
              <button
                onClick={() => {
                  setCrossType('dihybrid');
                  setParent1('AaBb');
                  setParent2('AaBb');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  crossType === 'dihybrid'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                Дигибридті (9:3:3:1)
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  1-Ата-ана генотипі (♀):
                </label>
                <input
                  type="text"
                  value={parent1}
                  onChange={(e) => setParent1(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                  placeholder={crossType === 'monohybrid' ? 'Aa' : 'AaBb'}
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  2-Ата-ана генотипі (♂):
                </label>
                <input
                  type="text"
                  value={parent2}
                  onChange={(e) => setParent2(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                  placeholder={crossType === 'monohybrid' ? 'Aa' : 'AaBb'}
                />
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase mb-2">
                Дайын олимпиадалық үлгілер:
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {crossType === 'monohybrid' ? (
                  <>
                    <button
                      onClick={() => {
                        setParent1('Aa');
                        setParent2('Aa');
                      }}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300"
                    >
                      Aa × Aa (Гетерозиготалы 3:1)
                    </button>
                    <button
                      onClick={() => {
                        setParent1('Aa');
                        setParent2('aa');
                      }}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300"
                    >
                      Aa × aa (Талдаушы 1:1)
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setParent1('AaBb');
                        setParent2('AaBb');
                      }}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300"
                    >
                      AaBb × AaBb (Классикалық 9:3:3:1)
                    </button>
                    <button
                      onClick={() => {
                        setParent1('AaBb');
                        setParent2('aabb');
                      }}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300"
                    >
                      AaBb × aabb (Дигибридті талдаушы 1:1:1:1)
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Punnett Square Visualization */}
          <div className="lg:col-span-7 bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <div className="text-xs font-mono text-emerald-400">
                P: {parent1} × {parent2}
              </div>
              <h3 className="text-base font-bold text-white">Пеннет торының нәтижесі</h3>
            </div>

            {/* Grid Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 p-2 bg-slate-950">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 border border-slate-800 bg-slate-900 text-xs font-mono text-slate-500">
                      ♀ \ ♂
                    </th>
                    {punnettResult.gametes2.map((g2, idx) => (
                      <th
                        key={idx}
                        className="p-2 border border-slate-800 bg-slate-900 text-xs font-mono font-bold text-sky-400"
                      >
                        {g2}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {punnettResult.matrix.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="p-2 border border-slate-800 bg-slate-900 text-xs font-mono font-bold text-emerald-400">
                        {punnettResult.gametes1[rIdx]}
                      </td>
                      {row.map((genotype, cIdx) => (
                        <td
                          key={cIdx}
                          className="p-3 border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 transition-colors text-xs font-mono font-semibold text-white"
                        >
                          {genotype}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Genotypic Breakdown */}
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase font-mono">
                Генотиптік ажырау қатынасы:
              </div>
              <div className="flex flex-wrap gap-3">
                {Object.entries(punnettResult.counts).map(([gen, count]) => {
                  const pct = ((count / punnettResult.total) * 100).toFixed(1);
                  return (
                    <div
                      key={gen}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/60 text-xs font-mono"
                    >
                      <span className="font-bold text-emerald-400">{gen}:</span>{' '}
                      <span className="text-white">{count}/{punnettResult.total}</span>{' '}
                      <span className="text-slate-400 text-[11px]">({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DNA & CODON TRANSLATION */}
      {activeCalc === 'dna' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">ДНҚ тізбегін енгізу</h3>
              <p className="text-xs text-slate-400 mt-1">
                Матрицалық ДНҚ тізбегін енгізіңіз (мысалы, TAC старт триплетінен басталатын). 
                Жүйе комплементарлы иРНҚ-ны және аминқышқылдар ретін автоматты түрде синтездейді.
              </p>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                ДНҚ матрицалық тізбегі (3' → 5'):
              </label>
              <textarea
                rows={3}
                value={dnaInput}
                onChange={(e) => setDnaInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs font-mono text-emerald-300 uppercase tracking-widest focus:outline-none focus:border-emerald-500"
                placeholder="TACGGCCTTAATACT"
              />
            </div>

            {/* Example presets */}
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase mb-2">
                Мысалдар:
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => setDnaInput('TACGGCCTTAATACT')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300"
                >
                  Стандартты полипептид (Met-Pro-Glu-Leu-Stop)
                </button>
                <button
                  onClick={() => setDnaInput('TACAAACGATTTATT')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300"
                >
                  Гистидин/Лизин тізбегі
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <div className="text-slate-400">Нуклеотидтер саны:</div>
                <div className="text-base font-bold text-white">{cleanDna.length}</div>
              </div>
              <div>
                <div className="text-slate-400">GC-үлесі:</div>
                <div className="text-base font-bold text-sky-400">{gcPercentage}%</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <div className="text-xs font-mono text-emerald-400">
                Орталық догма: ДНҚ → иРНҚ → Нәруыз
              </div>
              <h3 className="text-base font-bold text-white">Трансляция нәтижесі</h3>
            </div>

            {/* mRNA output */}
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase font-mono">
                Транскрипцияланған иРНҚ (5' → 3'):
              </div>
              <div className="font-mono text-xs text-sky-300 tracking-widest break-all">
                {mrna || '—'}
              </div>
            </div>

            {/* Polypeptide Amino Acid Sequence */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase font-mono">
                Синтезделген аминқышқылдар (Полипептид):
              </div>
              <div className="flex flex-wrap gap-2">
                {translatedAAs.length === 0 ? (
                  <div className="text-xs text-slate-500">ДНҚ тізбегін енгізіңіз...</div>
                ) : (
                  translatedAAs.map((res, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs font-mono ${
                        res.aa === 'Met'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : res.aa === 'STOP'
                          ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                          : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400">{triplets[idx]}</div>
                      <div className="font-bold text-sm">{res.aa}</div>
                      <div className="text-[10px] opacity-75">{res.name}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CHARGAFF RULES & DNA GEOMETRY */}
      {activeCalc === 'chargaff' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">ДНҚ есебінің бастапқы мәндері</h3>
              <p className="text-xs text-slate-400 mt-1">
                Чаргафф ережесі (A=T, G=C) және Уотсон-Крик ДНҚ қос спиралінің геометриялық параметрлері.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  ДНҚ фрагментіндегі нуклеотидтердің жалпы саны:
                </label>
                <input
                  type="number"
                  min={10}
                  step={10}
                  value={totalBp}
                  onChange={(e) => setTotalBp(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Аденин (А) саны:
                </label>
                <input
                  type="number"
                  min={0}
                  max={totalBp / 2}
                  value={adenineCount}
                  onChange={(e) => setAdenineCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="font-semibold text-emerald-400">Қолданылған заңдылықтар:</div>
              <div>• Аденин (A) = Тимин (T) (2 сутектік байланыс)</div>
              <div>• Гуанин (G) = Цитозин (C) (3 сутектік байланыс)</div>
              <div>• 1 нуклеотид жұбы арасы = 0.34 нм (B-форма)</div>
              <div>• 1 толық оралым = 10 жұп = 3.4 нм</div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <div className="text-xs font-mono text-emerald-400">Чаргафф есебінің шығарылуы</div>
              <h3 className="text-base font-bold text-white">ДНҚ молекуласының сипаттамалары</h3>
            </div>

            {/* Nucleotide Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-mono">Аденин (А)</div>
                <div className="text-lg font-bold text-emerald-400 font-mono">{safeAdenine}</div>
                <div className="text-[11px] text-slate-500 font-mono">{aPct}%</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-mono">Тимин (Т)</div>
                <div className="text-lg font-bold text-emerald-400 font-mono">{thymine}</div>
                <div className="text-[11px] text-slate-500 font-mono">{tPct}%</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-mono">Гуанин (G)</div>
                <div className="text-lg font-bold text-sky-400 font-mono">{guanine}</div>
                <div className="text-[11px] text-slate-500 font-mono">{gPct}%</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-mono">Цитозин (C)</div>
                <div className="text-lg font-bold text-sky-400 font-mono">{cytosine}</div>
                <div className="text-[11px] text-slate-500 font-mono">{cPct}%</div>
              </div>
            </div>

            {/* Geometry and Energy Metrics */}
            <div className="space-y-3 pt-2">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Сутектік байланыстардың жалпы саны:</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    ({safeAdenine} × 2) + ({guanine} × 3)
                  </div>
                </div>
                <div className="text-xl font-bold font-mono text-purple-400">
                  {hydrogenBonds} байланыс
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">ДНҚ молекуласының ұзындығы:</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {validTotal} жұп × 0.34 нм
                  </div>
                </div>
                <div className="text-xl font-bold font-mono text-amber-400">
                  {dnaLengthNm} нм
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Толық оралымдар саны (спираль қадамы):</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {validTotal} жұп / 10 жұп
                  </div>
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {helicalTurns} оралым
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
