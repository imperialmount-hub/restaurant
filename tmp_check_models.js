import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAQvD6LT7KlMqO3QNQZb-aZRsoln0Qjpw0";

async function listModels() {
    const versions = ["v1", "v1beta"];
    const models = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-pro-latest"];

    for (const v of versions) {
        console.log(`\n--- Testing API Version: ${v} ---`);
        const client = new GoogleGenerativeAI(API_KEY);
        for (const m of models) {
            try {
                const model = client.getGenerativeModel({ model: m }, { apiVersion: v });
                // Instead of generating content, just try to get the model metadata if possible
                // Actually generateContent is the sure way to check permission
                await model.generateContent("test");
                console.log(`✅ ${v} - ${m}: Available`);
            } catch (e) {
                if (e.message.includes("404")) {
                    console.log(`❌ ${v} - ${m}: 404 Not Found`);
                } else if (e.message.includes("429")) {
                    console.log(`⚠️ ${v} - ${m}: 429 Quota Exceeded (Limit 0?)`);
                } else {
                    console.log(`❓ ${v} - ${m}: ${e.message.substring(0, 100)}...`);
                }
            }
        }
    }
}

listModels();
