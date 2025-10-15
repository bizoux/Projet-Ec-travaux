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

                  <!-- Messages -->
                  <v-alert v-if="registerError" type="error" dense class="mb-2">{{ registerError }}</v-alert>
                  <v-alert v-if="registerSuccess" type="success" dense class="mb-2">{{ registerSuccess }}</v-alert>

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
      email: "",
      password: "",
      confirmPassword: "",
      loading: false,
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
      this.loading = true;
      this.loginError = "";
      this.loginSuccess = "";

      try {
        if (navigator.onLine) {
          const { error } = await supabase.auth.signInWithPassword({
            email: this.email,
            password: this.password
          });
          if (error) this.loginError = error.message;
          else {
            this.loginSuccess = "Connexion réussie 🎉";
            await db.Utilisateur.put({ email: this.email, password: this.password });
          }
        } else {
          const user = await db.Utilisateur.get(this.email);
          if (user && user.password === this.password) this.loginSuccess = "Connexion hors ligne ✅";
          else this.loginError = "Utilisateur introuvable hors ligne ❌";
        }
      } catch (err) {
        this.loginError = err.message;
      } finally {
        this.loading = false;
      }
    },

    // 🆕 Inscription
    async registerUser() {
      this.registerError = "";
      this.registerSuccess = "";

      if (this.password !== this.confirmPassword) {
        this.registerError = "Les mots de passe ne correspondent pas";
        return;
      }

      this.loading = true;

      try {
        if (navigator.onLine) {
          const { error } = await supabase.auth.signUp({
            email: this.email,
            password: this.password,
            options: { emailRedirectTo: "http://localhost:8080/" }
          });
          if (error) this.registerError = error.message;
          else {
            this.registerSuccess = "Compte créé 🎉 Vérifiez vos emails";
            await db.Utilisateur.put({ email: this.email, password: this.password });
          }
        } else {
          await db.Utilisateur.put({ email: this.email, password: this.password });
          this.registerSuccess = "Compte créé en local 📴. Synchronisation dès retour en ligne.";
        }
      } catch (err) {
        this.registerError = err.message;
      } finally {
        this.loading = false;
      }
    }
  },

  mounted() {
    // Synchronisation quand Internet revient
    window.addEventListener("online", async () => {
      const unsyncedUsers = await db.Utilisateur.toArray();
      for (const user of unsyncedUsers) {
        const { error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password
        });
        if (!error) console.log("Utilisateur synchronisé :", user.email);
      }
    });
  }
};
</script>
