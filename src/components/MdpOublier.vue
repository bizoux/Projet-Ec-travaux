<template>



<v-container-fluid class="fill-height d-flex justify-center align-center fondMdp">
    
    <v-card class="pa-10" width="500" elevation="12" rounded="xl">
  <!-- Onglets -->

    

<h2 class="text-center mb-5"><v-icon>mdi-lock-reset</v-icon> Réinitialiser le mot de passe </h2>
<v-form @submit.prevent="sendResetEmail">

        <v-text-field v-model="email" color="primary" label="Email" prepend-inner-icon="mdi-email-outline" type="email" variant="outlined" required/>
      
      <p v-if="message" style="color: green;">{{ message }}</p>
      <p v-if="error" style="color: red;">{{ error }}</p>

<v-btn type="submit" block color="primary" class="mt-3" :loading="loading">Envoyer le lien de réinitialisation</v-btn>


</v-form>
<v-btn to="/" block color="primary" class="mt-3" :loading="loading">RETOUR</v-btn>
     
</v-card>


  </v-container-fluid>



  </template>
  
  <script>
  import { supabase } from '@/supabaseClient'
  
  export default {
    data() {
      return {
        email: '',
        message: '',
        error: ''
      }
    },
    methods: {
      async sendResetEmail() {
        const { error } = await supabase.auth.resetPasswordForEmail(this.email, {
          redirectTo: 'http://localhost:5173/nouveau-mot-de-passe'
        })
  
        if (error) {
          this.error = error.message
          this.message = ''
        } else {
          this.message = 'Email de réinitialisation envoyé.'
          this.error = ''
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .fondMdp{
  width: 100%;
  height: 100vh;
  background: url("../image/fondformulaire2.jpg");
  background-size: cover;
}
  
  .reset-container {
    max-width: 400px;
    margin: auto;
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  </style>
  