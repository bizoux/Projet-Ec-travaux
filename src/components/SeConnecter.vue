<template>
    <div class="login-container bg-light p-5 rounded-4 shadow">
      <center><h2 class="text-success">Connexion</h2></center>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
      <input v-model="email" type="email" placeholder="Email" class="form-control"/>
      <input v-model="password" type="password" placeholder="Mot de passe" class="form-control"/>
  
      <button @click="login" class="btn btn-primary" :disabled="loading">{{ loading ? 'Connexion...' : 'Se connecter' }}</button>
      <center><router-link to="/MdpOublier">Mot de passe oublié</router-link></center>
      
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabaseClient'
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        errorMessage: '',
        loading: false
      }
    },
    methods: {
      async login() {
        this.loading = true;
        const { data, error } = await supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password
        })
        
        this.loading = false;


        if (error) {
          this.errorMessage = error.message
        } else {
          this.errorMessage = ''
          this.$router.push('/NouveauProjet/Materiel')
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 100px auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  </style>
  