<template>
  <v-app>
    <v-container fluid>
            <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
      >
        <v-list-item
          prepend-avatar="Abrivard.jpg"
          title="Jaffrelot"
          nav
        >
          <template v-slot:append>
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>
        
        <v-list density="compact" nav>
          <v-list-item to="/" prepend-icon="mdi-home-city" title="Accueil" value="home"></v-list-item>
          <v-list-item to="/test" prepend-icon="mdi-account" title="Anjara Micro" value="account"></v-list-item>
          <v-list-item prepend-icon="mdi-account-group-outline" title="Lisitra mpitondra MICRO" value="users"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-app-bar app color="primary">
          <v-app-bar-title>Dashboard 2025</v-app-bar-title>
        </v-app-bar>
        fgfdg
        <router-view />
      </v-main>
    </v-container>
  </v-app>
</template>
<script setup>
  import { ref } from 'vue'

  const drawer = ref(true)
  const rail = ref(true)
</script>
