<template>
  <div class="chatbot">
    <div class="messages" ref="messagesContainer">
      <div v-for="(msg, index) in messages" :key="index" :class="msg.role">
        {{ msg.content }}
      </div>
    </div>
    <input
      v-model="userMessage"
      @keyup.enter="handleSend"
      placeholder="Tape ton message..."
    />
    <button @click="handleSend">Envoyer</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userMessage: "",
      messages: [],
    };
  },
  methods: {
    async handleSend() {
      if (!this.userMessage.trim()) return;

      // Ajouter le message de l'utilisateur
      this.messages.push({ role: "user", content: this.userMessage });

      const userText = this.userMessage;
      this.userMessage = "";

      try {
        // 🔗 Appel à l'Edge Function Supabase
        const response = await fetch(
          "https://johuyafwtdnkqvbxkwfg.supabase.co/functions/v1/openrouter-proxy",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [{ role: "user", content: userText }],
            }),
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const botMessage = data.choices[0].message.content;

        // Ajouter la réponse du bot
        this.messages.push({ role: "bot", content: botMessage });

        this.scrollToBottom();
      } catch (error) {
        console.error("Erreur OpenRouter:", error);
        this.messages.push({
          role: "bot",
          content: "Erreur lors de la communication avec le chatbot.",
        });
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        container.scrollTop = container.scrollHeight;
      });
    },
  },
};
</script>

<style>
.chatbot {
  max-width: 500px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
}
.messages {
  border: 1px solid #ccc;
  padding: 10px;
  height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
  background: #f9f9f9;
  border-radius: 8px;
}
.user {
  text-align: right;
  color: white;
  background-color: #007bff;
  margin: 5px 0;
  padding: 5px 10px;
  border-radius: 12px;
  display: inline-block;
}
.bot {
  text-align: left;
  color: white;
  background-color: #28a745;
  margin: 5px 0;
  padding: 5px 10px;
  border-radius: 12px;
  display: inline-block;
}
input {
  width: 75%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  padding: 8px 12px;
  margin-left: 5px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
