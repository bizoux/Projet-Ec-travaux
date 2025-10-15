<template>
    
<v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems" :items-length="totalItems" :loading="loading" item-value="Code" @update:options="loadItems" class="elevation-1 rounded-lg" :footer-props="{ 'items-per-page-text': 'Lignes par page', 'items-per-page-options': [5, 10, 20, 50] }" > 
        
<!-- Colonne actions --> 
<template #item.actions="{ item }">

    <v-btn icon="mdi-pencil" size="small" color="warning" @click="remplirFormulaire(item)" ></v-btn>
    
    <v-btn icon="mdi-delete" size="small" color="error" @click="supprimerMateriel(item.Code)" ></v-btn> 

</template> 

</v-data-table-server>

</template>

<script setup> import { ref } from "vue" 
import db from "@/db" 
const itemsPerPage = ref(5) 
const headers = ref([ { title: "Code", key: "Code", align: "start" }, { title: "Matériels", key: "Materiels", align: "start" }, { title: "Unité", key: "Unite", align: "start" }, { title: "Prix", key: "Prix", align: "end" }, { title: "Observation", key: "Observation", align: "start" }, { title: "Actions", key: "actions", align: "center", sortable: false } ]) 
const serverItems = ref([]) 
const loading = ref(true) 
const totalItems = ref(0) 
/** * Fonction qui charge les matériels depuis IndexedDB (Dexie) * avec pagination et tri côté client (simule un vrai serveur) */ 
async function loadItems({ page, itemsPerPage, sortBy }) 
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

</script>