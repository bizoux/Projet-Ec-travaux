<script>
import Dexie from "dexie"
import { supabase } from "@/supabaseClient"

const db = new Dexie("authDB")
db.version(1).stores({
  users: "email,password" // email = clé primaire
})

export default {
  data() {
    return {
      tab: "login",
      email: "",
      password: "",
      confirmPassword: "",
      loading: false,
      errorMessage: "",
      successMessage: "",
      showPassword: false,
      showConfirmPassword: false
    }
  },

  methods: {
    // 🔑 Connexion
    async loginUser() {
      this.loading = true
      this.errorMessage = ""

      if (navigator.onLine) {
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email: this.email,
            password: this.password
          })
          this.loading = false
          if (error) {
            this.errorMessage = error.message
          } else {
            this.successMessage = "Connexion réussie 🎉"
            // Sauvegarde locale
            await db.users.put({ email: this.email, password: this.password })
          }
        } catch (err) {
          this.errorMessage = err.message
          this.loading = false
        }
      } else {
        // Mode hors ligne : vérif IndexedDB
        const user = await db.users.get(this.email)
        this.loading = false
        if (user && user.password === this.password) {
          this.successMessage = "Connexion hors ligne réussie ✅"
        } else {
          this.errorMessage = "Utilisateur introuvable hors ligne ❌"
        }
      }
    },

    // 🆕 Inscription
    async registerUser() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Les mots de passe ne correspondent pas"
        return
      }

      this.loading = true
      this.errorMessage = ""

      if (navigator.onLine) {
        try {
          const { error } = await supabase.auth.signUp({
            email: this.email,
            password: this.password,
            options: {
              emailRedirectTo: "http://localhost:8080/"
            }
          })
          this.loading = false
          if (error) {
            this.errorMessage = error.message
          } else {
            this.successMessage = "Compte créé 🎉 Vérifiez vos emails"
            // Sauvegarde locale
            await db.users.put({ email: this.email, password: this.password })
          }
        } catch (err) {
          this.errorMessage = err.message
          this.loading = false
        }
      } else {
        // Hors ligne : stocke en attente
        await db.users.put({ email: this.email, password: this.password })
        this.loading = false
        this.successMessage =
          "Compte créé en local 📴. Synchronisation dès retour en ligne."
      }
    }
  },

  mounted() {
    // 📡 Synchronisation quand Internet revient
    window.addEventListener("online", async () => {
      const unsyncedUsers = await db.users.toArray()
      for (const user of unsyncedUsers) {
        const { error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password
        })
        if (!error) {
          console.log("Utilisateur synchronisé :", user.email)
        }
      }
    })
  }
}
</script>
