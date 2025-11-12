<template>
  <div>
    <input v-model="message" placeholder="Tape ton message" />
    <button @click="sendMessage">Envoyer</button>
    <div v-if="response">{{ response }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      message: '',
      response: ''
    }
  },
  methods: {
    async sendMessage() {
      try {
        const res = await axios.post(
          'https://api.mistral.ai/v1/chat/completions',
          {
            model: 'mistral-large-2411', // ou le modèle que tu utilises
            messages: [{ role: 'user', content: this.message }]
          },
          {
            headers: {
              'Authorization': `Bearer i0MeewyZ1K7hFXLbkJtTPbxZ8t35MQOb`,
              'Content-Type': 'application/json'
            }
          }
        );

        this.response = res.data.choices?.[0]?.message?.content || 'Pas de réponse';
      } catch (err) {
        console.error('Erreur Mistral :', err.response?.data || err.message);
        this.response = 'Erreur serveur';
      }
    }
  }
}
</script>
