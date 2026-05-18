import { EXAMPLES_DATABASE } from '../constants';
import { motion } from 'motion/react';
import { Quote, ArrowRight, Lightbulb } from 'lucide-react';

export default function ExamplesLibrary() {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-12">
      <div className="text-right">
        <h2 className="text-3xl font-black text-neutral-900 mb-2">مكتبة الأمثلة المحلولة</h2>
        <p className="text-neutral-500 font-medium">أمثلة واقعية مشروحة بالتفصيل لتثبيت قواعد المادة.</p>
      </div>

      <div className="space-y-16">
        {EXAMPLES_DATABASE.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-6">
            <h3 className="text-2xl font-black text-blue-600 border-r-4 border-blue-600 pr-4 mr-2">{group.topic}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.examples.map((ex, exIdx) => (
                <motion.div 
                  key={exIdx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-[2.5rem] border border-neutral-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="space-y-4 text-right">
                    <div className="space-y-2">
                       <span className="text-[10px] font-black tracking-widest text-neutral-300 uppercase">Direct Speech</span>
                       <div className="flex items-start gap-3 justify-end">
                         <p className="text-lg font-mono font-semibold text-neutral-700 leading-relaxed">{ex.direct}</p>
                         <Quote className="text-blue-100 rotate-180 flex-shrink-0" size={20} />
                       </div>
                    </div>

                    <div className="py-2 flex justify-center">
                      <div className="h-8 w-px bg-neutral-100 relative">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-50 text-blue-400 p-1 rounded-full"><ArrowRight size={12} className="rotate-90" /></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                       <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">Reported Speech</span>
                       <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                         <p className="text-lg font-mono font-bold text-blue-600 leading-relaxed text-left">{ex.reported}</p>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-50 mt-4 flex items-start gap-3 justify-end">
                      <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                        {ex.explanation}
                      </p>
                      <Lightbulb className="text-amber-400 flex-shrink-0 mt-1" size={18} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
