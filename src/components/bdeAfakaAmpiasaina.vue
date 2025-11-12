<template>
  <div class="container my-4">

    <!-- Toast notification -->
    <div v-if="toastMessage" class="toast-notification">
      {{ toastMessage }}
    </div>

    <!-- Tableau BDE -->
    <table class="table table-striped table-bordered table-hover sdp-table table-sm" v-if="TravauxList.length || bdeAvecTravaux.length">
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
v-model="nouveauTravauxId"
:options="TravauxList"
label="travaux"
track-by="CodeTrav"
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
v-model="nouvelleDesignationId"
:options="DesignationList"
label="Designation"
track-by="CodeDes"
placeholder="Choisir Travaux"
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
        <template v-for="(bde, numRomain) in bdeAvecTravaux" :key="bde.nomTravaux">
          <tr class="table-primary">
            <td></td>
            <td><strong>{{ toRoman(numRomain + 1) }} - {{ bde.nomTravaux }}</strong>
            <button class="btn btn-sm btn-outline-primary" style="float: right;" @click="RecupererTravaux(bde.idTravaux)">
              <font-awesome-icon icon="pen" /> Modifier
            </button>
            
            </td>
            
            <td></td><td></td><td></td><td></td><td></td>
          </tr>

          <tr v-for="(des, numeroDes) in bde.designations" :key="des.CodeDes">
            <td class="text-center fw-bold" style="color:rgb(65, 80, 180)">{{ numRomain + 0 }}-{{ numeroDes + 1 }}</td>
            <td class="fw-bold" style="color:rgb(65, 80, 180)">
              {{ des.nomDesignation }}<br>
              <small class="text-muted">concerne : {{ des.nomDescription }}</small>
            </td>
            <td>{{ des.Unite }}</td>
            <td>{{ formatQte(des.Quantite) }}</td>
            <td>{{ formatPrice(des.Pu) }}</td>
            <td>{{ formatQte(des.Quantite * des.Pu) }}</td>
            <td></td>
          </tr>

          <tr class="table-secondary">
            <td></td>
            <td class="text-end"><strong>Sous total</strong></td>
            <td></td><td></td><td></td>
            <td><strong>{{ formatQte(Montant(bde.designations)) }} Ar</strong></td>
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

    <div v-else class="styleN">Aucun BDE</div>

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
          <input v-model="designation" type="text" class="form-control" placeholder="Lot" required />
          <br>
        </div>
        
        <button class="btn btn-primary">Ajouter</button>
        

    </div>
  
</div>


</form>


<!-- MODALE AJOUT NOUVEAU TRAVAUX -->

<form @submit.prevent="ajouterDesignation()">


     
  <div class="bloc-modale" v-if="TravauModale">

    <div class="overlay" v-on:click="AffichageModaleTravau()"></div>
    
    <div class="modale card">

        <div class="btn-modale btn btn-danger" v-on:click="AffichageModaleTravau()">X</div>
        <h1 class="styleTexte">Ajouter un nouveau Travau</h1><br>
        
        <div class="Aucentre">

          <label for="" class="form-label">Travau <b style="color: rgb(255, 0, 0);">*</b></label>
          <input v-model="designation" type="text" class="form-control" placeholder="Travau" required />
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
      idProjet:this.$route.query.idProj,
      modalModifTrav:false,
      TravauModale:false,
      LotModale:false,
      TravauxList: [],
      DesignationList: [],
      bdeAvecTravaux: [],
      toastMessage: '',

      // Ligne ajout inline
      nouveauTravauxId: '',
      nouvelleDesignationId: '',
      nouvelleUnite: '',
      nouvelleQuantite: null,
    };
  },
  async mounted() {
    await this.ListeTravaux();
    await this.ListeDesignation();
    await this.ListeBde();

  },
  methods: {

    // MODIFICATION LOT

    async RecupererTravaux(idTravaux) {
      const trav = await db.Travaux.get(idTravaux);
      if (trav) {
        this.idTravauxEnCours = trav.CodeTrav;
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
      await this.ListeTravaux();
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



    async ListeTravaux() { 
      this.TravauxList = await db.Travaux.toArray();
    
    },
    async ListeDesignation() {
       this.DesignationList = await db.designation.toArray(); 
      
    },

    async ListeBde() {
  const BdeList = await db.bde.where('idProj').equals(Number(this.idProjet)).toArray(); // 🔥 filtre par projet courant
  const resultat = [];

  for (const bde of BdeList) {
    const trav = await db.Travaux.get(bde.CodeTrav);
    const des = await db.designation.get(bde.CodeDes);

    let existingTrav = resultat.find(item => item.nomTravaux === trav.travaux);
    if (!existingTrav) {
      existingTrav = { nomTravaux: trav.travaux, idTravaux: trav.CodeTrav, designations: [] };
      resultat.push(existingTrav);
    }

    existingTrav.designations.push({
      CodeDes: des.CodeDes,
      nomDesignation: des.Designation,
      nomDescription: des.Description,
      Unite: bde.Unite,
      Quantite: bde.Quantite,
      Pu: bde.Pu,
      Montant: bde.Montant
    });
  }

  this.bdeAvecTravaux = resultat;
},



    async ajouterBde() {
  if (!this.nouveauTravauxId || !this.nouvelleDesignationId || !this.nouvelleUnite || !this.nouvelleQuantite) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  const travCode = this.nouveauTravauxId.CodeTrav;
  const desCode = this.nouvelleDesignationId.CodeDes;

  const existe = await db.bde.where({
    idProj: this.idProjet,
    CodeTrav: travCode,
    CodeDes: desCode
  }).first();
  if (existe) {
    alert("Cette BDE existe déjà !");
    return;
  }

  const numeroDes = (await db.bde.where({ CodeTrav: travCode }).count()) + 1;
  const codeBde = `${travCode}-${numeroDes}`;

  await db.bde.add({
    Num: codeBde,
    idProj: Number(this.idProjet),
    CodeTrav: travCode,
    CodeDes: desCode,
    Unite: this.nouvelleUnite,
    Quantite: Number(this.nouvelleQuantite),
    Pu: 0,
    Montant: 0
  });

  // Reset
  this.nouveauTravauxId = null;
  this.nouvelleDesignationId = null;
  this.nouvelleUnite = '';
  this.nouvelleQuantite = null;

  await this.ListeBde();
  this.toastMessage = "BDE ajouté avec succès !";
  setTimeout(() => this.toastMessage = '', 2000);
},



    formatQte(val) { return val === null || val === undefined || isNaN(val) ? '0,00' : Number(val).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    formatPrice(val) { return Number(val).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    Montant(designations) { return designations.reduce((total, item) => total + item.Quantite * item.Pu, 0); },
    totalGeneral() { return this.bdeAvecTravaux.reduce((total, bde) => total + this.Montant(bde.designations), 0); },

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
