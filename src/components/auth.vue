<script setup>
import { ref } from "vue"
import { supabase } from "@/supabaseClient"
import Dexie from "dexie"

// 📌 IndexedDB (Dexie) pour stocker utilisateurs localement
const db = new Dexie("authDB")
db.version(1).stores({
  users: "email,password" // email = clé primaire
})

const tab = ref("login")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const loading = ref(false)
const errorMessage = ref("")
const successMessage = ref("")
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 🔑 Connexion
async function loginUser() {
  loading.value = true
  errorMessage.value = ""

  if (navigator.onLine) {
    // Connexion normale avec Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    loading.value = false
    if (error) {
      errorMessage.value = error.message
    } else {
      successMessage.value = "Connexion réussie 🎉"
      // on sauvegarde dans IndexedDB
      await db.users.put({ email: email.value, password: password.value })
    }
  } else {
    // Mode hors ligne : on vérifie IndexedDB
    const user = await db.users.get(email.value)
    loading.value = false
    if (user && user.password === password.value) {
      successMessage.value = "Connexion hors ligne réussie ✅"
    } else {
      errorMessage.value = "Utilisateur introuvable hors ligne ❌"
    }
  }
}

// 🆕 Inscription
async function registerUser() {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Les mots de passe ne correspondent pas"
    return
  }

  loading.value = true
  errorMessage.value = ""

  if (navigator.onLine) {
    // Inscription Supabase
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
      // Sauvegarde locale pour connexion hors ligne
      await db.users.put({ email: email.value, password: password.value })
    }
  } else {
    // Mode hors ligne : on garde en attente
    await db.users.put({ email: email.value, password: password.value })
    loading.value = false
    successMessage.value =
      "Compte créé en local 📴. Synchronisation dès retour en ligne."
  }
}

// 📡 Synchronisation (quand Internet revient)
window.addEventListener("online", async () => {
  const unsyncedUsers = await db.users.toArray()
  for (const user of unsyncedUsers) {
    const { error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    })
    if (!error) {
      console.log("Utilisateur synchronisé :", user.email)
    }
  }
})
</script>
