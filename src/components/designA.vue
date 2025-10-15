<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow p-4" style="width: 450px;">
      <h2 class="text-center mb-4 text-primary">
        <font-awesome-icon icon="user-plus" class="me-2" />Créer un compte
      </h2>

      <form @submit.prevent="handleRegister">
        <!-- Nom -->
        <div class="mb-3">
          <label for="name" class="form-label">
            <font-awesome-icon icon="user" class="me-2 text-secondary" />Nom complet
          </label>
          <input type="text" id="name" v-model="name" class="form-control" placeholder="Votre nom" required />
        </div>

        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">
            <font-awesome-icon icon="envelope" class="me-2 text-secondary" />Adresse Email
          </label>
          <input type="email" id="email" v-model="email" class="form-control" placeholder="exemple@email.com" required />
        </div>

        <!-- Mot de passe -->
        <div class="mb-3">
          <label for="password" class="form-label">
            <font-awesome-icon icon="lock" class="me-2 text-secondary" />Mot de passe
          </label>
          <div class="input-group">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" class="form-control" placeholder="********" required />
            <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword">
              <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
            </button>
          </div>
          <small class="text-muted">8 caractères minimum, une majuscule et un chiffre.</small>
        </div>

        <!-- Confirmation mot de passe -->
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">
            <font-awesome-icon icon="check" class="me-2 text-secondary" />Confirmer le mot de passe
          </label>
          <input :type="showPassword ? 'text' : 'password'" id="confirmPassword" v-model="confirmPassword" class="form-control" placeholder="********" required />
        </div>

        <!-- Bouton d'inscription -->
        <button type="submit" class="btn btn-success w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          <span v-else><font-awesome-icon icon="user-plus" class="me-2" />S'inscrire</span>
        </button>

        <!-- Lien connexion -->
        <div class="text-center mt-3">
          <router-link to="/login" class="text-decoration-none">
            <font-awesome-icon icon="sign-in-alt" class="me-1" />Déjà un compte ? Se connecter
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      loading: false
    };
  },
  methods: {
    handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert("Les mots de passe ne correspondent pas !");
        return;
      }
      this.loading = true;
      setTimeout(() => {
        alert(`Compte créé pour ${this.name}`);
        this.loading = false;
      }, 1500);
    }
  }
};
</script>
