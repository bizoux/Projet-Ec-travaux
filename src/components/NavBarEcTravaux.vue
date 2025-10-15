<template>
  <nav class="navbar navbar-expand-lg navbar-light shadow-sm py-3 fondNav">

    <div class="container">
        <router-link class="navbar-brand fw-bold Logo" to="/  ">
          EC TRAVAUX
        </router-link>
      <button
      class="navbar-toggler"
      type="button"
      @click="toggleMenu"
      aria-controls="navbarNav"
      aria-expanded="isMenuOpen"
      aria-label="Toggle navigation"
    >
    <span v-if="isMenuOpen" class="close-icon" style="color: red;font-size: 40px;">&times;</span> <!-- Icône "X" lorsqu'ouvert -->
    <span v-else class="navbar-toggler-icon"></span> <!-- Icône hamburger lorsqu'il est fermé -->
    </button>




          <!-- Liens de la navbar -->
          <div class="collapse navbar-collapse" :class="{ show: isMenuOpen }" id="navbarNav">
            
            
                <!-- Bouton de connexion/déconnexion -->
                <router-link to="/Connexion" class="btn btn-primary ms-3">Se connecter</router-link>

                <!-- Bouton de creation d'une compte -->
                <router-link to="/CreerCompte" class="btn btn-primary ms-3">Créer un compte</router-link>
                
          </div>



      
    </div>

  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      isMenuOpen: false, // État pour suivre si le menu est ouvert ou non
      menus: [
        { name: "Accueil", path: "/" },
        { name: "Matériel", path: "/Materiel" },
        { name: "Main d'oeuvre", path: "/MainOeuvre" },
        { name: "Matériaux", path: "/Materiaux" },
        { name: "bde", path: "/bde" },
        { name: "Sdp", path: "/Sdp" }
      ]
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen; // Inverse l'état du menu
    },
    closeMenu() {
      this.isMenuOpen = false; // Ferme le menu
    }
  }
};
</script>

<style scoped>
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

/* Bouton hamburger minimal */
.navbar-toggler {
  outline: none !important;
}

/* Shadow léger et arrondi */
.navbar {
  border-radius: 8px;
}

/* Mobile spacing */
@media (max-width: 992px) {
  .nav-link {
    margin-bottom: 8px;
  }
}
.fondNav{
  /* background-color: rgba(62, 149, 187, 0.548); */
  background: linear-gradient(3000deg,#a5deece0,#3589b9,#29bbce9a);
}
.Logo{
  color: rgb(22, 70, 173);
}
</style>
