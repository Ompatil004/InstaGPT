// utils/gemini.js
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// Load API Key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY not found in .env file");
}

// Initialize genAI only if apiKey exists
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Initialize model only if genAI exists
const model = genAI ? genAI.getGenerativeModel({
  model: "gemini-2.0-flash"
}) : null;

const getGeminiAPIResponse = async (message) => {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY is not set in environment variables");
      return "Error: API key is not configured. Please contact the administrator.";
    }

    // Check if model is initialized
    if (!model) {
      console.error("❌ Gemini model is not initialized due to missing API key");
      return "Error: Gemini model is not properly configured.";
    }

    const result = await model.generateContent(message);

    const aiReply = result?.response?.text();

    if (!aiReply) {
      console.error("⚠️ No content received from Gemini:", JSON.stringify(result, null, 2));
      return "Sorry, I couldn't process your request at the moment.";
    }

    return aiReply.trim();
  } catch (err) {
    console.error("❌ Gemini API Error:", err.message || err);
    console.error("Error details:", err);
    return "Sorry, I encountered an error processing your request. Please try again later.";
  }
};

export default getGeminiAPIResponse;
