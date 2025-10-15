<template>
    <div class="p-4">
      
        <center><h2 style="border: 1px solid black;">Travaux</h2></center>

  
      <form @submit.prevent="ajouterTravaux()">
        <!-- <input v-model="CodeTrav" placeholder="CodeTrav" required/> -->
        <input v-model="travaux" placeholder="travaux" required/>
        <button type="submit">Ajouter</button>
      </form>
  
      
    </div>

</template>

<script>
 

import db from '@/db';

export default {
  name: 'Travaux',
  data() {
    return {

      // CodeTrav: '',
      travaux: '',
      
    };
  },
  methods: {

 // AJOUTER TRAVAUX 

 async ajouterTravaux() {
    // Ajouter le matériel
    await db.Travaux.add({
      travaux: this.travaux
    });

  },



  
  },

};
</script>
