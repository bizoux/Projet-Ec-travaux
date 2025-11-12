<template>
  <div class="dashboard">
    <!-- En-tête avec profil -->
    <header class="header d-flex align-items-center justify-content-between p-4">
      <div class="d-flex align-items-center gap-3">
        <v-avatar size="60" class="shadow-sm">
          <v-img :src="profil" alt="Profil"></v-img>
        </v-avatar>
        <div>
          <h4 class="fw-bold mb-1 text-primary">Bonjour 👋, {{ displayName }}</h4>
          <p class="text-muted mb-0 small">Bienvenue sur votre tableau de bord</p>
        </div>
      </div>
      <v-btn color="primary" variant="tonal" prepend-icon="mdi-logout" @click="logout">
        Déconnexion
      </v-btn>
    </header>

    <!-- Contenu principal -->
    <main class="container py-5">
      <div class="row gy-4">
        <!-- Carte projet -->
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

const router = useRouter();
const displayName = ref("Invité");

// --- Données principales ---
const cards = ref([
  {
    title: "Projet",
    subtitle: "EC TRAVAUX",
    icon: "mdi-folder-open-outline",
    iconColor: "info",
    bg: "linear-gradient(135deg, #007bff1a, #00c4ff2a, #6ec1ff40)",
    total: 0,
    displayValue: 0,
    route: "/Projet",
    hover: false,
  },
  {
    title: "Désignation",
    subtitle: "EC TRAVAUX",
    icon: "mdi-factory",
    iconColor: "success",
    bg: "linear-gradient(135deg, #42ba9620, #8debd930, #b1f5d745)",
    total: 0,
    displayValue: 0,
    route: "/Designation",
    hover: false,
  },
  {
    title: "Travaux",
    subtitle: "EC TRAVAUX",
    icon: "mdi-hammer",
    iconColor: "warning",
    bg: "linear-gradient(135deg, #f1c40f22, #ffdd5720, #ffefba45)",
    total: 0,
    displayValue: 0,
    route: "/Travaux",
    hover: false,
  },
]);

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

async function logout() {
  await supabase.auth.signOut();
  router.push("/login");
}

// Chargement des données
onMounted(async () => {
  const [projet, travaux, designation] = await Promise.all([
    db.Devis.count(),
    db.Travaux.count(),
    db.designation.count(),
  ]);

  cards.value[0].total = projet;
  cards.value[1].total = designation;
  cards.value[2].total = travaux;

  cards.value.forEach((item) => animateValue(item, item.total));

  if (navigator.onLine) {
      //  En ligne → récupérer depuis Supabase
  
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      user.value = currentUser
  
      if (user.value) {
  
        displayName.value = user.value.user_metadata?.display_name || 'RAKOTO'
      
      }
    } else {
      // Hors ligne → récupérer depuis Dexie (Session)
  
      const session = await db.Session.get(1)
      if (session) {
  
        displayName.value = session.displayName || 'Invité'
  
      }
    }


});
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(180deg, #eaf3ff, #f6fbff);
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-hover {
  transition: all 0.3s ease;
  border-radius: 20px !important;
  cursor: pointer;
}

.display-number {
  font-size: 2.8rem;
  font-weight: 800;
  color: #2b2b2b;
}

.text-primary {
  color: #0d6efd !important;
}

.text-muted {
  color: #6c757d;
}
</style>
