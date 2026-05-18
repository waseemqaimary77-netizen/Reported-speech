import { motion, AnimatePresence } from 'motion/react';
import { REPORTED_SPEECH_RULES } from '../constants';
import { Info, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function StudyGuide() {
  const [openSection, setOpenSection] = useState<string | null>(REPORTED_SPEECH_RULES[0].id);

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-6">
      <div className="text-right">
        <h2 className="text-3xl font-black text-neutral-900 mb-4">دليل قواعد الكلام المنقول</h2>
        <p className="text-neutral-500">مراجعة شاملة لجميع القواعد المطلوبة في الصف العاشر.</p>
      </div>

      <div className="space-y-4">
        {REPORTED_SPEECH_RULES.map((section) => (
          <div 
            key={section.id}
            className="bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-sm"
          >
            <button 
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between p-6 text-right hover:bg-neutral-50 transition-colors"
            >
              <ChevronDown className={`text-neutral-300 transition-transform duration-300 ${openSection === section.id ? 'rotate-180' : ''}`} />
              <div className="text-right">
                <h3 className="text-xl font-extrabold text-neutral-800">{section.title}</h3>
                {section.description && <p className="text-sm text-neutral-400 mt-1">{section.description}</p>}
              </div>
            </button>

            <AnimatePresence>
              {openSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 space-y-4 border-t border-neutral-50">
                    {section.rules && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-left font-bold text-neutral-400 text-sm uppercase tracking-wider px-4">Direct</div>
                        <div className="text-right font-bold text-neutral-400 text-sm uppercase tracking-wider px-4">Reported</div>
                        {section.rules.map((rule, idx) => (
                          <div key={idx} className="contents">
                            <div className="bg-neutral-50 p-4 rounded-xl font-mono text-blue-600">{rule.direct}</div>
                            <div className="bg-blue-600 p-4 rounded-xl text-white font-bold text-right">{rule.reported}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.types && (
                      <div className="space-y-6">
                        {section.types.map((type, idx) => (
                          <div key={idx} className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100">
                            <h4 className="text-blue-600 font-black mb-2 text-lg text-right">{type.name}</h4>
                            <p className="text-neutral-600 mb-4 text-right italic">{type.rule}</p>
                            <div className="bg-white p-4 rounded-2xl border border-blue-100 flex items-start gap-4">
                              <Info className="text-blue-400 flex-shrink-0 mt-1" />
                              <p className="text-sm font-medium text-neutral-800 leading-relaxed text-left font-mono">
                                {type.example}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Quick Notes Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:p-12 rounded-[3rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8 justify-end">
            <h3 className="text-3xl font-black">الملاحظات الذهبية للتميز</h3>
            <CheckCircle2 className="text-blue-300" size={40} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <h4 className="font-black text-blue-200 mb-2">1. ترتيب الجملة</h4>
                <p className="text-blue-50 text-sm leading-relaxed">تذكر دائماً أن السؤال المنقول يتحول إلى جملة خبرية، يعني الفاعل يهرب ليقف قبل الفعل المساعد!</p>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <h4 className="font-black text-blue-200 mb-2">2. الأزمنة والمستقبل</h4>
                <p className="text-blue-50 text-sm leading-relaxed">أي فعل مساعد مثل (can, will, may) يتغير فوراً لصيغته الماضية (could, would, might).</p>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <h4 className="font-black text-blue-200 mb-2">3. حذف الأسئلة المساعدة</h4>
                <p className="text-blue-50 text-sm leading-relaxed">عند وجود (do, does, did) في السؤال، نقوم بحذفها ونحول الفعل الأساسي للماضي.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <h4 className="font-black text-blue-200 mb-2">4. الكلمات الدالة</h4>
                <p className="text-blue-50 text-sm leading-relaxed">لا تنسَ تحويل الظروف: yesterday تصبح the day before، و tomorrow تصبح the next day.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

