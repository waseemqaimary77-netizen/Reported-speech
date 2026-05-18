export const REPORTED_SPEECH_RULES = [
  {
    id: 'pronouns',
    title: 'تغيير الضمائر (Pronoun Changes)',
    description: 'عند تحويل الكلام، يجب تغيير الضمائر لتعبر عن الشخص الذي يتحدث الآن.',
    rules: [
      { direct: 'I (أنا)', reported: 'he/she (هو/هي)' },
      { direct: 'We (نحن)', reported: 'they (هم)' },
      { direct: 'You (أنت)', reported: 'I (أنا) - حسب المخاطب' },
      { direct: 'my (لي)', reported: 'his/her (له/لها)' },
      { direct: 'our (لنا)', reported: 'their (لهم)' },
      { direct: 'me (ياء الملكية/ني)', reported: 'him/her' },
      { direct: 'us (نا)', reported: 'them' }
    ]
  },
  {
    id: 'tenses',
    title: 'تغيير الأزمنة (Tense Changes)',
    description: 'القاعدة الذهبية: الزمن "يتراجع خطوة" إلى الماضي دائماً.',
    rules: [
      { direct: 'Present Simple (مضارع بسيط)', reported: 'Past Simple (ماضي بسيط)', example: 'I play -> He played' },
      { direct: 'Past Simple (ماضي بسيط)', reported: 'Past Perfect (ماضي تام)', example: 'I played -> He had played' },
      { direct: 'Present Continuous (مضارع مستمر)', reported: 'Past Continuous (ماضي مستمر)', example: 'I am playing -> He was playing' },
      { direct: 'Can (يستطيع)', reported: 'Could (استطاع)', example: 'I can swim -> He could swim' },
      { direct: 'Will (سوف)', reported: 'Would', example: 'I will go -> He would go' },
      { direct: 'May (ربما)', reported: 'Might', example: 'I may stay -> He might stay' }
    ]
  },
  {
    id: 'questions',
    title: 'تحويل الأسئلة (Questions)',
    description: 'انتبه! في الكلام المنقول يتغير ترتيب الجملة ليصبح الفاعل قبل الفعل، ونحذف علامة الاستفهام.',
    types: [
      {
        name: 'Yes/No Questions (أسئلة نعم/لا)',
        rule: 'نستخدم كلمة (if) للربط بين جملة القول والسؤال.',
        example: 'Are you ready? -> He asked if I was ready.'
      },
      {
        name: 'Wh- Questions (أسئلة المعلومات)',
        rule: 'نستخدم نفس أداة السؤال (Where, When, Why) كأداة ربط.',
        example: 'Where is the dog? -> She asked where the dog was.'
      }
    ]
  }
];

export const EXAMPLES_DATABASE = [
  {
    topic: 'Statements - أمثلة المعلمة (العبارات)',
    examples: [
      {
        direct: "I speak English. (Ahmed says)",
        reported: "Ahmed says that he speaks English.",
        explanation: "لاحظ هنا أن فعل القول (says) في المضارع، لذلك لم يتغير زمن الفعل داخل الجملة، فقط غيرنا الضمير I إلى he."
      },
      {
        direct: "You need to send the letter. (Ali tells me)",
        reported: "Ali tells me I need to send the letter.",
        explanation: "بما أن الكلام موجه لي (tells me)، تم تحويل الضمير You إلى I."
      },
      {
        direct: "We love our teachers. (students say)",
        reported: "Students say they love their teachers.",
        explanation: "تحول الضمير We إلى they، والضمير our إلى their ليعبر عن الطلاب."
      },
      {
        direct: "Science is helping people. (We agreed)",
        reported: "We agreed that science was helping people.",
        explanation: "هنا فعل القول في الماضي (agreed)، لذلك حولنا المضارع المستمر (is helping) إلى ماضي مستمر (was helping)."
      },
      {
        direct: "Ali plays football well. (Ahmed said)",
        reported: "Ahmed said that Ali played football well.",
        explanation: "حولنا المضارع البسيط (plays) إلى ماضي بسيط (played) لأن فعل القول في الماضي."
      },
      {
        direct: "We watched the movie. (People said)",
        reported: "People said they had watched the movie.",
        explanation: "الماضي البسيط (watched) يتحول دائماً إلى ماضي تام (had watched)."
      }
    ]
  },
  {
    topic: 'Requests - أمثلة المعلمة (الطلب)',
    examples: [
      {
        direct: "Could you look after the baby, please? (Mum asks me)",
        reported: "Mum asks me to look after the baby.",
        explanation: "في حالة الطلب المهذب (Could you)، نستخدم to + الفعل المجرد للربط ونحذف please."
      },
      {
        direct: "Could you give me the pen, please? (Bilal asks me)",
        reported: "Bilal wants me to give him the pen.",
        explanation: "يمكن استخدام فعل القول (wants me to) في حالة الطلب. تحول الضمير me إلى him."
      },
      {
        direct: "Could you send me the letter, please? (Sara asks Hala)",
        reported: "Sara asks Hala to send her the letter.",
        explanation: "استخدمنا to للربط، وتحول الضمير me إلى her لأن المتحدثة هي سارة."
      }
    ]
  },
  {
    topic: 'Questions - أمثلة المعلمة (الأسئلة)',
    examples: [
      {
        direct: "Are you from Gaza? (Samar asks me)",
        reported: "Samar asks me if I am from Gaza.",
        explanation: "سؤال نعم/لا، نستخدم (if) للربط. بما أن القول في المضارع (asks) لم يتغير زمن الفعل."
      },
      {
        direct: "Does Hani sleep early? (Ali asks Rami)",
        reported: "Ali asks Rami if Hani sleeps early.",
        explanation: "عند السؤال بـ Does، نحذفها ونستخدم if، ونبقي الفعل في المضارع إذا كان فعل القول مضارعاً."
      },
      {
        direct: "Did Basim watch the new movie? (Khaled wonders)",
        reported: "Khaled wonders if Basim watched the new movie.",
        explanation: "سؤال في الماضي (Did)، عند التحويل نستخدم if ونحول الفعل للماضي (watched)."
      },
      {
        direct: "Where is dad? (Sami asks me)",
        reported: "Sami asks me where dad is.",
        explanation: "في أسئلة Wh، نستخدم نفس الأداة للربط، ونضع الفاعل قبل الفعل (dad is)."
      },
      {
        direct: "How does it rain? (the kid asks me)",
        reported: "The kid asks me how it rains.",
        explanation: "حذفنا فعل المساعد does وأضفنا s للفعل لأننا في حالة مضارع."
      }
    ]
  }
];
