import React, { useState } from 'react';
import { ChevronDown, Check, AlertCircle, Sparkles } from 'lucide-react';

// Teacher Dunya Awadallah's Exam Database (Pre-loaded & Approved)
const SCHOOL_QUIZ_SECTIONS = [
  {
    title: "المجموعة الأولى (A) - تحويل الجمل إلى الكلام المنقول",
    instruction: "Change into reported speech. Pay attention to the tense and reporting verb!",
    questions: [
      {
        num: 1,
        direct: '"Pollution causes dangerous diseases." the doctor comments',
        reported: "The doctor comments that pollution causes dangerous diseases.",
        explanation: "فعل القول المكتوب هو (comments) في زمن المضارع البسيط. تذكر القاعدة الذهبية: إذا كان فعل القول مضارعاً (says, comments, tells, asks)، لا يتغير زمن الفعل المكتوب داخل علامتي الاقتباس على الإطلاق! لذلك يبقى الفعل (causes) مضارعاً كما هو.",
        trick: "الخدعة هنا هي فعل القول المضارع (comments). الكثير من الطلاب يحولون الجملة للماضي بشكل تلقائي، لكن الصحيح هو بقاء الفعل في زمن المضارع!"
      },
      {
        num: 2,
        direct: '"Could you tell me the way to the mosque, please?" the tourist asks me',
        reported: "The tourist asks me to tell him the way to the mosque.",
        explanation: "هذا السؤال يعبر عن طلب مهذب (Polite Request) لأنه يبدأ بـ (Could you) وينتهي بـ (please). عندما نقوم بتحويل الطلبات، نستخدم صيغة (to + الفعل المجرد). نقوم بحذف أسلوب الطلب وسحب الفعل الأساسي (tell) ليصبح (to tell)، ونغير الضمير (me) ليعود على السائح المذكر فيصبح (him).",
        trick: "طلب مهذب يحتاج إلى ربط بـ (to) والمصدر، كما يتم حذف كلمات الطلب مثل please و Could you."
      },
      {
        num: 3,
        direct: '"Don\'t make any noise," the teacher says to the students',
        reported: "The teacher says to the students not to make any noise.",
        explanation: "هذه الجملة جملة نهي أو أمر منفي تبدأ بـ (Don't). في حالة تحويل النهي، نقوم بحذف كلمة (Don't) واستبدالها دائماً بـ (not to) متبوعة بالفعل مجرداً (not to make).",
        trick: "عند تحويل النهي (Don't)، استخدم دائماً (not to) وليس (to not)."
      },
      {
        num: 4,
        direct: '"Do you like action films?" Khaled asks Hani',
        reported: "Khaled asks Hani if he likes action films.",
        explanation: "هذا سؤال نعم أو لا (Yes/No Question) يبدأ بفعل مساعد (Do). عند التحويل، نربط دائماً بـ (if). زمن فعل القول مضارع (asks) فلا نغير زمن الأفعال. الضمير (you) يعود على هاني الغائب المذكر فيتحول إلى (he)، ويأخذ الفعل المفرد (likes).",
        trick: "في الأسئلة المنقولة، يجب تحويل ترتيب السؤال إلى ترتيب جملة عادية (فاعل ثم فعل)، ونربط بـ (if) لأسئلة نعم/لا."
      },
      {
        num: 5,
        direct: '"What is your favorite subject?" the teacher asks me',
        reported: "The teacher asks me what my favorite subject is.",
        explanation: "هذا سؤال كلمة سؤال (Wh-Question) يبدأ بـ (What). نستخدم نفس الكلمة (what) كأداة ربط. تذكر أننا نحول السؤال لجملة خبرية وبما أن فعل القول مضارع (asks) فلا نغير الزمن، نقوم بتقديم الفاعل (my favorite subject) على فعل الكينونة (is) الذي يوضع في النهاية.",
        trick: "الخطأ الشائع هو كتابة (what is my...)، بينما الترتيب الصحيح للكلام المنقول يقتضي مجيء فعل الكينونة في النهاية (what my favorite subject is)."
      }
    ]
  },
  {
    title: "المجموعة الثانية (B) - صياغة الكلام المنقول بالبدء بما بين القوسين",
    instruction: "Give the reported speech form of the following. Start with the words in brackets.",
    questions: [
      {
        num: 1,
        direct: '"Be nice to your brother." (My father says)',
        reported: "My father says to be nice to my/his brother.",
        explanation: "هذا فعل أمر مباشر ومثبت يبدأ بـ (Be). نستخدم للربط حرف الجر (to) متبوعاً بالفعل مجرداً لتصبح الجملة (to be nice). ونغير ضمير الملكية ليناسب السياق.",
        trick: "فعل القول مضارع (says)، وطبيعة الجملة أمر مثبت، لذلك نربط مباشرة بـ (to)."
      },
      {
        num: 2,
        direct: '"Where will you go at the weekend?" (He asked them)',
        reported: "He asked them where they would go at the weekend.",
        explanation: "فعل القول في الماضي (asked). نقوم بالربط باستخدام نفس كلمة السؤال (where). وبما أن الكلام موجه لهم (asked them) فإن الضمير (you) يتحول لجمع الغائب (they). كما نقوم بإرجاع الفعل المساعد (will) إلى صيغة الماضي لتصبح (would). ونضعه بعد الفاعل.",
        trick: "تغيير الزمن من (will) إلى (would)، وجعل الفاعل (they) يسبق الفعل المساعد."
      },
      {
        num: 3,
        direct: '"She can\'t leave the city because of the traffic." (She said)',
        reported: "She said that she couldn't leave the city because of the traffic.",
        explanation: "جملة خبرية عادية وفعل القول في الماضي (said). نقوم بربط الجملتين بكلمة الربط الاختيارية (that)، ثم نقوم بإرجاع الفعل المساعد (can't) خطوة للماضي ليصبح (couldn't) مع بقاء باقي الجملة كما هي.",
        trick: "تحويل الأفعال الناقصة للماضي: (can't) تصبح دائماً (couldn't) إذا كان فعل القول ماضياً."
      },
      {
        num: 4,
        direct: '"I mended the car perfectly." (The mechanic said)',
        reported: "The mechanic said that he had mended the car perfectly.",
        explanation: "فعل القول ماضٍ (said). الفعل الأساسي للجملة في الماضي البسيط (mended). حسب قواعد التحويل التراجعي للأزمنة، يتم تحويل الماضي البسيط دائماً للزمن الأقدم وهو الماضي التام (had + Past Participle) فيصبح (had mended)، والضمير (I) يصبح (he) عائداً على الميكانيكي.",
        trick: "الماضي البسيط (mended) يصبح ماضي تام (had mended) للتدليل على أن الحدث وقع في الماضي الأبعد."
      },
      {
        num: 5,
        direct: '"I have already finished revising for my exam." (She replied)',
        reported: "She replied that she had already finished revising for her exam.",
        explanation: "فعل القول ماضٍ (replied). الجملة تبدأ بـ (I) وتتحول إلى (she). وزمن الجملة مضارع تام (have finished) فيتحول تراجعياً للماضي التام (had finished)، وضمير الملكية (my exam) يتحول لـ (her exam).",
        trick: "المضارع التام (have finished) يُرجع دائماً خطوة للوراء ليصبح ماضي تام (had finished)."
      }
    ]
  },
  {
    title: "المجموعة الثالثة (C) - اختيار الإجابة الصحيحة (فخاخ تريكي الشائعة)",
    instruction: "Choose the correct answer carefully. Analyze the grammar cues!",
    questions: [
      {
        num: 1,
        direct: '"She asks him when ... buys his new bike." (he - him - himself)',
        reported: "She asks him when he buys his new bike.",
        explanation: "في الجملة نحتاج إلى ضمير فاعل (Subject Pronoun) ليقوم بالحدث قبل الفعل المضارع (buys). الضمير الفاعل المناسب هو (he). الضمير (him) مفعول به و(himself) ضمير انعكاسي.",
        trick: "تحديد موقع الكلمة المطلوبة في الجملة التابعة: قبل الفعل دائماً نستخدم ضمير الفاعل الأساسي."
      },
      {
        num: 2,
        direct: '"He asked when ... have dinner." (could they - they could - can they)',
        reported: "He asked when they could have dinner.",
        explanation: "في الكلام المنقول، يتم إلغاء صيغة السؤال الاستفهام والعودة للترتيب الخبري (الفاعل أولاً ثم الفعل): الفاعل هو (they) متبوعاً بالماضي من can وهو (could) لأن فعل القول ماضي (asked). الترتيب الصحيح هو (they could).",
        trick: "انتبه! الكثير يختارون (could they) لأنهم يظنون أنه سؤال، لكن في الكلام المنقول يتحول السؤال لجملة عادية فيتقدم الفاعل على الفعل المساعد."
      },
      {
        num: 3,
        direct: 'Peter says to John "Why ... so late?" (are you - you are - you were)',
        reported: "are you",
        explanation: "انتبه بشدة! هنا الجملة وضعت داخل علامتي اقتباس مزدوجتين \"...\"، وهذا يعني أن الكلام لا يزال كلاماً مباشراً (Direct Speech) ولم يتم تفريغه أو نقله بعد. في السؤال المباشر نبقي دائماً على صيغة السؤال التقليدية (الفعل المساعد قبل الفاعل) فنختار (are you).",
        trick: "علامات الاقتباس تعني أن الجملة مباشرة 100%! لا تقم بنقل القواعد بل اختر صيغة السؤال المباشرة العادية."
      },
      {
        num: 4,
        direct: '"He asked me ... the door." (open - could you open - to open)',
        reported: "He asked me to open the door.",
        explanation: "هذا أسلوب طلب منقول غير مباشر (Indirect Command/Request). لصياغة الطلب المنقول نستخدم دائماً أداة الربط (to) متبوعة بالفعل المصدر (to open).",
        trick: "لتحويل الطلبات والأوامر نستخدم دائماً الصيغة المصدرية المباشرة (to + Verb)."
      },
      {
        num: 5,
        direct: '"The teacher ... us that they could finish on time." (says - told - said)',
        reported: "The teacher told us that they could finish on time.",
        explanation: "يوجد في الجملة مفعول به مباشر وهو الضمير (us). الفعل الوحيد من بين الخيارات الذي يتطلب مفعولاً به مباشرة بعده بدون حرف جر هو الفعل (told). بينما الفعل (said) يحتاج إلى حرف الجر to ليليه مفعول (যেমন: said to us).",
        trick: "القاعدة تقول: (told + object) مفعول به، بينما (said + that) بدون مفعول به مباشر بدون to."
      }
    ]
  }
];

export default function QuizAnalyzer() {
  // Solved School Quiz Open State
  const [openedQuestions, setOpenedQuestions] = useState<Record<string, boolean>>({});

  const toggleQuestion = (sectionIdx: number, qIdx: number) => {
    const key = `${sectionIdx}-${qIdx}`;
    setOpenedQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8 py-4">
      {/* Pinned school worksheet solution screen */}
      <div className="space-y-10 max-w-4xl mx-auto">
        <div className="text-right space-y-3 font-sans">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs px-4 py-1.5 rounded-full font-black shadow-md shadow-amber-100">
            <Sparkles size={14} />
            <span>جزء خاص بـ وسيم قيمري - 10 Grade</span>
          </div>
          <h2 className="text-3xl font-black text-neutral-900 leading-tight">حلول ورقة عمل الكلام المنقول المعتمدة</h2>
          <p className="text-neutral-500 font-medium">تحتوي هذه الصفحة على الحل النموذجي والشرح التفصيلي لورقة عمل (Reported Speech) لجميع الأقسام وشرح التريكات الخداعية لحصد الدرجة الكاملة.</p>
        </div>

        <div className="space-y-12">
          {SCHOOL_QUIZ_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-6">
              <div className="bg-white rounded-[2rem] border border-neutral-100 p-6 md:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-l from-blue-500 to-indigo-600" />
                <div className="text-right space-y-2">
                  <h3 className="text-xl font-black text-neutral-900">{section.title}</h3>
                  <p className="text-xs font-mono text-neutral-400 dir-ltr">{section.instruction}</p>
                </div>
              </div>

              <div className="space-y-4">
                {section.questions.map((q, qIdx) => {
                  const isOpen = !!openedQuestions[`${sIdx}-${qIdx}`];
                  return (
                    <div 
                      key={qIdx}
                      className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden hover:border-blue-200 transition-all duration-300"
                    >
                      {/* Question Header Accordion Toggle */}
                      <button
                        onClick={() => toggleQuestion(sIdx, qIdx)}
                        className="w-full p-6 text-right flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className={`p-2 rounded-full transition-transform duration-200 ${isOpen ? 'bg-neutral-100 rotate-180' : 'bg-neutral-50'}`}>
                          <ChevronDown size={18} className="text-neutral-500" />
                        </div>
                        <div className="flex-1 text-right space-y-1">
                          <div className="flex items-center gap-2 justify-end mb-1">
                            <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-lg font-black">السؤال {q.num}</span>
                          </div>
                          <p className="text-lg font-mono font-bold text-neutral-800 leading-relaxed text-right">{q.direct}</p>
                        </div>
                      </button>

                      {/* Collapsible Content */}
                      {isOpen && (
                        <div className="px-6 pb-6 pt-2 border-t border-neutral-50 bg-neutral-50/50 space-y-6">
                          {/* Answer Block */}
                          <div className="space-y-2 text-right">
                            <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase">الجواب النموذجي المعتمد (Reported Speech)</span>
                            <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 justify-between">
                              <span className="bg-green-500 text-white p-1 rounded-full"><Check size={14} /></span>
                              <p className="text-lg font-mono font-bold text-green-700 leading-relaxed text-left flex-1 pl-2">{q.reported}</p>
                            </div>
                          </div>

                          {/* Applied Grammatical Rules */}
                          <div className="space-y-2 text-right">
                            <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">القواعد المطبقة والخطوات</span>
                            <p className="text-neutral-600 font-medium leading-relaxed bg-white border border-neutral-100 p-4 rounded-xl text-sm text-right flex justify-end">
                              {q.explanation}
                            </p>
                          </div>

                          {/* Trick alert label */}
                          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 items-start text-right">
                            <div className="flex-1">
                              <h5 className="font-black text-amber-800 text-sm mb-1">تنبيه ذكي للخدعة الامتحانية ⚠️</h5>
                              <p className="text-amber-700 text-xs leading-relaxed font-semibold">{q.trick}</p>
                            </div>
                            <AlertCircle size={18} className="text-amber-500 transform scale-x-[-1] mt-0.5 flex-shrink-0" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
