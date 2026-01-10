
import { GoogleGenAI } from "@google/genai";
import { ChurchReport } from "../types";

// Fix: Initialize GoogleGenAI using a named parameter with process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsights = async (reports: ChurchReport[]): Promise<string> => {
  if (reports.length === 0) return "Não há dados suficientes para gerar insights.";

  const reportsSummary = reports.map(r => ({
    data: r.date,
    total: r.total,
    presenca: r.attendance,
    visitantes: r.visitors
  }));

  const prompt = `
    Como um consultor financeiro e administrativo para igrejas, analise os seguintes relatórios financeiros e de frequência:
    ${JSON.stringify(reportsSummary)}

    Forneça uma análise concisa sobre:
    1. Tendência de arrecadação.
    2. Relação entre presença e ofertas.
    3. Engajamento de visitantes.
    4. Uma sugestão prática para melhoria baseada nos números.
    
    Responda em Português do Brasil, de forma encorajadora e profissional.
  `;

  try {
    // Fix: Call generateContent directly from ai.models as per the latest guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Fix: Access response.text as a property, not a method
    return response.text || "Erro ao gerar análise.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, não consegui analisar os dados no momento.";
  }
};
