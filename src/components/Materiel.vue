<template>
  <div class="container my-4">

    <!-- Titre principal -->
    <div class="card shadow border-0 rounded-4 mb-4 p-4 text-center" style="background:linear-gradient(230deg,#ffffff83,#ffffff27,#00000023);">
      <h2 class="fw-bold text-primary mb-2" style="font-family: 'MaRaleway', sans-serif;">
        Tarif de location matériels et Outillages en vue de leur amortissement
      </h2>
      <p class="fw-semibold" style="color:rgb(214, 117, 148);font-family: 'MaRoboto', sans-serif;">( Inclut chauffeur ou machiniste )</p>
    </div>

    <!-- Formulaire -->
    <v-expansion-panels class="pa-7 fontPolice">
      <v-expansion-panel>
        <v-expansion-panel-title style="font-size: 20px;background:linear-gradient(200deg,#cfe4e421,#e4e4e465,#13626d23);">
          {{ modeEdition ? 'Modifier' : 'Nouveau' }} Matériel
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
              </v-btn>&nbsp;
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
        <h4 class="fw-bold text-primary mb-0">Importation matériels</h4>
      </div>
      <input type="file" class="form-control" @change="importerExcel"/>
    </div>

    <!-- Tableau matériel -->
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
      <template v-slot:top>
        <v-toolbar class="pa-2" style="background:linear-gradient(250deg,#cfe4e421,#e4e4e465,#13626d17);">
          <v-toolbar-title class="fw-bold listeMatPolice">Liste des Matériels</v-toolbar-title>
          <v-text-field
            class="pa-5 fontPolice"
            color="primary"
            hide-details
            v-model="search"
            label="Rechercher par code ou matériel"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            clearable
            style="max-width: 350px;"
          />
        </v-toolbar>
      </template>

      <!-- Colonne actions -->
      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" size="30" color="success" @click="remplirFormulaire(item)"></v-btn>&nbsp;
        <v-btn icon="mdi-delete" size="30" color="error" @click="supprimerMateriel(item.Code,item.Materiels)" ></v-btn>
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
import { ref, onMounted, watch, getCurrentInstance } from 'vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import db from '@/db';
import { supabase } from '@/supabaseClient';
import { syncFromSupabase, syncToSupabase } from '@/services/syncServiceMateriel';

export default {
  name: 'Materiel',
  setup() {
    const form = ref();
    const { proxy } = getCurrentInstance();

    const itemsPerPage = ref(5);
    const headers = ref([
      { title: "Code", key: "Code", align: "start" },
      { title: "Matériels", key: "Materiels", align: "start" },
      { title: "Unité", key: "Unite", align: "start" },
      { title: "Prix", key: "Prix", align: "end" },
      { title: "Observation", key: "Observation", align: "start" },
      { title: "Actions", key: "actions", align: "center", sortable: false }
    ]);

    const serverItems = ref([]);
    const loading = ref(true);
    const totalItems = ref(0);
    const Code = ref('');
    const Materiels = ref('');
    const Unite = ref('');
    const Prix = ref('');
    const Observation = ref('');
    const modeEdition = ref(false);
    const idEnCours = ref(null);
    const search = ref('');
    const materiels = ref([]);
    const Listemateriels = ref([]);

    const chargerMateriels = async () => {
      Listemateriels.value = await db.materiel.toArray();
    };

    const annulerEdition = () => {
      form.value.reset()
      modeEdition.value = false;
      idEnCours.value = null;
    };

    const modifierMateriel = async () => {
      if (!idEnCours.value) return;
      await db.materiel.update(idEnCours.value, {
        Materiels: Materiels.value,
        Unite: Unite.value,
        Prix: Prix.value,
        Observation: Observation.value
      });



      await notifModifMateriel();
      
      await chargerMateriels();
      await loadItems();
      if (navigator.onLine) await syncToSupabase();
      annulerEdition();
      // annuler();
    };

    const supprimerMateriel = async (code,materiels) => {

try {

const result = await proxy.$swal.fire({
title: "Etes vous sure de vouloir supprimer le materiel " + materiels + " ?",
text: "Cette action est irréversible !",
icon: 'warning',
showCancelButton: true,
confirmButtonColor: '#d33',
cancelButtonColor: '#3085d6',
confirmButtonText: 'Oui',
cancelButtonText: 'Annuler',
didOpen: () => {
  const confirmBtn = document.querySelector('.swal2-confirm');
  const cancelBtn = document.querySelector('.swal2-cancel');
  if (confirmBtn && cancelBtn) {
    const maxWidth = Math.max(confirmBtn.offsetWidth, cancelBtn.offsetWidth);
    confirmBtn.style.width = cancelBtn.style.width = maxWidth + 'px';
  }
}
});

if (result.isConfirmed) {
// suppression

  await db.materiel.delete(code);
  await loadItems()

  if (navigator.onLine) {
  
  const { error } = await supabase.from('Materiel').delete().eq('Code', code);
  if (error) alert('Erreur Supabase : ' + error.message);

} else {

  await db.suppressions.add({ userId: code });
  await loadItems()
  await proxy.$swal.fire({

  icon:'success',
  title:"Supprimé !",
  text: materiels + " a été supprimé avec succès.",
  timer:2500,
  showConfirmButton:false
  
});

// await chargerMateriels();


}


}
} catch (error) {
console.error("Erreur lors de la suppression :", error);
}



};

    const notifModifMateriel = async () => {
        
        proxy.$swal.fire({
        icon:'info',
        title:'Modif du matériel ',
        text:"avec succès",
        timer:2500,
        showConfirmButton:false
      })
        
    };



    const loadItems = async ({ page = 1, itemsPerPage = 5, sortBy = [] } = {}) => {
      loading.value = true;
      let items = await db.materiel.toArray();

      if (search.value) {
        const query = search.value.toLowerCase();
        items = items.filter(
          (m) =>
            String(m.Code).toLowerCase().includes(query) ||
            String(m.Materiels).toLowerCase().includes(query)
        );
      }

      if (sortBy.length) {
        const { key, order } = sortBy[0];
        items.sort((a, b) => {
          const aVal = a[key];
          const bVal = b[key];
          if (typeof aVal === "number" && typeof bVal === "number") {
            return order === "desc" ? bVal - aVal : aVal - bVal;
          } else {
            return order === "desc"
              ? String(bVal).localeCompare(String(aVal))
              : String(aVal).localeCompare(String(bVal));
          }
        });
      }

      const start = (page - 1) * itemsPerPage;
      const paginated = items.slice(start, start + itemsPerPage);
      serverItems.value = paginated;
      totalItems.value = items.length;
      loading.value = false;
    };

    watch(search, () => loadItems());

    const ajouterMateriel = async () => {
      try {
        if (!Code.value || !Materiels.value || !Unite.value || !Prix.value) {
          throw new Error("Veuillez remplir tous les champs !");
        }

        const existe = await db.materiel.get(parseInt(Code.value));
        if (existe) throw new Error("Ce code existe déjà.");

        await db.materiel.add({
          Code: parseInt(Code.value),
          Materiels: Materiels.value,
          Unite: Unite.value,
          Prix: Prix.value,
          Observation: Observation.value
        });

        proxy.$swal.fire({
          icon: 'success',
          title: 'Matériel ajouté',
          text: 'avec succès',
          timer: 2500,
          showConfirmButton: false
        });

        form.value.reset();
        await loadItems();
        if (navigator.onLine) await syncToSupabase();

      } catch (error) {
        proxy.$swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.message,
          timer: 2500,
          showConfirmButton: false
        });
      }
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

    const importerExcel = async (event) => {

      try {
        
        const file = event.target.files[0];
        if (!file) return;

        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const formated = jsonData.map((row) => ({
          Code: parseInt(row["CODE"]) || null,
          Materiels: row["MATERIELS"]?.trim() || "",
          Unite: row["UNITE"]?.trim() || "",
          Prix: parseFloat(row["PRIX"] || 0),
          Observation: row["OBSERVATIONS"] || ""
        }));

        const existants = await db.materiel.toArray();

        const nouveaux = formated.filter((item) => {
          return !existants.some(
            (ex) =>
              ex.Code === item.Code ||
              ex.Materiels.toLowerCase() === item.Materiels.toLowerCase()
          );
        });

        if (nouveaux.length === 0) {
          proxy.$swal.fire({
            icon: "info",
            title: "Aucun nouveau matériel ajouté",
            text: "Tous les matériels du fichier existent déjà.",
            timer: 3000,
            showConfirmButton: false,
          });
          return;
        }

        await db.materiel.bulkAdd(nouveaux);
        materiels.value = await db.materiel.toArray();
        await loadItems();

        proxy.$swal.fire({
          icon: "success",
          title: "Importation réussie",
          text: `${nouveaux.length} nouveau(x) matériel(s) ajouté(s).`,
          timer: 3000,
          showConfirmButton: false,
        });

        if (navigator.onLine) await syncToSupabase();

      } catch (error) {
        console.error("Erreur importation Excel :", error);
        proxy.$swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Une erreur est survenue pendant l’importation.",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    };

    onMounted(async () => {
      await loadItems();
      if (navigator.onLine) await syncToSupabase();
    });

    return {
      form, Code, Materiels, Unite, Prix, Observation,
      materiels, modeEdition, ajouterMateriel,annulerEdition,
      importerExcel, headers, serverItems, totalItems,notifModifMateriel,chargerMateriels,
      loading, itemsPerPage, loadItems, search,remplirFormulaire,modifierMateriel,supprimerMateriel
    };
  }
};
</script>

<style scoped>
.custom-table {
  background: #f9fafb;
  border-radius: 1rem;
  overflow: hidden;
  font-family: 'MaRaleway', sans-serif;
}
.custom-table :deep(.v-data-table__th) {
  background: rgb(67, 81, 174, 0.9);
  color: white;
  font-weight: 600;
  text-transform: uppercase;
}
.custom-table :deep(.v-data-table__tr:hover) {
  background-color: #f3f4f6;
  transition: background-color 0.2s ease-in-out;
}
.fontPolice, .listeMatPolice {
  font-family: 'MaRoboto', sans-serif;
}
::v-deep .v-field{
  background: rgb(248, 249, 250);
  border-radius: 15px;
}
</style>
