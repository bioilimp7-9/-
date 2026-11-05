import React from 'react';
import { X, Printer, BookOpen, Check } from 'lucide-react';
import { THEORY_TOPICS } from '../data/olympiadData';

interface PrintStudyGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintStudyGuide: React.FC<PrintStudyGuideProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        {/* Modal Toolbar (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 print:hidden">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Олимпиадалық шпаргалка мен дайындық жадынамасы (Study Guide)
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Басып шығару (Print / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-8 overflow-y-auto space-y-8 bg-white text-slate-900 print:p-0 print:m-0 print:text-black">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
              БиоОлимп 7-9: Олимпиадалық биология жадынамасы
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Кэмпбелл биологиясы стандарты бойынша аудандық, облыстық және республикалық олимпиадаға дайындық құралы
            </p>
          </div>

          {/* Core Formulas Section */}
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-300 pb-1 mb-3">
              1. Негізгі олимпиадалық формулалар мен ережелер
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-bold text-slate-900">Чаргафф заңы және ДНҚ байланыстары:</div>
                <div className="font-mono text-slate-700 mt-1">A = T (2 сутектік байланыс)</div>
                <div className="font-mono text-slate-700">G = C (3 сутектік байланыс)</div>
                <div className="text-slate-600 text-[11px] mt-1">
                  1 жұп арақашықтығы = 0.34 нм; 1 оралым = 10 жұп = 3.4 нм.
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-bold text-slate-900">Кроссинговер жиілігі (Морган):</div>
                <div className="font-mono text-slate-700 mt-1">
                  RF = (Рекомбинанттар саны / Жалпы ұрпақ саны) × 100%
                </div>
                <div className="text-slate-600 text-[11px] mt-1">
                  1% рекомбинация = 1 сантиморган (1 cM / 1 морганида).
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-bold text-slate-900">Гүлдегі қосарлы ұрықтану плоидтылығы:</div>
                <div className="text-slate-700 mt-1">
                  • Зигота / Ұрық: спермий (n) + жұмыртқа жасушасы (n) = <strong>2n</strong>
                </div>
                <div className="text-slate-700">
                  • Эндосперм: спермий (n) + орталық жасуша (2n) = <strong>3n</strong>
                </div>
                <div className="text-slate-700">• Тұқым қабығы мен перисперм: <strong>2n</strong></div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-bold text-slate-900">Мендель заңдарының ажырау қатынастары:</div>
                <div className="text-slate-700 mt-1">• Моногибридті фенотип: 3 : 1; Генотип: 1 : 2 : 1</div>
                <div className="text-slate-700">• Дигибридті фенотип: 9 : 3 : 3 : 1</div>
                <div className="text-slate-700">• Талдаушы шағылыстыру (дигибридті): 1 : 1 : 1 : 1</div>
              </div>
            </div>
          </div>

          {/* Organelles Quick Cheat Table */}
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-300 pb-1 mb-3">
              2. Органеллалардың құрылысы мен олимпиадалық маркерлері
            </h2>
            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead className="bg-slate-100 font-bold">
                <tr>
                  <th className="p-2 border border-slate-300">Органелла</th>
                  <th className="p-2 border border-slate-300">Мембранасы</th>
                  <th className="p-2 border border-slate-300">Негізгі қызметі</th>
                  <th className="p-2 border border-slate-300">Олимпиадалық ерекшелігі</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 font-semibold border border-slate-300">Рибосома (80S / 70S)</td>
                  <td className="p-2 border border-slate-300">Мембранасыз</td>
                  <td className="p-2 border border-slate-300">Трансляция (нәруыз синтезі)</td>
                  <td className="p-2 border border-slate-300">рРНҚ мен нәруыздардан тұрады</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold border border-slate-300">Митохондрия</td>
                  <td className="p-2 border border-slate-300">Қос мембрана</td>
                  <td className="p-2 border border-slate-300">Кребс циклі, АТФ синтезі</td>
                  <td className="p-2 border border-slate-300">Симбиогенез: сақиналы ДНҚ, 70S рибосома</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold border border-slate-300">Хлоропласт</td>
                  <td className="p-2 border border-slate-300">Қос мембрана</td>
                  <td className="p-2 border border-slate-300">Фотосинтез (жарық/қараңғы)</td>
                  <td className="p-2 border border-slate-300">Тилакоидта АТФ/НАДФН, стромада глюкоза</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold border border-slate-300">Гольджи аппараты</td>
                  <td className="p-2 border border-slate-300">Бір мембрана</td>
                  <td className="p-2 border border-slate-300">Гликозилдену, сұрыптау</td>
                  <td className="p-2 border border-slate-300">Лизосомаларға маннозо-6-фосфат белгісін іледі</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold border border-slate-300">Лизосома</td>
                  <td className="p-2 border border-slate-300">Бір мембрана</td>
                  <td className="p-2 border border-slate-300">Қышқыл гидролиз (рН ~4.5)</td>
                  <td className="p-2 border border-slate-300">Аутофагия және жасушаішілік қорыту</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Scientific Methodology Checklist */}
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-300 pb-1 mb-3">
              3. Ғылыми экспериментті бағалау қағидалары
            </h2>
            <div className="space-y-2 text-xs text-slate-800">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Тәуелсіз айнымалы (Independent variable):</strong> Зерттеушінің өзі әдейі өзгертетін факторы (мысалы, температура немесе ингибитор мөлшері). Графиктің X осі.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Тәуелді айнымалы (Dependent variable):</strong> Өлшенетін биологиялық жауап (фермент жылдамдығы, бактерия өсуі). Графиктің Y осі.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Бақылау тобы (Control group):</strong> Тәжірибенің тазалығын қамтамасыз ету үшін қажет. Теріс бақылауда фактор болмайды, оң бақылауда стандартты нәтиже алынатыны алдын-ала белгілі болады.
                </span>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-500 pt-4 border-t border-slate-200">
            «БиоОлимп 7-9» оқу құралы · Campbell Biology 12th Edition стандарты бойынша жасалған.
          </div>
        </div>
      </div>
    </div>
  );
};
