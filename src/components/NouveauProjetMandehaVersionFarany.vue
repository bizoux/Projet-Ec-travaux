<template>
  <div class="fond">
    <br>
    <div class="bg-white p-2">
      <ul class="navbar-nav d-flex flex-row justify-content-evenly">
        <li class="nav-item" v-for="menu in menus" :key="menu.name">

          <router-link :to="{ name: menu.name }" class="nav-link px-3 py-2 rounded" active-class="active">{{ menu.name }}</router-link>
        </li>

      </ul>

    </div>

    <!-- Contenu du sous-menu -->
    <router-view></router-view>

    <!-- Chatbot -->
    <div id="chatbase-container"></div>
  </div>
</template>

<script>
export default {
  name: "NouveauProjet",
  data() {
    return {
     menus: [
              { name: "Materiel" },
              { name: "MainOeuvre" },
              { name: "Materiaux" },
              { name: "bde" },
              { name: "Sdp" }
            ]

    };
  },
  mounted() {
    window.embeddedChatbotConfig = {
      chatbotId: "hFED3whPa0DVOGqE8iLB9",
      domain: "www.chatbase.co",
    };
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "chatbase-script";
    script.defer = true;
    document.body.appendChild(script);
  },
};
</script>

<style scoped>
.fond {
  background-color: #f0f8ff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar, .nav-link {
  font-family: "Inter", "Helvetica", Arial, sans-serif;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.navbar-nav .nav-link {
  color: #000000;
  transition: all 0.3s ease;
}

.navbar-nav .nav-link:hover {
  color: #ffffff;
  background: linear-gradient(300deg, #1a808d, #1f659e, #356e9cf5);
}

.navbar-nav .nav-link.active {
  color: #ffffff;
  font-weight: 600;
  background: linear-gradient(300deg, #1a808d, #aac6dd, #356e9cf5);
}
</style>
