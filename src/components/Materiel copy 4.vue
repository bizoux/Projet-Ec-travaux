<template>
  <div class="container my-4">

    <!-- Titre principal -->
    <div class="card shadow border-0 rounded-4 mb-4 p-4 text-center" style="background:linear-gradient(250deg,#cfe4e421,#c6d2dfc5,#a4c3c700);">
      <h2 class="fw-bold text-primary mb-2" style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;">
        Tarif location matériels et Outillages en vue de leur amortissement
      </h2>
      <p class="fw-semibold text-secondary">(Inclut chauffeur ou machiniste)</p>
    </div>

    <!-- État et mode -->
    <div class="text-end mb-4">
      <span class="badge rounded-pill px-3 py-2"
            :class="estEnLigne ? 'bg-success' : 'bg-danger'">
        {{ estEnLigne ? '🟢 En ligne' : '🔴 Hors ligne' }}
      </span>
    </div>

    <!-- Formulaire -->
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title style="font-size: 20px;">{{ modeEdition ? 'Modifier' : 'Nouveau' }} Matériel</v-expansion-panel-title>
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
              <v-btn type="submit" prepend-icon="mdi-check-circle" variant="elevated" color="primary" class="rounded-xl">{{ modeEdition ? 'Enregistrer' : 'Ajouter' }}</v-btn>&nbsp;
              <v-btn v-if="modeEdition" @click="annulerEdition" prepend-icon="mdi-close" variant="elevated" color="white" class="rounded-xl">Annuler</v-btn>&nbsp;
            
            </div>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <br>

    <!-- Tableau matériel -->
    <div class="card shadow border-0 rounded-4 mb-4 p-4 text-center" style="background:linear-gradient(200deg,#cfe4e421,#c6d2dfc5,#a4c3c700);">
      <h3 class="fw-bold text-primary mb-2">Liste des Matériels</h3>

      <!-- Champ de recherche -->
      <div class="d-flex justify-content-end">
        <v-text-field
          color="primary"
          v-model="search"
          label="Rechercher par code ou matériel"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          style="max-width: 350px;"
        />
      </div>

      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        item-value="Code"
        @update:options="loadItems"
        class="elevation-3 rounded-xl custom-table"
        density="comfortable"
        hover
        :footer-props="{ 'items-per-page-text': 'Lignes par page', 'items-per-page-options': [5, 10, 20, 50] }"
      > 
        <!-- Colonne actions --> 
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="30" color="success" @click="remplirFormulaire(item)"></v-btn>&nbsp;
          <v-btn icon="mdi-delete" size="30" color="error" @click="supprimerMateriel(item.Code)" ></v-btn> 
        </template> 
      </v-data-table-server>
    </div> 

    <!-- Bouton PDF -->
    <div class="mt-4 text-end">
      <button @click="genererPDF" class="btn btn-outline-success px-4 rounded-pill hover-grow">
        Télécharger le PDF
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '@/assets/Voiture.png';
import * as XLSX from 'xlsx';
import db from '@/db';
import { supabase } from '@/supabaseClient';
import { syncFromSupabase, syncToSupabase } from '@/services/syncServiceMateriel';

export default {
  name: 'Materiel',
  setup() {
    const itemsPerPage = ref(5) 
    const headers = ref([ 
      { title: "Code", key: "Code", align: "start" }, 
      { title: "Matériels", key: "Materiels", align: "start" }, 
      { title: "Unité", key: "Unite", align: "start" }, 
      { title: "Prix", key: "Prix", align: "end" }, 
      { title: "Observation", key: "Observation", align: "start" }, 
      { title: "Actions", key: "actions", align: "center", sortable: false } 
    ]) 

    const serverItems = ref([]) 
    const loading = ref(true) 
    const totalItems = ref(0) 
    const Code = ref('');
    const Materiels = ref('');
    const Unite = ref('');
    const Prix = ref('');
    const Observation = ref('');
    const Listemateriels = ref([]);
    const estEnLigne = ref(navigator.onLine);
    const modeEdition = ref(false);
    const idEnCours = ref(null);
    const search = ref('');
    const form = ref();
    const annuler = async () => {
      form.value.reset()
    };

    async function loadItems({ page = 1, itemsPerPage = 5, sortBy = [] } = {}) { 
      loading.value = true;
      let items = await db.materiel.toArray();

      // Filtrage par Code ou Matériels
      if (search.value) {
        const query = search.value.toLowerCase();
        items = items.filter(
          (mat) =>
            String(mat.Code).toLowerCase().includes(query) ||
            String(mat.Materiels).toLowerCase().includes(query)
        );
      }

      // Tri
      if (sortBy.length) { 
        const sortKey = sortBy[0].key 
        const sortOrder = sortBy[0].order 
        items.sort((a, b) => { 
          const aVal = a[sortKey]; 
          const bVal = b[sortKey]; 
          if (typeof aVal === "number" && typeof bVal === "number") { 
            return sortOrder === "desc" ? bVal - aVal : aVal - bVal; 
          } else { 
            return sortOrder === "desc"
              ? String(bVal).localeCompare(String(aVal)) 
              : String(aVal).localeCompare(String(bVal)); 
          } 
        }); 
      } 

      // Pagination 
      const start = (page - 1) * itemsPerPage; 
      const end = start + itemsPerPage; 
      const paginated = items.slice(start, end); 

      serverItems.value = paginated; 
      totalItems.value = items.length; 
      loading.value = false; 
    } 

    // recharge quand on tape dans la recherche
    watch(search, () => {
      loadItems();
    });

    const chargerMateriels = async () => {
      Listemateriels.value = await db.materiel.toArray();
    };

    const ajouterMateriel = async () => {
      await db.materiel.add({
        Code: parseInt(Code.value),
        Materiels: Materiels.value,
        Unite: Unite.value,
        Prix: Prix.value,
        Observation: Observation.value
      });
      annulerEdition();
      await chargerMateriels();
      await loadItems()
      if (navigator.onLine) await syncToSupabase();
    };

    const modifierMateriel = async () => {
      if (!idEnCours.value) return;
      await db.materiel.update(idEnCours.value, {
        Materiels: Materiels.value,
        Unite: Unite.value,
        Prix: Prix.value,
        Observation: Observation.value
      });
      
      await chargerMateriels();
      await loadItems();
      if (navigator.onLine) await syncToSupabase();
      // annulerEdition();
      annuler();
    };

    const supprimerMateriel = async (code) => {
      if (!confirm('Supprimer ce matériel ?')) return;
      await db.materiel.delete(code);
      if (navigator.onLine) {
        const { error } = await supabase.from('Materiel').delete().eq('Code', code);
        if (error) alert('Erreur Supabase : ' + error.message);
      } else {
        await db.suppressions.add({ userId: code });
      }
      await chargerMateriels();
    };

    const remplirFormulaire = (mat) => {
      Code.value = mat.Code;
      Materiels.value = mat.Materiels;
      Unite.value = mat.Unite;
      Prix.value = mat.Prix;
      Observation.value = mat.Observation;
      idEnCours.value = mat.Code;
      modeEdition.value = true;
    };

    const annulerEdition = () => {
      Code.value = '';
      Materiels.value = '';
      Unite.value = '';
      Prix.value = '';
      Observation.value = '';
      modeEdition.value = false;
      idEnCours.value = null;
    };

    const genererPDF = () => {
      const doc = new jsPDF();
      const image = new Image();
      image.src = logo;
      image.onload = () => {
        doc.addImage(image, 'PNG', 15, 10, 30, 30);
        doc.setFontSize(16);
        doc.text('Rapport des matériels', 50, 25);

        const colonnes = ['Code', 'Matériels', 'Unité', 'Prix', 'Observation'];
        const lignes = Listemateriels.value.map(u => [u.Code, u.Materiels, u.Unite, u.Prix, u.Observation]);

        doc.autoTable({
          head: [colonnes],
          body: lignes,
          startY: 45,
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          alternateRowStyles: { fillColor: [240, 240, 240] },
          showHead: 'firstPage'
        });

        doc.save('materiels.pdf');
      };
    };

    const mettreAJourEtatConnexion = () => {
      estEnLigne.value = navigator.onLine;
    };

    const synchroniserSuppressions = async () => {
      const suppressions = await db.suppressions.toArray();
      for (const item of suppressions) {
        const { error } = await supabase.from('Materiel').delete().eq('Code', item.userId);
        if (!error) await db.suppressions.delete(item.id);
      }
    };

    const synchroniser = async () => {
      await syncToSupabase();
      await syncFromSupabase();
      await chargerMateriels();
    };

    onMounted(async () => {
      await loadItems();
      if (navigator.onLine) await synchroniser();

      window.addEventListener('offline', () => mettreAJourEtatConnexion());
      window.addEventListener('online', async () => {
        mettreAJourEtatConnexion();
        await synchroniserSuppressions();
        await synchroniser();
      });

      setInterval(() => {
        if (navigator.onLine) synchroniser();
      }, 60000);
    });

    return {
      Code, Materiels, Unite, Prix, Observation, Listemateriels,
      estEnLigne, modeEdition, ajouterMateriel, modifierMateriel,
      supprimerMateriel, remplirFormulaire, annulerEdition, genererPDF,
      itemsPerPage, headers, serverItems, loading, totalItems, loadItems,
      search,annuler
    };
  }
};
</script>

<style scoped>
/* STYLE TABLEAU MATERIEL */
.custom-table {
  background: #f9fafb; /* fond clair */
  border-radius: 1rem;
  overflow: hidden;
}
.custom-table :deep(.v-data-table__th) {
  background: #374151; /* gris foncé */
  color: white;
  font-weight: 600;
  text-transform: uppercase;
}
.custom-table :deep(.v-data-table__tr:hover) {
  background-color: #f3f4f6; /* survol lignes */
  transition: background-color 0.2s ease-in-out;
}
.custom-table :deep(.v-btn) {
  border-radius: 0.75rem;
}

::v-deep .v-field{
  background: rgb(248, 249, 250);
  border-radius: 15px;
}
</style>
