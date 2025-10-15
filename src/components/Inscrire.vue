<template>
  <div class="register-container bg-light p-5 rounded-4 shadow">
    <center><h2 class="text-success">Inscription</h2></center>
    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
    <p v-if="successMessage" class="text-success">{{ successMessage }}</p>

    <input v-model="email" type="email" placeholder="Email" class="form-control" autocomplete="email"/>
    <input v-model="password" type="password" placeholder="Mot de passe" class="form-control" autocomplete="new-password"/>
    <input v-model="confirmPassword" type="password" placeholder="Confirmer le mot de passe" class="form-control"/>

    <button @click="register" class="btn btn-primary" :disabled="loading">
      {{ loading ? 'Inscription...' : 'S’inscrire' }}
    </button>

    <center><router-link to="/SeConnecter">Déjà un compte ? Connectez-vous</router-link></center>
  </div>
</template>

<script>
import { supabase } from '@/supabaseClient'

export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      successMessage: '',
      loading: false
    }
  },

  methods: {
    async register() {
      if (!this.email || !this.password || !this.confirmPassword) {
        this.errorMessage = "Veuillez remplir tous les champs";
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Les mots de passe ne correspondent pas";
        return;
      }

      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { data, error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
        options:{
          emailRedirectTo: 'http://localhost:5173/nouveau-mot-de-passe'
        }
        
      });

      this.loading = false;

      if (error) {
        this.errorMessage = error.message;
      } else {
        this.successMessage = "Compte créé ! Vérifiez votre email pour confirmer.";
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
