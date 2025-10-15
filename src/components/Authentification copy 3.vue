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

                  <!-- Messages -->
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
                  /> <br>
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
  ></v-progress-circular>
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
                <v-card-title class="text-h6 text-center mb-4">
                  <v-icon start class="mr-2" color='success'>mdi-account-plus</v-icon> Créer un nouveau compte
                </v-card-title>

                <v-form @submit.prevent="registerUser">

                  <!-- Messages -->
                  <v-alert v-if="registerError" type="error" dense class="mb-2">{{ registerError }}</v-alert>
                  <v-alert v-if="registerSuccess" type="success" dense class="mb-2">{{ registerSuccess }}</v-alert>

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
                  <v-btn
                    type="submit"
                    block
                    color="success"
                    class="mt-4 mb-3"
                    :disabled="signupLoading"
                  >

<v-progress-circular
    v-if="signupLoading"
    indeterminate
    color="white"
    size="20"
    width="2"
    class="mr-2"
  ></v-progress-circular>
  {{ signupLoading ? 'Inscription...' : 'Inscription' }}

</v-btn>

                  <div class="text-center">
                    <v-btn variant="text" color="success" @click="tab='login'">
                      Déjà un compte ? Connectez-vous
                    </v-btn>
                  </div>  
                </v-form>
              </v-window-item>

            </v-window>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { supabase } from "@/supabaseClient";
import db from "@/db";

export default {
  data() {
    return {
      tab: "login",
      
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

      // Messages distincts pour connexion et inscription
      loginError: "",
      loginSuccess: "",
      registerError: "",
      registerSuccess: ""
    };
  },

methods: {
  // 🔑 Connexion
  async loginUser() {
    this.loginLoading = true;
    this.loginError = "";
    this.loginSuccess = "";

    try {
      if (navigator.onLine) {
        const { error } = await supabase.auth.signInWithPassword({
          email: this.emailLogin,
          password: this.passwordLogin
        });

        if (error) {
          this.loginError = error.message;
        } else {
          this.loginSuccess = "Connexion réussie 🎉";
          await db.Utilisateur.put({ email: this.emailLogin, password: this.passwordLogin });
        }
      } else {
        // ⚠️ Attention à bien utiliser emailLogin
        const user = await db.Utilisateur.get(this.emailLogin);
        if (user && user.password === this.passwordLogin) {
          this.loginSuccess = "Connexion hors ligne réussie ✅";
        } else {
          this.loginError = "Utilisateur introuvable hors ligne ❌";
        }
      }
    } catch (err) {
      this.loginError = err.message || "Erreur inconnue";
    } finally {
      // 🔹 Toujours arrêter le loading
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
          options: { emailRedirectTo: "http://localhost:5173/" }
        });

        if (error) {
          this.registerError = error.message;
        } else {
          this.registerSuccess = "Compte créé 🎉 Vérifiez vos emails";
          await db.Utilisateur.put({ email: this.emailSignup, password: this.passwordSignup });
        }
      } else {
        // Hors ligne : sauvegarde locale
        await db.Utilisateur.put({ email: this.emailSignup, password: this.passwordSignup });
        this.registerSuccess = "Compte créé en local 📴. Synchronisation dès retour en ligne.";
      }
    } catch (err) {
      this.registerError = err.message || "Erreur inconnue";
    } finally {
      // 🔹 Toujours arrêter le loading
      this.signupLoading = false;
    }
  }
},



mounted() {
  // Synchronisation des utilisateurs hors ligne quand Internet revient
  window.addEventListener("online", async () => {
    try {
      const unsyncedUsers = await db.Utilisateur.toArray();
      for (const user of unsyncedUsers) {
        const { error } = await supabase.auth.signUp({
          email: user.email,       // email de l’inscription hors ligne
          password: user.password  // mot de passe de l’inscription hors ligne
        });
        if (!error) {
          console.log("Utilisateur synchronisé :", user.email);
          // Optionnel : supprimer de IndexedDB si synchronisation réussie
          await db.Utilisateur.delete(user.email);
        } else {
          console.error("Erreur synchronisation :", error.message);
        }
      }
    } catch (err) {
      console.error("Erreur lors de la synchronisation :", err);
    }
  });
}




};
</script>
