<template>
  <div class="container my-4">

    <!-- Titre principal -->
    <div class="card shadow-lg border-0 rounded-4 mb-4 p-4 text-center" style="background-color: #f0f8ff;">
      <h2 class="fw-bold text-primary mb-2">
        TARIF LOCATION MATÉRIELS  <br>& <br>OUTILLAGES EN VUE DE LEUR AMORTISSEMENT
      </h2>
      <p class="fw-semibold text-secondary">(Inclut chauffeur ou machiniste)</p>
    </div>



<!-- 
    <v-expansion-panels>
      <v-expansion-panel>

        <v-expansion-panel-title><strong>Nouveau Matériel</strong></v-expansion-panel-title>
        <v-expansion-panel-text>


          <form @submit.prevent="modeEdition ? modifierMateriel() : ajouterMateriel()">
          <div class="row g-3">
            <div class="col-md-2">
              <input v-model="Code" type="number" class="form-control" placeholder="Code" required>
            </div>
            <div class="col-md-3">
              <input v-model="Materiels" type="text" class="form-control" placeholder="Matériel" required>
            </div>
            <div class="col-md-2">
              <input v-model="Unite" type="text" class="form-control" placeholder="Unité" required>
            </div>
            <div class="col-md-2">
              <input v-model="Prix" type="number" class="form-control" placeholder="Prix" required>
            </div>
            <div class="col-md-3">
              <input v-model="Observation" type="text" class="form-control" placeholder="Observation">
            </div>
          </div>

          <div class="mt-4 text-end">
            
            <button type="submit" class="btn btn-primary px-4 rounded-pill">
              <font-awesome-icon icon="fa-solid fa-floppy-disk" class="me-1" />
              {{ modeEdition ? 'Enregistrer' : 'Ajouter' }}
            </button>&nbsp;

            <button v-if="modeEdition" type="button" @click="annulerEdition" 
              class="btn btn-outline-secondary px-4 rounded-pill hover-grow">
              <font-awesome-icon icon="fa-solid fa-xmark" class="me-1" />
              Annuler
            </button>

          </div>
        </form>
            


        </v-expansion-panel-text>
    
      </v-expansion-panel>
    </v-expansion-panels> -->



    <!-- État et mode -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-semibold">
        {{ modeEdition ? 'Modifier' : 'Ajouter' }} Matériel
      </h4>
      <span class="badge rounded-pill px-3 py-2"
            :class="estEnLigne ? 'bg-success' : 'bg-danger'">
        {{ estEnLigne ? '🟢 En ligne' : '🔴 Hors ligne' }}
      </span>
    </div>

    <!-- Formulaire -->
    <div class="card shadow-sm border-0 rounded-4 mb-4 bg-light">
      <div class="card-body">
        <form @submit.prevent="modeEdition ? modifierMateriel() : ajouterMateriel()">
          <div class="row g-3">
            <div class="col-md-2">
              <input v-model="Code" type="number" class="form-control" placeholder="Code" required>
            </div>
            <div class="col-md-3">
              <input v-model="Materiels" type="text" class="form-control" placeholder="Matériel" required>
            </div>
            <div class="col-md-2">
              <input v-model="Unite" type="text" class="form-control" placeholder="Unité" required>
            </div>
            <div class="col-md-2">
              <input v-model="Prix" type="number" class="form-control" placeholder="Prix" required>
            </div>
            <div class="col-md-3">
              <input v-model="Observation" type="text" class="form-control" placeholder="Observation">
            </div>
          </div>

          <div class="mt-4 text-end">
            
            <button type="submit" class="btn btn-primary px-4 rounded-pill">
              <font-awesome-icon icon="fa-solid fa-floppy-disk" class="me-1" />
              {{ modeEdition ? 'Enregistrer' : 'Ajouter' }}
            </button>&nbsp;

            <button v-if="modeEdition" type="button" @click="annulerEdition" 
              class="btn btn-outline-secondary px-4 rounded-pill hover-grow">
              <font-awesome-icon icon="fa-solid fa-xmark" class="me-1" />
              Annuler
            </button>

          </div>
        </form>
      </div>
    </div>

    <!-- Tableau -->

<v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems" :items-length="totalItems" :loading="loading" item-value="Code" @update:options="loadItems" class="elevation-3 rounded-xl custom-table" density="comfortable" hover :footer-props="{ 'items-per-page-text': 'Lignes par page', 'items-per-page-options': [5, 10, 20, 50] }" > 
        
<!-- Colonne actions --> 
<template #item.actions="{ item }">

    <v-btn icon="mdi-pencil" size="30" color="success" @click="remplirFormulaire(item)"></v-btn>&nbsp;
    
    <v-btn icon="mdi-delete" size="30" color="error" @click="supprimerMateriel(item.Code)" ></v-btn> 

</template> 

</v-data-table-server>



    <!-- Bouton PDF -->

    <div class="mt-4 text-end">
      <button @click="genererPDF" class="btn btn-outline-success px-4 rounded-pill hover-grow">
        Télécharger le PDF
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '@/assets/Voiture.png';
import * as XLSX from 'xlsx';
import db from '@/db';
import { supabase } from '@/supabaseClient';
import { syncFromSupabase, syncToSupabase } from '@/services/syncServiceMateriel';
// import ListTableMateriel from '@/components/MaterielTable.vue';


export default {
  name: 'Materiel',
  setup() {
    const itemsPerPage = ref(5) 
    const headers = ref([ { title: "Code", key: "Code", align: "start" }, { title: "Matériels", key: "Materiels", align: "start" }, { title: "Unité", key: "Unite", align: "start" }, { title: "Prix", key: "Prix", align: "end" }, { title: "Observation", key: "Observation", align: "start" }, { title: "Actions", key: "actions", align: "center", sortable: false } ]) 
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



    async function loadItems({ page = 1, itemsPerPage = 5, sortBy = [] } = {}) 
{ 
    loading.value = true 
    let items = await db.materiel.toArray() 
    // Tri si demandé 
    if (sortBy.length) { 
        const sortKey = sortBy[0].key 
        const sortOrder = sortBy[0].order 
        items.sort((a, b) => { const aVal = a[sortKey] 
            const bVal = b[sortKey] 
            if (typeof aVal === "number" && typeof bVal === "number") { 
                return sortOrder === "desc" ? bVal - aVal : aVal - bVal 
            } else { 
                return sortOrder === "desc" ? String(bVal).localeCompare(String(aVal)) : String(aVal).localeCompare(String(bVal)) } }) } 
                // Pagination 
                const start = (page - 1) * itemsPerPage 
                const end = start + itemsPerPage 
                const paginated = items.slice(start, end) 
                serverItems.value = paginated 
                totalItems.value = items.length 
                loading.value = false 
  
    } 



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
      annulerEdition();
      await chargerMateriels();
      if (navigator.onLine) await syncToSupabase();
    };

    const supprimerMateriel = async (code) => {
      if (!confirm('Supprimer cet matériel ?')) return;
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

    const importerExcel = async (event) => {
      const file = event.target.files[0];
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      const formated = jsonData.map(row => ({
        Code: parseInt(row["Code"]),
        Materiels: row["Materiels"] || '',
        Unite: row["Unite"] || '',
        Prix: row["Prix"] || '',
        Observation: row["Observation"] || ''
      }));

      await db.materiel.clear();
      await db.materiel.bulkPut(formated);
      await chargerMateriels();
      if (navigator.onLine) await syncToSupabase();
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
      // await chargerMateriels();
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
      importerExcel,itemsPerPage, headers, serverItems, loading, totalItems, loadItems
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


</style>
