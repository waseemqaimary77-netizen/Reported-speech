import { motion } from 'motion/react';
import { Sparkles, ArrowRight, GraduationCap } from 'lucide-react';

export default function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-12 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute -inset-4 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <GraduationCap className="relative w-24 h-24 text-blue-600 mb-6 mx-auto" />
      </motion.div>

      <div className="space-y-4 max-w-2xl px-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-neutral-900 leading-tight">
          Master <span className="text-blue-600">Reported Speech</span>
          <br />بذكاء وإتقان
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 font-medium">
          تحويل الكلام المنقول أصبح أسهل من أي وقت مضى. تعلم، حلل، وتدرب لتدعيم مهاراتك الدراسية.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button 
          onClick={onStart}
          className="group relative px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 overflow-hidden cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-2">
            ابدأ رحلة التعلم <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
        </button>
        
        <div className="px-6 py-4 bg-white border border-neutral-200 rounded-2xl font-semibold text-neutral-600 flex items-center gap-2">
          <Sparkles className="text-amber-400" />
          <span>مشروع الطلاب: وسيم قيمري وأكرم عواد</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl pt-12">
        <FeatureCard 
          title="دليل دراسي شامل" 
          desc="شرح مفصل لجميع قواعد الكلام المنقول المستخلصة من المنهج المدرسي."
          icon={<BookIcon />}
        />
        <FeatureCard 
          title="محلل ورقة العمل" 
          desc="تصفح الحلول النموذجية المعتمدة لورقة عمل المادة وشروحات التريكات الامتحانية بالتفصيل."
          icon={<BrainIcon />}
        />
        <FeatureCard 
          title="تدريب تفاعلي" 
          desc="حل أسئلة تفاعلية متنوعة للتدرب والتحضير للدرجة الكاملة."
          icon={<TestIcon />}
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 bg-white border border-neutral-100 rounded-3xl text-right shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 ml-0 mr-auto">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
);

const BrainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0-10 10c0 5 4 10 10 10s10-5 10-10A10 10 0 0 0 12 2Z"/><path d="M8 9h8"/><path d="M8 13h8"/><path d="M8 17h8"/></svg>
);

const TestIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="m3.34 19 1.4-1.4"/><path d="M16.03 5.62 19 8.59"/><path d="m7.19 15.19 1.41-1.41"/><path d="M2.34 2.34 21.66 21.66"/></svg>
);
