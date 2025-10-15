<template>
    <div class="p-4">
      <!-- <h2>Importer un fichier Excel</h2> -->
    <!-- <input type="file" @change="importerExcel" /> -->
        <center><h2 style="border: 1px solid black;">Designation</h2></center>
  
      <form @submit.prevent="ajouterDesignation()">

        <input v-model="designation" placeholder="Designation" required />
        <input v-model="description" placeholder="Description" required />
        <button type="submit">Ajouter'</button>
        
      </form>

      
    </div>

</template>

<script>
 
import db from '@/db';

export default {
  name: 'Designation',
  data() {
    return {

      codeDes : '',
      designation : '',
      description : ''
      
    };
  },
  methods: {

    // AJOUTER DESIGNATION

 async ajouterDesignation() {

    await db.designation.add({

      Designation: this.designation,
      Description: this.description

    });

  }


  },

};
</script>
