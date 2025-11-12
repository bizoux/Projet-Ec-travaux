<template>
  <div style="background:linear-gradient(180deg, #eaf3ff, #0833577c);" class="fill-height">
  <v-container class="py-8">
    <!-- Titre -->
    <div class="text-center mb-8">
      <v-icon icon="mdi-clipboard-list-outline" size="40" color="primary"></v-icon>
      <h2 class="font-weight-bold text-gradient mt-2">Liste des Projets</h2>
      <p class="text-medium-emphasis">Cliquez sur un projet pour voir ses détails</p>
    </div>

    <!-- Barre de recherche moderne -->
    <v-text-field
      v-model="search"
      label="Rechercher un projet..."
      hide-details
      clearable
      dense
      variant="outlined"
      prepend-inner-icon="mdi-magnify"
      class="modern-search mx-auto mb-6"
      style="max-width: 600px;"
    />

    <v-row dense class="g-6">
  <v-col
    v-for="proj in filteredProjets"
    :key="proj.idProj"
    cols="12"
    sm="6"
    lg="4"
  >
    <v-card class="d-flex align-center p-4 project-card" elevation="2" rounded="lg" :to="{ name: 'Materiel', query: { idProj: proj.idProj } }">
      <!-- Image miniature -->
      <v-img
        :src="proj.Image || 'https://via.placeholder.com/100'" 
        max-width="100"
        class="me-4"
        height="100"
        contain
        rounded="lg"
      ></v-img>

      <!-- Infos projet -->
      <div>
        <h3 class="mb-1">{{ proj.TacheEffect }}</h3>
        <p class="text-subtitle-2 mb-0">{{ proj.Entreprise }}</p>
      </div>

      <!-- Flèche navigation -->
      <v-spacer></v-spacer>
      <v-btn icon color="primary">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card>
  </v-col>
</v-row>


    <!-- Aucun projet -->
    <div v-if="filteredProjets.length === 0" class="text-center mt-10 text-medium-emphasis">
      <v-icon icon="mdi-inbox-outline" size="48" />
      <p>Aucun projet ne correspond à votre recherche.</p>
    </div>
  </v-container>
</div>
</template>

<script>
import db from "@/db";

export default {
  data() {
    return {
      projets: [],
      search: "",
    };
  },
  computed: {
    filteredProjets() {
      const s = this.search.toLowerCase();
      return this.projets.filter(
        (p) =>
          p.NomMaitreOuvr.toLowerCase().includes(s) ||
          p.Entreprise.toLowerCase().includes(s) ||
          p.TacheEffect.toLowerCase().includes(s)
      );
    },
  },
  methods: {
    async loadProjets() {
      this.projets = await db.Projet.toArray();
    },
  },
  async mounted() {
    await this.loadProjets();
  },
};
</script>

<style scoped>
/* Texte gradient pour le titre */
.text-gradient {
  background: linear-gradient(90deg, #1976d2, #00b4d8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Style moderne de la barre de recherche */
.modern-search .v-input__control {
  border-radius: 50px;
  background: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.modern-search:hover .v-input__control,
.modern-search:focus-within .v-input__control {
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.15);
  transform: translateY(-2px);
}

.modern-search input {
  padding: 12px 20px !important;
}

/* Cartes projet */
.project-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(25, 118, 210, 0.15);
}

::v-deep .v-field{
  background: rgb(248, 249, 250);
  border-radius: 15px;
}
</style>
