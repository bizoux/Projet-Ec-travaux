<template>
  <div class="container my-4">
    <!-- Toast notification -->
    <div v-if="toastMessage" class="toast-notification">
      {{ toastMessage }}
    </div>

    <!-- Sélection projet -->
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

    <!-- Formulaire BDE -->
    <form @submit.prevent="ajouterBdeNouveau()">
      <div class="bloc-modale" v-if="afficherFormulaireBde">
        <div class="overlay" @click="AffichageFormulaireBde()"></div>
        <div class="modale card">
          <div class="btn-modale btn btn-danger" @click="AffichageFormulaireBde()">X</div>
          <center><h1 class="styleTexte">Ajouter BDE</h1></center>

          <!-- Projet -->
          <div class="mb-3">
            <label class="form-label">Projet <b style="color:red">*</b></label>
            <select v-model="selectedProjetId" class="form-select" required>
              <option disabled value="">-- Choisir Projet --</option>
              <option v-for="proj in ProjetList" :key="proj.idDevis" :value="proj.idDevis">
                {{ proj.nomProjet }}
              </option>
            </select>
          </div>

          <!-- Travaux -->
          <div class="mb-3">
            <label class="form-label">Travaux <b style="color:red">*</b></label>
            <select v-model="selectedTraveauId" class="form-select" required>
              <option disabled value="">-- Choisir travaux --</option>
              <option v-for="trav in TravauxList" :key="trav.CodeTrav" :value="trav.CodeTrav">
                {{ trav.travaux }}
              </option>
            </select>
          </div>

          <!-- Désignation -->
          <div class="mb-3">
            <label class="form-label">Désignation <b style="color:red">*</b></label>
            <select v-model="selectedDesignationId" class="form-select" required>
              <option disabled value="">-- Choisir designation --</option>
              <option v-for="des in DesignationList" :key="des.CodeDes" :value="des.CodeDes">
                {{ des.Designation }}
              </option>
            </select>
          </div>

          <!-- Unité & Quantité -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Unité <b style="color:red">*</b></label>
              <input v-model="Unite" type="text" class="form-control" placeholder="Unité" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Quantité <b style="color:red">*</b></label>
              <input v-model="Quantite" type="number" class="form-control" placeholder="Quantité" required />
            </div>
          </div>

          <button type="submit" class="btn btn-primary">Ajouter</button>
        </div>
      </div>
    </form>

    <!-- Tableau BDE -->
    <table class="table table-striped table-bordered" v-if="bdeAvecTravaux.length">
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
        <template v-for="(bde, numRomain) in bdeAvecTravaux" :key="bde.idTravaux">
          <tr class="table-primary">
            <td></td>
            <td><strong>{{ toRoman(numRomain + 1) }} - {{ bde.nomTravaux }}</strong></td>
            <td></td><td></td><td></td><td></td>
          </tr>

          <tr v-for="(des, numeroDes) in bde.designations" :key="des.CodeDes">
            <td>{{ numRomain + 0 }}-{{ numeroDes + 1 }}</td>
            <td>{{ des.nomDesignation }}<br><small class="text-muted">concerne : {{ des.nomDescription }}</small></td>
            <td>{{ des.Unite }}</td>
            <td>{{ formatQte(des.Quantite) }}</td>
            <td>{{ formatPrice(des.Pu) }}</td>
            <td>{{ formatQte(des.Quantite * des.Pu) }}</td>
          </tr>

          <!-- Multiselect ajout BDE -->
          <tr>
            <td colspan="6">
              <multiselect
                v-model="selectedDesignationParTravaux[bde.idTravaux]"
                :options="DesignationList"
                placeholder="Sélectionner désignation"
                :searchable="true"
                :close-on-select="true"
                label="Designation"
                track-by="CodeDes"
              ></multiselect>
              <button class="btn btn-sm btn-primary mt-2" @click="ajouterBde(numRomain, bde.nomTravaux)">
                Ajouter désignation
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
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
      ProjetList: [],
      TravauxList: [],
      DesignationList: [],
      bdeAvecTravaux: [],
      selectedDevisId: '',
      selectedProjetId: '',
      selectedTraveauId: '',
      selectedDesignationId: '',
      Unite: '',
      Quantite: '',
      toastMessage: '',
      selectedDesignationParTravaux: {},
      afficherFormulaireBde: false,
    };
  },
  async mounted() {
    await this.ListeProjets();
    await this.ListeTravaux();
    await this.ListeDesignation();
  },
  methods: {
    async ListeProjets() {
      this.ProjetList = await db.Devis.toArray();
    },
    async ListeTravaux() {
      this.TravauxList = await db.Travaux.toArray();
    },
    async ListeDesignation() {
      this.DesignationList = await db.designation.toArray();
    },
    async filtrerBdeParDevis() {
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
          Montant: bde.Montant
        });
      }

      this.bdeAvecTravaux = resultat;

      // Initialiser selectedDesignationParTravaux
      this.selectedDesignationParTravaux = {};
      this.bdeAvecTravaux.forEach(bde => (this.selectedDesignationParTravaux[bde.idTravaux] = null));
    },
    AffichageFormulaireBde() {
      this.afficherFormulaireBde = !this.afficherFormulaireBde;
    },
    toRoman(num) {
      const roman = ["", "O", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
      return roman[num] || num;
    },
    formatQte(val) {
      if (val === null || val === undefined || isNaN(val)) return '0,00';
      return Number(val).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    formatPrice(val) {
      if (!val) val = 0;
      return Number(val).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    async ajouterBdeNouveau() {
      if (!this.selectedProjetId || !this.selectedTraveauId || !this.selectedDesignationId) {
        alert("Veuillez remplir tous les champs !");
        return;
      }

      const travail = await db.Travaux.get(this.selectedTraveauId);
      const designation = await db.designation.get(this.selectedDesignationId);

      if (!travail || !designation) {
        alert("Travaux ou désignation introuvable !");
        return;
      }

      const existe = await db.bde
        .where({ idDevis: this.selectedProjetId, CodeTrav: this.selectedTraveauId, CodeDes: this.selectedDesignationId })
        .first();

      if (existe) {
        alert("Cette BDE existe déjà !");
        return;
      }

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

      await this.filtrerBdeParDevis();
      this.afficherFormulaireBde = false;
      this.toastMessage = "Ajout BDE avec succès !";
      setTimeout(() => (this.toastMessage = ''), 2000);
    },
    async ajouterBde(indexTravaux, nomTravaux) {
      const travail = this.TravauxList.find(t => t.travaux === nomTravaux);
      const designation = this.selectedDesignationParTravaux[travail.CodeTrav];

      if (!designation || !designation.CodeDes) {
        alert("Veuillez sélectionner une désignation !");
        return;
      }

      const existe = await db.bde
        .where({ CodeTrav: travail.CodeTrav, CodeDes: designation.CodeDes })
        .first();

      if (existe) {
        alert("Cette BDE existe déjà pour ce travail !");
        return;
      }

      const numRomain = this.bdeAvecTravaux.findIndex(b => b.idTravaux === travail.CodeTrav);
      const numeroDes = (await db.bde.where({ CodeTrav: travail.CodeTrav }).count()) + 1;
      const codeBde = `${numRomain}-${numeroDes}`;

      await db.bde.add({
        idDevis: this.selectedDevisId,
        CodeTrav: travail.CodeTrav,
        CodeDes: designation.CodeDes,
        Unite: this.Unite,
        Quantite: Number(this.Quantite),
        Pu: 0,
        Montant: 0,
        codeBde
      });

      this.selectedDesignationParTravaux[travail.CodeTrav] = null;
      await this.filtrerBdeParDevis();
      this.toastMessage = "Ajout BDE avec succès !";
      setTimeout(() => (this.toastMessage = ''), 2000);
    }
  }
};
</script>

<style scoped>
/* Styles minimal pour modale et toast */
.bloc-modale { position: fixed; top:0; left:0; right:0; bottom:0; display:flex; justify-content:center; align-items:center; z-index:9999; }
.overlay { background: rgba(0,0,0,0.3); position:fixed; top:0; bottom:0; left:0; right:0; z-index:9998; }
.modale { background:white; padding:30px; z-index:10000; position:relative; }
.btn-modale { position:absolute; top:10px; right:10px; }
.toast-notification { position:fixed; top:20px; right:20px; background:#4caf50; color:white; padding:12px 24px; border-radius:8px; z-index:9999; }
</style>
