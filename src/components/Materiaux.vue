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
    <div class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold policeCategorie mb-0">Liste des matériaux</h3>

          <!-- 🔍 Recherche (toujours visible) -->
          <input 
            type="text" 
            v-model="searchQuery"
            class="form-control w-25 rounded-pill"
            placeholder="Rechercher un matériau..."
          />
        </div>

        <!-- Transition englobe à la fois le v-if et le v-else -->
        <transition name="fade">
          <!-- Si résultats trouvés -->
          <div v-if="filteredMateriaux.length" key="results">
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

          <!-- Si aucun résultat trouvé -->
          <div v-else key="no-results" class="text-center text-muted mt-4">
            <p>
              <font-awesome-icon icon="search" class="me-2 text-secondary" />
              Aucun matériau trouvé pour 
              <strong v-if="searchQuery">{{ searchQuery }}</strong>
              <span v-else>le moment.</span>
            </p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import db from "@/db";
import { syncFromSupabase, syncToSupabase } from "@/services/syncServiceMateriaux";

export default {
  data() {
    return {
      materiaux: [],
      searchQuery: "",
      _syncIntervalId: null, // pour pouvoir clearInterval proprement
    };
  },
  async mounted() {
    await this.chargerMateriaux();

    // Synchronisation auto toutes les 60s si en ligne
    this._syncIntervalId = setInterval(() => {
      if (navigator.onLine) {
        this.synchroniser();
      }
    }, 60000);

    if (navigator.onLine) {
      await this.synchroniser();
    }

    window.addEventListener("online", this._onOnline);
  },
  beforeUnmount() {
    // Nettoyage
    if (this._syncIntervalId) clearInterval(this._syncIntervalId);
    window.removeEventListener("online", this._onOnline);
  },
  computed: {
    // 🔍 Filtrage de la recherche
    filteredMateriaux() {
      if (!this.searchQuery.trim()) return this.materiaux;
      const q = this.searchQuery.toLowerCase();
      return this.materiaux.filter(
        (item) =>
          (item.Materiaux && item.Materiaux.toLowerCase().includes(q)) ||
          (item.Type && item.Type.toLowerCase().includes(q)) ||
          (item.Categorie && item.Categorie.toLowerCase().includes(q))
      );
    },

    // Regroupement par catégorie
    groupedFilteredData() {
      const groupe = {};
      for (const item of this.filteredMateriaux) {
        const cat = item.Categorie || "Sans catégorie";
        if (!groupe[cat]) groupe[cat] = [];
        groupe[cat].push(item);
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

    _onOnline: async function () {
      console.log("Connexion retrouvée. Synchronisation automatique...");
      await this.synchroniser();
    },

    // ✅ Import Excel sans doublons
    async importerExcel(event) {
      const file = event.target.files[0];
      if (!file) return;

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const existants = await db.Materiaux.toArray();

      const nouveaux = [];
      for (const row of jsonData) {
        const cat = (row["Categorie"] || "").trim();
        const type = (row["Type"] || "").trim();
        const mat = (row["Materiaux"] || "").trim();

        const dejaExiste = existants.some(
          (m) =>
            (m.Categorie || "").trim().toLowerCase() === cat.toLowerCase() &&
            (m.Type || "").trim().toLowerCase() === type.toLowerCase() &&
            (m.Materiaux || "").trim().toLowerCase() === mat.toLowerCase()
        );

        if (!dejaExiste && mat !== "") {
          nouveaux.push({
            Categorie: cat,
            Type: type,
            Materiaux: mat,
            Unites: row["Unites"] || "",
            Pu: parseFloat(row["Pu"] || 0) || 0,
            CoutTrans: parseFloat(row["CoutTrans"] || 0) || 0,
            PrixChantier: parseFloat(row["PrixChantier"] || 0) || 0,
          });
        }
      }

      if (nouveaux.length > 0) {
        await db.Materiaux.bulkPut(nouveaux);

        this.$swal({
          icon: "info",
          title: "Importation réussie",
          text: `${nouveaux.length} nouveau(x) matériau(x) ajouté(s).`,
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        this.$swal({
          icon: "info",
          title: "Aucun nouveau matériau ajouté",
          text: "Tous les matériaux du fichier existent déjà.",
          timer: 3000,
          showConfirmButton: false,
        });
      }

      this.materiaux = await db.Materiaux.toArray();
    },

    // stub si tu n'as pas encore la méthode réelle
    modaleSdp() {
      // Ouvre ton modal — remplace par ta logique réelle
      console.log("ouvrir modal nouveau matériau");
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
}

.policeCategorie {
  font-family: "MaRaleway", sans-serif;
  letter-spacing: 0.5px;
  font-size: 20px;
}

input[type="text"]::placeholder {
  font-style: italic;
}

/* 🌟 Transition pour le message d'absence de résultats */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
