<template>
  <div class="fond">
    <div class="d-flex justify-content-center pa-5 gap-2">
      <v-avatar color="info">
        <v-img :src="profil" alt="Profil"></v-img>
      </v-avatar>
      <h4 style="font-family: 'MaRaleway', sans-serif;color:rgb(64, 67, 82);padding: 5px;">
        Bonjour <strong>{{ displayName }}</strong>
      </h4>
    </div>

    <div class="row pa-6">
      <!-- Projet -->
      <div class="col-md-4">
        <v-card max-width="368" style="background:linear-gradient(200deg,#0a6dcf31,#0c6fe923,#45a1f875);">
          <v-card-item title="Projet">
            <template v-slot:subtitle>
              <v-icon class="me-1 pb-1" color="error" icon="mdi-folder-open-outline" size="18" />
              EC TRAVAUX
            </template>
          </v-card-item>

          <v-card-text class="py-0">
            <v-row align="center" no-gutters>
              <v-col class="text-h2" cols="6">
                {{ displayProjet }}
              </v-col>
              <v-col class="text-right" cols="6">
                <v-icon color="success" icon="mdi-folder-open-outline" size="88" />
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <v-card-actions class="d-flex justify-content-end">
            <v-btn variant="flat" color="primary" class="text-none" prepend-icon="mdi-open-in-new">Voir</v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <!-- Désignation -->
      <div class="col-md-4">
        <v-card max-width="368" style="background:linear-gradient(200deg,#91e7d931,#5eb5bb23,#59d8d875);">
          <v-card-item title="Désignation">
            <template v-slot:subtitle>
              <v-icon class="me-1 pb-1" color="error" icon="mdi-factory" size="18" />
              EC TRAVAUX
            </template>
          </v-card-item>

          <v-card-text class="py-0">
            <v-row align="center" no-gutters>
              <v-col class="text-h2" cols="6">
                {{ displayDesignation }}
              </v-col>
              <v-col class="text-right" cols="6">
                <v-icon color="success" icon="mdi-factory" size="88" />
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <v-card-actions class="d-flex justify-content-end">
            <v-btn variant="flat" color="primary" class="text-none" prepend-icon="mdi-open-in-new" @click="goToDesignation">Voir</v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <!-- Travaux -->
      <div class="col-md-4">
        <v-card max-width="368" style="background:linear-gradient(200deg,#41ad5c31,#0bc9801f,#98ebb175);">
          <v-card-item title="Travaux">
            <template v-slot:subtitle>
              <v-icon class="me-1 pb-1" color="error" icon="mdi-hammer" size="18" />
              EC TRAVAUX
            </template>
          </v-card-item>

          <v-card-text class="py-0">
            <v-row align="center" no-gutters>
              <v-col class="text-h2" cols="6">
                {{ displayTravaux }}
              </v-col>
              <v-col class="text-right" cols="6">
                <v-icon color="success" icon="mdi-hammer" size="88" />
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <v-card-actions class="d-flex justify-content-end">
            <v-btn variant="flat" color="primary" class="text-none" prepend-icon="mdi-open-in-new">Voir</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
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
const user = ref(null);
const displayName = ref("Invité");

// Valeurs réelles
const totalProjet = ref(0);
const totalTravaux = ref(0);
const totalDesignation = ref(0);

// Valeurs animées affichées
const displayProjet = ref(0);
const displayTravaux = ref(0);
const displayDesignation = ref(0);

// Fonction d’animation fluide
function animateValue(displayRef, newValue) {
  gsap.to(displayRef, {
    duration: 0.6,
    value: newValue,
    ease: "power2.out",
    onUpdate: () => {
      displayRef.value = Math.floor(displayRef.value);
    },
  });
}

function goToDesignation() {
  router.push("/Designation");
}

onMounted(async () => {
  totalProjet.value = await db.Devis.count();
  totalTravaux.value = await db.Travaux.count();
  totalDesignation.value = await db.designation.count();

  // Animation des trois nombres
  animateValue(displayProjet, totalProjet.value);
  animateValue(displayTravaux, totalTravaux.value);
  animateValue(displayDesignation, totalDesignation.value);

  if (navigator.onLine) {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    user.value = currentUser;
    if (user.value) {
      displayName.value = user.value.user_metadata?.display_name || "RAKOTO";
    }
  } else {
    const session = await db.Session.get(1);
    if (session) {
      displayName.value = session.displayName || "Invité";
    }
  }
});
</script>

<style scoped>
.fond {
  background: linear-gradient(300deg, #1a808d31, #aac6dd, #356e9c2a);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.text-h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b3b3b;
  transition: all 0.3s ease;
}
</style>
