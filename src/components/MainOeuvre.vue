+ç <template>
  <div class="container py-5">


    <!-- Titre principal -->

    <div class="card shadow border-0 rounded-4 mb-4 p-4 text-center" style="background:linear-gradient(230deg,#ffffff83,#ffffff27,#00000023);">
      <h4 class="fw-bold text-primary mb-2" style="font-family: 'MaRaleway', sans-serif;">
        Tarif de la Main d'Oeuvre
      </h4>
      <p class="fw-semibold" style="color:rgb(214, 117, 148);font-family: 'MaRoboto', sans-serif;">Calcul des prix moyens de la journée par catégorie</p>
    </div>



    <!-- FORMULAIRE AJOUT MAIN D’ŒUVRE -->

    <v-expansion-panels class="pa-7 fontPolice">

      <v-expansion-panel>
        <v-expansion-panel-title style="font-size: 20px;background:linear-gradient(200deg,#cfe4e421,#e4e4e465,#13626d23);">Nouveau Main d'oeuvre</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-form ref="form" @submit.prevent="ajouterMainOeuvre">
            <div class="row g-3">
              <div class="col-md-4">
                <v-text-field
                    v-model="nom"
                    color="primary"
                    label="Nom"
                    variant="outlined"
                    :rules="[v => !!v || 'Nom requis']"
                    required
                    clearable
                  />
              </div>
              <div class="col-md-4">
                <v-text-field
                    v-model="SalaireBase"
                    color="primary"
                    label="Salaire de base"
                    type="number"
                    min="0"
                    variant="outlined"
                    :rules="[v => !!v || 'Salaire de base requis']"
                    required
                    clearable
                  />
              </div>
              <div class="col-md-4">
                <v-text-field
                    v-model="HeureBase"
                    color="primary"
                    label="Horaire de travail"
                    type="number"
                    min="0"
                    variant="outlined"
                    :rules="[v => !!v || 'Horaire de travail requise']"
                    required
                    clearable
                  />
              </div>

            </div>

            <div class="mt-4 text-end">

              <v-btn type="submit" prepend-icon="mdi-check-circle" variant="elevated" color="primary" class="rounded-xl">Ajouter</v-btn>&nbsp;
              
            
            </div>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
    
    </v-expansion-panels>









    <!-- TABLEAU MAIN D’ŒUVRE -->
    <div class="card shadow-sm">

      <div class="d-flex justify-content-end">
  <!-- Champ de recherche -->


  <v-text-field class="pa-5 policeForm"
          color="primary"
          hide-details
          v-model="Recherche"
          label="Rechercher une catégorie"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          style="max-width: 350px;"
        />

</div>




      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered align-middle text-center">
            <thead class="table-primary text-center">
              <tr>
                <th>ÉLÉMENTS DU PRIX DE L'HEURE</th>
                <th v-for="mainoeuvre in paginatedMainOeuvre" :key="mainoeuvre.CodeMainOeuvre">
                  {{ mainoeuvre.nomCategorie }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 - Salaire de base</td>
                <td v-for="m in paginatedMainOeuvre" :key="m.CodeMainOeuvre">{{ formatMontant(m.salaireBase) }}</td>
              </tr>
              <tr>
                <td>2 - Heures supplémentaires</td>
                <td v-for="m in paginatedMainOeuvre" :key="m.CodeMainOeuvre">{{ formatMontant(m.heureSupp) }}</td>
              </tr>
              <tr class="fw-bold table-light">
                <td>TOTAL PARTIEL</td>
                <td v-for="m in paginatedMainOeuvre" :key="m.CodeMainOeuvre">{{ formatMontant(m.totalPartiel) }}</td>
              </tr>
              <tr>
                <td>4 - Charges salariales 25%</td>
                <td v-for="m in paginatedMainOeuvre" :key="m.CodeMainOeuvre">{{ formatMontant(m.chargeSalariales) }}</td>
              </tr>
              <tr>
                <td>P.M.J FINAL</td>
                <td v-for="m in paginatedMainOeuvre" :key="m.CodeMainOeuvre">{{ formatMontant(m.pmjFinal) }}</td>
              </tr>
              <tr class="fw-bold bg-info text-white">
                <td>ARRONDI</td>
                <td v-for="m in paginatedMainOeuvre" :key="m.CodeMainOeuvre">{{ arrondir(m.pmjFinal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      <!-- Pagination -->
  <div class="d-flex justify-content-end align-items-center">
    <v-btn
      icon="mdi-chevron-left"
      :disabled="PageActuel === 1"
      @click="PageActuel--"
      variant="text"
    ></v-btn>

    <span class="mx-2">
      Page <strong>{{ PageActuel }}</strong> / <strong>{{ totalPages }}</strong>
    </span>

    <v-btn
      icon="mdi-chevron-right"
      :disabled="PageActuel === totalPages"
      @click="PageActuel++"
      variant="text"
    ></v-btn>
  </div>





    </div>

<br>
<div>


        <!-- Titre cliquable -->
    <div 
      class="d-flex justify-content-between align-items-center p-3 border rounded bg-primary shadow-sm"
      @click="isOpen = !isOpen"
      style="cursor: pointer;"
    >
      <span class="fw-bold primary">Voir la Classification Professionnelle</span>

      <!-- Font Awesome Icon -->
      <font-awesome-icon
        icon="chevron-down"
        class="arrow"
        :class="{ rotate: isOpen }"
      />
    </div>

    <!-- Contenu masqué/affiché -->
    <div v-if="isOpen" class="mt-1 mb-4 p-3 border rounded" style="background:linear-gradient(250deg,#cfe4e421,#e4e4e465,#13626d1e);">

         <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Tableau des Salaires</h1>

    <table class="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
      <thead class="bg-gray-200">
        <tr>
          <th class="border border-gray-300 px-4 py-2">Classification</th>
          <th class="border border-gray-300 px-4 py-2">Indice</th>
          <th class="border border-gray-300 px-4 py-2">Salaire Horaire</th>
          <th class="border border-gray-300 px-4 py-2">Salaire Journalier</th>
          <th class="border border-gray-300 px-4 py-2">Salaire Mensuel</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(row, index) in salaires" 
          :key="index"
          class="hover:bg-gray-100 transition"
        >
          <td class="border border-gray-300 px-4 py-2 font-semibold">{{ row.classification }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ row.indice }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ formatCurrency(row.horaire) }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ formatCurrency(row.journalier) }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ formatCurrency(row.mensuel) }}</td>
        </tr>
      </tbody>
    </table>
  </div>


</div>


</div>

</div>

</template>

<script>
import db from '@/db';
import { syncFromSupabase, syncToSupabase } from '@/services/syncServiceMainOeuvre';
export default {
  name: "MainOeuvre",
  data() {
    return {

      Recherche:'',
      PageActuel:1,
      NbrParPage:3,

      salaires: [
        { classification: "M.1", indice: 995, horaire: 366.16, journalier: 2929.28, mensuel: 81609.74 },
        { classification: "M.2", indice: 1025, horaire: 377.2, journalier: 3017.6, mensuel: 84070.34 },
        { classification: "OS.1", indice: 1090, horaire: 401.12, journalier: 3208.96, mensuel: 89401.63 },
        { classification: "OS.2", indice: 1150, horaire: 423.2, journalier: 3385.6, mensuel: 94322.82 },
        { classification: "OS.3", indice: 1225, horaire: 450.8, journalier: 3606.4, mensuel: 100474.3 },
        { classification: "OP1.A", indice: 1315, horaire: 483.92, journalier: 3871.36, mensuel: 107856.09 },
        { classification: "OP1.B", indice: 1440, horaire: 529.92, journalier: 4239.36, mensuel: 118108.57 },
        { classification: "OP2.1", indice: 1580, horaire: 581.44, journalier: 4651.52, mensuel: 129591.35 },
        { classification: "OP2.2", indice: 1830, horaire: 673.44, journalier: 5387.52, mensuel: 150506.41 },
        { classification: "OP3", indice: 2160, horaire: 794.88, journalier: 6359.04, mensuel: 177162.85 }
      ],

      isOpen: false,
      nom:"",
      SalaireBase:"",
      HeureBase: "",
      Listemainoeuvre:[],
      heures: {
        base: 48,
        hs25: 8,
        hs50: 0,
        hs100: 0,
      },
      charges: {
        salariales: 25,
        prime: 0,
      },

    };
  },
  async mounted() {

    setInterval(() => {
    if (navigator.onLine) {
      this.synchroniser();
    }
  }, 60000); 
    
    await this.chargerMainOeuvre();

    // Sync immédiat au démarrage si en ligne
    if (navigator.onLine) {
      await this.synchroniser();
    }

    // Auto-sync dès qu’on redevient connecté
    window.addEventListener('online', async () => {
      console.log('Connexion retrouvée. Synchronisation automatique...');

      // await this.synchroniserSuppressions();
      await this.synchroniser();
    });
  },

computed: {
  // Filtrer la liste selon le nom de catégorie
  
  filteredMainOeuvre() {
    if (!this.Recherche) return this.Listemainoeuvre;
    const q = this.Recherche.toLowerCase();
    return this.Listemainoeuvre.filter(item =>
      item.nomCategorie.toLowerCase().includes(q)
    );
  },

  // Pagination de la liste filtrée

  paginatedMainOeuvre() {
    const start = (this.PageActuel - 1) * this.NbrParPage;
    return this.filteredMainOeuvre.slice(start, start + this.NbrParPage);
  },

  // Nombre total de pages
  
  totalPages() {
    return Math.ceil(this.filteredMainOeuvre.length / this.NbrParPage);
  }
},



methods: {

formatCurrency(value) {
      return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "DZD" }).format(value);
    },


reset(){
  this.$refs.form.reset()
},


// AJOUTER MAIN D'OEUVRE

 async ajouterMainOeuvre() {
  // const id = Math.floor(1000 + Math.random() * 9000);
try{

  if(!this.nom || !this.SalaireBase || !this.HeureBase){
        // throw new Error("Veuillez remplir tous les champs!");
        alert('remplir tous les champs');
      }

      else{

          const existe = await db.Mainoeuvre
          .where('nomCategorie')
          .equalsIgnoreCase(this.nom)
          .first()

        if (existe) {
          // throw new Error("Cette main d'oeuvre existe déjà !");
          alert('existe deja');
          
        }
        else{

          await db.Mainoeuvre.add({

            nomCategorie: this.nom,
            salaireBase: parseFloat(this.SalaireBase),
            heureSupp: this.calculHeuresSupp({ salaireBase: this.SalaireBase }),
            totalPartiel: this.totalPartiel({ salaireBase: parseFloat(this.SalaireBase) }),
            chargeSalariales: this.chargesSalariales(this.totalPartiel({ salaireBase: parseFloat(this.SalaireBase) })),
            pmjFinal: this.pmjFinal({ salaireBase: parseFloat(this.SalaireBase) }),
      
        });
        
        this.$refs.form.reset();
        this.chargerMainOeuvre();

        if (navigator.onLine) {
        await syncToSupabase();
      }
}


}


}catch(error){

    alert(error);
}


  },

  // ARRONDIR

    arrondir(valeur) {
      let multiple = 10;
  if (valeur >= 1000000) {
    multiple = 10000;
  } else if (valeur >= 100000) {
    multiple = 1000;
  } else if (valeur >= 10000) {
    multiple = 100;
  }

  // Arrondir vers le bas au multiple choisi
  const arrondi = Math.round(valeur / multiple) * multiple;

  // 4. Formater avec 2 décimales en français
  return arrondi.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
},
  
  // LISTE DE MAIN D'OEUVRE

  async chargerMainOeuvre() {
      this.Listemainoeuvre = await db.Mainoeuvre.toArray();
    },
    tauxHoraire(cat) {
      return cat.salaireBase / this.heures.base;
    },

    // CALCULE HEURE SUPPLEMENTAIRE

    calculHeuresSupp(cat) {
      const taux = this.tauxHoraire(cat);
      const hs25 = this.heures.hs25 * taux * 0.25;
      const hs50 = this.heures.hs50 * taux * 0.5;
      const hs100 = this.heures.hs100 * taux * 1.0;
      return hs25 + hs50 + hs100;
    },

    // CALCULE TOTAL PARTIEL

    totalPartiel(cat) {
      return cat.salaireBase + this.calculHeuresSupp(cat);
    },

    // CALCULE CHARGES SALARIALES

    chargesSalariales(total) {
      return total * (this.charges.salariales / 100);
    },

    // CALCULE PRIX MOYENS DE LA JOURNEE

    pmjFinal(cat) {
      const total = this.totalPartiel(cat);
      const charges = this.chargesSalariales(total);
      return total + charges;
    },

    // FORMAT MONTANT

    formatMontant(valeur) {
    return valeur.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
    });
    
  },


    // SYNCHRONISATION DANS SUPABASE

    async synchroniser() {
      await syncToSupabase();
      await syncFromSupabase();
      await this.chargerMainOeuvre();
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}
table {
  width: 100%;
  text-align: center;
}
.params {
  margin-top: 30px;
  max-width: 400px;
}
input {
  width: 160px;
  text-align: center;
}

      /* style accordion */

.arrow {
  transition: transform 0.3s;
}
.arrow.rotate {
  transform: rotate(180deg);
}

.fontPolice,.policeForm{
  font-family:'MaRoboto',sans-serif;
  letter-spacing: 0.5px;
}

::v-deep .v-field {
  background: rgb(248, 249, 250);
  border-radius: 15px;
}

.btn{
  transition: all 0.2s;
}
.v-btn:hover{
  transform:scale(1.1);
}

</style>
