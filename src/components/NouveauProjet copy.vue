<template>
  <div class="fond">
    <br>
    <div class="p-2" style="background:linear-gradient(50deg,#00000021,#0e0c0c0c,#00000023);">
      <ul class="navbar-nav d-flex flex-row justify-content-evenly">
  <li class="nav-item" v-for="menu in menus" :key="menu.name">
    <router-link 
      :to="{ name: menu.name, query: $route.query }" 
      class="nav-link px-3 py-2 rounded" 
      active-class="active">
      {{ menu.name }}
    </router-link>
  </li>
</ul>


    </div>

    <!-- Contenu du sous-menu -->
    <v-slide-x-transition>
      <router-view></router-view>
    </v-slide-x-transition>  
    <!-- Chatbot -->
    <!-- <div id="chatbase-container"></div> -->
  </div>
</template>

<script>
export default {
  name: "NouveauProjet",
  data() {
    return {
     menus: [
              { name: "Materiel" },
              { name: "Main d'oeuvre" },
              { name: "Materiaux" },
              { name: "bde" },
              { name: "Sdp" }
            ]

    };
  },
};
</script>

<style scoped>
.fond {
  background:linear-gradient(300deg, #1a808d31, #aac6dd, #356e9c2a);
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
  font-family:'MaRaleway',sans-serif;
}

.navbar-nav .nav-link:hover {
  color: #ffffff;
  background: linear-gradient(300deg, #1a808d, #1f659e, #356e9cf5);
  font-family:'MaRaleway',sans-serif;
}

.navbar-nav .nav-link.active {
  color: #ffffff;
  font-weight: 600;
  background: linear-gradient(300deg, #1a808d, #aac6dd, #356e9cf5);
  font-family:'MaRaleway',sans-serif;
}
</style>
