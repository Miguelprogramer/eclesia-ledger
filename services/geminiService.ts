
import { ChurchReport } from "../types";

const GITHUB_MODELS_API_URL = "https://api.inference.github.com/v1/chat/completions";
const API_KEY = process.env.GITHUB_MODELS_API_KEY || process.env.API_KEY;

export const getFinancialInsights = async (reports: ChurchReport[]): Promise<string> => {
  if (reports.length === 0) return "Não há dados suficientes para gerar insights.";

  if (!API_KEY) {
    console.error("GitHub Models API Key não configurada");
    return "Chave de API não configurada. Configure GITHUB_MODELS_API_KEY no arquivo .env";
  }

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
    const response = await fetch(GITHUB_MODELS_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("GitHub Models API Error:", errorData);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Erro ao gerar análise.";
  } catch (error) {
    console.error("GitHub Models Error:", error);
    return "Desculpe, não consegui analisar os dados no momento.";
  }
};
