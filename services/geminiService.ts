
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const polishTextWithGemini = async (text: string): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini API not initialized. Please check your API key.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rewrite the following text to be more professional, clear, and concise for a business document, but keep the core meaning and all key details. Text: "${text}"`
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to polish text with AI. Please try again.");
  }
};
