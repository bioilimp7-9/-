import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types/olympiad';
import { INITIAL_LEADERBOARD_ENTRIES } from '../data/olympiadData';
import {
  Trophy,
  Medal,
  Flame,
  Search,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LeaderboardProps {
  onStartQuiz: () => void;
  quizScore?: number;
  totalQuestions?: number;
}

const STORAGE_KEY = 'bioolymp_leaderboard_custom_entries';
const USER_PROFILE_KEY = 'bioolymp_user_profile';

export const Leaderboard: React.FC<LeaderboardProps> = ({
  onStartQuiz,
  quizScore = 0,
  totalQuestions = 0,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_LEADERBOARD_ENTRIES;
  });

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    school: string;
    city: string;
    grade: '7' | '8' | '9';
    favoriteTopic: string;
    streakDays: number;
    score: number;
    accuracy: number;
  }>(() => {
    try {
      const saved = localStorage.getItem(USER_PROFILE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      name: 'Сіз (Оқушы)',
      school: '№1 Мектеп-лицей',
      city: 'Астана',
      grade: '8',
      favoriteTopic: 'Цитология және биохимия',
      streakDays: 4,
      score: 750,
      accuracy: 88.0,
    };
  });

  const [selectedGrade, setSelectedGrade] = useState<'all' | '7' | '8' | '9'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'accuracy' | 'streak'>('score');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState(currentUser.name);
  const [formSchool, setFormSchool] = useState(currentUser.school);
  const [formCity, setFormCity] = useState(currentUser.city);
  const [formGrade, setFormGrade] = useState<'7' | '8' | '9'>(currentUser.grade);
  const [formTopic, setFormTopic] = useState(currentUser.favoriteTopic);

  // Sync with quiz score if available and greater
  useEffect(() => {
    if (totalQuestions > 0 && quizScore > 0) {
      const calculatedBonus = quizScore * 25; // 25 points per correct olympiad question
      const accuracyPct = Math.round((quizScore / totalQuestions) * 100);

      setCurrentUser((prev) => {
        const updatedScore = Math.max(prev.score, 600 + calculatedBonus);
        const updated = {
          ...prev,
          score: updatedScore,
          accuracy: Math.max(prev.accuracy, accuracyPct),
        };
        try {
          localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
        } catch {
          // ignore storage error
        }
        return updated;
      });
    }
  }, [quizScore, totalQuestions]);

  // Combine currentUser entry with other entries
  const allEntries: LeaderboardEntry[] = [
    ...entries.filter((e) => e.id !== 'user-entry'),
    {
      id: 'user-entry',
      name: currentUser.name,
      school: currentUser.school,
      city: currentUser.city,
      grade: currentUser.grade,
      totalScore: currentUser.score,
      accuracy: currentUser.accuracy,
      modulesCompleted: currentUser.score >= 900 ? 6 : currentUser.score >= 800 ? 5 : 4,
      favoriteTopic: currentUser.favoriteTopic,
      rankBadge:
        currentUser.score >= 920
          ? 'Республикалық Алтын үміткері'
          : currentUser.score >= 850
          ? 'Облыстық I дәрежелі жүлдегер'
          : currentUser.score >= 750
          ? 'Аудандық олимпиадашы'
          : 'Үміткер олимпиадашы',
      streakDays: currentUser.streakDays,
      lastActive: 'Қазір белсенді',
      isCurrentUser: true,
    },
  ];

  // Filter & Sort
  const filteredEntries = allEntries
    .filter((entry) => {
      const matchGrade = selectedGrade === 'all' || entry.grade === selectedGrade;
      const matchSearch =
        searchQuery === '' ||
        entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.favoriteTopic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGrade && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.totalScore - a.totalScore;
      if (sortBy === 'accuracy') return b.accuracy - a.accuracy;
      if (sortBy === 'streak') return b.streakDays - a.streakDays;
      return 0;
    });

  // Top 3 Podium
  const top1 = filteredEntries[0];
  const top2 = filteredEntries[1];
  const top3 = filteredEntries[2];

  // User rank in filtered list
  const userRank = filteredEntries.findIndex((e) => e.isCurrentUser) + 1;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name: formName.trim() || 'Оқушы',
      school: formSchool.trim() || 'Мектеп',
      city: formCity.trim() || 'Қала',
      grade: formGrade,
      favoriteTopic: formTopic.trim() || 'Цитология',
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setIsEditProfileOpen(false);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  const handlePracticeRoundBonus = () => {
    setCurrentUser((prev) => {
      const updated = {
        ...prev,
        score: prev.score + 50,
        streakDays: prev.streakDays + 1,
      };
      try {
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <section className="py-10 px-6 max-w-7xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span>ОЛИМПИАДАЛЫҚ РЕЙТИНГ ЖӘНЕ ПРОГРЕСС</span>
            <span aria-hidden="true">·</span>
            <span>7-9 СЫНЫПТАР СТАНДАРТЫ</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">РЕСПУБЛИКАЛЫҚ БАЗА</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Олимпиадашылар рейтингі (Leaderboard)
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
            Тест тапсырмаларын орындап, есептер шығару арқылы олимпиадалық балл жинаңыз. 
            Өз сыныбыңыз бен республика бойынша прогресіңізді бақылап, бәсекелестікте біліміңізді шыңдаңыз.
          </p>
        </div>

        {/* Profile Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsEditProfileOpen(!isEditProfileOpen)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Профильді өңдеу</span>
          </button>
          <button
            onClick={onStartQuiz}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ұпай жинау (Тест тапсыру)</span>
          </button>
        </div>
      </div>

      {/* User Progress Banner */}
      <div className="p-6 bg-slate-900 border border-emerald-500/30 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="font-bold">{currentUser.grade}-сынып олимпиадашысы</span>
              <span aria-hidden="true">·</span>
              <span>{currentUser.school}, {currentUser.city}</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <span>{currentUser.name}</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-sans">
                {currentUser.score >= 920
                  ? 'Алтын үміткері'
                  : currentUser.score >= 850
                  ? 'Күміс үміткері'
                  : 'Аудандық олимпиадашы'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Сүйікті бағыты: <strong className="text-slate-300">{currentUser.favoriteTopic}</strong>
            </p>
          </div>

          {/* User Score Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-500 uppercase font-mono">Орныңыз</div>
              <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                #{userRank > 0 ? userRank : '—'}
              </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-500 uppercase font-mono">Жалпы ұпай</div>
              <div className="text-lg font-bold font-mono text-white tabular-nums">
                {currentUser.score}
              </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-500 uppercase font-mono">Дәлдік</div>
              <div className="text-lg font-bold font-mono text-sky-400 tabular-nums">
                {currentUser.accuracy}%
              </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-500 uppercase font-mono">Стрик күні</div>
              <div className="text-lg font-bold font-mono text-amber-400 tabular-nums flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{currentUser.streakDays}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Bonus Practice Action */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="text-slate-400">
            Күн сайын биологиялық теорияны қайталап, тесттер шешу арқылы рейтингіңізді жоғарылатыңыз.
          </div>
          <button
            onClick={handlePracticeRoundBonus}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white rounded-lg transition-colors border border-slate-700/60"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Күнделікті белсенділікті белгілеу (+50 ұпай)</span>
          </button>
        </div>
      </div>

      {/* Profile Edit Inline Drawer */}
      {isEditProfileOpen && (
        <form
          onSubmit={handleSaveProfile}
          className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Олимпиадашының профиль ақпаратын жаңарту</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Жабу
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-mono">Оқушының аты-жөні:</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Мысалы: Ерлан Әділбек"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-mono">Мектебі:</label>
              <input
                type="text"
                value={formSchool}
                onChange={(e) => setFormSchool(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Мысалы: РФМШ / БИЛ / НЗМ"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-mono">Қала / Өңір:</label>
              <input
                type="text"
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Мысалы: Алматы"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-mono">Сынып:</label>
              <select
                value={formGrade}
                onChange={(e) => setFormGrade(e.target.value as '7' | '8' | '9')}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="7">7-сынып</option>
                <option value="8">8-сынып</option>
                <option value="9">9-сынып</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-400">
              Деректер браузердің жадында (localStorage) сақталады.
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
            >
              Сақтау және Рейтингті жаңарту
            </button>
          </div>
        </form>
      )}

      {/* Top-3 Podium Showcase */}
      <div>
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4">
          Үздік көшбасшылар трибунасы (Top Contenders)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* #2 Silver */}
          {top2 && (
            <div className="p-6 bg-slate-900/60 border border-slate-700/60 rounded-2xl flex flex-col justify-between space-y-4 relative">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-mono font-bold text-sm">
                  #2
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                  <Medal className="w-4 h-4 text-slate-300" />
                  <span>Күміс орын</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{top2.name}</span>
                  {top2.isCurrentUser && (
                    <span className="text-xs text-emerald-400 font-mono">(Сіз)</span>
                  )}
                </h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  {top2.school} · {top2.city} · {top2.grade}-сынып
                </div>
                <div className="mt-3 text-xs text-slate-300">
                  {top2.favoriteTopic}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Дәлдік: {top2.accuracy}%</span>
                <span className="text-base font-bold text-white tabular-nums">
                  {top2.totalScore} балл
                </span>
              </div>
            </div>
          )}

          {/* #1 Gold - Highlighted Center */}
          {top1 && (
            <div className="p-6 bg-slate-900 border border-amber-500/50 rounded-2xl flex flex-col justify-between space-y-4 relative shadow-lg shadow-amber-950/20 md:-translate-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-base">
                  #1
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-bold">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Алтын жеңімпаз</span>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>{top1.name}</span>
                  {top1.isCurrentUser && (
                    <span className="text-xs text-emerald-400 font-mono">(Сіз)</span>
                  )}
                </h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  {top1.school} · {top1.city} · {top1.grade}-сынып
                </div>
                <div className="mt-3 text-xs text-amber-200/90 font-medium">
                  {top1.favoriteTopic}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Дәлдік: {top1.accuracy}%</span>
                <span className="text-xl font-black text-amber-400 tabular-nums">
                  {top1.totalScore} балл
                </span>
              </div>
            </div>
          )}

          {/* #3 Bronze */}
          {top3 && (
            <div className="p-6 bg-slate-900/60 border border-amber-800/40 rounded-2xl flex flex-col justify-between space-y-4 relative">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-950/60 text-amber-600 flex items-center justify-center font-mono font-bold text-sm">
                  #3
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-600">
                  <Medal className="w-4 h-4 text-amber-600" />
                  <span>Қола орын</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{top3.name}</span>
                  {top3.isCurrentUser && (
                    <span className="text-xs text-emerald-400 font-mono">(Сіз)</span>
                  )}
                </h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  {top3.school} · {top3.city} · {top3.grade}-сынып
                </div>
                <div className="mt-3 text-xs text-slate-300">
                  {top3.favoriteTopic}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Дәлдік: {top3.accuracy}%</span>
                <span className="text-base font-bold text-white tabular-nums">
                  {top3.totalScore} балл
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar for Tabular View */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pt-6 border-t border-slate-800">
        {/* Grade Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {(['all', '7', '8', '9'] as const).map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedGrade === grade
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white bg-slate-800/60'
              }`}
            >
              {grade === 'all' ? 'Барлық сыныптар' : `${grade}-сынып рейтингі`}
            </button>
          ))}
        </div>

        {/* Sort and Search */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs bg-slate-800/60 rounded-lg p-1 border border-slate-700/60">
            <button
              onClick={() => setSortBy('score')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sortBy === 'score' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400'
              }`}
            >
              Ұпай
            </button>
            <button
              onClick={() => setSortBy('accuracy')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sortBy === 'accuracy' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400'
              }`}
            >
              Дәлдік
            </button>
            <button
              onClick={() => setSortBy('streak')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sortBy === 'streak' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400'
              }`}
            >
              Стрик
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Оқушыны немесе қаланы іздеу..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase font-mono border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 w-16 text-center">Орын</th>
              <th className="py-3.5 px-4">Оқушы & Мектеп</th>
              <th className="py-3.5 px-4">Сынып</th>
              <th className="py-3.5 px-4">Сүйікті бағыты</th>
              <th className="py-3.5 px-4 text-center">Модульдер</th>
              <th className="py-3.5 px-4 text-right">Дәлдік</th>
              <th className="py-3.5 px-4 text-center">Стрик</th>
              <th className="py-3.5 px-4 text-right">Ұпай</th>
              <th className="py-3.5 px-4">Олимпиадалық дәрежесі</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredEntries.map((entry, index) => {
              const rank = index + 1;
              const isUser = entry.isCurrentUser;

              return (
                <tr
                  key={entry.id}
                  className={`transition-colors ${
                    isUser
                      ? 'bg-emerald-950/30 hover:bg-emerald-950/40 border-l-2 border-emerald-400'
                      : rank <= 3
                      ? 'bg-slate-900/30 hover:bg-slate-800/40'
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 text-center font-mono font-bold tabular-nums">
                    {rank === 1 ? (
                      <span className="text-amber-400">#1</span>
                    ) : rank === 2 ? (
                      <span className="text-slate-300">#2</span>
                    ) : rank === 3 ? (
                      <span className="text-amber-600">#3</span>
                    ) : (
                      <span className="text-slate-500">#{rank}</span>
                    )}
                  </td>

                  {/* Name & School */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>{entry.name}</span>
                      {isUser && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                          Сіз
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {entry.school} · {entry.city}
                    </div>
                  </td>

                  {/* Grade */}
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {entry.grade}-сынып
                  </td>

                  {/* Favorite Topic */}
                  <td className="py-3.5 px-4 text-slate-300">
                    {entry.favoriteTopic}
                  </td>

                  {/* Modules Completed */}
                  <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-400">
                    <span className="text-white font-semibold">{entry.modulesCompleted}</span> / 6
                  </td>

                  {/* Accuracy */}
                  <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-sky-400">
                    {entry.accuracy}%
                  </td>

                  {/* Streak */}
                  <td className="py-3.5 px-4 text-center font-mono tabular-nums text-amber-400">
                    <span className="inline-flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{entry.streakDays} күн</span>
                    </span>
                  </td>

                  {/* Total Score */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-sm tabular-nums text-white">
                    {entry.totalScore}
                  </td>

                  {/* Badge */}
                  <td className="py-3.5 px-4 text-xs text-slate-300">
                    <span
                      className={`inline-block text-[11px] font-medium ${
                        entry.totalScore >= 920
                          ? 'text-amber-300'
                          : entry.totalScore >= 850
                          ? 'text-sky-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {entry.rankBadge}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Olympiad Tier System Explainer */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80">
          <div className="font-bold text-amber-400 font-mono mb-1">
            900+ Ұпай: Республикалық кезең
          </div>
          <p className="text-slate-400 leading-relaxed">
            Кэмпбелл стандартының молекулалық деңгейіндегі есептерді толық меңгерген, IBO халықаралық олимпиадасына үміткерлер тобы.
          </p>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80">
          <div className="font-bold text-sky-400 font-mono mb-1">
            800–899 Ұпай: Облыстық кезең
          </div>
          <p className="text-slate-400 leading-relaxed">
            Анатомия, цитологиялық құрылымдар және Мендельдің дигибридті будандастыруын жақсы түсінген жүлдегерлер тобы.
          </p>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80">
          <div className="font-bold text-emerald-400 font-mono mb-1">
            700–799 Ұпай: Аудандық кезең
          </div>
          <p className="text-slate-400 leading-relaxed">
            Мектептік және аудандық олимпиаданың базалық тесттері мен өсімдік/жануарлар систематикасын белсенді меңгерушілер.
          </p>
        </div>
      </div>
    </section>
  );
};
