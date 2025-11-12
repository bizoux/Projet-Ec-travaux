<script setup>
import { ref } from 'vue'
import { supabase } from "@/supabaseClient";

const email = ref('')
const password = ref('')
const userData = ref(null)
const errorMsg = ref('')

const signUp = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMsg.value = error.message
  } else if (data.user) {
    // Insérer le profil après inscription
    await supabase.from('profiles').insert([
      { id: data.user.id, email: data.user.email, role: 'user' }
    ])
  }
}



const signIn = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMsg.value = error.message
  } else if (data.session) {
    // Maintenant on récupère correctement l'utilisateur
    userData.value = data.session.user
    fetchProfiles() // récupérer les profils après connexion
  }
}


// Déconnexion
const signOut = async () => {
  await supabase.auth.signOut()
  userData.value = null
}

// Récupérer les profils (test RLS)
const profiles = ref([])
const fetchProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
  if (error) errorMsg.value = error.message
  else profiles.value = data
}
</script>

<template>
  <input v-model="email" placeholder="Email" />
  <input v-model="password" type="password" placeholder="Password" /><br>
  <button @click="signUp">Sign Up</button><br>
  <button @click="signIn">Sign In</button><br>
  <button @click="signOut">Sign Out</button>

  <div v-if="profiles.length">
    <h2>Profils visibles</h2>
    <ul>
      <li v-for="p in profiles" :key="p.id">{{ p.email }} - {{ p.role }}</li>
    </ul>
  </div>
</template>
