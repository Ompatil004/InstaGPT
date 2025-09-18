// utils/gemini.js
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY not found in .env file");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Choose model: "gemini-1.5-flash" (faster) or "gemini-1.5-pro" (more accurate)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getGeminiAPIResponse = async (message) => {
  try {
    const result = await model.generateContent(message);

    const aiReply = result?.response?.text();

    if (!aiReply) {
      console.error("⚠️ No content received from Gemini:", JSON.stringify(result, null, 2));
      return null;
    }

    return aiReply.trim();
  } catch (err) {
    console.error("❌ Gemini API Error:", err.message || err);
    return null;
  }
};

export default getGeminiAPIResponse;
