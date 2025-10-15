import { defineStore } from 'pinia';

export const useDesignationStore = defineStore('designation', {
  state: () => ({
    toutesLesDesignations: [],   // toutes les désignations du BDE avec numeroDetail
    designationSelectionnee: null // celle choisie dans SDP
  }),
  actions: {
    setToutesLesDesignations(list) {
      this.toutesLesDesignations = list;
    },
    setDesignationSelectionnee(designation) {
      this.designationSelectionnee = designation;
    }
  }
});
