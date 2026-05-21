import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, ArrowRight, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';

const TOPICS = [
  { id: 'tricky', name: 'أسئلة تريكي خداعية (Tricky)', icon: '🧠', description: 'الخدع الشائعة في الامتحانات مثل أفعال القول المضارعة وترتيب السؤال المنقول' },
  { id: 'all', name: 'شامل لكل القواعد (All Rules)', icon: '🌟', description: 'تدرب على كافة أنماط الكلام المنقول (Reported Speech) المتنوعة' },
  { id: 'statements', name: 'جمل خبرية (Statements)', icon: '💬', description: 'عبارات خبرية وتغيير الأزمنة والضمائر خطوة للوراء' },
  { id: 'questions', name: 'أسئلة (Questions)', icon: '❓', description: 'تحويل أسئلة Wh- و Yes/No وضبط الترتيب الخبري' },
  { id: 'requests', name: 'طلبات (Requests)', icon: '🙏', description: 'تحويل الأوامر والطلبات المهذبة باستخدام to و not to' }
];

// Completely offline pre-loaded database for grade 10 students
const LOCAL_QUESTIONS_DATABASE: Record<string, QuizQuestion[]> = {
  tricky: [
    {
      direct: '"Pollution causes dangerous diseases." (The doctor comments)',
      options: [
        "The doctor comments that pollution caused dangerous diseases.",
        "The doctor comments that pollution causes dangerous diseases.",
        "The doctor comment that pollution had caused dangerous diseases.",
        "The doctor commented that pollution causes dangerous diseases."
      ],
      correctIndex: 1,
      explanation: "فعل القول المكتوب هو (comments) في زمن المضارع البسيط. تذكر القاعدة الذهبية: إذا كان فعل القول مضارعاً (says, comments, tells)، لا يتغير زمن الفعل المكتوب داخل علامتي الاقتباس على الإطلاق! لذلك يبقى الفعل (causes) مضارعاً كما هو."
    },
    {
      direct: '"Why are you so late?" (Peter asks John)',
      options: [
        "Peter asks John why was he late.",
        "Peter asks John why he was late.",
        "Peter asks John why he is so late.",
        "Peter asks John why is he so late."
      ],
      correctIndex: 2,
      explanation: "فعل القول مضارع (asks)، لذلك لا نغير زمن الأفعال. الضمير (you) يتحول إلى (he) ليعود على جون المذكر الغائب، وفي السؤال المنقول يتحول الترتيب لخبري، فيتقدم الفاعل على الفعل المساعد: الفاعل (he) أولاً متبوعاً بـ (is) ليكون الترتيب (he is)."
    },
    {
      direct: '"The teacher ... us that they could finish on time."',
      options: [
        "said",
        "told",
        "says to",
        "told to"
      ],
      correctIndex: 1,
      explanation: "يوجد في الجملة مفعول به مباشر وهو الضمير (us). الفعل الوحيد من بين الخيارات الذي يتطلب مفعولاً به مباشرة بعده بدون حرف جر هو الفعل (told). بينما الفعل (said) يحتاج إلى حرف الجر to ليليه مفعول."
    },
    {
      direct: 'Peter says to John: "Why ... so late?"',
      options: [
        "are you",
        "you are",
        "you were",
        "were you"
      ],
      correctIndex: 0,
      explanation: "انتبه بشدة! هنا الجملة وضعت داخل علامتي اقتباس مزدوجتين \"...\"، وهذا يعني أن الكلام لا يزال كلاماً مباشراً (Direct Speech) ولم يتم تفريغه أو نقله بعد. في السؤال المباشر نبقي دائماً على صيغة السؤال التقليدية (are you)."
    },
    {
      direct: '"I have already finished revising." (She replied)',
      options: [
        "She replied that she has already finished revising.",
        "She replied that she had already finished revising.",
        "She replied that she already finished revising.",
        "She replied that she finishes revising."
      ],
      correctIndex: 1,
      explanation: "فعل القول في الماضي (replied). حسب قواعد التحويل التراجعي للأزمنة، يتم تحويل المضارع التام (have finished) خطوة للماضي ليصبح ماضي تام (had finished)."
    }
  ],
  statements: [
    {
      direct: '"I don\'t believe in ghosts." (Ali said)',
      options: [
        "Ali said that he didn't believe in ghosts.",
        "Ali said that I didn't believe in ghosts.",
        "Ali said that he doesn't believe in ghosts.",
        "Ali said that he hadn't believed in ghosts."
      ],
      correctIndex: 0,
      explanation: "يتحول الضمير (I) إلى (he) ليعود على علي الغائب، ونرجع الفعل المضارع البسيط المنفي (don't believe) خطوة للماضي ليصبح ماضياً بسيطاً منفياً (didn't believe)."
    },
    {
      direct: '"We visited London last year." (They said)',
      options: [
        "They said that they visited London the next year.",
        "They said that they had visited London the year before.",
        "They said that we had visited London the year before.",
        "They said that they had visited London last year."
      ],
      correctIndex: 1,
      explanation: "فعل القول ماضٍ (said). الفعل الأساسي للجملة في الماضي البسيط (visited) يتحول تراجعياً للماضي التام (had visited) والكلمة الدالة (last year) تتحول إلى (the year before)."
    },
    {
      direct: '"My mother will cook dinner tomorrow." (Mona said)',
      options: [
        "Mona said that her mother will cook dinner tomorrow.",
        "Mona said that her mother would cook dinner tomorrow.",
        "Mona said that her mother would cook dinner the following day.",
        "Mona said that my mother would cook dinner tomorrow."
      ],
      correctIndex: 2,
      explanation: "ضمير الملكية (my mother) يصبح (her mother) عائداً على منى. والأفعال الناقصة مثل (will) ترجع للماضي (would). وتحول الكلمة الدالة (tomorrow) إلى (the following day)."
    },
    {
      direct: '"She is reading a new novel now." (He explained)',
      options: [
        "He explained that she was reading a new novel then.",
        "He explained that she is reading a new novel at that time.",
        "He explained that she has read a new novel then.",
        "He explained that she was reading a new novel now."
      ],
      correctIndex: 0,
      explanation: "المضارع المستمر (is reading) يُرجع خطوة للماضي المستمر (was reading) لأن فعل القول (explained) بالماضي. وتتحول الكلمة الدالة (now) إلى (then)."
    },
    {
      direct: '"I can solve this puzzle easily." (The boy bragged)',
      options: [
        "The boy bragged that he can solve that puzzle easily.",
        "The boy bragged that he could solve this puzzle easily.",
        "The boy bragged that he could solve that puzzle easily.",
        "The boy bragged that he could solved that puzzle easily."
      ],
      correctIndex: 2,
      explanation: "يتحول الضمير (I) إلى (he)، وترجع (can) للماضي (could) متبوعة بالفعل الأصلي مجرداً (solve)، ويتحول اسم الإشارة للقريب (this) للبعيد (that)."
    }
  ],
  questions: [
    {
      direct: '"Do you speak French?" (He asked me)',
      options: [
        "He asked me if did I speak French.",
        "He asked me if I spoke French.",
        "He asked me why I spoke French.",
        "He asked me if I speak French."
      ],
      correctIndex: 1,
      explanation: "سؤال نعم/لا يربط دائماً بـ (if/whether). نقوم بحذف الفعل المساعد (Do) ونحول الفعل الأساسي (speak) مضارع للماضي البسيط (spoke) ليتناسب مع فعل القول الماضي."
    },
    {
      direct: '"Where did you spend your vacation?" (She asked him)',
      options: [
        "She asked him where did he spend his vacation.",
        "She asked him where he spent his vacation.",
        "She asked him where he had spent his vacation.",
        "She asked him where she had spent her vacation."
      ],
      correctIndex: 2,
      explanation: "نربط بنفس أداة الاستفهام (where). وبما أن السؤال بصيغة الماضي البسيط (did + spend)، فإنه يتحول ماضياً تاماً (had spent)، مع تقديم الفاعل ويصبح (he) بدلاً من صيغة الاستفهام."
    },
    {
      direct: '"Are you ready for the exam?" (The teacher asked the students)',
      options: [
        "The teacher asked the students if they are ready for the exam.",
        "The teacher asked the students if they were ready for the exam.",
        "The teacher asked the students if were they ready for the exam.",
        "The teacher asked the students whether they are ready."
      ],
      correctIndex: 1,
      explanation: "نستخدم (if) للربط. مخاطب الجمع (you) يصبح (they) ليعود على الطلاب، وتتحول (are) تراجعياً للماضي لتصبح (were) موضوعة بعد الفاعل."
    },
    {
      direct: '"What time will the train arrive?" (He wondered)',
      options: [
        "He wondered what time the train would arrive.",
        "He wondered what time would the train arrive.",
        "He wondered if the train would arrive at what time.",
        "He wondered what time the train will arrive."
      ],
      correctIndex: 0,
      explanation: "نربط بنفس عبارة الاستفهام (what time). يتحول الترتيب لخبري، فيتقدم الفاعل (the train) على الفعل المساعد الذي يتحول للماضي (would arrive)."
    },
    {
      direct: '"Did you see my keys?" (My brother asked me)',
      options: [
        "My brother asked me if did I see his keys.",
        "My brother asked me if I had seen his keys.",
        "My brother asked me if I saw his keys.",
        "My brother asked me where I had seen his keys."
      ],
      correctIndex: 1,
      explanation: "نربط بـ (if)، ونحول الماضي البسيط (did... see) للماضي التام (had seen) مع تبديل ضمائر الملكية لملائمة السياق (his keys)."
    }
  ],
  requests: [
    {
      direct: '"Please, turn off the lights." (He asked them)',
      options: [
        "He asked them to turn off the lights.",
        "He asked them please to turn off the lights.",
        "He asked them that they turn off the lights.",
        "He asked them to turning off the lights."
      ],
      correctIndex: 0,
      explanation: "في الطلبات المباشرة، نقوم بحذف أداة الملاطفة والرجاء (please) ونربط باستخدام الصيغة المصدرية (to + الفعل مجرداً) لتصبح الجملة (to turn off)."
    },
    {
      direct: '"Don\'t touch this fresh paint!" (The guard warned us)',
      options: [
        "The guard warned us to not touch that fresh paint.",
        "The guard warned us not to touch that fresh paint.",
        "The guard warned us didn't touch that fresh paint.",
        "The guard warned us to touch that fresh paint."
      ],
      correctIndex: 1,
      explanation: "النهي المبدوء بـ (Don't) نقوم بصياغته وتحويله بتبديله بـ (not to) متبوعاً بالمصدر مجرداً (not to touch). وتتحول (this) لاسم الإشارة البعيد (that)."
    },
    {
      direct: '"Could you speak louder, please?" (She asked him)',
      options: [
        "She asked him to speak louder.",
        "She asked him if he could speak louder.",
        "She asked him to speak louder please.",
        "She asked him not to speak louder."
      ],
      correctIndex: 0,
      explanation: "هذا يعبر عن طلب مهذب (Could you... please). عند تحويل صيغ الطلب نربط دائماً بـ (to) والمصدر مباشرة: (to speak louder) مع حذف معالم الطلب الإضافية."
    },
    {
      direct: '"Help me carry these bags." (My grandma asked me)',
      options: [
        "My grandma asked me to help me carry those bags.",
        "My grandma asked me to help her carry those bags.",
        "My grandma asked me to helping her carry those bags.",
        "My grandma asked me that I help her carry those bags."
      ],
      correctIndex: 1,
      explanation: "طلب عادي، نربط بـ (to) والمصدر (to help)، ويتحول مفعول المتكلم (me) ليعود على الجدة فيصبح (her)، وتتحول (these) إلى (those)."
    },
    {
      direct: '"Never walk on the grass!" (The gardener told me)',
      options: [
        "The gardener told me not to walk on the grass.",
        "The gardener told me to never walk on the grass.",
        "The gardener told me to absolute walk on the grass.",
        "The gardener told me if I walk on the grass."
      ],
      correctIndex: 0,
      explanation: "الأوامر المنفية التي تعبر عن نهي تحول وتصاغ بشكل قياسي باستخدام (not to + verb) لتعبر عن النهي عن حدوث الفعل."
    }
  ]
};

export default function PracticeArena() {
  const [topic, setTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const startPractice = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setIsLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    
    // Simulate a ultra-fast premium preparation experience
    setTimeout(() => {
      let selectedQuestions: QuizQuestion[] = [];
      if (selectedTopic === 'all') {
        // Collect from all categories and take a mix of 5
        const allPool = [
          ...LOCAL_QUESTIONS_DATABASE.tricky,
          ...LOCAL_QUESTIONS_DATABASE.statements,
          ...LOCAL_QUESTIONS_DATABASE.questions,
          ...LOCAL_QUESTIONS_DATABASE.requests
        ];
        // Shuffle and pick 5
        const shuffled = [...allPool].sort(() => 0.5 - Math.random());
        selectedQuestions = shuffled.slice(0, 5);
      } else {
        const pool = LOCAL_QUESTIONS_DATABASE[selectedTopic] || [];
        // Shuffle the pool to keep it dynamic and fresh
        selectedQuestions = [...pool].sort(() => 0.5 - Math.random());
      }

      setQuestions(selectedQuestions);
      setIsLoading(false);
    }, 600);
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === currentQuestion.correctIndex) {
      setScore(s => s + 1);
      if (currentIndex === questions.length - 1) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentIndex(prev => prev + 1);
  };

  if (!topic) {
    return (
      <div className="space-y-12 py-12 max-w-4xl mx-auto font-sans">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-neutral-900 leading-tight">تدرب مثل المحترفين</h2>
          <p className="text-lg text-neutral-600 max-w-xl mx-auto">اختر الموضوع الذي تريد تقويته وسيقوم النظام بتصميم اختبار تفاعلي فوري لك.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => startPractice(t.id)}
              className="group p-8 bg-white border border-neutral-100 rounded-[2.5rem] text-right hover:border-blue-300 hover:shadow-xl hover:shadow-blue-50 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-50 group-hover:scale-110 transition-all">
                {t.icon}
              </div>
              <div className="space-y-1 text-right flex-1 pr-4">
                <span className="block text-xl font-bold text-neutral-900">{t.name}</span>
                <span className="text-sm text-neutral-400 block leading-relaxed">{t.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6 font-sans">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
        <p className="text-xl font-bold text-neutral-500 animate-pulse">جاري تحضير أسئلة التدريب...</p>
      </div>
    );
  }

  if (currentIndex >= questions.length && questions.length > 0) {
    return (
        <div className="max-w-xl mx-auto py-20 text-center space-y-8 bg-white rounded-[3rem] shadow-xl border border-neutral-100 font-sans">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full mb-4">
                <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
                <h2 className="text-4xl font-black text-neutral-900">أحسنت صنعاً!</h2>
                <p className="text-neutral-500 font-medium">لقد أتممت التدريب بنجاح.</p>
            </div>
            <div className="text-6xl font-black text-blue-600">{score} / {questions.length}</div>
            <button 
                onClick={() => setTopic(null)}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
                <RefreshCw size={20} />
                <span>العودة للقائمة</span>
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8 font-sans">
      <div className="flex items-center justify-between px-2">
        <button onClick={() => setTopic(null)} className="text-neutral-400 hover:text-neutral-900 font-bold transition-colors cursor-pointer">إلغاء</button>
        <div className="flex items-center gap-2 text-blue-600 font-black">
          <Brain size={20} />
          <span>سؤال {currentIndex + 1} من {questions.length}</span>
        </div>
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white border border-neutral-100 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-blue-50 space-y-8"
      >
        <div className="space-y-4 text-left">
          <span className="text-xs font-black uppercase tracking-widest text-blue-400">Direct Speech:</span>
          <h3 className="text-2xl md:text-3xl font-mono text-neutral-800 leading-relaxed font-semibold">
            {currentQuestion?.direct}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 text-left">
          {currentQuestion?.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selectedAnswer !== null}
              className={`p-6 rounded-2xl text-left font-mono font-bold border-2 transition-all cursor-pointer ${
                selectedAnswer === null 
                  ? 'border-neutral-100 hover:border-blue-200 hover:bg-neutral-50' 
                  : idx === currentQuestion.correctIndex
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : selectedAnswer === idx
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-neutral-50 text-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="flex-1 text-left">{option}</span>
                {selectedAnswer !== null && idx === currentQuestion.correctIndex && <CheckCircle2 size={24} className="text-green-500 flex-shrink-0" />}
                {selectedAnswer === idx && idx !== currentQuestion.correctIndex && <XCircle size={24} className="text-red-500 flex-shrink-0" />}
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-6 border-t border-neutral-100 space-y-4"
            >
              <div className="bg-blue-50 p-6 rounded-2xl text-right">
                <h4 className="font-black text-blue-800 mb-2">الشرح التعليمي والخدعة الامتحانية:</h4>
                <p className="text-blue-700 leading-relaxed font-medium">{currentQuestion?.explanation}</p>
              </div>
              
              <button 
                onClick={nextQuestion}
                className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                السؤال التالي <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
