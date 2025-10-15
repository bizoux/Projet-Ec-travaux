<template>
  <div class="container my-4">



    <!-- Titre principal -->
    <div class="card shadow-lg border-0 rounded-4 mb-4 p-4 text-center" style="background-color: #f0f8ff;">
      <h2 class="fw-bold text-primary mb-2">
        TARIF LOCATION MATÉRIELS  <br>& <br>OUTILLAGES EN VUE DE LEUR AMORTISSEMENT
      </h2>
      <p class="fw-semibold text-secondary">(Inclut chauffeur ou machiniste)</p>
    </div>

    <!-- État et mode -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-semibold">
        {{ modeEdition ? '✏️ Modifier' : '➕ Ajouter' }} Matériel
      </h4>
      <span class="badge rounded-pill px-3 py-2"
            :class="estEnLigne ? 'bg-success' : 'bg-danger'">
        {{ estEnLigne ? '🟢 En ligne' : '🔴 Hors ligne' }}
      </span>
    </div>

    <!-- Formulaire -->
    <div class="card shadow-sm border-0 rounded-4 mb-4">
      <div class="card-body">
        <form @submit.prevent="modeEdition ? modifierMateriel() : ajouterMateriel()">
          <div class="row g-3">
            <div class="col-md-2">
              <input v-model="Code" type="number" class="form-control modern-input" placeholder="Code" required>
            </div>
            <div class="col-md-3">
              <input v-model="Materiels" type="text" class="form-control modern-input" placeholder="Matériel" required>
            </div>
            <div class="col-md-2">
              <input v-model="Unite" type="text" class="form-control modern-input" placeholder="Unité" required>
            </div>
            <div class="col-md-2">
              <input v-model="Prix" type="number" class="form-control modern-input" placeholder="Prix" required>
            </div>
            <div class="col-md-3">
              <input v-model="Observation" type="text" class="form-control modern-input" placeholder="Observation">
            </div>
          </div>
          

          <div class="mt-4 text-end">
            <button type="submit" class="btn btn-primary px-4 rounded-pill me-2 shadow-sm hover-grow">
  <font-awesome-icon icon="fa-solid fa-floppy-disk" class="me-1" />
  {{ modeEdition ? 'Enregistrer' : 'Ajouter' }}
</button>

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
    <div class="card shadow-sm border-0 rounded-4">
      <div class="card-body">
        <h4 class="mb-3 fw-bold">📋 Liste des Matériels</h4>
        <div class="table-responsive rounded-3 overflow-hidden">
          <table class="table align-middle modern-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Matériels</th>
                <th>Unité</th>
                <th>Prix</th>
                <th>Observation</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mat in Listemateriels" :key="mat.Code">
                <td>{{ mat.Code }}</td>
                <td>{{ mat.Materiels }}</td>
                <td>{{ mat.Unite }}</td>
                <td>{{ mat.Prix }}</td>
                <td>{{ mat.Observation }}</td>
                <td class="text-center">
                    <button 
  @click="remplirFormulaire(mat)" 
  class="btn btn-sm btn-warning rounded-circle me-1 shadow-sm hover-rotate"
  title="Modifier"
>
  <font-awesome-icon icon="fa-solid fa-pen" />
</button>

<button 
  @click="supprimerMateriel(mat.Code)" 
  class="btn btn-sm btn-danger rounded-circle shadow-sm hover-rotate"
  title="Supprimer"
>
  <font-awesome-icon icon="fa-solid fa-trash" />
</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Bouton PDF -->
    <div class="mt-4 text-end">
      <button @click="genererPDF" class="btn btn-outline-success px-4 rounded-pill hover-grow">
        📄 Télécharger le PDF
      </button>
    </div>
  </div>
</template>
<script>
 
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '@/assets/Voiture.png'; // Charge l'image
import * as XLSX from 'xlsx';

import db from '@/db';
import { supabase } from '@/supabaseClient'; 
import { syncFromSupabase, syncToSupabase } from '@/services/syncServiceMateriel';

export default {
  name: 'Materiel',
  data() {
    return {
      Code: '',
      Materiels: '',
      Unite: '',
      Prix: '',
      Observation: '',
      Listemateriels: [],
      estEnLigne: navigator.onLine,
      modeEdition: false,
      
    };
  },
  methods: {
    async importerExcel(event) {
  const file = event.target.files[0];
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  const formated = jsonData.map(row => ({
    Code: parseInt(row["Code"]), // assure que Code est un nombre
    Materiels: row["Materiels"] || '',
    Unite: row["Unite"] || '',
    Prix: row["Prix"] || '',
    Observation: row["Observation"] || ''
  }));

  // Supprime tous les anciens enregistrements
  await db.materiel.clear();

  // Insère tous les nouveaux matériaux
  await db.materiel.bulkPut(formated);

  // Recharge la liste affichée
  await this.chargerMateriels();

  // Synchronise si en ligne
  if (navigator.onLine) {
    await syncToSupabase();
  }
},

    async genererPDF() {
      const doc = new jsPDF();

      // 🖼️ Ajouter le logo
      const image = new Image();
      image.src = logo;

      image.onload = () => {
        doc.addImage(image, 'PNG', 15, 10, 30, 30); // x, y, largeur, hauteur

        // 📝 Ajouter un titre à côté du logo
        doc.setFontSize(16);
        doc.text('Rapport des utilisateurs', 50, 25);

        // 🧾 Générer le tableau
        const colonnes = ['Nom', 'Email', 'Téléphone'];
        const lignes = this.Utilisateurs.map(u => [u.nom, u.email, u.tel]);

        doc.autoTable({
          head: [colonnes],
          body: lignes,
          startY: 45,
          styles: {
            fontSize: 10,
            cellPadding: 3
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240]
          },
          
            showHead: 'firstPage'
        });

        // 📥 Enregistrer le PDF
        doc.save('utilisateurs_avec_logo.pdf');
      };
    },

 // Ajouter un matériel sans doublon
 async ajouterMateriel() {
  const Code = parseInt(this.Code);
    // Ajouter le matériel
    await db.materiel.add({
      Code,
      Materiels: this.Materiels,
      Unite: this.Unite,
      Prix: this.Prix,
      Observation: this.Observation
    });

    // Réinitialiser formulaire
    this.Code = '';
    this.Materiels = '';
    this.Unite = '';
    this.Prix = '';
    this.Observation = '';

    await this.chargerMateriels();

    if (navigator.onLine) {
      await syncToSupabase();
    }
  },




 async modifierMateriel() {
      if (!this.idEnCours) return;

      await db.materiel.update(this.idEnCours, {
      Materiels: this.Materiels,
      Unite: this.Unite,
      Prix: this.Prix,
      Observation: this.Observation
      });
       this.Materiels = ''
       this.Unite = ''
       this.Prix = ''
       this.Observation = ''
      this.idEnCours = null;
      this.modeEdition = false;
      await this.chargerMateriels();
      if (navigator.onLine) await syncToSupabase();
    },

    async supprimerMateriel(Code) {
      if (confirm('Supprimer cet materiel ?')) {
        await db.materiel.delete(Code);
        // Suppression Supabase si connecté
      if (navigator.onLine) {
        const { error } = await supabase
          .from('Materiel')
          .delete()
          .eq('Code', Code);

        if (error) {
          alert('Erreur lors de la suppression Supabase : ' + error.message);
          return;
        }
        
      }
      else {
    // Stocker la suppression pour la synchronisation future
    await db.suppressions.add({ userId: Code });
  }
        await this.chargerMateriels();
        
        
      }
    },

    async synchroniserSuppressions() {
  const suppressions = await db.suppressions.toArray();

  for (const item of suppressions) {
    const { error } = await supabase
      .from('Materiel')
      .delete()
      .eq('Code', item.userId);

    if (!error) {
      await db.suppressions.delete(item.id); // Suppression réussie → on retire
    }
  }
},

    remplirFormulaire(mat) {
      this.Code = mat.Code;
      this.Materiels = mat.Materiels;
      this.Unite = mat.Unite;
      this.Prix = mat.Prix;
      this.Observation = mat.Observation;
      this.idEnCours = mat.Code;
      this.modeEdition = true;
    },

    annulerEdition() {
      this.Code = '';
      this.Materiels = '';
      this.Unite = '';
      this.Prix = '';
      this.Observation = '';
      this.modeEdition = false;
      this.idEnCours = null;
    },



    async chargerMateriels() {
      this.Listemateriels = await db.materiel.toArray();
    },
    async synchroniser() {
      await syncToSupabase();
      await syncFromSupabase();
      await this.chargerMateriels();
    },

    mettreAJourEtatConnexion() {
      this.estEnLigne = navigator.onLine;
    }
  },
  async mounted() {
    setInterval(() => {
    if (navigator.onLine) {
      this.synchroniser();
    }
  }, 60000); 
    await this.chargerMateriels();

    // Sync immédiat au démarrage si en ligne
    if (navigator.onLine) {
      await this.synchroniser();
    }

    window.addEventListener('offline', () => this.mettreAJourEtatConnexion());
    // Auto-sync dès qu’on redevient connecté
    window.addEventListener('online', async () => {
      console.log('Connexion retrouvée. Synchronisation automatique...');
      this.mettreAJourEtatConnexion();
      await this.synchroniserSuppressions();
      await this.synchroniser();
    });
  }
};
</script>


<style scoped>
/* Optionnel : petites améliorations visuelles */
.table-hover tbody tr:hover {
  background-color: #e9f7ef;
}

/* Glass effect */
.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
}

/* Dégradé titre */
.title-gradient {
  background: linear-gradient(90deg, #007bff, #6610f2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Boutons modernes */
.btn-gradient {
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  border: none;
  color: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Table moderne */
.modern-table tbody tr:hover {
  background: rgba(0, 123, 255, 0.08);
  transition: background 0.2s ease;
}
</style>
