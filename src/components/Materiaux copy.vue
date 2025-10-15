<template>
  <div class="container-fluid pa-3">


    <!-- Import Excel -->

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h2 class="h5 text-secondary mb-3">Importer un fichier Excel</h2>

        <button 
        class="btn btn-primary gap-2 rounded-pill px-3 modern-btn"
        @click="modaleNouveauTravaux"
      >
        <font-awesome-icon icon="hammer" style="font-size: 18;"/>
        <span>Nouveau</span>
      </button>



        <input 
          type="file" 
          class="form-control" 
          @change="importerExcel"
        />
      </div>
    </div>




<div class="card shadow-lg border-0 rounded-4 p-4 mb-4 bg-light bg-opacity-75">
  <!-- Header avec boutons -->
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h4 class="fw-bold text-primary mb-0">Gestion de Sdp</h4>
    <div class="d-flex gap-2">

      <button 
        class="btn btn-outline-primary d-flex align-items-center gap-2 rounded-pill"
        @click="modaleSdp"
      >
        <font-awesome-icon icon="plus-circle" style="font-size: 20;"/>
        <span>Nouveau Sdp</span>
      </button>
      
    </div>
        
  </div>

  <input type="file" class="form-control" @change="importerExcel"/>
  

</div>
  



    <!-- Données importées -->
    <div v-if="materiaux.length" class="card shadow-sm">
      <div class="card-body">
        <h3 class="h5 mb-3">Liste des matériaux</h3>

        <div v-for="(group, cat) in groupedData" :key="cat" class="mb-4">
          <h4 class="fw-bold text-primary border-bottom pb-2 mb-3">{{ cat }}</h4>

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

    <!-- Aucun fichier importé -->
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
    };
  },
  async mounted() {
    await this.chargerMateriaux();

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
    groupedData() {
      const groupe = {};
      for (const item of this.materiaux) {
        if (!groupe[item.Categorie]) {
          groupe[item.Categorie] = [];
        }
        groupe[item.Categorie].push(item);
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
  
    async importerExcel(event) {
      const file = event.target.files[0];
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const formated = jsonData.map((row, index) => ({
        id: index + 1,
        Categorie: row["Categorie"] || '',
        Type: row["Type"] || '',
        Materiaux: row["Materiaux"] || '',
        Unites: row["Unites"] || '',
        Pu: parseFloat(row["Pu"] || 0),
        CoutTrans: parseFloat(row["CoutTrans"] || 0),
        PrixChantier: parseFloat(row["PrixChantier"] || 0)
      }));

      await db.Materiaux.clear();
      await db.Materiaux.bulkPut(formated);

      this.materiaux = await db.Materiaux.toArray();
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 900px;
}
</style>
