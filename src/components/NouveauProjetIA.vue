<template>
<div class="fond">
<br>
<div class="bg-white p-2">
    <ul class="navbar-nav d-flex flex-row justify-content-evenly">
          <li class="nav-item" v-for="menu in menus" :key="menu.name">
            <router-link :to="menu.path ? `/NouveauProjet/${menu.path}` : '/NouveauProjet/Materiel'" class="nav-link px-3 py-2 rounded" active-class="active">
              {{ menu.name }}
            </router-link>
          </li>
    </ul>
</div>

<!-- Contenu sous le menu -->
<router-view></router-view>




<!-- Ici, le conteneur pour le chatbot si nécessaire -->
    <div id="chatbase-container"></div>
</div>

</template>
<script>
export default{
    name:"NouveauProjet",
      data() {
    return {
      menus: [

        { name: "Materiel", path: "Materiel" },
        { name: "Main d'oeuvre", path: "MainOeuvre" },
        { name: "Materiaux", path: "Materiaux" },
        { name: "bde", path: "bde" },
        { name: "Sdp", path: "Sdp" }
      ]
    };
  },
  mounted() {
    // Charger dynamiquement le script Chatbase
    window.embeddedChatbotConfig = {
      chatbotId: "hFED3whPa0DVOGqE8iLB9",
      domain: "www.chatbase.co"
    };
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "chatbase-script";
    script.defer = true;
    document.body.appendChild(script);
  }
}
</script>

<style scoped>
    /* Fond du composant complet */
.fond {
  background-color: #f0f8ff; /* couleur de ton choix */
  min-height: 100vh;         /* occupe toute la hauteur de la fenêtre */
  display: flex;
  flex-direction: column;        /* s'assure que le fond prend toute la hauteur */
}

    /* Typographie moderne */
.navbar, .nav-link {
  font-family: "Inter", "Helvetica", Arial, sans-serif;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.5px;
}
/* Lien menu */
.navbar-nav .nav-link {
  color: #000000;
  transition: all 0.3s ease;
}

.navbar-nav .nav-link:hover {
  color: #ffffff;
  background: linear-gradient(300deg,#1a808d,#1f659e,#356e9cf5);
}

.navbar-nav .nav-link.active {
  color: #ffffff;
  font-weight: 600;
  background: linear-gradient(300deg,#1a808d,#aac6dd,#356e9cf5);
}
</style>