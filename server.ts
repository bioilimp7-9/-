import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Biology Olympiad AI Tutor & Problem Explainer
app.post('/api/gemini/tutor', async (req, res) => {
  try {
    const { prompt, grade = '8', topic = 'Жалпы биология', context = '' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Сұрақ мәтіні қажет (prompt is required).' });
    }

    if (!ai) {
      // High quality educational fallback if API key is not yet set
      return res.json({
        answer: `[Ғылыми олимпиадалық анықтамалық жауап]\n\nСұрақ: ${prompt}\n\nКэмпбелл биологиясы (Campbell Biology) және халықаралық биология олимпиадасы (IBO) бойынша бұл мәселе 7-9 сынып стандартында қарастырылады:\n\n1. Негізгі ғылыми тұжырым: Биологиялық жүйелерде құрылым әрқашан қызметпен тығыз байланысты (Form follows function). Мысалы, мембрананың сұйық-мозаикалық моделі немесе ДНҚ антипараллель қос спиралі.\n2. Тәжірибелік дәлелдеме: Олимпиадалық есептерде тәуелді және тәуелсіз айнымалыларды, сондай-ақ бақылау тобын (control group) айқын ажырату қажет.\n\n(Толық генерацияланған AI жауаптарын алу үшін жүйеге GEMINI_API_KEY қосылған болуы қажет).`,
        sources: ['Campbell Biology 12th Ed.', 'Республикалық биология олимпиадасы ережелері'],
      });
    }

    const systemInstruction = `Сіз 7-9 сынып оқушыларына арналған биология олимпиадасының бас жаттықтырушысы әрі ғылыми сарапшысысыз (Biology Olympiad Head Coach & Campbell Biology Expert).
Тіліңіз: Қазақ тілі (қажет жерінде латынша ғылыми атаулар мен ағылшынша терминдерді жақшада көрсетіңіз).
Оқушының деңгейі: ${grade}-сынып олимпиадашысы. Тақырыбы: ${topic}.
Мақсат:
- Сұраққа терең, ғылыми дәлелденген, логикалық тұрғыдан нақты әрі олимпиадалық стандартта (Campbell Biology деңгейінде) түсінік беру.
- Тек жай жаттанды анықтама емес, механизмді, себеп-салдар байланысын, биологиялық маңызын және олимпиадада жиі кездесетін «қақпандарды» (common pitfalls) көрсету.
- Формулалар, реакциялар немесе генетикалық схемалар қажет болса, көрнекі етіп жазу.
- Жауап соңында олимпиадаға қатысты 1 практикалық кеңес немесе ойлануға арналған 1 күрделі сұрақ қосыңыз.`;

    const fullPrompt = `${context ? `Контекст: ${context}\n\n` : ''}Оқушының сұрағы: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
      },
    });

    const text = response.text || 'Жауап алынбады.';
    return res.json({ answer: text });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Gemini error:', error);
    return res.status(500).json({
      error: 'AI жауабын өңдеуде қателік орын алды: ' + (error?.message || 'Белгісіз қателік'),
    });
  }
});

// AI Evaluation of Student's Open-Ended Hypothesis or Solution
app.post('/api/gemini/evaluate-solution', async (req, res) => {
  try {
    const { question, studentAnswer, grade = '8' } = req.body;

    if (!question || !studentAnswer) {
      return res.status(400).json({ error: 'Сұрақ пен жауап қажет.' });
    }

    if (!ai) {
      return res.json({
        score: 85,
        feedback: 'Жауабыңыз биологиялық тұрғыдан жақсы құрастырылған. Толық бағалау үшін API кілтін баптаңыз.',
        improvements: ['Терминологияны нақтылау', 'Бақылау тобын көрсету'],
      });
    }

    const systemInstruction = `Сіз биология олимпиадасының қазылар алқасының мүшесісіз (Olympiad Jury Evaluator).
Оқушы олимпиаданың ашық сұрағына немесе есебіне жауап берді.
Оқушының жауабын 100 балдық жүйемен бағалап, JSON форматында қайтарыңыз:
{
  "score": number (0-100),
  "verdict": string ("Өте жақсы" / "Жақсы" / "Толықтыру қажет" / "Қате тұжырымдар бар"),
  "feedback": string (қазақ тіліндегі ғылыми талдау және мақтау/сын),
  "missedKeyPoints": string[] (оқушы ұмытып кеткен немесе атамаған маңызды ғылыми кілт сөздер мен дәлелдер),
  "correctModelAnswer": string (олимпиадалық үлгілі толық академиялық жауап)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Сұрақ: ${question}\nОқушының жауабы: ${studentAnswer}\nСынып: ${grade}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Evaluation error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
