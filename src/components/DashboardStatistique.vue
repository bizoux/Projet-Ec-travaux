<template>
  <div class="dashboard">
    <!-- En-tête (déjà existant) -->
    <header class="header">
      <v-avatar size="64" color="primary" class="avatar">
        <v-img :src="profil" alt="Profil" />
      </v-avatar>
      <div class="header-text">
        <h3 class="titre">Bienvenue 👋</h3>
        <h2 class="nom">{{ displayName }}</h2>
        <p class="sous-titre">{{ email }}</p>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="container py-5">
      <div class="row gy-4">
        <!-- Cartes -->
        <div
          v-for="(item, i) in cards"
          :key="i"
          class="col-md-4"
          @mouseenter="hoverCard(i, true)"
          @mouseleave="hoverCard(i, false)"
        >
          <v-card
            class="rounded-4 card-hover"
            :elevation="item.hover ? 12 : 4"
            :style="{ background: item.bg }"
          >
            <v-card-item>
              <v-card-title class="fw-bold text-dark">{{ item.title }}</v-card-title>
              <v-card-subtitle class="d-flex align-items-center">
                <v-icon class="me-2" :color="item.iconColor" :icon="item.icon" size="20" />
                {{ item.subtitle }}
              </v-card-subtitle>
            </v-card-item>

            <v-card-text class="py-4">
              <div class="d-flex align-items-center justify-content-between">
                <span class="display-number">{{ item.displayValue }}</span>
                <v-icon :icon="item.icon" :color="item.iconColor" size="64" />
              </div>
            </v-card-text>

            <v-card-actions class="justify-content-end">
              <v-btn
                variant="tonal"
                color="primary"
                prepend-icon="mdi-open-in-new"
                class="text-none"
                @click="router.push(item.route)"
              >
                Voir
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>

      <!-- 📊 Section Graphique dynamique -->
      <div class="mt-8">
        <h3 class="text-center mb-4 text-primary fw-bold">Évolution des Projets</h3>
        <apexchart type="line" height="350" :options="chartOptions" :series="series" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";
import db from "@/db";
import { supabase } from "@/supabaseClient";
import profil from "@/assets/user.png";
import { useRouter } from "vue-router";
import VueApexCharts from "vue3-apexcharts";

const router = useRouter();
const displayName = ref("Invité");
const email = ref("");

const cards = ref([
  { title: "Projet", subtitle: "EC TRAVAUX", icon: "mdi-folder-open-outline", iconColor: "info", bg: "linear-gradient(135deg, #007bff1a, #00c4ff2a)", total: 0, displayValue: 0, route: "/Projet", hover: false },
  { title: "Désignation", subtitle: "EC TRAVAUX", icon: "mdi-factory", iconColor: "success", bg: "linear-gradient(135deg, #42ba9620, #8debd930)", total: 0, displayValue: 0, route: "/Designation", hover: false },
  { title: "Travaux", subtitle: "EC TRAVAUX", icon: "mdi-hammer", iconColor: "warning", bg: "linear-gradient(135deg, #f1c40f22, #ffdd5720)", total: 0, displayValue: 0, route: "/Travaux", hover: false },
]);

// 🔹 Données dynamiques du graphique
const series = ref([
  {
    name: "Projets terminés",
    data: [10, 15, 25, 22, 30, 45, 50], // Exemple initial
  },
]);

const chartOptions = ref({
  chart: {
    id: "projects-line",
    toolbar: { show: false },
    animations: { enabled: true, easing: "easeinout", speed: 800 },
  },
  xaxis: {
    categories: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  },
  stroke: { curve: "smooth", width: 3 },
  colors: ["#1976d2"],
  title: { text: "Progression hebdomadaire", align: "center" },
});

// Animation fluide du compteur
function animateValue(item, newValue) {
  gsap.to(item, {
    duration: 0.8,
    displayValue: newValue,
    roundProps: "displayValue",
    ease: "power2.out",
  });
}

function hoverCard(index, isHover) {
  cards.value[index].hover = isHover;
  gsap.to(`.col-md-4:nth-child(${index + 1})`, {
    scale: isHover ? 1.03 : 1,
    duration: 0.3,
    ease: "power1.out",
  });
}

onMounted(async () => {
  // Simulation de nouvelles données toutes les 3 secondes
  setInterval(() => {
    const newData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 60));
    series.value = [{ name: "Projets terminés", data: newData }];
  }, 3000);
});
</script>

<style scoped>
.mt-8 {
  margin-top: 4rem;
}
</style>
<script>
export default{
  components:{
    apexchart:VueApexCharts
  }
  
}
</script>
