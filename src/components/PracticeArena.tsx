import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, ArrowRight, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';

const TOPICS = [
  { id: 'statements', name: 'جمل خبرية (Statements)', icon: '💬' },
  { id: 'questions', name: 'أسئلة (Questions)', icon: '❓' },
  { id: 'requests', name: 'طلبات (Requests)', icon: '🙏' },
  { id: 'all', name: 'شامل لكل القواعد', icon: '🌟' }
];

export default function PracticeArena() {
  const [topic, setTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const startPractice = async (selectedTopic: string) => {
    setTopic(selectedTopic);
    setIsLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    
    try {
      const response = await fetch('/api/generate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: selectedTopic }),
      });
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
      <div className="space-y-12 py-12 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-neutral-900 leading-tight">تدرب مثل المحترفين</h2>
          <p className="text-lg text-neutral-600 max-w-xl mx-auto">اختر الموضوع الذي تريد تقويته وسيقوم الذكاء الاصطناعي بإنشاء اختبار خاص لك.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => startPractice(t.id)}
              className="group p-8 bg-white border border-neutral-100 rounded-[2.5rem] text-right hover:border-blue-300 hover:shadow-xl hover:shadow-blue-50 transition-all flex items-center justify-between"
            >
              <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-50 group-hover:scale-110 transition-all">
                {t.icon}
              </div>
              <div className="space-y-1">
                <span className="block text-xl font-bold text-neutral-900">{t.name}</span>
                <span className="text-sm text-neutral-400">أسئلة مولدة آلياً لمراجعة القواعد</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
        <p className="text-xl font-bold text-neutral-500 animate-pulse">جاري تحضير أسئلة التدريب...</p>
      </div>
    );
  }

  if (currentIndex >= questions.length && questions.length > 0) {
    return (
        <div className="max-w-xl mx-auto py-20 text-center space-y-8 bg-white rounded-[3rem] shadow-xl border border-neutral-100">
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
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto"
            >
                <RefreshCw size={20} />
                <span>العودة للقائمة</span>
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between px-2">
        <button onClick={() => setTopic(null)} className="text-neutral-400 hover:text-neutral-900 font-bold transition-colors">إلغاء</button>
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
        <div className="space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-blue-400">Direct Speech:</span>
          <h3 className="text-2xl md:text-3xl font-mono text-neutral-800 leading-relaxed font-semibold">
            {currentQuestion?.direct}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentQuestion?.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selectedAnswer !== null}
              className={`p-6 rounded-2xl text-left font-bold border-2 transition-all ${
                selectedAnswer === null 
                  ? 'border-neutral-100 hover:border-blue-200 hover:bg-neutral-50' 
                  : idx === currentQuestion.correctIndex
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : selectedAnswer === idx
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-neutral-50 text-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {selectedAnswer !== null && idx === currentQuestion.correctIndex && <CheckCircle2 size={24} />}
                {selectedAnswer === idx && idx !== currentQuestion.correctIndex && <XCircle size={24} />}
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
                <h4 className="font-black text-blue-800 mb-2">الشرح التعليمي:</h4>
                <p className="text-blue-700 leading-relaxed font-medium">{currentQuestion?.explanation}</p>
              </div>
              
              <button 
                onClick={nextQuestion}
                className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-2"
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
