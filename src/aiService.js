import { GoogleGenerativeAI } from "@google/generative-ai";

// Note: Replace with actual API key or use environment variables
const API_KEY = "AIzaSyAQvD6LT7KlMqO3QNQZb-aZRsoln0Qjpw0";
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeMenuImage = async (base64Image, mimeType) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }, { apiVersion: "v1" });

        const prompt = `
      Энэхүү хоолны цэсний зурагнаас хоолнуудыг ялган авч JSON форматаар буцаана уу.
      Хариу нь заавал ийм бүтэцтэй байх ёстой:
      [
        {
          "title": "Хоолны нэр",
          "price": 15000,
          "description": "Хоолны найрлага эсвэл дэлгэрэнгүй тайлбар",
          "category": "buuz",
          "tags": "Best Seller, New"
        }
      ]
      Зөвхөн цэвэр JSON массив буцаа, өөр текст битгий бичээрэй.
      Ангиллыг (category) дараах дотроос хамгийн тохирохыг нь сонго: buuz, khuushuur, pizza, desert, drink, snack.
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Extract JSON from the response text (removes markdown code blocks if any)
        const jsonStr = text.replace(/```json|```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        throw error;
    }
};
