<template>
  <div class="container my-4">

    <!-- Toast notification -->
    <div v-if="toastMessage" class="toast-notification">
      {{ toastMessage }}
    </div>

    <!-- Tableau BDE -->
    <table class="table table-striped table-bordered table-hover sdp-table table-sm">
      <thead class="table-dark">
        <tr>
          <th>N°</th>
          <th>DESIGNATION</th>
          <th>U</th>
          <th>QUANTITE</th>
          <th>PRIX UNITAIRE</th>
          <th>MONTANT</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <!-- Ligne ajout mivantana -->
        <tr class="table-warning">
          <td></td>
          <td>
            
<!-- Lot -->

<multiselect
v-model="nouveauLotId"
:options="LotList"
label="lot"
track-by="CodeLot"
placeholder="Choisir lot"
:multiple="false"
:close-on-select="true"
:clear-on-select="true"
:preserve-search="true"
class="mb-1"
>
<template #noResult>
  <div style="padding: 5px; color: red;">Aucun résultat trouvé.</div>
  <hr>
  
  <button class="btn btn-sm btn-primary" type="button" @click="modaleNouveauLot" style="color: white;">Nouveau lot</button>
</template>
</multiselect>

<!-- Travau -->

<multiselect
v-model="nouveauTravauId"
:options="TravauxList"
label="nomTravau"
track-by="CodeTrav"
placeholder="Choisir travaux"
:multiple="false"
:close-on-select="true"
:clear-on-select="true"
:preserve-search="true"
>
<template #noResult>
  <div style="padding: 5px; color: red;">Aucun résultat trouvé.</div>
  <hr>
  
  <button class="btn btn-sm btn-primary" type="button" @click="modaleNouveauTravau" style="color: white;">Nouveau travau</button>
</template>
</multiselect>



          </td>
          <td><input v-model="nouvelleUnite" type="text" class="form-control form-control-sm" placeholder="U"/></td>
          <td><input v-model="nouvelleQuantite" type="number" class="form-control form-control-sm" placeholder="Qté"/></td>
          <td>0</td>
          <td>0</td>
          <td>
            <button class="btn btn-sm btn-primary" @click="ajouterBde">Ajouter</button>
          </td>
        </tr>

        <!-- Affichage BDE existants -->
        <template v-for="(bde, numRomain) in bdeAvecTravaux" :key="bde.nomLot">
          <tr class="table-primary">
            <td></td>
            <td><strong>{{ toRoman(numRomain + 1) }} - {{ bde.nomLot }}</strong>
            <button class="btn btn-sm btn-outline-primary" style="float: right;" @click="RecupererTravaux(bde.idTravaux)">
              <font-awesome-icon icon="pen" /> Modifier
            </button>
            
            </td>
            
            <td></td><td></td><td></td><td></td><td></td>
          </tr>

          <tr v-for="(trav, numeroTrav) in bde.travaux" :key="trav.CodeTrav">
            <td class="text-center fw-bold" style="color:rgb(65, 80, 180)">{{ numRomain + 0 }}-{{ numeroTrav + 1 }}</td>
            <td class="fw-bold" style="color:rgb(65, 80, 180)">
              {{ trav.nomTravau }}<br>
              <small class="text-muted">concerne : {{ trav.nomDescription }}</small>
            </td>
            <td>{{ trav.Unite }}</td>
            <td>{{ formatQte(trav.Quantite) }}</td>
            <td>{{ formatPrice(trav.Pu) }}</td>
            <td>{{ formatQte(trav.Quantite * trav.Pu) }}</td>
            <td></td>
          </tr>

          <tr class="table-secondary">
            <td></td>
            <td class="text-end"><strong>Sous total</strong></td>
            <td></td><td></td><td></td>
            <td><strong>{{ formatQte(Montant(bde.travaux)) }} Ar</strong></td>
            <td></td>
          </tr>
        </template>

        <!-- Total général -->
        <tr class="table-dark">
          <td></td>
          <td class="text-end"><strong>Total général</strong></td>
          <td></td><td></td><td></td>
          <td><strong>{{ formatQte(totalGeneral()) }} Ar</strong></td>
          <td></td>
        </tr>
      </tbody>
    </table>


<!-- MODALE MODIF TRAVAUX -->

<div class="bloc-modale" v-if="modalModifTrav">

  <div class="overlay" v-on:click="AffichageModifTrav()"></div>
  
  <div class="modale card">

      <div class="btn-modale btn btn-danger" v-on:click="AffichageModifTrav()">X</div>
      <h1 class="styleTexte">Modifier Travaux</h1><br>
      
      
      <div class="Aucentre">

        <label for="" class="form-label">Nom de travaux</label>
        <input v-model="modifNomTrav" type="text" class="form-control" required />
        <br>
        
      
      </div>
      
      <button class="btn btn-primary" v-on:click="ModifierTravaux()">Modifier</button>
      
      

  </div>

</div>

<!-- MODALE AJOUT NOUVEAU LOT -->

<form @submit.prevent="ajouterLot()">
    
  <div class="bloc-modale" v-if="LotModale">

    <div class="overlay" v-on:click="AffichageModaleLot()"></div>
    
    <div class="modale card">

        <div class="btn-modale btn btn-danger" v-on:click="AffichageModaleLot()">X</div>
        <h1 class="styleTexte">Ajouter un nouveau Lot</h1><br>
        
        <div class="Aucentre">

          <label for="" class="form-label">Lot <b style="color: rgb(255, 0, 0);">*</b></label>
          <input v-model="nomLot" type="text" class="form-control" placeholder="Lot" required />
          <br>
        </div>
        
        <button class="btn btn-primary">Ajouter</button>
        

    </div>
  
</div>


</form>


<!-- MODALE AJOUT NOUVEAU TRAVAUX -->

<form @submit.prevent="ajouterTravau()">


     
  <div class="bloc-modale" v-if="TravauModale">

    <div class="overlay" v-on:click="AffichageModaleTravau()"></div>
    
    <div class="modale card">

        <div class="btn-modale btn btn-danger" v-on:click="AffichageModaleTravau()">X</div>
        <h1 class="styleTexte">Ajouter un nouveau Travau</h1><br>
        
        <div class="Aucentre">

          <label for="" class="form-label">Travau <b style="color: rgb(255, 0, 0);">*</b></label>
          <input v-model="nomTravau" type="text" class="form-control" placeholder="Travau" required />
          <br>
          
          <label for="" class="form-label">Description <b style="color: rgb(255, 0, 0);">*</b></label>
          <input v-model="description" type="text" class="form-control" placeholder="Description" required />
          <br>
        </div>
        
        <button class="btn btn-primary">Ajouter</button>
        

    </div>
  
</div>


</form> 



  </div>
</template>

<script>
import multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';  
import db from '@/db';

export default {
  components: { multiselect },
  data() {
    return {
      nomLot:'',
      nomTravau:'',
      idProjet:this.$route.query.idProj,
      modalModifTrav:false,
      TravauModale:false,
      LotModale:false,
      LotList: [],
      TravauxList: [],
      bdeAvecTravaux: [],
      toastMessage: '',

      // Ligne ajout inline
      nouveauLotId: '',
      nouveauTravauId: '',
      nouvelleUnite: '',
      nouvelleQuantite: null,
    };
  },
  async mounted() {
    await this.ListeLot();
    await this.ListeDesignation();
    await this.ListeBde();

  },
  methods: {



async ajouterLot() {

const existeLot = await db.Lot.where({ lot: this.nomLot }).first();
if (existeLot) { 
  alert("Cette lot existe déjà !"); 
  return; 
}

await db.Lot.add({ lot: this.nomLot });
await this.ListeLot();
this.toastMessage = "Ajout lot avec succès !";
setTimeout(() => this.toastMessage = '', 2000);
this.LotModale=false;

},

async ajouterTravau() {

const existeTravau = await db.Travaux.where({ nomTravau: this.nomTravau }).first();
if (existeTravau) { 
  alert("Cette désignation existe déjà !"); 
  return; 
}

await db.Travaux.add({ nomTravau: this.nomTravau, Description: this.description });
await this.ListeDesignation();
this.TravauModale = false;
this.toastMessage = "Ajout nouvelle désignation avec succès !";
setTimeout(() => this.toastMessage = '', 2000);
},

    // MODIFICATION LOT

    async RecupererTravaux(idTravaux) {
      const trav = await db.Travaux.get(idTravaux);
      if (trav) {
        this.idTravauxEnCours = trav.CodeLot;
        this.modifNomTrav = trav.travaux;
        this.modalModifTrav = true;
      }
    },
    AffichageModifTrav() { 

      this.modalModifTrav = !this.modalModifTrav; 
    
    },
    AffichageModaleLot() { 
    
      this.LotModale = !this.LotModale; 
    
    },
    AffichageModaleTravau() { 
    
      this.TravauModale = !this.TravauModale; 
    
    },

    async ModifierTravaux() {
      if (!this.modifNomTrav.trim()) { alert("Veuillez saisir un nom valide !"); return; }
      await db.Travaux.update(this.idTravauxEnCours, { travaux: this.modifNomTrav });
      this.modalModifTrav = false;
      this.idTravauxEnCours = null;
      this.modifNomTrav = "";
      await this.ListeLot();
      await this.ListeBde();
      this.toastMessage = "Modification avec succès !";
      setTimeout(() => this.toastMessage = '', 2000);
    },

    // FIN MODIFICATION LOT

    modaleNouveauTravau() {
      this.TravauModale = true; 
    },

    modaleNouveauLot(){
      this.LotModale = true;
    },



    async ListeLot() { 
      this.LotList = await db.Lot.toArray();
    
    },
    async ListeDesignation() {
       this.TravauxList = await db.Travaux.toArray(); 
      
    },

    async ListeBde() {
  // Maka ny BDE rehetra amin'ilay projet courant
  const BdeList = await db.bde.where('idProj').equals(Number(this.idProjet)).toArray();
  const resultat = [];

  for (const bde of BdeList) {
    const lot = await db.Lot.get(bde.CodeLot);
    const trav = await db.Travaux.get(bde.CodeTrav);

    // 🔥 Mitady raha efa misy ilay lot ao amin'ny resultat
    let existingLot = resultat.find(item => item.nomLot === lot.lot);
    if (!existingLot) {
      existingLot = { 
        nomLot: lot.lot,   // Anaran'ilay lot
        idLot: lot.CodeLot,
        travaux: []         // Travaux rehetra ao anatiny
      };
      resultat.push(existingLot);
    }

    // 🔥 Ampiana travaux vaovao ao anatin'ilay lot efa misy
    existingLot.travaux.push({
      CodeTrav: trav.CodeTrav,
      nomTravau: trav.nomTravau,
      nomDescription: trav.Description,
      Unite: bde.Unite,
      Quantite: bde.Quantite,
      Pu: bde.Pu,
      Montant: bde.Montant
    });
  }

  // Mise à jour de la variable d'affichage
  this.bdeAvecTravaux = resultat;
},


    async ajouterBde() {
  if (!this.nouveauLotId || !this.nouveauTravauId || !this.nouvelleUnite || !this.nouvelleQuantite) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  const codeLot = this.nouveauLotId.CodeLot;
  const codeTrav = this.nouveauTravauId.CodeTrav;

  const existe = await db.bde.where({
    idProj: this.idProjet,
    CodeLot: codeLot,
    CodeTrav: codeTrav
  }).first();
  if (existe) {
    alert("Cette BDE existe déjà !");
    return;
  }

  const numeroTrav = (await db.bde.where({ CodeLot: codeLot }).count());
  const codeBde = `${codeLot-1}-${numeroTrav+1}`;

  await db.bde.add({
    Num: codeBde,
    idProj: Number(this.idProjet),
    CodeLot: codeLot,
    CodeTrav: codeTrav,
    Unite: this.nouvelleUnite,
    Quantite: Number(this.nouvelleQuantite),
    Pu: 0,
    Montant: 0
  });

  // Reset
  this.nouveauLotId = null;
  this.nouveauTravauId = null;
  this.nouvelleUnite = '';
  this.nouvelleQuantite = null;

  await this.ListeBde();
  this.toastMessage = "BDE ajouté avec succès !";
  setTimeout(() => this.toastMessage = '', 2000);
},



    formatQte(val) { return val === null || val === undefined || isNaN(val) ? '0,00' : Number(val).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    formatPrice(val) { return Number(val).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    Montant(travaux) { return travaux.reduce((total, item) => total + item.Quantite * item.Pu, 0); },
    totalGeneral() { return this.bdeAvecTravaux.reduce((total, bde) => total + this.Montant(bde.travaux), 0); },

    toRoman(num) {
      const roman = ["", "O", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
      return roman[num] || num;
    }
  }
};
</script>

<style scoped>
.table { border-collapse: collapse; border: 0px solid black; }
th, td { padding: 8px; border: 0px solid #00000085; }
.sdp-table thead th { background: rgba(65, 80, 180, 0.87); color: white; text-align: center; }
.styleN { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; }
.toast-notification {
  position: fixed; top: 20px; right: 20px; background-color: #4caf50; color: white;
  padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  font-weight: bold; animation: fadein 0.3s, fadeout 0.5s 1.5s; z-index: 9999;
}
@keyframes fadein { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeout { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(10px); } }

/* STYLE MODIF LOT */
.bloc-modale { position: fixed; top: 0; bottom: 0; left: 0; right: 0; display: flex; justify-content: center; align-items: center; z-index: 9999; }
.overlay { background: rgba(0, 0, 0, 0.1); position: fixed; top: 0; bottom: 0; left: 0; right: 0; backdrop-filter: blur(1px); z-index: 9998; }
.modale { background: linear-gradient(200deg,#02303065,#557497,#00bbd49a); color: #333; padding: 50px; position: fixed; z-index: 10000; }
.btn-modale { position: absolute; top: 10px; right: 10px; }

</style>
