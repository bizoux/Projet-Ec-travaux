<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-6" max-width="400" elevation="10" rounded="xl">
      <v-tabs v-model="tab" background-color="primary" dark grow>
        <v-tab value="login">Connexion</v-tab>
        <v-tab value="signup">Inscription</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <!-- Connexion -->
          <v-window-item value="login">
            <v-form @submit.prevent="loginUser">
              <v-text-field
                v-model="email"
                label="Email"
                prepend-icon="mdi-email-outline"
                type="email"
                required
              />
              <v-text-field
                v-model="password"
                label="Mot de passe"
                prepend-icon="mdi-lock-outline"
                type="password"
                required
              />
              <v-btn
                type="submit"
                block
                color="primary"
                class="mt-4"
                :loading="loading"
              >
                Connexion
              </v-btn>
            </v-form>
          </v-window-item>

          <!-- Inscription -->
          <v-window-item value="signup">
            <v-form @submit.prevent="registerUser">
              <v-text-field
                v-model="email"
                label="Email"
                prepend-icon="mdi-email-outline"
                type="email"
                required
              />
              <v-text-field
                v-model="password"
                label="Mot de passe"
                prepend-icon="mdi-lock-outline"
                type="password"
                required
              />
              <v-text-field
                v-model="confirmPassword"
                label="Confirmer mot de passe"
                prepend-icon="mdi-lock-check-outline"
                type="password"
                required
              />
              <v-btn
                type="submit"
                block
                color="success"
                class="mt-4"
                :loading="loading"
              >
                Inscription
              </v-btn>
            </v-form>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-alert v-if="errorMessage" type="error" dense>{{ errorMessage }}</v-alert>
      <v-alert v-if="successMessage" type="success" dense>{{ successMessage }}</v-alert>
    </v-card>
  </v-container>
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
