  <template>

  <!-- Toast notification -->
  <div v-if="toastMessage" class="toast-notification">
    {{ toastMessage }}
  </div>

<div class="container my-4">

    
<div class="card shadow-lg border-0 rounded-4 p-4 mb-4 bg-light bg-opacity-75">
  <!-- Header avec boutons -->
  <div class="d-flex justify-content-between align-items-center mb-4" style="font-family: 'MaRaleway',sans-serif;">
    <h4 class="fw-bold text-primary mb-0">Gestion de Bde</h4>
    <div class="d-flex gap-2">
      <button 
        class="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-3 modern-btn"
        @click="modaleNouveauTravaux"
      >
        <font-awesome-icon icon="hammer" style="font-size: 18;"/>
        <span>Nouveau</span>
      </button>

      <button 
        class="btn btn-outline-primary d-flex align-items-center gap-2 rounded-pill px-3 modern-btn"
        @click="modaleBde"
      >
        <font-awesome-icon icon="plus-circle" style="font-size: 18;"/>
        <span>Désignation</span>
      </button>
    </div>
  </div>

  <!-- Sélection Projet -->
  <div v-if="ProjetList.length > 0">
    <label for="selectProjet" class="form-label fw-semibold text-secondary">Projet</label>
    <select
      id="selectProjet"
      v-model="selectedDevisId"
      class="form-select form-select-lg shadow-sm rounded-pill border-0 focus-ring"
      @change="filtrerBdeParDevis"
    >
      <option disabled value="" selected hidden>-- Sélectionner un projet --</option>
      <option v-for="devis in ProjetList" :key="devis.idDevis" :value="devis.idDevis">
        {{ devis.nomProjet }}
      </option>
    </select>
  </div>
</div>

  

<form @submit.prevent="ajouterBdeNouveau()">

    <div class="bloc-modale" v-if="afficherFormulaireBde">

        <div class="overlay" v-on:click="AffichageFormulaireBde()"></div>
        
        <div class="modale card">

            <div class="btn-modale btn btn-danger" v-on:click="AffichageFormulaireBde()">X</div>
            <br><center><h1 class="styleTexte">Ajouter Bde</h1></center>
            


                <!-- FORMULAIRE BDE -->


        <div class="row">

          <div class="col-md-12 mb-3">

          <label class="form-label">Projet <b style="color: rgb(255, 0, 0);">*</b></label>
            <select v-model="selectedProjetId" class="form-select" required>
              <option disabled value="">-- Choisir Projet --</option>
              <option v-for="proj in ProjetList" :key="proj.idDevis" :value="proj.idDevis">
                {{ proj.nomProjet }}
              </option>
            </select>

     
          </div>


        </div>



        
        <div class="row">

          <div class="col-md-12 mb-3">

          <label class="form-label">Travaux <b style="color: rgb(255, 0, 0);">*</b></label>
            <select v-model="selectedTraveauId" class="form-select" required>
              <option disabled value="">-- Choisir travaux --</option>
              <option v-for="trav in TravauxList" :key="trav.CodeTrav" :value="trav.CodeTrav">
                {{ trav.travaux }}
              </option>
            </select> 
          </div>      
          
        </div>

        <div class="row mb-3">

          <div class="col-md-12">

            <label class="form-label">Désignation <b style="color: rgb(255, 0, 0);">*</b></label>
            <select v-model="selectedDesignationId" class="form-select" required>
              <option disabled value="">-- Choisir designation --</option>
              <option v-for="des in DesignationList" :key="des.CodeDes" :value="des.CodeDes">
                {{ des.Designation }}
              </option>
            </select>

            

          
          </div>
          
        </div>

        
        <div class="row mb-4">

          <div class="col-md-6">

            <label class="form-label">Unité <b style="color: rgb(255, 0, 0);">*</b></label>
            <input v-model="Unite" type="text" class="form-control" placeholder="Unité" required />
       
          </div>

          <div class="col-md-6">
            
            <label class="form-label">Quantité <b style="color: rgb(255, 0, 0);">*</b></label>
            <input v-model="Quantite" class="form-control" placeholder="Quantité" required />

          </div>

        </div> 
   

        <button type="submit" class="btn btn-primary">Ajouter</button>
    

        </div>
      
    </div>
</form>
          



<!-- TITRE PROJET -->
      
<div class="mb-4">
<center><h2 v-if="selectedDevisNom">{{ selectedDevisNom }}</h2></center>
</div>
      

<!-- TABLEAU BDE -->

<table class="table table-striped table-bordered table-hover sdp-table" v-if="bdeAvecTravaux.length">
        <thead class="table-dark">
          <tr>
            <th>N°</th>
            <th>DESIGNATION</th>
            <th>U</th>
            <th>QUANTITE</th>
            <th>PRIX UNITAIRE</th>
            <th>MONTANT</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(bde, numRomain) in bdeAvecTravaux" :key="bde.nomTravaux">
            <!-- Titre de la catégorie -->
            <tr class="table-primary">
              <td></td>
              <td><strong>{{ toRoman(numRomain + 1) }} - {{ bde.nomTravaux }}</strong><button class="btn btn-sm btn-outline-primary" style="float: right;" v-on:click="RecupererTravaux(bde.idTravaux)"><font-awesome-icon icon="pen" /> Modifier</button></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <!-- Détails (désignations) sous cette catégorie -->
            <tr v-for="(des, numeroDes) in bde.designations" :key="des.CodeDes">
              <td>{{ numRomain + 0 }}-{{ numeroDes + 1 }}</td>
              <td>
                {{ des.nomDesignation }}<br>
                <small class="text-muted">concerne : {{ des.nomDescription }}</small>
              </td>
              <td>{{ des.Unite }}</td>
              <td>{{ formatQte(des.Quantite) }}</td>
              <td>{{ formatPrice(des.Pu) }}</td>
              <td>{{ formatQte(des.Quantite * des.Pu) }}</td>
            </tr>


            <tr>
            <td></td>
            <td>
              <multiselect
                v-model="selectedDesignationParTravaux[numRomain]"
                :options="DesignationList"
                placeholder="Sélectionner désignation"
                :searchable="true"
                :close-on-select="true"
                label="Designation"
                track-by="CodeDes"
                @select="modaleDesignation"
              >
                <template #noResult>
                  <div style="padding: 5px; color: red;">Aucun résultat trouvé.</div>
                  <hr>
                  <button type="button" @click="modaleNouvelleDesignation">Créer cette désignation</button>
                </template>
              </multiselect>


            <!-- MODALE AJOUT NOUVEAU DESIGNATION BDE-->

<form @submit.prevent="ajouterBde(numRomain, bde.nomTravaux)">

      <div class="bloc-modale" v-if="afficherModaleDesignation">

        <div class="overlay" v-on:click="AffichageDesignationBde()"></div>
        
        <div class="modale card">

            <div class="btn-modale btn btn-danger" v-on:click="AffichageDesignationBde()">X</div>
            <br><center><h1 class="styleTexte">Ajouter Bde</h1></center><br>
            <h5 style="background: linear-gradient(100deg,#08b4b4ee,#557497,#00bbd49a);text-align: center;font-weight: 800;color:white;padding:10px;">{{ DesignationSelectionner }}</h5>
            
        
        
        <div class="mb-3">
          <label for="" class="form-label">Unité</label>
          <input class="form-control" v-model="UniteBde" placeholder="unite" required/>
        </div>
        
        
        <div class="mb-3">
          <label for="" class="form-label">Quantité</label>
          <input class="form-control" v-model="QuantiteBde" placeholder="qte" required/>
        </div>

        <button type="submit" class="btn btn-primary">Ajouter</button>
                  
        </div>
      
    </div>

</form>             



    
<!-- MODALE AJOUT NOUVEAU DESIGNATION -->

<form @submit.prevent="ajouterDesignation()">


     
      <div class="bloc-modale" v-if="DesignationModale">

        <div class="overlay" v-on:click="AffichageModaleDesignation()"></div>
        
        <div class="modale card">

            <div class="btn-modale btn btn-danger" v-on:click="AffichageModaleDesignation()">X</div>
            <h1 class="styleTexte">Ajouter une nouvelle désignation</h1><br>
            
            <div class="Aucentre">

              <label for="" class="form-label">Designation <b style="color: rgb(255, 0, 0);">*</b></label>
              <input v-model="designation" type="text" class="form-control" placeholder="Designation" required />
              <br>
              
              <label for="" class="form-label">Description <b style="color: rgb(255, 0, 0);">*</b></label>
              <input v-model="description" type="text" class="form-control" placeholder="Description" required />
              <br>
            </div>
            
            <button class="btn btn-primary">Ajouter</button>
            

        </div>
      
    </div>


</form> 








              <br>
           </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>




            <!-- Sous-total -->
            <tr class="table-secondary">
              <td></td>
              <td class="text-end"><strong>Sous total</strong></td>
              <td></td>
              <td></td>
              <td></td>
              <td><strong>{{ formatQte(Montant(bde.designations)) }} Ar</strong></td>
            </tr>





          </template>
          <tr class="table-dark">

            <td></td>
            <td class="text-end"><strong>Total général</strong></td>
            <td></td>
            <td></td>
            <td></td>
            <td><strong>{{ formatQte(totalGeneral()) }} Ar</strong></td>
          
          </tr>

        </tbody>


</table>


<!-- MODALE AJOUT NOUVEAU TRAVAIL -->

<form @submit.prevent="ajouterTravaux()">


     <div class="bloc-modale" v-if="afficherModale">

          <div class="overlay" v-on:click="Affichage()"></div>
          
          <div class="modale card">

              <div class="btn-modale btn btn-danger" v-on:click="Affichage()">X</div>
              <h1 class="styleTexte">Nouveau travail</h1><br>
              
              <div class="mb-3">

                <label for="" class="form-label">Travail</label>
                <input v-model="travaux" class="form-control" placeholder="travaux" required/>
                <br>

              </div>
              
              <button class="btn btn-primary">Ajouter</button>
              

          </div>
        
      </div>

</form>

     
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


<!-- GENERATION PDF -->

<button v-if="bdeAvecTravaux.length" class="btn btn-outline-danger" @click="generatePDF">
  <font-awesome-icon icon="file-pdf" /> Télécharger PDF
</button>


<div class="styleN" v-else>
  
  <!-- <img v-bind:src="nonTrouver" width="200"> -->
Aucun résultat  

</div>


</div>
</template>
<script>
import multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import db from '@/db';

  export default {
    components: { multiselect },
    data() {
      return {

        chargement:true,
        // nonTrouver:'src/image/loader-unscreen.gif',

        // MODALE

        afficherModaleDesignation:false,
        DesignationModale:false,
        afficherModale:false,
        afficherFormulaireBde:false,
        modalModifTrav:false,

        // Sélection projet

        selectedDevisId: '',
        selectedDevisNom: '',
        UniteBde:'',
        QuantiteBde:'',

        toastMessage: '',
        
        travaux: '',
        modifNomTrav: "",
        
        DesignationSelectionner:"",

        // attribut bde

        idProjet:'',
        selectedProjetId: '',
        selectedTraveauId: '',
        Unite:'',
        Quantite:'',
        
        selectedDesignationId: '',
        selectedDesignationParTravaux: {},

        // Liste

        ProjetList:[],
        TravauxList: [],
        DesignationList:[],
        bdeAvecTravaux:[],


        // attribut nouvelle designation

        designation:'',
        description:''
  };
    },
      async mounted() {

    await this.ListeProjets();
    await this.ListeTravaux();
    await this.ListeDesignation();
    // await this.ListeBde();


      
  },
    methods: {

      // FILTER PROJET

          async filtrerBdeParDevis() {
      const devis = this.ProjetList.find(d => d.idDevis === this.selectedDevisId);
      this.selectedDevisNom = devis ? devis.nomProjet : "";

      const BdeList = await db.bde.where('idDevis').equals(this.selectedDevisId).toArray();
      const resultat = [];

      for (const bde of BdeList) {
        const trav = await db.Travaux.get(bde.CodeTrav);
        const des = await db.designation.get(bde.CodeDes);

        let existingTrav = resultat.find(item => item.nomTravaux === trav.travaux);

        if (!existingTrav) {
          existingTrav = {
            nomTravaux: trav.travaux,
            idTravaux: trav.CodeTrav,
            designations: []
          };
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
      
     AffichageDesignationBde:function(){
            this.afficherModaleDesignation = !this.afficherModaleDesignation;
        },


    AffichageModifTrav:function(){
            this.modalModifTrav = !this.modalModifTrav;
        },

    AffichageFormulaireBde:function(){
            this.afficherFormulaireBde = !this.afficherFormulaireBde;
        },

        totalGeneral() {
    return this.bdeAvecTravaux.reduce((total, bde) => {
    return total + this.Montant(bde.designations);
  }, 0);
},





  // MODALE
        
modaleDesignation(item) {

    if (!item) return;
  this.afficherModaleDesignation = true;
  this.DesignationSelectionner = item.Designation;
  // this.PuMat = item.Prix;

},

modaleBde() {

  this.afficherFormulaireBde = true;
  
},

      
  // RECUPERER TRAVAUX

async RecupererTravaux(idTravaux) {
  const trav = await db.Travaux.get(idTravaux);
  if (trav) {
    this.idTravauxEnCours = trav.CodeTrav;
    this.modifNomTrav = trav.travaux;
    this.modalModifTrav = true;
  }
},

  // MODIFIER TRAVAUX

 async ModifierTravaux() {

       if (!this.modifNomTrav.trim()) {
    alert("Veuillez saisir un nom valide !");
    return;
  }

  await db.Travaux.update(this.idTravauxEnCours, {
    travaux: this.modifNomTrav
  });

  

  this.modalModifTrav = false;
  this.idTravauxEnCours = null;
  this.modifNomTrav = "";

  await this.ListeTravaux();
  await this.ListeBde();
  await this.AfficherMessageModif();
  


    },


  // NOTIFICATION MODIF TRAVAUX

async AfficherMessageModif(){
  
    // Affiche le toast
    this.toastMessage = "Modification avec succès !";
    setTimeout(() => {
      this.toastMessage = '';
    }, 2000);
    
  },



  // AJOUT

async ajouterDesignation() {

    await db.designation.add({

      Designation: this.designation,
      Description: this.description

    });
    await this.ListeDesignation();
    
    // Affiche le toast

    this.toastMessage = "Ajout nouvelle désignation avec succès !";
    setTimeout(() => {
      this.toastMessage = '';
    }, 2000);

    this.DesignationModale = false;

  },



async ajouterTravaux() {
      // Ajouter le matériel
      await db.Travaux.add({
        travaux: this.travaux
      });
      await this.ListeTravaux();
      await this.notification();
      this.afficherModale=false;

    },


async ajouterBde(indexTravaux, nomTravaux) {
      const designation = this.selectedDesignationParTravaux[indexTravaux];

      const travail = this.TravauxList.find(t => t.travaux === nomTravaux);
      if (!travail) return alert("Travaux non trouvé");

      // Vérifier si déjà présent
  const existe = await db.bde
    .where({ 
      CodeTrav: travail.CodeTrav, 
      CodeDes: designation.CodeDes 
    }).first();

  if (existe) {
    alert("Cette bde est déjà ajoutée pour cette travaux !");
    return;
    // await this.test();
    return;
  }

      await db.bde.add({
        idDevis: this.selectedDevisId,
        CodeTrav: travail.CodeTrav,
        CodeDes: designation.CodeDes,
        Unite: this.UniteBde,
        Quantite: Number(this.QuantiteBde),
        Pu: 0,
        Montant: 0
      });

      // Affiche le toast
      this.toastMessage = "Ajout BDE avec succès !";
      setTimeout(() => {
        this.toastMessage = '';
      }, 2000);

      this.selectedDesignationParTravaux[indexTravaux] = null;
      await this.filtrerBdeParDevis();
      this.afficherModaleDesignation = false;
      this.toast("Ajout réussi !");
    },

    
async ajouterBdeNouveau() {

      await db.bde.add({
        idDevis: this.selectedProjetId,
        CodeTrav: this.selectedTraveauId,
        CodeDes: this.selectedDesignationId,
        Unite: this.Unite,
        Quantite: Number(this.Quantite),
        Pu: 0,// La valeur est dans le sdp
        Montant: 0
      });
      await this.ListeBde();

      this.afficherFormulaireBde = false;
      // Affiche le toast
      this.toastMessage = "Ajout BDE avec succès !";
      setTimeout(() => {
        this.toastMessage = '';
      }, 2000);


    },

  


  // GENERER PDF

generatePDF() {
  const doc = new jsPDF("p", "mm", "a4");

  // Titre
  doc.setFontSize(14);
  doc.text("Tableau BDE", 14, 15);

  // Construction des lignes du tableau
  const body = [];


  this.bdeAvecTravaux.forEach((bde, numRomain) => {
    // Ligne catégorie
    body.push([
      { content: "", styles: { fillColor: [173, 216, 230] } },
      { content: `${this.toRoman(numRomain + 1)} - ${bde.nomTravaux}`, colSpan: 5, styles: { fillColor: [173, 216, 230], fontStyle: "bold" } },
      {}, {}, {}, {}
    ]);

    // Lignes détails
    bde.designations.forEach((des, numeroDes) => {
      const qte = Number(des.Quantite) || 0;
      const pu = Number(des.Pu) || 0;
      const montant = qte * pu;

      body.push([
        `${numRomain + 0}-${numeroDes + 0}`,
        `${des.nomDesignation}\n(concerne : ${des.nomDescription})`,
        des.Unite,
        this.formatQte(qte).replace(/\s/g, " "),
        this.formatPrice(pu).replace(/\s/g, " "),
        this.formatQte(montant).replace(/\s/g, " "),
      ]);
    });

    // Ligne sous-total
    const sousTotal = bde.designations.reduce((total, d) => {
      const qte = Number(d.Quantite) || 0;
      const pu = Number(d.Pu) || 0;
      return total + (qte * pu);
    }, 0);

    body.push([
      "",
      { content: "Sous total", colSpan: 4, styles: { halign: "right", fillColor: [220, 220, 220], fontStyle: "bold" } },`${this.formatQte(sousTotal).replace(/\s/g, " ")}`]);
  });

  // Génération du tableau
  autoTable(doc, {
    head: [["N°", "DESIGNATION", "U", "QUANTITE", "PRIX UNITAIRE", "MONTANT"]],
    body: body,
    startY: 25,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [52, 58, 64] }, // couleur entête bootstrap "table-dark"
  });

  // Sauvegarde
  doc.save("bde.pdf");
},



  // FORMAT

formatQte(val) {

  if (val === null || val === undefined || isNaN(val)) {
    return '0,00';
  }
  return Number(val).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

},


formatPrice(val) {
      

      let multiple = 10;
  if (val >= 1000000) {
    multiple = 10000;
  } else if (val >= 100000) {
    multiple = 1000;
  } else if (val >= 10000) {
    multiple = 100;
  }

  // Arrondir vers le bas au multiple choisi
  const arrondi = Math.round(val / multiple) * multiple;

  // 4. Formater avec 2 décimales en français
  return arrondi.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

    },


  // MONTANT TOTAL

Montant(designations) {
      return designations.reduce(
        (total, item) => total + item.Quantite * item.Pu,0);
    },



  // NOTIFICATION

    async notification(){

      
  // Affiche le toast
      this.toastMessage = "Ajout travail avec succès !";
      setTimeout(() => {
        this.toastMessage = '';
      }, 2000);

    },

    // MODALE

      Affichage:function(){
              this.afficherModale = !this.afficherModale;
          },

      modaleNouveauTravaux() {

    this.afficherModale = true;
  
  },

      modaleNouvelleDesignation() {

    this.DesignationModale = true;
  
  },

  AffichageModaleDesignation:function(){
            this.DesignationModale = !this.DesignationModale;
        },


      // CALCUL SOUS TOTAL

      calculerSousTotal(designations) {
  return designations.reduce((total, item) => {
    const montant = parseFloat(item.Montant);
    return total + (isNaN(montant) ? 0 : montant);
  }, 0);
},



      // LISTE 


    async ListeBde() {

    const BdeList = await db.bde.toArray();

    const resultat = [];

    for (const bde of BdeList) {
      const trav = await db.Travaux.get(bde.CodeTrav);
      const des = await db.designation.get(bde.CodeDes);

      // Regrouper par travaux
      let existingTrav = resultat.find(item => item.nomTravaux === trav.travaux);

      if (!existingTrav) {
        existingTrav = {
          nomTravaux: trav.travaux,
          idTravaux: trav.CodeTrav,
          designations: []
        };
        resultat.push(existingTrav);
      }

      existingTrav.designations.push({
        CodeDes: des.CodeDes,
        nomDesignation: des.Designation,
        nomDescription: des.Description,
        Unite: bde.Unite,
        Quantite: Number(bde.Quantite) || 0,
        Pu: Number(bde.PrixUnitaire) || 0,
        Montant: Number(bde.Montant) || 0
      });
    }

    this.bdeAvecTravaux = resultat;
  },


    toRoman(num) {
        const roman = ["", "O", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
        return roman[num] || num;
      },


      async ListeProjets(){

          this.ProjetList = await db.Devis.toArray();
          this.chargement = false;

      },

      async ListeTravaux(){

          this.TravauxList = await db.Travaux.toArray();


      },


      async ListeDesignation(){

          this.DesignationList = await db.designation.toArray();

      },

    }
  };
</script>

<style scoped>

    .styleN{
          position: relative;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 3px solid black;
          z-index: 0;
    }


    .form-label{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: white;
            font-size: 16px;
    }

  /* MODALE */

      .bloc-modale{

          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
      
      }
      .overlay{
          background: rgba(0, 0, 0, 0.295);
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
    transition: backdrop-filter 0.3s ease, background 0.3s ease;
    /* AO AMBADIKAN'NY MODALE NY PLASINY */
     z-index: 9998;
      }
      .modale{
          background: linear-gradient(200deg,#02303065,#557497,#00bbd49a);
          color: #333;
          padding: 50px;
          position: fixed;
           /* AMBONY NY PLASINY */
          z-index: 10000;
      }
      .btn-modale{
          position: absolute;
          top: 10px;
          right: 10px;
      }
      .styleTexte{
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
            color:white;
            text-align: center;
        }


    table {
    border-collapse: collapse;
    border: 2px solid black;
  }
  th, td,tr {
    padding: 8px;
    border: 1px solid #000000;
  }



  /* NOTIFICATION */

  .toast-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #4caf50;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    font-weight: bold;
    animation: fadein 0.3s, fadeout 0.5s 1.5s;
    z-index: 9999;
  }

  @keyframes fadein {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeout {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(10px); }
  }

.sdp-table thead th {
  background:linear-gradient(#02303065,#557497,#0c5e699a);
  color: white;
  text-align: center;
}
  </style>