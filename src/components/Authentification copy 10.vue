<template>
  <v-container-fluid class="fill-height d-flex justify-center align-center fond">
    
    <v-card class="pa-7" width="500" elevation="12" rounded="xl">
      <center><img src="../image/logoDGI.png" alt="" width="60px"></center>
      <!-- Onglets -->
      <v-tabs v-model="tab" background-color="primary" dark grow>
        <v-tab value="login">Connexion</v-tab>
        <v-tab value="signup">Inscription</v-tab>
      </v-tabs>

      <v-card-text>

        

             <!-- Statut de connexion -->
      <v-alert
        :type="isOnline ? 'success' : 'warning'"
        density="compact"
        class="mb-3"
        border="start"
        elevation="2"
      >
        <v-icon start>{{ isOnline ? 'mdi-wifi' : 'mdi-wifi-off' }}</v-icon>
        {{ isOnline ? 'Vous êtes en ligne' : 'Vous êtes hors ligne' }}
      </v-alert>
        <v-window v-model="tab">
          <!-- Connexion -->
          <v-window-item value="login">
            <v-card-title class="text-h6 text-center mb-4 text-primary">
              <v-icon start class="mr-2" color="primary">mdi-login</v-icon>
              Connexion à votre compte
            </v-card-title>

            <v-form @submit.prevent="loginUser">
              <v-alert v-if="loginError" type="error" dense class="mb-2">{{ loginError }}</v-alert>
              <v-alert v-if="loginSuccess" type="success" dense class="mb-2">{{ loginSuccess }}</v-alert>

              <v-text-field
                v-model="emailLogin"
                color="primary"
                label="Email"
                prepend-inner-icon="mdi-email-outline"
                type="email"
                variant="outlined"
                :rules="[v => !!v || 'Email requis']"
                required
              />
              <v-text-field
                v-model="passwordLogin"
                color="primary"
                label="Mot de passe"
                prepend-inner-icon="mdi-lock-outline"
                type="password"
                variant="outlined"
                :rules="[v => !!v || 'Mot de passe requis']"
                required
              />

              <v-btn type="submit" block color="primary" class="mt-4 mb-3" :disabled="loginLoading">
                <v-progress-circular
                  v-if="loginLoading"
                  indeterminate
                  color="white"
                  size="20"
                  width="2"
                  class="mr-2"
                />
                {{ loginLoading ? 'Connexion...' : 'Connexion' }}
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
            <v-card-title class="text-h6 text-center mb-4 text-success">
              <v-icon start class="mr-2" color="success">mdi-account-plus</v-icon>
              Créer un nouveau compte
            </v-card-title>

            <v-form @submit.prevent="registerUser">
              <v-alert v-if="registerError" type="error" dense class="mb-2">{{ registerError }}</v-alert>
              <v-alert v-if="registerSuccess" type="success" dense class="mb-2">{{ registerSuccess }}</v-alert>


              <v-text-field
  v-model="displayName"
  label="Nom"
  prepend-inner-icon="mdi-account-outline"
  color="success"
  variant="outlined"
  :rules="[v => !!v || 'Nom requis']"
  required
/>


              <v-text-field
                v-model="emailSignup"
                label="Email"
                prepend-inner-icon="mdi-email-outline"
                color="success"
                type="email"
                variant="outlined"
                :rules="[v => !!v || 'Email requis']"
                required
              />
              <v-text-field
                v-model="passwordSignup"
                color="success"
                :type="showPassword ? 'text' : 'password'"
                label="Mot de passe"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                :rules="[v => !!v || 'Mot de passe requis']"
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
                :rules="[v => !!v || 'Confirmer le mot de passe']"
                required
              />

              <v-btn type="submit" block color="success" class="mt-4" :disabled="signupLoading">
                <v-progress-circular
                  v-if="signupLoading"
                  indeterminate
                  color="white"
                  size="20"
                  width="2"
                  class="mr-2"
                />
                {{ signupLoading ? 'Inscription...' : 'Inscription' }}
              </v-btn>

              <div class="text-center">
                <v-btn variant="text" color="success" @click="tab = 'login'">
                  Déjà un compte ? Connectez-vous
                </v-btn>
              </div>
            </v-form>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
    

    <!-- Snackbar pour synchro -->
    <v-snackbar v-model="showSyncSnackbar" variant="outlined" color="success" timeout="4000" location="top right">
      ✅ {{ syncMessage }}
    </v-snackbar>
    
  </v-container-fluid>
</template>

<script>
import { supabase } from "@/supabaseClient";
import db from "@/db";
import bcrypt from "bcryptjs"; // ✅ ajout

export default {
  data() {
    return {
      isOnline: navigator.onLine, // 👈 état initial
      tab: "login",
      displayName: "",

      // Connexion
      emailLogin: "",
      passwordLogin: "",
      loginLoading: false,

      // Inscription
      emailSignup: "",
      passwordSignup: "",
      confirmPassword: "",
      signupLoading: false,
      showPassword: false,
      showConfirmPassword: false,

      // Messages
      loginError: "",
      loginSuccess: "",
      registerError: "",
      registerSuccess: "",
      syncMessage: "",
      showSyncSnackbar:false
    };
  },

  methods: {
    // 🔑 Connexion
    async loginUser() {
      this.loginLoading = true;
      this.loginError = "";
      this.loginSuccess = "";

      try {
        // Vérif rapide avant l'appel
    if (!this.emailLogin || !this.passwordLogin) {
      this.loginError = "Email et mot de passe sont requis.";
      this.loginLoading = false;
      return;
    }

        if (navigator.onLine) {
          
          const { data,error } = await supabase.auth.signInWithPassword({
            email: this.emailLogin,
            password: this.passwordLogin
          });

          if (error) {

            // ✅ Ici on capte l'erreur Supabase
          if (error.message.includes("Invalid login credentials")) {
            this.loginError = "Email ou mot de passe incorrect ❌";
          } else {
            this.loginError = error.message || "Échec de connexion.";
          }
          return;

          } else {


            const user = data.user;

        if (user && user.confirmed_at) {
            this.loginSuccess = "Connexion réussie 🎉";

            // Hash local pour IndexedDB
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(this.passwordLogin, salt);

          // Récupération du displayName depuis Supabase
          const displayName = user.user_metadata?.display_name || "";


            // Stocker l'utilisateur et la session dans Dexie
            await db.Utilisateur.put({
              email: this.emailLogin,
              password: hashedPassword,
              displayName: displayName, // ✅ stocké
              synced: true
            });
            await db.Session.put({
              id: 1,
              email: this.emailLogin,
              displayName: displayName, // ✅ ajouté
              loginAt: new Date().toISOString()
            });

            // ✅ Redirection si compte confirmé
          this.$router.push("/Accueil"); 

            
          }
          else{
            this.loginError = "Votre compte n’est pas encore confirmé. Vérifiez vos emails 📧";
      
          }
        
        }
        } 
        else {

          // Mode hors ligne
          const user = await db.Utilisateur.get(this.emailLogin);

      if (!user) {
        this.loginError = "Utilisateur introuvable hors ligne ❌";
        return;
      }

      if (bcrypt.compareSync(this.passwordLogin, user.password)) {
        this.loginSuccess = "Connexion hors ligne réussie ✅";
        await db.Session.put({
          id: 1,
          email: this.emailLogin,
          displayName: user.displayName || "",
          loginAt: new Date().toISOString()
        });

        this.$router.push("/Accueil");


      } else {
        this.loginError = "Mot de passe incorrect (hors ligne) ❌";
      }
        }
      } catch (err) {
        this.loginError = err.message || "Erreur inconnue";
      } finally {
        this.loginLoading = false;
      }
    },

    // 🆕 Inscription
    async registerUser() {
      this.signupLoading = true;
      this.registerError = "";
      this.registerSuccess = "";

      if (this.passwordSignup !== this.confirmPassword) {
        this.registerError = "Les mots de passe ne correspondent pas";
        this.signupLoading = false;
        return;
      }

      try {
        if (navigator.onLine) {
          const { error } = await supabase.auth.signUp({
            email: this.emailSignup,
            password: this.passwordSignup,
            options: { 
              emailRedirectTo: "http://localhost:5173/",
              data: { display_name: this.displayName}
             }
          });

          if (error) {
            this.registerError = error.message;
          } else {
            this.registerSuccess = "Compte créé 🎉 Vérifiez vos emails";
            // Hash local
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(this.passwordSignup, salt);
            await db.Utilisateur.put({
              email: this.emailSignup,
              password: hashedPassword,
              displayName: this.displayName,
              synced: true
            });
          }
        } else {
           // 🔐 Hors-ligne → hash avant stockage
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(this.passwordSignup, salt);
          await db.Utilisateur.put({
            email: this.emailSignup,
            password: hashedPassword,
            displayName: this.displayName,
            synced: false
          });
          this.registerSuccess =
            "Compte créé en local 📴. Synchronisation dès retour en ligne.";
        }
      } catch (err) {
        this.registerError = err.message || "Erreur inconnue";
      } finally {
        this.signupLoading = false;
      }
    },

async syncUsers() {
  // Affichage du snackbar seulement si en ligne
  if (!this.isOnline) {
    this.syncMessage = 'Activer la connexion pour la synchronisation.';
  }

  console.log("🌐 Connexion retrouvée → synchronisation des utilisateurs locaux...");
  try {
    const allUsers = await db.Utilisateur.toArray();
    const unsyncedUsers = allUsers.filter(user => user.synced === false);

    for (const user of unsyncedUsers) {
      try {
        const { error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: { display_name: user.displayName || "" } // ✅ on envoie le displayName
          }
        });

        if (!error) {
          // Marquer comme synchronisé dans Dexie
          await db.Utilisateur.put({
            email: user.email,
            password: user.password,
            displayName: user.displayName || "", // ✅ on garde le nom aussi
            synced: true
          });
          
          // Affichage du snackbar seulement si en ligne
          if (this.isOnline) {
            this.syncMessage = `Utilisateur ${user.email} synchronisé ✅`;
            this.showSyncSnackbar = true;
          }


        } else if (error.message.includes("already registered")) {
          await db.Utilisateur.update(user.email, { synced: true });
          console.warn("⚠️ Déjà existant :", user.email);
        } else {
          console.warn("❌ Erreur synchro :", error.message);
        }
      } catch (err) {
        console.error("Erreur interne synchro :", err);
      }
    }
  } catch (err) {
    console.error("Erreur récupération IndexedDB :", err);
  }
}

  },

  mounted() {


      window.addEventListener("online", async () => {
    this.isOnline = true;
    await this.syncUsers();
  });

  window.addEventListener("offline", () => (this.isOnline = false));


  }
};
</script>
<style scoped>
.fond{
  width: 100%;
  height: 100vh;
  background: url("../image/fondformulaire2.jpg");
  background-size: cover;
}

.v-card {
  background: rgba(255, 255, 255, 0.9) !important; /* verre transparent */
  backdrop-filter: blur(8px);
}
</style>
