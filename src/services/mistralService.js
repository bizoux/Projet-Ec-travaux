import axios from "axios";

const API_KEY = "qCVPADMi8IhLJiCig85OR84PU3ogmosh";
const API_URL = "https://api.mistral.ai/v1/chat/completions";

export async function sendMessageToMistral(message) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "mistral-small", // ou mistral-large
        messages: [
          {
            role: "system",
            content: `
              Tu es un assistant expert en BTP (Bâtiment et Travaux Publics).
              Tu aides les utilisateurs à résoudre des problèmes de construction,
              matériaux, gestion de chantier et normes techniques.
              Réponds de manière claire et professionnelle.
            `,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("Erreur Mistral :", err.response?.data || err.message);
    return "⚠️ Erreur : impossible de contacter l’agent IA.";
  }
}
