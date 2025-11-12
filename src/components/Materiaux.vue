<template>
  <div class="container-fluid pa-3">

    <!-- Formulaire -->
    <v-expansion-panels class="pa-7 fontPolice">
      <v-expansion-panel>
        <v-expansion-panel-title style="font-size: 20px; background: linear-gradient(200deg,#cfe4e421,#e4e4e465,#13626d23);">
          {{ modeEdition ? 'Modifier' : 'Nouveau' }} Matériau
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-form ref="form" @submit.prevent="modeEdition ? modifierMateriel() : ajouterMateriel()">
            <div class="row g-3">
              <div class="col-md-2">
                <v-text-field
                  v-model="Code"
                  color="primary"
                  label="Code"
                  variant="outlined"
                  :rules="[v => !!v || 'Code requis']"
                  required
                  clearable
                />
              </div>
              <div class="col-md-3">
                <v-text-field
                  v-model="Materiels"
                  color="primary"
                  label="Matériels"
                  variant="outlined"
                  :rules="[v => !!v || 'Matériel requis']"
                  required
                  clearable
                />
              </div>
              <div class="col-md-2">
                <v-text-field
                  v-model="Unite"
                  color="primary"
                  label="Unité"
                  variant="outlined"
                  :rules="[v => !!v || 'Unité requise']"
                  required
                  clearable
                />
              </div>
              <div class="col-md-2">
                <v-text-field
                  v-model="Prix"
                  color="primary"
                  label="Prix"
                  type="number"
                  min="0"
                  variant="outlined"
                  :rules="[v => !!v || 'Prix requis']"
                  required
                  clearable
                />
              </div>
              <div class="col-md-3">
                <v-text-field
                  v-model="Observation"
                  color="primary"
                  label="Observation"
                  variant="outlined"
                  clearable
                />
              </div>
            </div>

            <div class="mt-4 text-end">
              <v-btn type="submit" prepend-icon="mdi-check-circle" variant="elevated" color="primary" class="rounded-xl">
                {{ modeEdition ? 'Enregistrer' : 'Ajouter' }}
              </v-btn>
              <v-btn v-if="modeEdition" @click="annulerEdition" prepend-icon="mdi-close" variant="elevated" color="white" class="rounded-xl">
                Annuler
              </v-btn>
            </div>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Importation fichier Excel -->
    <div class="card shadow-lg border-0 rounded-4 p-4 mb-4 bg-light bg-opacity-75">
      <div class="pa-3">
        <h4 class="fw-bold text-primary mb-0">Importation matériaux</h4>
      </div>
      <input type="file" class="form-control mb-3" @change="importerExcel" />
    </div>

    <!-- Liste des matériaux -->
    <div class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold policeCategorie mb-0">Liste des matériaux</h3>
          <input 
            type="text" 
            v-model="searchQuery"
            class="form-control w-25 rounded-pill"
            placeholder="Rechercher un matériau..."
          />
        </div>

        <transition name="fade">
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
                      <th class="text-info">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in group" :key="item.idMateriau">
                      <td>{{ item.idMateriau }}</td>
                      <td>{{ item.Type }}</td>
                      <td>{{ item.Materiaux }}</td>
                      <td>{{ item.Unites }}</td>
                      <td>{{ item.Pu }}</td>
                      <td>{{ item.CoutTrans }}</td>
                      <td>{{ item.PrixChantier }}</td>
                      <td>
                        <v-btn icon color="warning" @click="editMateriel(item)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="error" @click="supprimerMateriel(item)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

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
      modeEdition: false,
      currentEditingId: null,
      Code: "",
      Materiels: "",
      Unite: "",
      Prix: "",
      Observation: "",
      _syncIntervalId: null
    };
  },
  async mounted() {
    await this.chargerMateriaux();
    this._syncIntervalId = setInterval(() => {
      if (navigator.onLine) this.synchroniser();
    }, 60000);
    if (navigator.onLine) await this.synchroniser();
    window.addEventListener("online", this._onOnline);
  },
  beforeUnmount() {
    if (this._syncIntervalId) clearInterval(this._syncIntervalId);
    window.removeEventListener("online", this._onOnline);
  },
  computed: {
    filteredMateriaux() {
      if (!this.searchQuery.trim()) return this.materiaux;
      const q = this.searchQuery.toLowerCase();
      return this.materiaux.filter(item =>
        (item.Materiaux && item.Materiaux.toLowerCase().includes(q)) ||
        (item.Type && item.Type.toLowerCase().includes(q)) ||
        (item.Categorie && item.Categorie.toLowerCase().includes(q))
      );
    },
    groupedFilteredData() {
      const groupe = {};
      for (const item of this.filteredMateriaux) {
        const cat = item.Categorie || "Sans catégorie";
        if (!groupe[cat]) groupe[cat] = [];
        groupe[cat].push(item);
      }
      return groupe;
    }
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
          m => (m.Categorie||"").trim().toLowerCase()===cat.toLowerCase() &&
               (m.Type||"").trim().toLowerCase()===type.toLowerCase() &&
               (m.Materiaux||"").trim().toLowerCase()===mat.toLowerCase()
        );
        if (!dejaExiste && mat !== "") {
          nouveaux.push({
            Categorie: cat,
            Type: type,
            Materiaux: mat,
            Unites: row["Unites"] || "",
            Pu: parseFloat(row["Pu"] || 0) || 0,
            CoutTrans: parseFloat(row["CoutTrans"] || 0) || 0,
            PrixChantier: parseFloat(row["PrixChantier"] || 0) || 0
          });
        }
      }
      if (nouveaux.length > 0) {
        await db.Materiaux.bulkPut(nouveaux);
        this.$swal({ icon: "info", title: "Importation réussie", text: `${nouveaux.length} nouveau(x) matériau(x) ajouté(s).`, timer:3000, showConfirmButton:false });
      } else {
        this.$swal({ icon: "info", title: "Aucun nouveau matériau ajouté", text: "Tous les matériaux du fichier existent déjà.", timer:3000, showConfirmButton:false });
      }
      this.materiaux = await db.Materiaux.toArray();
    },
    resetForm() {
      this.Code = "";
      this.Materiels = "";
      this.Unite = "";
      this.Prix = "";
      this.Observation = "";
    },
    async ajouterMateriel() {
      const newMat = {
        idMateriau: Date.now(),
        Code: this.Code,
        Materiaux: this.Materiels,
        Unites: this.Unite,
        Pu: parseFloat(this.Prix) || 0,
        Observation: this.Observation || "",
        Type: "Standard",
        Categorie: "Général",
        CoutTrans: 0,
        PrixChantier: parseFloat(this.Prix) || 0
      };
      await db.Materiaux.add(newMat);
      this.materiaux.push(newMat);
      this.resetForm();
      this.$swal({ icon:"success", title:"Matériau ajouté !" });
    },
    async modifierMateriel() {
      const updated = {
        Code: this.Code,
        Materiaux: this.Materiels,
        Unites: this.Unite,
        Pu: parseFloat(this.Prix) || 0,
        Observation: this.Observation || "",
        PrixChantier: parseFloat(this.Prix) || 0
      };
      await db.Materiaux.update(this.currentEditingId, updated);
      const index = this.materiaux.findIndex(m => m.idMateriau===this.currentEditingId);
      if (index !== -1) this.materiaux[index] = {...this.materiaux[index], ...updated};
      this.resetForm();
      this.modeEdition=false;
      this.currentEditingId=null;
      this.$swal({ icon:"success", title:"Matériau modifié !" });
    },
    annulerEdition() {
      this.resetForm();
      this.modeEdition=false;
      this.currentEditingId=null;
    },
    editMateriel(mat) {
      this.modeEdition=true;
      this.currentEditingId=mat.idMateriau;
      this.Code=mat.Code;
      this.Materiels=mat.Materiaux;
      this.Unite=mat.Unites;
      this.Prix=mat.Pu;
      this.Observation=mat.Observation||"";
    },
    async supprimerMateriel(mat) {
      const res = await this.$swal({
        title: 'Confirmer la suppression ?',
        text: `Matériau : ${mat.Materiaux}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      });
      if (res.isConfirmed) {
        await db.Materiaux.delete(mat.idMateriau);
        this.materiaux=this.materiaux.filter(m=>m.idMateriau!==mat.idMateriau);
        this.$swal({ icon:"success", title:"Matériau supprimé !" });
      }
    }
  }
};
</script>

<style scoped>
.container { max-width: 900px; }
.policeCategorie { font-family: "MaRaleway", sans-serif; letter-spacing:0.5px; font-size:20px; }
input[type="text"]::placeholder { font-style: italic; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
