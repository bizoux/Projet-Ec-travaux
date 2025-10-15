<template>
    <div class="p-4">
      
        <center><h2 style="border: 1px solid black;">Création Projet</h2></center>

  
      <!-- État de connexion -->
      <p :style="{ color: estEnLigne ? 'green' : 'red' }">
        {{ estEnLigne ? '🟢 En ligne' : '🔴 Hors ligne' }}
      </p>
  
      <form @submit.prevent="ajouterDevis()">
        <input v-model="CodeProjet" placeholder="CodeProjet" required/>
        <input v-model="NomProjet" placeholder="NomProjet" required/>
        <input v-model="Type" placeholder="Type" required/>

        <button type="submit">Ajouter</button>
      </form>
  
      
    </div>

</template>

<script>
 

import db from '@/db';

export default {
  name: 'Materiel',
  data() {
    return {
      CodeProjet:'',
      NomProjet:'',
      Type:'',
      estEnLigne: navigator.onLine,
      modeEdition: false,
      
    };
  },
  methods: {
 
    // AJOUTER PROJET
 
    async ajouterDevis() {

  const Code = parseInt(this.CodeProjet);
    // Ajouter le matériel
    await db.Devis.add({
      idDevis: Code,
      nomProjet: this.NomProjet,
      type: this.Type,

    });

  },



    async chargerDevis() {
      this.ListeDevis = await db.Devis.toArray();
    },
    async synchroniser() {
      await syncToSupabase();
      await syncFromSupabase();
      await this.chargerDevis();
    },


  }
  // async mounted() {
  //   setInterval(() => {
  //   if (navigator.onLine) {
  //     this.synchroniser();
  //   }
  // }, 60000); 
  //   await this.chargerDevis();

  //   Sync immédiat au démarrage si en ligne
  //   if (navigator.onLine) {
  //     await this.synchroniser();
  //   }

  //   window.addEventListener('offline', () => this.mettreAJourEtatConnexion());
  //   Auto-sync dès qu’on redevient connecté
  //   window.addEventListener('online', async () => {
  //     console.log('Connexion retrouvée. Synchronisation automatique...');
  //     this.mettreAJourEtatConnexion();
  //     await this.synchroniser();
  //   });
  // }
};
</script>
