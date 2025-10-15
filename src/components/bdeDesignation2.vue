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

    <!-- Formulaire ajout BDE -->
    <form @submit.prevent="ajouterBdeNouveau()">
      <div class="bloc-modale" v-if="afficherFormulaireBde">
        <div class="overlay" @click="AffichageFormulaireBde()"></div>
        <div class="modale card">
          <div class="btn-modale btn btn-danger" @click="AffichageFormulaireBde()">X</div>
          <center><h1 class="styleTexte">Ajouter Bde</h1></center>

          <!-- Sélection Projet -->
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

          <!-- Sélection Travaux -->
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

          <!-- Sélection Désignation -->
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

          <!-- Unité et Quantité -->
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

    <!-- Titre Projet -->
    <div class="mb-4">
      <center><h2 v-if="selectedDevisNom">{{ selectedDevisNom }}</h2></center>
    </div>

    <!-- Tableau BDE -->
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
            <td>
              <strong>{{ toRoman(numRomain + 1) }} - {{ bde.nomTravaux }}</strong>
              <button class="btn btn-sm btn-outline-primary" style="float: right;" @click="RecupererTravaux(bde.idTravaux)">
                <font-awesome-icon icon="pen" /> Modifier
              </button>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <!-- Détails (désignations) -->
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

          <!-- Multiselect ajout désignation -->
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
              <button class="btn btn-sm btn-primary mt-2" @click="ajouterBde(numRomain, bde.nomTravaux)">
                Ajouter désignation
              </button>
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

        <!-- Total général -->
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

    <div v-else class="styleN">
      Aucun résultat
    </div>

    <!-- Bouton PDF -->
    <button v-if="bdeAvecTravaux.length" class="btn btn-outline-danger" @click="generatePDF">
      <font-awesome-icon icon="file-pdf" /> Télécharger PDF
    </button>

    <!-- MODALES et formulaires supplémentaires (Travaux, Désignation, Modifier Travaux) sont identiques à ton code existant -->
    <!-- Le script ci-dessous gère toutes les actions et les interactions avec Dexie -->

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
      afficherModaleDesignation:false,
      DesignationModale:false,
      afficherModale:false,
      afficherFormulaireBde:false,
      modalModifTrav:false,
      selectedDevisId: '',
      selectedDevisNom: '',
      UniteBde:'',
      QuantiteBde:'',
      toastMessage: '',
      travaux: '',
      modifNomTrav: "",
      DesignationSelectionner:"",
      idProjet:'',
      selectedProjetId: '',
      selectedTraveauId: '',
      Unite:'',
      Quantite:'',
      selectedDesignationId: '',
      selectedDesignationParTravaux: [],
      ProjetList:[],
      TravauxList: [],
      DesignationList:[],
      bdeAvecTravaux:[],
      designation:'',
      description:''
    };
  },
  async mounted() {
    await this.ListeProjets();
    await this.ListeTravaux();
    await this.ListeDesignation();
  },
  methods: {

    // Filtrer BDE par projet
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
          Montant: bde.Montant,
          codeBde: bde.codeBde
        });
      }

      this.bdeAvecTravaux = resultat;
      this.selectedDesignationParTravaux = this.bdeAvecTravaux.map(() => null);
    },

    AffichageDesignationBde() { this.afficherModaleDesignation = !this.afficherModaleDesignation; },
    AffichageModifTrav() { this.modalModifTrav = !this.modalModifTrav; },
    AffichageFormulaireBde() { this.afficherFormulaireBde = !this.afficherFormulaireBde; },

    totalGeneral() {
      return this.bdeAvecTravaux.reduce((total, bde) => total + this.Montant(bde.designations), 0);
    },

    modaleDesignation(item) {
      if (!item) return;
      this.afficherModaleDesignation = true;
      this.DesignationSelectionner = item.Designation;
    },

    modaleBde() { this.afficherFormulaireBde = true; },
    modaleNouveauTravaux() { this.afficherModale = true; },
    modaleNouvelleDesignation() { this.DesignationModale = true; },

    async RecupererTravaux(idTravaux) {
      const trav = await db.Travaux.get(idTravaux);
      if (trav) {
        this.idTravauxEnCours = trav.CodeTrav;
        this.modifNomTrav = trav.travaux;
        this.modalModifTrav = true;
      }
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

    async ajouterDesignation() {
      await db.designation.add({ Designation: this.designation, Description: this.description });
      await this.ListeDesignation();
      this.DesignationModale = false;
      this.toastMessage = "Ajout nouvelle désignation avec succès !";
      setTimeout(() => this.toastMessage = '', 2000);
    },

    async ajouterTravaux() {
      await db.Travaux.add({ travaux: this.travaux });
      await this.ListeTravaux();
      this.toastMessage = "Ajout travail avec succès !";
      setTimeout(() => this.toastMessage = '', 2000);
      this.afficherModale=false;
    },

    async ajouterBde(indexTravaux, nomTravaux) {
      const designation = this.selectedDesignationParTravaux[indexTravaux];
      if (!designation) { alert("Veuillez sélectionner une désignation !"); return; }

      const travail = this.TravauxList.find(t => t.travaux === nomTravaux);
      if (!travail) return alert("Travaux non trouvé");

      const existe = await db.bde.where({ CodeTrav: travail.CodeTrav, CodeDes: designation.CodeDes }).first();
      if (existe) { alert("Cette BDE existe déjà pour ce travail !"); return; }

      const numRomain = indexTravaux;
      const numeroDes = (await db.bde.where({ CodeTrav: travail.CodeTrav }).count()) + 1;
      const codeBde = `${numRomain}-${numeroDes}`;

      await db.bde.add({
        idDevis: this.selectedDevisId,
        CodeTrav: travail.CodeTrav,
        CodeDes: designation.CodeDes,
        Unite: this.UniteBde,
        Quantite: Number(this.QuantiteBde),
        Pu: 0,
        Montant: 0,
        codeBde
      });

      this.toastMessage = "Ajout BDE avec succès !";
      setTimeout(() => this.toastMessage = '', 2000);

      this.selectedDesignationParTravaux[indexTravaux] = null;
      await this.filtrerBdeParDevis();
      this.afficherModaleDesignation = false;
    },

    async ajouterBdeNouveau() {
      if (!this.selectedProjetId || !this.selectedTraveauId || !this.selectedDesignationId) {
        alert("Veuillez remplir tous les champs !"); return;
      }
      const travail = await db.Travaux.get(this.selectedTraveauId);
      const designation = await db.designation.get(this.selectedDesignationId);
      if (!travail || !designation) { alert("Travaux ou désignation introuvable !"); return; }

      const existe = await db.bde.where({
        idDevis: this.selectedProjetId,
        CodeTrav: this.selectedTraveauId,
        CodeDes: this.selectedDesignationId
      }).first();
      if (existe) { alert("Cette BDE existe déjà !"); return; }

      const numRomain = this.TravauxList.findIndex(t => t.CodeTrav === this.selectedTraveauId);
      const numeroDes = (await db.bde.where({ CodeTrav: this.selectedTraveauId }).count()) + 1;
      const codeBde = `${numRomain}-${numeroDes}`;

      await db.bde.add({
        idDevis: this.selectedProjetId,
        CodeTrav: this.selectedTraveauId,
        CodeDes: this.selectedDesignationId,
        Unite: this.Unite,
        Quantite: Number(this.Quantite),
        Pu: 0,
        Montant: 0,
        codeBde
      });

      await this.ListeBde();
      this.afficherFormulaireBde = false;
      this.toastMessage = "Ajout BDE avec succès !";
      setTimeout(() => this.toastMessage = '', 2000);
    },

    // Formats
    formatQte(val) { return val === null || val === undefined || isNaN(val) ? '0,00' : Number(val).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    formatPrice(val) {
      let multiple = 10;
      if (val >= 1000000) multiple = 10000;
      else if (val >= 100000) multiple = 1000;
      else if (val >= 10000) multiple = 100;

      const arrondi = Math.round(val / multiple) * multiple;
      return arrondi.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    Montant(designations) {
      return designations.reduce((total, item) => total + item.Quantite * item.Pu, 0);
    },

    generatePDF() {
      const doc = new jsPDF("p", "mm", "a4");
      doc.setFontSize(14);
      doc.text("Tableau BDE", 14, 15);

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
            `${numRomain}-${numeroDes}`,
            `${des.nomDesignation}\n(concerne : ${des.nomDescription})`,
            des.Unite,
            this.formatQte(qte),
            this.formatPrice(pu),
            this.formatQte(montant)
          ]);
        });

        // Ligne sous-total
        const sousTotal = bde.designations.reduce((total, d) => total + (Number(d.Quantite) * Number(d.Pu)), 0);
        body.push([
          "",
          { content: "Sous total", colSpan: 4, styles: { halign: "right", fillColor: [220, 220, 220], fontStyle: "bold" } },
          this.formatQte(sousTotal)
        ]);
      });

      autoTable(doc, {
        head: [["N°", "DESIGNATION", "U", "QUANTITE", "PRIX UNITAIRE", "MONTANT"]],
        body: body,
        startY: 25,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [52, 58, 64] },
      });

      doc.save("bde.pdf");
    },

    // Affichage modales
    Affichage() { this.afficherModale = !this.afficherModale; },
    AffichageModaleDesignation() { this.DesignationModale = !this.DesignationModale; },

    // Listes
    async ListeBde() {
      const BdeList = await db.bde.toArray();
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
          Quantite: Number(bde.Quantite) || 0,
          Pu: Number(bde.Pu) || 0,
          Montant: Number(bde.Montant) || 0
        });
      }

      this.bdeAvecTravaux = resultat;
    },

    async ListeProjets() { this.ProjetList = await db.Devis.toArray(); this.chargement = false; },
    async ListeTravaux() { this.TravauxList = await db.Travaux.toArray(); },
    async ListeDesignation() { this.DesignationList = await db.designation.toArray(); },

    // Conversion en chiffres romains simplifié
    toRoman(num) {
      const roman = ["", "O", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
      return roman[num] || num;
    }
  }
};
</script>

<style scoped>
/* Modales et toast notifications */
.bloc-modale { position: fixed; top: 0; bottom: 0; left: 0; right: 0; display: flex; justify-content: center; align-items: center; z-index: 9999; }
.overlay { background: rgba(0, 0, 0, 0.3); position: fixed; top: 0; bottom: 0; left: 0; right: 0; backdrop-filter: blur(2px); z-index: 9998; }
.modale { background: linear-gradient(200deg,#02303065,#557497,#00bbd49a); color: #333; padding: 50px; position: fixed; z-index: 10000; }
.btn-modale { position: absolute; top: 10px; right: 10px; }
.styleTexte { font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; color:white; text-align: center; }

.toast-notification {
  position: fixed; top: 20px; right: 20px; background-color: #4caf50; color: white;
  padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  font-weight: bold; animation: fadein 0.3s, fadeout 0.5s 1.5s; z-index: 9999;
}
@keyframes fadein { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeout { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(10px); } }

.table { border-collapse: collapse; border: 2px solid black; }
th, td,tr { padding: 8px; border: 1px solid #000000; }
.sdp-table thead th { background: linear-gradient(#02303065,#557497,#0c5e699a); color: white; text-align: center; }
.styleN { display: flex; justify-content: center; align-items: center; border: 3px solid black; width: 100%; height: 100%; }

</style>

