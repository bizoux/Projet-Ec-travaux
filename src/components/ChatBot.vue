<template>
    <div class="container">
      <h2>🤖 Chatbot BTP Assistant</h2>
  
      <div class="chat-box">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="message"
          :class="msg.role"
        >
          <b>{{ msg.role === 'user' ? '👷 Vous:' : '🤖 Bot:' }}</b>
          <pre>{{ msg.content }}</pre>
        </div>
      </div>
  
      <div class="input-area">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Pose ta question sur le BTP..."
        />
        <button @click="sendMessage">Envoyer</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  
  const messages = ref([]);
  const userInput = ref("");
  
  // ⚠️ Mets ta clé dans .env
  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  const sendMessage = async () => {
    if (!userInput.value.trim()) return;
  
    messages.value.push({ role: "user", content: userInput.value });
  
    const systemPrompt = `
    Tu es un assistant expert en BTP.
    Donne toujours des réponses TRÈS COURTES et formatées clairement.
    N’explique rien, ne fais pas de phrases longues.
    Formate comme ceci :
  
    Quantité par m3 (ou m2) : ...
    Matériaux nécessaires : ...
  
    Si ce n’est pas une question de BTP, réponds simplement "Question non liée au BTP".
    `;
  
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-3.5-turbo", // ou "gpt-4-turbo" si disponible
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.value,
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const botReply = response.data.choices[0].message.content.trim();
      messages.value.push({ role: "assistant", content: botReply });
      userInput.value = "";
    } catch (err) {
      console.error(err);
      messages.value.push({
        role: "assistant",
        content: "⚠️ Erreur lors de la génération de la réponse.",
      });
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 500px;
    margin: auto;
    font-family: 'Segoe UI', sans-serif;
    text-align: center;
  }
  .chat-box {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 1em;
    height: 400px;
    overflow-y: auto;
    margin-bottom: 1em;
    background-color: #f9f9f9;
  }
  .message {
    margin: 0.5em 0;
    text-align: left;
    white-space: pre-wrap;
  }
  .message.user {
    text-align: right;
    color: #0c4a6e;
  }
  .message.assistant {
    color: #2563eb;
  }
  .input-area {
    display: flex;
    gap: 8px;
  }
  input {
    flex: 1;
    padding: 0.6em;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
  button {
    padding: 0.6em 1em;
    border-radius: 6px;
    background-color: #2563eb;
    color: white;
    border: none;
  }
  button:hover {
    background-color: #1d4ed8;
  }
  </style>
  