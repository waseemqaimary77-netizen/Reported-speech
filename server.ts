import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route: Analyze Quiz
  app.post("/api/analyze-quiz", async (req, res) => {
    try {
      const { image, regions } = req.body;
      
      const prompt = `
        أنت معلم لغة إنجليزية خبير. أنا أعرض عليك صورة لاختبار حول "الكلام المنقول" (Reported Speech).
        قام المستخدم بتحديد مناطق معينة (المناطق المحددة: ${JSON.stringify(regions)}).
        
        يرجى تقديم شرح مفصل باللغة العربية حصراً لكل سؤال في هذه المناطق.
        
        لكل سؤال، يرجى اتباع التنسيق التالي:
        1. **الجملة الأصلية (Direct Speech):** اكتب الجملة بالإنجليزية.
        2. **القاعدة المطبقة:** اشرح باللغة العربية التغييرات التي حدثت (تغيير الأزمنة، الضمائر، إلخ).
        3. **الحل الصحيح:** اكتب الحل النهائي بالإنجليزية مع شرح "لماذا" باللغة العربية.
        
        ملاحظة هامة: يجب أن يكون الشرح باللغة العربية، والأمثلة فقط بالإنجليزية. استخدم Markdown للتنسيق. تأكد أن النص العربي واللغة الإنجليزية منسقان بشكل يسهل قراءته من اليمين لليسار.
      `;

      const imagePart = {
        inlineData: {
          mimeType: "image/png",
          data: image.split(",")[1],
        },
      };

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [imagePart, { text: prompt }] }],
      });

      res.json({ explanation: result.text });
    } catch (error: any) {
      console.error("Analysis Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Generate Practice
  app.post("/api/generate-practice", async (req, res) => {
    try {
      const { topic } = req.body;
      
      const prompt = `
        Generate 5 practice questions for Reported Speech focusing on: ${topic}.
        The questions should be suitable for Grade 10 students.
        
        CRITICAL: The "direct" field MUST include a reporting clause in parentheses, like this: "I am happy." (Ahmed says). This is how students are used to seeing it in their worksheets.
        
        CRITICAL: Ensure the correct answer index is RANDOMIZED for each question. Do NOT follow a pattern (like making the second option always correct). Variety is key.
        
        Return the response strictly in JSON format matching this schema:
        {
          "questions": [
            {
              "direct": "string (The original sentence followed by reporting clause in parentheses)",
              "options": ["string", "string", "string", "string"],
              "correctIndex": number (0-3, randomized),
              "explanation": "Detailed professional explanation in Arabic only, clarifying the rule applied."
            }
          ]
        }
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    direct: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctIndex: { type: Type.NUMBER },
                    explanation: { type: Type.STRING }
                  },
                  required: ["direct", "options", "correctIndex", "explanation"]
                }
              }
            },
            required: ["questions"]
          }
        }
      });

      res.json(JSON.parse(result.text || "{}"));
    } catch (error: any) {
      console.error("Practice Gen Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
