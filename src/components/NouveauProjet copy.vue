<template>

<ul class="navbar-nav ms-auto">
          <li class="nav-item" v-for="menu in menus" :key="menu.name">
            <router-link :to="menu.path ? `/NouveauProjet/${menu.path}` : '/NouveauProjet'" class="nav-link px-3 py-2 rounded" active-class="active">
              {{ menu.name }}
            </router-link>
          </li>
</ul>

<!-- Contenu sous le menu -->
    <div class="content-wrapper mt-5 pt-3">
      <router-view></router-view>
    </div>


</template>
<script>
export default{
    name:"NouveauProjet",
      data() {
    return {
      menus: [

        { name: "Materiel", path: "Materiel" },
        { name: "MainOeuvre", path: "MainOeuvre" },
        { name: "Materiaux", path: "Materiaux" },
        { name: "bde", path: "bde" },
        { name: "Sdp", path: "Sdp" }
      ]
    };
  }
}
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
</style>