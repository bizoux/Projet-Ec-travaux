<template>
  <div class="chat-container">
    <div class="chat-messages" ref="chatMessages">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['chat-message', msg.sender]"
      >
        <span>{{ msg.content }}</span>
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="message"
        @keyup.enter="sendMessage"
        placeholder="Pose ta question BTP..."
      />
      <button @click="sendMessage">Envoyer</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      message: '',
      messages: [] // liste des messages {sender: 'user' | 'bot', content: string}
    };
  },
  methods: {
    async sendMessage() {
      if (!this.message.trim()) return;

      // Ajouter le message utilisateur
      this.messages.push({ sender: 'user', content: this.message });
      const userMessage = this.message;
      this.message = '';

      this.$nextTick(() => this.scrollToBottom());

      // Prompt spécialisé BTP
      const botPrompt = `
Tu es un expert en BTP spécialisé en maçonnerie et construction. 
Pour chaque demande, respecte les règles suivantes :
1. Donne la composition exacte (briques, ciment, sable, eau, acier, gravier) pour l'ouvrage demandé.
2. Calcule les quantités exactes selon les dimensions et volumes fournis.
3. Fournis un devis estimatif avec le coût des matériaux et de la main d'œuvre.
4. Ne parle que de BTP, de construction ou de travaux liés.
5. Si une information est manquante (prix ou dimension), demande-la avant de répondre.
Répond toujours de manière structurée et claire.
      `;

      try {
        const res = await axios.post(
          'https://api.mistral.ai/v1/chat/completions',
          {
            model: 'mistral-large-2411', // ou un modèle Mistral gratuit disponible
            messages: [
              { role: 'system', content: botPrompt },
              { role: 'user', content: userMessage }
            ]
          },
          {
            headers: {
              'Authorization': `Bearer i0MeewyZ1K7hFXLbkJtTPbxZ8t35MQOb`,
              'Content-Type': 'application/json'
            }
          }
        );

        const botReply =
          res.data.choices?.[0]?.message?.content || 'Pas de réponse';
        this.messages.push({ sender: 'bot', content: botReply });
        this.$nextTick(() => this.scrollToBottom());
      } catch (err) {
        console.error('Erreur Mistral :', err.response?.data || err.message);
        this.messages.push({ sender: 'bot', content: 'Erreur serveur' });
      }
    },
    scrollToBottom() {
      const container = this.$refs.chatMessages;
      container.scrollTop = container.scrollHeight;
    }
  }
};
</script>

<style scoped>
.chat-container {
  width: 400px;
  max-width: 100%;
  height: 500px;
  border: 2px solid #4a90e2;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: Arial, sans-serif;
  background-color: #f7f9fc;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.chat-message {
  max-width: 70%;
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 16px;
  word-wrap: break-word;
}

.chat-message.user {
  align-self: flex-end;
  background-color: #4a90e2;
  color: white;
}

.chat-message.bot {
  align-self: flex-start;
  background-color: #e5e5ea;
  color: black;
}

.chat-input {
  display: flex;
  border-top: 1px solid #ccc;
  padding: 8px;
  background-color: #fff;
}

.chat-input input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid #ccc;
  outline: none;
}

.chat-input button {
  margin-left: 8px;
  padding: 8px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.2s;
}

.chat-input button:hover {
  background-color: #357ab8;
}
</style>
