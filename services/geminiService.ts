
import { GoogleGenAI, Type } from "@google/genai";

// Standard function to analyze order history using Gemini
export const analyzeOrderHistory = async (orders: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these cabinetry orders and identify trends in popular materials, common delays, and revenue peaks: ${orders}`,
    config: {
      systemInstruction: "You are an expert manufacturing consultant specializing in custom cabinetry and shop management."
    }
  });
  return response.text || "No analysis generated.";
};

// Function to suggest upsells or optimizations based on quote details
export const suggestQuoteOptimization = async (quoteDetails: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on this quote configuration: ${quoteDetails}, suggest 2-3 upsell accessories or alternative materials that might improve the aesthetics or durability while maintaining a good margin.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                item: { type: Type.STRING },
                benefit: { type: Type.STRING },
                estimatedImpact: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  // Handle potentially empty response text
  const text = response.text || '{"suggestions": []}';
  return JSON.parse(text);
};
