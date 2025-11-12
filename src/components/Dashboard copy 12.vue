<template>
  <div class="chat-container">
    <div class="chat-messages" ref="chatMessages">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['chat-message', msg.sender]"
        v-html="msg.content"
      ></div>
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
import axios from "axios";

export default {
  data() {
    return {
      message: "",
      messages: [],
    };
  },
  methods: {
    async sendMessage() {
      if (!this.message.trim()) return;

      this.messages.push({ sender: "user", content: this.message });
      const userMessage = this.message;
      this.message = "";

      this.$nextTick(() => this.scrollToBottom());

      // ✅ Prompt BTP amélioré avec structure bien séparée
      const botPrompt = `
Vous êtes un expert en BTP spécialisé en maçonnerie.
Quand on vous indique un type de maçonnerie (exemple : "maçonnerie de brique", "maçonnerie de moellon", "parpaing"),
vous devez donner une réponse claire et bien structurée comme ceci :

Type de maçonnerie : ...
<br><br>
<b>Quantité par m² :</b> ...
<br><br>
<b>Matériaux nécessaires pour 1 m² :</b>
exemple(<br>
- Ciment : ... kg
<br>
- Sable : ... m³
<br>
- Eau : ... L
<br>
- Autres : ...)

⚙️ Règles :
- Ne pas mettre les valeurs en gras.
- Ne pas ajouter d’explications ni phrases supplémentaires.
- Utiliser les balises <br> pour les retours à la ligne et <b> pour les titres demandés.
- Répondre avec ce format HTML proprement.
`;

      try {
        const res = await axios.post(
          "https://api.mistral.ai/v1/chat/completions",
          {
            model: "codestral-latest",
            messages: [
              { role: "system", content: botPrompt },
              { role: "user", content: userMessage },
            ],
          },
          {
            headers: {
              Authorization: `Bearer i0MeewyZ1K7hFXLbkJtTPbxZ8t35MQOb`,
              "Content-Type": "application/json",
            },
          }
        );

        const botReply =
          res.data.choices?.[0]?.message?.content || "Pas de réponse";

        this.messages.push({ sender: "bot", content: botReply });
        this.$nextTick(() => this.scrollToBottom());
      } catch (err) {
        console.error("Erreur Mistral :", err.response?.data || err.message);
        this.messages.push({
          sender: "bot",
          content: "<b>Erreur serveur</b>",
        });
      }
    },
    scrollToBottom() {
      const container = this.$refs.chatMessages;
      container.scrollTop = container.scrollHeight;
    },
  },
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
  max-width: 80%;
  margin-bottom: 10px;
  padding: 10px 14px;
  border-radius: 16px;
  word-wrap: break-word;
  line-height: 1.6;
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

.chat-message.bot b {
  font-weight: bold;
  color: #000;
}

.chat-message.bot br {
  margin-bottom: 4px;
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
