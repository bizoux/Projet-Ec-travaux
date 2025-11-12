<template>
  <div class="container mt-4">
    <h3 class="text-center mb-3">Liste des Projets</h3>

    <!-- Champ de recherche -->
    <input
      v-model="search"
      type="text"
      class="form-control mb-3"
      placeholder="Rechercher un projet..."
    />

    <!-- Cards des projets -->
    <div class="row">
      <div
        v-for="proj in filteredProjets"
        :key="proj.idProj"
        class="col-md-4 mb-3"
      >
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">{{ proj.NomMaitreOuvr }}</h5>
            <p class="card-text"><strong>Entreprise:</strong> {{ proj.Entreprise }}</p>
            <p class="card-text"><strong>Adresse:</strong> {{ proj.Adresse }}</p>
            <p class="card-text"><strong>Tâche:</strong> {{ proj.TacheEffect }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/db';

export default {
  data() {
    return {
      projets: [],
      search: ""
    };
  },
  computed: {
    filteredProjets() {
      const s = this.search.toLowerCase();
      return this.projets.filter(p =>
        p.NomMaitreOuvr.toLowerCase().includes(s) ||
        p.Entreprise.toLowerCase().includes(s) ||
        p.TacheEffect.toLowerCase().includes(s)
      );
    }
  },
  methods: {
    async loadProjets() {
      this.projets = await db.Projet.toArray();
    }
  },
  async mounted() {
    await this.loadProjets();
  }
};
</script>

<style scoped>
.card {
  border-radius: 12px;
  transition: transform 0.2s ease;
}
.card:hover {
  transform: scale(1.03);
}
</style>
