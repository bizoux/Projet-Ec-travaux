<template>
  <div>
    <multiselect
      v-model="selectedDesignation"
      :options="designationList"
      placeholder="Sélectionner désignation"
      :searchable="true"
      :close-on-select="true"
      label="Designation"
      track-by="CodeDes"
      @select="onSelect"
    >
      <template #noResult>
        <div style="padding: 5px; color: red;">Aucun résultat trouvé.</div>
        <hr>
        <button type="button" @click="ajouterNouvelleDesignation">Créer cette désignation</button>
      </template>
    </multiselect>

    <div v-if="numeroBde" class="mt-2">
      <strong>Numéro correspondant :</strong> {{ numeroBde }}
    </div>
  </div>
</template>

<script>
import multiselect from 'vue-multiselect';
export default {
  name: 'Sdp',
  components: { multiselect },
  props: {
    designationList: {
      type: Array,
      required: true
    },
    bdeAvecTravaux: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedDesignation: null,
      numeroBde: null
    };
  },
  methods: {
    onSelect(designation) {
      this.numeroBde = this.getNumeroBde(designation);
    },
    getNumeroBde(designation) {
      // Parcourt toutes les catégories et designations
      for (let i = 0; i < this.bdeAvecTravaux.length; i++) {
        const bde = this.bdeAvecTravaux[i];
        const indexDes = bde.designations.findIndex(d => d.CodeDes === designation.CodeDes);
        if (indexDes !== -1) {
          return `${i}-${indexDes}`; // Ex: 0-1
        }
      }
      return null;
    },
    ajouterNouvelleDesignation() {
      // Logique pour ouvrir modal ou ajouter nouvelle désignation
      this.$emit('nouvelle-designation');
    }
  }
};
</script>
