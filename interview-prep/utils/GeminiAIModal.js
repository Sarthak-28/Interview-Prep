import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
//dotenv.config();

// Get the GEMINI API key from the backend's .env file
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// Make sure GEMINI_API_KEY is defined in your backend .env

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Start the chat session
export const chatSession = model.startChat({
  generationConfig,
});
