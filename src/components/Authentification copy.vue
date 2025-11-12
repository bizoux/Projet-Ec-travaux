<template>
  <h2>Authentification</h2>
  <div>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" /><br>
    <button @click="signUp">Sign Up</button><br>
    <button @click="signIn">Sign In</button><br>
    <button @click="signOut" v-if="userData">Sign Out</button>
  </div>

  <p v-if="errorMsg" style="color:red">{{ errorMsg }}</p>

  <div v-if="userData">
    <h3>Bienvenue : {{ userData.email }}</h3>

    <!-- Affichage des profils visibles -->
    <div v-if="profiles.length">
      <h4>Profils visibles</h4>
      <ul>
        <li v-for="p in profiles" :key="p.id">
          {{ p.email }} - {{ p.role }} - {{ p.is_active ? 'Actif' : 'Inactif' }}
        </li>
      </ul>
    </div>

    <!-- Section admin : validation des utilisateurs -->
    <div v-if="userData && pendingUsers.length >= 0">
      <h4>Utilisateurs en attente de validation (Admin)</h4>
      <ul>
        <li v-for="p in pendingUsers" :key="p.id">
          {{ p.email }} - {{ p.role }} - {{ p.is_active ? 'Actif' : 'Inactif' }}
          <button @click="activateUser(p.id)">Valider</button>
        </li>
      </ul>
      <p v-if="!pendingUsers.length">Aucun utilisateur en attente</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient'

// --- Variables ---
const email = ref('')
const password = ref('')
const userData = ref(null)
const errorMsg = ref('')
const profiles = ref([])
const pendingUsers = ref([])

// --- Sign Up ---
const signUp = async () => {
  errorMsg.value = ''
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMsg.value = error.message
  } else if (data.user) {
    const { error: insertError } = await supabase.from('profiles').insert([
      { id: data.user.id, email: data.user.email, role: 'user', is_active: false }
    ])
    if (insertError) {
      errorMsg.value = insertError.message
    } else {
      alert('Votre compte doit être validé par un admin avant de pouvoir se connecter.')
      email.value = ''
      password.value = ''
    }
  }
}

// --- Sign In ---
const signIn = async () => {
  errorMsg.value = ''
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMsg.value = error.message
    return
  }

  if (data.session) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .single()

    if (profileError) {
      errorMsg.value = profileError.message
      return
    }

    console.log('Profil connecté:', profile) // <-- LOG du profil

    if (!profile.is_active) {
      alert('Votre compte n’a pas encore été validé par un admin.')
      await supabase.auth.signOut()
      return
    }

    userData.value = data.session.user

    if (profile.role === 'admin') {
      await fetchPendingUsers()
    }

    await fetchProfiles()
  }
}

// --- Sign Out ---
const signOut = async () => {
  await supabase.auth.signOut()
  userData.value = null
  profiles.value = []
  pendingUsers.value = []
}

// --- Récupérer tous les profils visibles ---
const fetchProfiles = async () => {
  const { data, error } = await supabase.from('profiles').select('*')
  if (error) {
    errorMsg.value = error.message
  } else {
    profiles.value = data
  }
}

// --- Récupérer les utilisateurs en attente ---
const fetchPendingUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_active', false)
  
  if (error) {
    errorMsg.value = error.message
  } else {
    pendingUsers.value = data
    console.log('Utilisateurs en attente:', pendingUsers.value) // <-- LOG
  }
}

// --- Activer un utilisateur (admin) ---
const activateUser = async (id) => {
  const { error } = await supabase
    .from('profiles')
    .update({ is_active: true })
    .eq('id', id)

  if (error) {
    errorMsg.value = error.message
  } else {
    pendingUsers.value = pendingUsers.value.filter(u => u.id !== id)
    profiles.value = profiles.value.map(u => u.id === id ? { ...u, is_active: true } : u)
  }
}

// --- Auto check si utilisateur connecté (refresh page) ---
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    console.log('Profil connecté (onMounted):', profile) // <-- LOG

    userData.value = session.user

    if (profile.role === 'admin') {
      await fetchPendingUsers()
    }

    await fetchProfiles()
  }
})
</script>
