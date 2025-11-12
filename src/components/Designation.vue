<template>
<div class="fond"> 
  <div v-if="projet">
    <h2>{{projet.NomMaitreOuvr}}</h2>
    <p>{{projet.Entreprise}}</p>
  </div>
  


  <div class="container my-4">
    <v-expansion-panels class="pa-10 policeForm">
      <v-expansion-panel>
        <v-expansion-panel-title
          style="font-size: 20px;background:linear-gradient(200deg,#cfe4e421,#e4e4e465,#13626d23);">
          {{ modeEdition ? 'Modifier' : 'Nouvelle' }} Désignation
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-form ref="form" @submit.prevent="modeEdition ? modifierDesignation() : ajouterDesignation()">
            <div class="row pa-3">
              <div class="col-md-2"></div>

              <div class="col-md-4">
                <v-text-field
                  v-model="designation"
                  label="Désignation"
                  color="primary"
                  variant="outlined"
                  :rules="[v => !!v || 'Désignation requise']"
                  clearable
                  required />
              </div>

              <div class="col-md-4">
                <v-text-field
                  v-model="description"
                  label="Description"
                  color="primary"
                  variant="outlined"
                  :rules="[v => !!v || 'Description requise']"
                  clearable
                  required />
              </div>

              <div class="col-md-2"></div>
            </div>

            <div class="mt-4 text-end">
              <v-btn type="submit" prepend-icon="mdi-check-circle" variant="elevated"color="primary" class="rounded-xl">
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




<!-- TABLEAU DE LA DESIGNATION -->


<v-data-table-server

        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        item-value="CodeDes"
        @update:options="loadItems"
        class="elevation-3 rounded-xl custom-table"
        density="comfortable"
        hover
        :footer-props="{ 'items-per-page-text': 'Lignes par page', 'items-per-page-options': [5, 10, 20, 50] }"
      >
      
  <template v-slot:top>
    <v-toolbar class="pa-2" style="background:linear-gradient(250deg,#cfe4e421,#e4e4e465,#13626d17);">
    
      <v-toolbar-title class="fw-bold designPolice">Liste des Désignations</v-toolbar-title>
      <v-text-field class="pa-5 policeForm"
          color="primary"
          hide-details
          v-model="search"
          label="Rechercher par désignation"
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
  <v-btn icon="mdi-delete" size="30" color="error" @click="supprimerDesignation(item.CodeDes,item.Designation)" ></v-btn> 
  </template> 

</v-data-table-server>
</div>

</div>

</template>

<script>
import { ref, onMounted, watch, getCurrentInstance } from 'vue'
import db from '@/db'
 import { useRoute } from 'vue-router'

export default {
  name: 'Designation',
  setup() {
    const form = ref()
    const projet = ref(null)
    const designation = ref('')
    const description = ref('')
    const { proxy } = getCurrentInstance()
    const itemsPerPage = ref(5)
    const serverItems = ref([])
    const search = ref('')
    const ListeDesignations = ref([]);
    const idEnCours = ref(null);
    const modeEdition = ref(false);
    const route = useRoute()
    
    const headers = ref([ 
      { title: "CodeDes", key: "CodeDes", align: "start" }, 
      { title: "Désignation", key: "Designation", align: "start" }, 
      { title: "Déscription", key: "Description", align: "start" }, 
      { title: "Actions", key: "actions", align: "center", sortable: false } 
    ])
    
    const loading = ref(true) 
    const totalItems = ref(0) 

    const notifAjoutDesignation = async () => {
      proxy.$swal.fire({
        icon: 'success',
        title: 'Ajout de la désignation',
        text: 'Effectué avec succès',
        timer: 2500,
        showConfirmButton: false
      })
    }



    const chargerDesignation = async () => {
      ListeDesignations.value = await db.designation.toArray();
    };

    const remplirFormulaire = (des) => {
      designation.value = des.Designation;
      description.value = des.Description;
      idEnCours.value = des.CodeDes;
      modeEdition.value = true;
    };
    


    const ajouterDesignation = async () => {
      try {
        
        if (!designation.value || !description.value) {
          throw new Error('Veuillez remplir tous les champs !')
        }

        const existe = await db.designation
          .where('Designation')
          .equalsIgnoreCase(designation.value)
          .first()

        if (existe) {
          throw new Error('Cette désignation existe déjà !')
          
        }

        await db.designation.add({
          Designation: designation.value,
          Description: description.value
        })
      
        form.value.reset();
        await notifAjoutDesignation();
        await chargerDesignation();
        await loadItems();
        

        
      } catch (error) {
        proxy.$swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.message || "Impossible d'ajouter la désignation",
          timer: 2500,
          showConfirmButton: false
        })
      }
    }

    const annulerEdition = () => {
      form.value.reset()
      modeEdition.value = false;
      idEnCours.value = null;
    };


    const modifierDesignation = async () => {
      if (!idEnCours.value) return;
      await db.designation.update(idEnCours.value, {
        Designation: designation.value,
        Description: description.value
      });

      await notifModifDesignation();
      
      await chargerDesignation();
      await loadItems();

      annulerEdition();
      // annuler();
    };

    const supprimerDesignation = async (codeDes,designation) => {

try {

const result = await proxy.$swal.fire({
title: "Etes vous sure de vouloir supprimer la designation " + designation + " ?",
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

  await db.designation.delete(codeDes);
  await loadItems()

  await proxy.$swal.fire({

  icon:'success',
  title:"Supprimé !",
  text: designation + " a été supprimé avec succès.",
  timer:2500,
  showConfirmButton:false
  
});
}

} catch (error) {

console.error("Erreur lors de la suppression :", error);

}




};


    const notifModifDesignation = async () => {
        
        proxy.$swal.fire({
        icon:'info',
        title:'Modif du désignation ',
        text:"avec succès",
        timer:2500,
        showConfirmButton:false
      })
        
    };



    async function loadItems({ page = 1, itemsPerPage = 5, sortBy = [] } = {}) { 
      loading.value = true;
      let items = await db.designation.toArray();

      // Filtrage par Code ou Matériels
      if (search.value) {
        const query = search.value.toLowerCase();
        items = items.filter(
          (des) =>
            String(des.Designation).toLowerCase().includes(query)
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

    onMounted(async () => {

      await loadItems();
      

    });




    return { form, designation, description, notifModifDesignation,annulerEdition,modeEdition,ajouterDesignation,modifierDesignation,supprimerDesignation, loadItems,headers, itemsPerPage, serverItems, loading, totalItems, totalItems, search, ListeDesignations,remplirFormulaire }
  }
}
</script>

<style scoped>


::v-deep .v-field {
  background: rgb(248, 249, 250);
  border-radius: 15px;
}

/* STYLE TABLEAU DESIGNATION */

.custom-table {
  background: #f9fafbd5; /* fond clair */
  border-radius: 1rem;
  overflow: hidden;
  font-family:'MaRaleway',sans-serif;
}
.custom-table :deep(.v-data-table__th) {
  background: rgb(67, 81, 174, 0.9);
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

.fond {
  background:linear-gradient(300deg, #1a808d31, #aac6dd, #356e9c2a);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
}

.policeForm,.designPolice{

  font-family:'MaRoboto',sans-serif;
  letter-spacing: 0.5px;


}

</style>
