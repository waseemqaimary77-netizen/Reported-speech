/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Target, 
  BrainCircuit, 
  Home as HomeIcon, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

import StudyGuide from './components/StudyGuide';
import QuizAnalyzer from './components/QuizAnalyzer';
import PracticeArena from './components/PracticeArena';
import LandingPage from './components/LandingPage';
import ExamplesLibrary from './components/ExamplesLibrary';

type Tab = 'home' | 'study' | 'examples' | 'analyze' | 'practice';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('practice');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <LandingPage onStart={() => setActiveTab('study')} />;
      case 'study': return <StudyGuide />;
      case 'examples': return <ExamplesLibrary />;
      case 'analyze': return <QuizAnalyzer />;
      case 'practice': return <PracticeArena />;
      default: return <LandingPage onStart={() => setActiveTab('study')} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 px-4 py-2 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
        <div className="max-w-5xl mx-auto flex justify-around md:justify-center md:gap-8">
          <NavButton 
            active={activeTab === 'practice'} 
            onClick={() => setActiveTab('practice')} 
            icon={<BrainCircuit size={20} />} 
            label="تدريب" 
          />
          <NavButton 
            active={activeTab === 'study'} 
            onClick={() => setActiveTab('study')} 
            icon={<BookOpen size={20} />} 
            label="قواعد" 
          />
          <NavButton 
            active={activeTab === 'examples'} 
            onClick={() => setActiveTab('examples')} 
            icon={<Sparkles size={20} />} 
            label="أمثلة" 
          />
          <NavButton 
            active={activeTab === 'analyze'} 
            onClick={() => setActiveTab('analyze')} 
            icon={<Target size={20} />} 
            label="تحليل" 
          />
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<HomeIcon size={20} />} 
            label="الرئيسية" 
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-24 pt-4 md:pt-20 md:pb-8 px-4 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer (Desktop) */}
      <footer className="hidden md:block py-8 text-center text-neutral-400 text-sm border-t border-neutral-100 mt-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={16} className="text-amber-400" />
          <span className="font-medium">مشروع المادة النهائي - اللغة الإنجليزية</span>
        </div>
        <p>بإشراف المعلمة: دنيا عوض الله | إعداد الطالب: وسيم قيمري</p>
      </footer>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
        active ? 'text-blue-600 bg-blue-50' : 'text-neutral-500 hover:bg-neutral-100'
      }`}
    >
      <span className={active ? 'scale-110 transition-transform' : ''}>{icon}</span>
      <span className="text-[10px] md:text-sm font-medium">{label}</span>
    </button>
  );
}
