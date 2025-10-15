<template>
  <div class="container-fluid pa-3">

    <!-- Section Import -->
    <div class="card shadow-lg border-0 rounded-4 p-4 mb-4 bg-light bg-opacity-75">
      <div class="pa-3">
        <div class="d-flex justify-content-end">
          <button 
            class="btn btn-outline-primary d-flex align-items-center gap-2 rounded-pill"
            @click="modaleSdp"
          >
            <font-awesome-icon icon="plus-circle" style="font-size: 20px;" />
            <span>Nouveau matériaux</span>
          </button>
        </div>
      </div>

      <!-- Champ import Excel -->
      <input type="file" class="form-control mb-3" @change="importerExcel" />
    </div>

    <!-- Liste des matériaux -->
    <div v-if="filteredMateriaux.length" class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold policeCategorie mb-0">Liste des matériaux</h3>

          <!-- 🔍 Recherche -->
          <input 
            type="text" 
            v-model="searchQuery"
            class="form-control w-25 rounded-pill"
            placeholder="Rechercher un matériau..."
          />
        </div>

        <!-- Tableau groupé par catégorie -->
        <div v-for="(group, cat) in groupedFilteredData" :key="cat" class="mb-4">
          <h4 class="fw-bold text-primary border-bottom pb-2 mb-3 policeCategorie">{{ cat }}</h4>

          <div class="table-responsive">
            <table class="table table-hover table-striped align-middle">
              <thead class="table-primary">
                <tr>
                  <th class="text-info">ID</th>
                  <th class="text-info">Type</th>
                  <th class="text-info">Matériaux</th>
                  <th class="text-info">Unité</th>
                  <th class="text-info">PU (Ar)</th>
                  <th class="text-info">Coût Transport</th>
                  <th class="text-info">Prix Chantier</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in group" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.Type }}</td>
                  <td>{{ item.Materiaux }}</td>
                  <td>{{ item.Unites }}</td>
                  <td>{{ item.Pu }}</td>
                  <td>{{ item.CoutTrans }}</td>
                  <td>{{ item.PrixChantier }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Si aucun matériau -->
    <div v-else class="text-center text-muted mt-4">
      <p>Aucun matériau importé pour le moment.</p>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import db from '@/db';
import { syncFromSupabase, syncToSupabase } from '@/services/syncServiceMateriaux';

export default {
  data() {
    return {
      materiaux: [],
      searchQuery: "",
    };
  },
  async mounted() {
    await this.chargerMateriaux();

    // Synchronisation toutes les 60s si en ligne
    setInterval(() => {
      if (navigator.onLine) {
        this.synchroniser();
      }
    }, 60000);

    if (navigator.onLine) {
      await this.synchroniser();
    }

    window.addEventListener('online', async () => {
      console.log('Connexion retrouvée. Synchronisation automatique...');
      await this.synchroniser();
    });
  },
  computed: {
    // 🔍 Filtrage de la recherche
    filteredMateriaux() {
      if (!this.searchQuery.trim()) return this.materiaux;
      const q = this.searchQuery.toLowerCase();
      return this.materiaux.filter(item =>
        (item.Materiaux && item.Materiaux.toLowerCase().includes(q)) ||
        (item.Type && item.Type.toLowerCase().includes(q)) ||
        (item.Categorie && item.Categorie.toLowerCase().includes(q))
      );
    },

    // Regroupement des matériaux par catégorie
    groupedFilteredData() {
      const groupe = {};
      for (const item of this.filteredMateriaux) {
        if (!groupe[item.Categorie]) groupe[item.Categorie] = [];
        groupe[item.Categorie].push(item);
      }
      return groupe;
    },
  },
  methods: {

    
    async chargerMateriaux() {
      this.materiaux = await db.Materiaux.toArray();
    },

    async synchroniser() {
      await syncToSupabase();
      await syncFromSupabase();
      await this.chargerMateriaux();
    },

    // ✅ Import Excel sans doublons
    async importerExcel(event) {
      const file = event.target.files[0];
      if (!file) return;

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Récupère les matériaux existants
      const existants = await db.Materiaux.toArray();

      const nouveaux = [];
      for (const row of jsonData) {
        const cat = (row["Categorie"] || '').trim();
        const type = (row["Type"] || '').trim();
        const mat = (row["Materiaux"] || '').trim();

        // Vérifie si ce matériau existe déjà (même catégorie + type + nom)
        const dejaExiste = existants.some(
          (m) =>
            m.Categorie?.trim().toLowerCase() === cat.toLowerCase() &&
            m.Type?.trim().toLowerCase() === type.toLowerCase() &&
            m.Materiaux?.trim().toLowerCase() === mat.toLowerCase()
        );

        if (!dejaExiste && mat !== "") {
          nouveaux.push({
            id: Date.now() + Math.random(), // ID unique
            Categorie: cat,
            Type: type,
            Materiaux: mat,
            Unites: row["Unites"] || '',
            Pu: parseFloat(row["Pu"] || 0),
            CoutTrans: parseFloat(row["CoutTrans"] || 0),
            PrixChantier: parseFloat(row["PrixChantier"] || 0),
          });
        }
      }

      if (nouveaux.length > 0) {
        await db.Materiaux.bulkPut(nouveaux);

        this.$swal({
        icon:'info',
        title:'Importation réussie',
        text:`${nouveaux.length} nouveau(x) matériaux(s) ajouté(s).`,
        timer:3000,
        showConfirmButton:false
      })



      } else {

        
        this.$swal({
        icon:'info',
        title:'Aucun nouveau matériau ajouté',
        text:"Tous les matériaux du fichier existent déjà.",
        timer:3000,
        showConfirmButton:false
      })

          

      }

      // Recharge la liste
      this.materiaux = await db.Materiaux.toArray();
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
}

.policeCategorie {
  font-family: 'MaRaleway', sans-serif;
  letter-spacing: 0.5px;
  font-size: 20px;
}

input[type="text"]::placeholder {
  font-style: italic;
}
</style>
