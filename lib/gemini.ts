import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

export interface AdditiveInfo {
  name: string;
  category: string;
  reason: string;
}

export interface AdditiveCheckResult {
  judgment: "safe" | "caution" | "danger";
  detected_additives: AdditiveInfo[];
  safe_ingredients: string[];
  product_category: string;
  summary: string;
  blog_keyword: string;
}

export function getGeminiModel(): GenerativeModel {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}
