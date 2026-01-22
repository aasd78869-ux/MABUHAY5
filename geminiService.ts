
import { GoogleGenAI, Type } from "@google/genai";
import { AIItinerary } from "./types";

const SYSTEM_INSTRUCTION = `
أنت "مساعد مابوهاي الذكي الأقدم"، خبير سياحي استراتيجي في الفلبين.
مهمتك تصميم برامج سياحية متكاملة وعميقة.
يجب أن يكون الرد دائماً بتنسيق JSON حصراً باللغة العربية.
الميزانية يجب أن تُحسب بدقة وتُعرض بالريال السعودي (SAR).
وزع الأنشطة اليومية على ثلاث فترات: صباح، ظهر، مساء.
اقترح فنادق حقيقية متوفرة في الوجهة المختارة.
يجب عليك دمج طلبات العميل الخاصة تلقائياً في صلب البرنامج السياحي.
`;

export const generateAIItinerary = async (userData: {
  name: string;
  vibe: string;
  budget: string;
  travelers: string;
  interests: string[];
  customRequest?: string;
}): Promise<AIItinerary | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
    صمم رحلة سياحية استثنائية وعميقة للفلبين للعميل ${userData.name}.
    - نوع التجربة المطلوبة: ${userData.vibe}.
    - الميزانية المحددة: ${userData.budget}.
    - عدد المسافرين: ${userData.travelers}.
    - الاهتمامات الرئيسية: ${userData.interests.join(", ")}.
    - طلبات خاصة إضافية من العميل (يجب دمجها في البرنامج): ${userData.customRequest || "لا يوجد طلبات خاصة"}.
    
    المطلوب في الرد (بصيغة JSON):
    1. وجهة أساسية تناسب هذه الاهتمامات والطلبات.
    2. مدة الرحلة المثالية.
    3. فندق مقترح حقيقي وفاخر مع تصنيف النجوم.
    4. خطة يومية عميقة تشمل (نشاط صباحي، نشاط ظهيرة، نشاط مسائي) لكل يوم.
    5. نصيحة محلية (Local Secret) لكل يوم تزيد من عمق التجربة.
    6. التكلفة الإجمالية التقديرية بالريال السعودي (SAR).
    7. تفصيل دقيق للتكلفة (سكن، طعام، تنقل، أنشطة) بالريال السعودي.
    8. 3 نصائح جوهرية وذكية للمسافر قبل الانطلاق.
    
    ملاحظة: اجعل الأنشطة متنوعة جداً ومفصلة لدرجة أن المسافر يشعر وكأنه هناك بالفعل.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            duration: { type: Type.STRING },
            hotelStars: { type: Type.NUMBER },
            hotelName: { type: Type.STRING },
            dailyPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  activity: { type: Type.STRING },
                  location: { type: Type.STRING },
                  timeSlots: {
                    type: Type.OBJECT,
                    properties: {
                      morning: { type: Type.STRING },
                      afternoon: { type: Type.STRING },
                      evening: { type: Type.STRING }
                    },
                    required: ["morning", "afternoon", "evening"]
                  },
                  localTip: { type: Type.STRING }
                },
                required: ["day", "activity", "location", "timeSlots"]
              }
            },
            totalEstimatedPriceSAR: { type: Type.STRING },
            priceBreakdown: {
              type: Type.OBJECT,
              properties: {
                accommodation: { type: Type.STRING },
                meals: { type: Type.STRING },
                transport: { type: Type.STRING },
                activities: { type: Type.STRING }
              },
              required: ["accommodation", "meals", "transport", "activities"]
            },
            essentialTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["destination", "duration", "hotelStars", "hotelName", "dailyPlan", "totalEstimatedPriceSAR", "priceBreakdown", "essentialTips"]
        }
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AIItinerary;
    }
    return null;
  } catch (error) {
    console.error("[AI Planner Error]:", error);
    return null;
  }
};
