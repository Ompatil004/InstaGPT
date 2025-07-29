// utils/openai.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("❌ OPENAI_API_KEY not found in .env file");
}

const openai = new OpenAI({
  apiKey: apiKey
});

const getOpenAIAPIResponse = async (message) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const aiReply = response?.choices?.[0]?.message?.content;

    if (!aiReply) {
      console.error("⚠️ No content received from OpenAI:", JSON.stringify(response, null, 2));
      return null;
    }

    return aiReply.trim();
  } catch (err) {
    console.error("❌ OpenAI API Error:", err?.response?.data || err.message || err);
    return null;
  }
};

export default getOpenAIAPIResponse;
