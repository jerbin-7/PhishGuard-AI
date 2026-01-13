
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { DetectorType, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    riskScore: { type: Type.NUMBER, description: "Numeric score from 0-100 indicating risk" },
    threatLevel: { type: Type.STRING, description: "Categorical threat level: Low, Medium, High, or Critical" },
    summary: { type: Type.STRING, description: "A concise summary of why this was flagged" },
    indicators: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Specific red flags found" 
    },
    recommendations: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "What the user should do next" 
    }
  },
  required: ["riskScore", "threatLevel", "summary", "indicators", "recommendations"]
};

export async function analyzeThreat(
  type: DetectorType,
  content: string | { data: string; mimeType: string }
): Promise<AnalysisResult> {
  const modelName = type === DetectorType.VOICE 
    ? 'gemini-2.5-flash-native-audio-preview-12-2025' 
    : 'gemini-3-flash-preview';

  let prompt = "";
  let contents: any = null;

  switch (type) {
    case DetectorType.EMAIL:
      prompt = `Analyze the following email for phishing attempts. Look for suspicious headers, urgency, generic greetings, and malicious links. Text: ${content}`;
      contents = { parts: [{ text: prompt }] };
      break;
    case DetectorType.SMS:
      prompt = `Analyze this SMS for smishing (phishing via text). Check for suspicious links, urgency, or impersonation of brands/banks. Text: ${content}`;
      contents = { parts: [{ text: prompt }] };
      break;
    case DetectorType.SCREENSHOT:
      prompt = `Analyze this screenshot for phishing indicators. Check for fake URLs, visual inconsistencies in branding, suspicious login forms, or misleading UI elements.`;
      contents = { parts: [{ inlineData: content as any }, { text: prompt }] };
      break;
    case DetectorType.QR_CODE:
      prompt = `Analyze the QR code in this image. Decode the URL if possible and evaluate if the destination or the surrounding context is malicious/phishing-related.`;
      contents = { parts: [{ inlineData: content as any }, { text: prompt }] };
      break;
    case DetectorType.VOICE:
      prompt = `Analyze this audio for deepfake voice manipulation or social engineering tactics. Check for unnatural pauses, frequency artifacts typical of AI synthesis, or suspicious requests for sensitive info.`;
      contents = { parts: [{ inlineData: content as any }, { text: prompt }] };
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        systemInstruction: "You are a world-class cybersecurity expert specializing in phishing and social engineering detection. Be thorough and objective."
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw new Error("Failed to analyze content. Please check your connection and try again.");
  }
}
