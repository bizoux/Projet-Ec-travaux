<template>
    <div class="UptadeMdp-container bg-light p-5 rounded-4 shadow">
      <h2 class="text-success">Nouveau mot de passe</h2>
      <input v-model="newPassword" type="password" placeholder="Nouveau mot de passe" class="form-control"/>
      <button @click="updatePassword" class="btn btn-primary">Changer le mot de passe</button>
  
      <p v-if="message" style="color: green;">{{ message }}</p>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabaseClient'
  
  export default {
    data() {
      return {
        newPassword: '',
        message: '',
        error: ''
      }
    },
    async mounted() {
    // Supabase récupère automatiquement les tokens depuis l’URL
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      // Nettoyer l’URL : supprime les fragments #access_token etc.
      window.history.replaceState({}, document.title, this.$route.path)

    } else {
      console.error('Session invalide')
    }
  },
    methods: {
      async updatePassword() {
        const { data, error } = await supabase.auth.updateUser({
          password: this.newPassword
        })
  
        if (error) {
          this.error = error.message
          this.message = ''
        } else {
          this.message = 'Mot de passe mis à jour avec succès.'
          this.error = ''
          this.$router.push('/SeConnecter')
        }
      }
    }
  }
  </script>
  
  <style scoped>

 .UptadeMdp-container {
  max-width: 400px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
  
  </style>
  