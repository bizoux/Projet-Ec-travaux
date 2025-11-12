<template>
  <div class="container col-md-3 chatbot-container">

    <!-- Titre -->
    <div class="chatbot-header">
      <h4 class="fw-bold text-primary mb-0">
        🤖 Chatbot BTP Assistant
      </h4>
    </div>

    <!-- Zone des messages -->
    <div class="chatbot-messages" ref="messagesContainer">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message"
        :class="msg.role"
      >
        <div class="message-bubble shadow-sm">
          <span v-if="msg.role === 'user'" class="fw-semibold text-dark">👷 Vous :</span>
          <span v-else class="fw-semibold text-primary">🤖 Bot :</span>
          <p class="m-0">{{ msg.content }}</p>
        </div>
      </div>
    </div>

    <!-- Zone de saisie -->
    <div class="chatbot-input mt-3 d-flex align-items-center">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        class="form-control shadow-sm me-2"
        type="text"
        placeholder="Écrire un message..."
      />
      <button class="btn btn-primary rounded-circle" @click="sendMessage">
        <font-awesome-icon icon="paper-plane" />
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const messages = ref([
  { role: "assistant", content: "Bonjour 👋, comment puis-je vous aider sur votre projet BTP ?" },
]);

const newMessage = ref("");
const messagesContainer = ref(null);

function sendMessage() {
  if (!newMessage.value.trim()) return;

  // Ajouter message utilisateur
  messages.value.push({ role: "user", content: newMessage.value });
  const userMsg = newMessage.value;
  newMessage.value = "";

  // Scroll vers le bas
  nextTick(() => {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  });

  // Simulation réponse du bot
  setTimeout(() => {
    let botReply = "";

    if (userMsg.toLowerCase().includes("fondation")) {
      botReply = "Les fondations sont la base du projet 🏗️. Vous voulez des conseils sur le type (semelle, radier, pieux) ?";
    } else if (userMsg.toLowerCase().includes("materiaux")) {
      botReply = "Les matériaux essentiels sont : ciment, sable, gravier, fer à béton, eau. Souhaitez-vous voir les quantités estimatives ?";
    } else if (userMsg.toLowerCase().includes("plan")) {
      botReply = "Je peux vous aider à structurer un plan de construction 📐. Voulez-vous un exemple pour un bâtiment R+1 ?";
    } else {
      botReply = "Je prends note 👷‍♂️. Pouvez-vous préciser votre question liée au chantier ou au matériel ?";
    }

    messages.value.push({ role: "assistant", content: botReply });

    nextTick(() => {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    });
  }, 800);
}
</script>

<style scoped>
/* ======================= */
/* 🌈 MODALE GLOBALE */
/* ======================= */

.bloc-modale {
  position: fixed;
  top: 0; bottom: 0; left: 0; right: 0;
  width: 100%; height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.overlay {
  background: rgba(0, 0, 0, 0.295);
  position: fixed;
  top: 0; bottom: 0; left: 0; right: 0;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  transition: backdrop-filter 0.3s ease, background 0.3s ease;
  z-index: 9998;
}

.modale {
  background: linear-gradient(200deg, #02303065, #557497, #00bbd49a);
  color: #fff;
  padding: 35px;
  position: fixed;
  z-index: 10000;
  border-radius: 15px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.3);
}

.btn-modale {
  position: absolute;
  top: 10px;
  right: 10px;
}

.styleTexte {
  font-family: 'Gill Sans MT', Calibri, sans-serif;
  color: white;
  text-align: center;
}

.form-label {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  font-size: 16px;
}

.btn-primary {
  font-size: 18px;
  border-radius: 30px;
  padding: 8px 20px;
}

/* ======================= */
/* 🤖 CHATBOT MODERNE */
/* ======================= */

.chatbot-container {
  background: linear-gradient(200deg, #ffffffb2, #d3e4e8);
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.chatbot-header {
  background: rgba(0, 88, 124, 0.1);
  border-radius: 15px;
  padding: 10px;
  text-align: center;
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 15px;
  scroll-behavior: smooth;
  max-height: 350px;
}

.message {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;
}

.message-bubble {
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 85%;
  line-height: 1.4;
}

.message.user .message-bubble {
  background: linear-gradient(200deg, #007b8a, #0d8c9a);
  color: #fff;
  align-self: flex-end;
}

.message.assistant .message-bubble {
  background: #ffffff;
  color: #333;
  align-self: flex-start;
  border: 1px solid #d0e4e7;
}

.chatbot-input input {
  border-radius: 50px;
  padding: 10px 15px;
  border: 1px solid #cfd8dc;
  transition: 0.2s;
  flex: 1;
}

.chatbot-input input:focus {
  border-color: #007b8a;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 138, 0.25);
}

.chatbot-input button {
  background-color: #007b8a;
  border: none;
  color: white;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chatbot-input button:hover {
  background-color: #056e7a;
}

/* Animation d'apparition */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scroll personnalisé */
.chatbot-messages::-webkit-scrollbar {
  width: 6px;
}
.chatbot-messages::-webkit-scrollbar-thumb {
  background: #007b8a;
  border-radius: 10px;
}
.chatbot-messages::-webkit-scrollbar-track {
  background: transparent;
}
</style>
