<template>
  <v-app>
    <v-main>  
  <v-container class="fill-height d-flex justify-center align-center">
    
    <v-card class="pa-10" width="500" elevation="12" rounded="xl">
  <!-- Onglets -->
  <v-tabs v-model="tab" background-color="primary" dark grow>
    <v-tab value="login">Connexion</v-tab>
    <v-tab value="signup">Inscription</v-tab>
  </v-tabs>

  <v-card-text>
    <v-window v-model="tab">
      <!-- Connexion -->
      <v-window-item value="login">
        <v-card-title class="text-h6 text-center mb-4">
          <v-icon start class="mr-2" color="primary">mdi-login</v-icon> Connexion à votre compte
        </v-card-title>
        <v-form @submit.prevent="loginUser">
          <v-text-field
            v-model="email"
            color="primary"
            label="Email"
            prepend-inner-icon="mdi-email-outline"
            type="email"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="password"
            color="primary"
            label="Mot de passe"
            prepend-inner-icon="mdi-lock-outline"
            type="password"
            variant="outlined"
            required
          />
          <v-btn
            type="submit"
            block
            color="primary"
            class="mt-4 mb-3"
            :loading="loading"
          >
            Connexion
          </v-btn>

<div class="text-center">
  <v-btn variant="text" color="primary" to="/MdpOublier">
    Mot de passe oublié ?
  </v-btn>
</div>

        </v-form>
      </v-window-item>

      <!-- Inscription -->
      <v-window-item value="signup">
        <v-card-title class="text-h6 text-center mb-4">
           <v-icon start class="mr-2" color='success'>mdi-account-plus</v-icon> Créer un nouveau compte
        </v-card-title>
        <v-form @submit.prevent="registerUser">
          <v-text-field
            v-model="email"
            label="Email"
            prepend-inner-icon="mdi-email-outline"
            color="success"
            type="email"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="password"
            color="success"
            :type="showPassword ? 'text' : 'password'"
            label="Mot de passe"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="confirmPassword"
            color="success"
            label="Confirmer mot de passe"
            :type="showConfirmPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
            variant="outlined"
            required
          />
          
          <v-btn
            type="submit"
            block
            color="success"
            class="mt-4 mb-3"
            :loading="loading"
          >
            Inscription
          </v-btn>
          <!-- dans Inscription -->
<div class="text-center">
  <v-btn variant="text" color="success" to="/">
    Déjà un compte ? Connectez-vous
  </v-btn>
</div>  
        </v-form>
      </v-window-item>
    </v-window>
  </v-card-text>

  <v-alert v-if="errorMessage" type="error" dense>{{ errorMessage }}</v-alert>
  <v-alert v-if="successMessage" type="success" dense>{{ successMessage }}</v-alert>
</v-card>


  </v-container>
</v-main>
</v-app>
</template>

<script setup>
import { ref } from "vue"
import { supabase } from "@/supabaseClient"

const tab = ref("login")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const loading = ref(false)
const errorMessage = ref("")
const successMessage = ref("")
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Connexion
async function loginUser() {
  loading.value = true
  errorMessage.value = ""
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  loading.value = false
  if (error) {
    errorMessage.value = error.message
  } else {
    successMessage.value = "Connexion réussie 🎉"
  }
}

// Inscription
async function registerUser() {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Les mots de passe ne correspondent pas"
    return
  }
  loading.value = true
  errorMessage.value = ""
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      emailRedirectTo: "http://localhost:5173/",
    },
  })
  loading.value = false
  if (error) {
    errorMessage.value = error.message
  } else {
    successMessage.value = "Compte créé 🎉 Vérifiez vos emails"
  }
}
</script>
