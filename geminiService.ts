
import { GoogleGenAI } from "@google/genai";

// Always initialize GoogleGenAI with a named apiKey parameter as required by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartSearchSuggestions = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise a busca do usuário: "${query}". 
      Extraia o tipo de serviço (categoria) e a localização (bairro ou cidade).
      Retorne APENAS um JSON no formato: { "category": "string", "location": "string", "tags": ["string"] }.
      Se não houver localização, deixe vazio. Se não houver categoria clara, tente inferir a mais próxima.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return { category: query, location: "", tags: [] };
  }
};

export const generateProfileSummary = async (profileName: string, skills: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crie uma biografia profissional curta (máximo 3 frases) para ${profileName}. 
      Habilidades: ${skills.join(', ')}. O tom deve ser extremamente confiável e premium.`
    });
    return response.text;
  } catch (error) {
    return "Profissional verificado com excelência em serviços residenciais e comerciais.";
  }
};
