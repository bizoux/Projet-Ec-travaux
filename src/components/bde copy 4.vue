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
            <select v-model="nouveauTravauxId" class="form-select form-select-sm mb-1">
              <option disabled value="">-- Choisir Travaux --</option>
              <option v-for="trav in TravauxList" :key="trav.CodeTrav" :value="trav.CodeTrav">
                {{ trav.travaux }}
              </option>
            </select>
            <select v-model="nouvelleDesignationId" class="form-select form-select-sm">
              <option disabled value="">-- Choisir Désignation --</option>
              <option v-for="des in DesignationList" :key="des.CodeDes" :value="des.CodeDes">
                {{ des.Designation }}
              </option>
            </select>
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
            <td><strong>{{ toRoman(numRomain + 1) }} - {{ bde.nomTravaux }}</strong></td>
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
  </div>
</template>

<script>
import db from '@/db';

export default {
  data() {
    return {
      idProjet:this.$route.query.idProj,
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
    async ListeTravaux() { this.TravauxList = await db.Travaux.toArray(); },
    async ListeDesignation() { this.DesignationList = await db.designation.toArray(); },

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

      const existe = await db.bde.where({
        CodeTrav: this.nouveauTravauxId,
        CodeDes: this.nouvelleDesignationId
      }).first();
      if (existe) { alert("Cette BDE existe déjà !"); return; }

      const numeroDes = (await db.bde.where({ CodeTrav: this.nouveauTravauxId }).count()) + 1;
      const codeBde = `${this.nouveauTravauxId}-${numeroDes}`;

      await db.bde.add({
        Num: codeBde,
        idProj:Number(this.idProjet),
        CodeTrav: this.nouveauTravauxId,
        CodeDes: this.nouvelleDesignationId,
        Unite: this.nouvelleUnite,
        Quantite: Number(this.nouvelleQuantite),
        Pu: 0,
        Montant: 0
      });

      // Reset
      this.nouveauTravauxId = '';
      this.nouvelleDesignationId = '';
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
</style>
