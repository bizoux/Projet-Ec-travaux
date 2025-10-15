<template>
  
    <v-layout>
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
          <v-list-item prepend-icon="mdi-home-city" title="Accueil" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-account" title="Anjara Micro" value="account"></v-list-item>
          <v-list-item prepend-icon="mdi-account-group-outline" title="Lisitra mpitondra MICRO" value="users"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        
        <v-toolbar color="blue" elevation="4" height="84">
          <template #title>
            <h2 class="text-h4 font-weight-bold">Dashboard</h2>
          </template>
        
        </v-toolbar>
  
        <div class="pa-4">
          <v-sheet
            border="dashed md"
            color="surface-light"
            height="500"
            rounded="lg"
            width="100%"
          />
          </div>

      </v-main>
    </v-layout>
  
</template>
<script setup>
  import { ref } from 'vue'

  const drawer = ref(true)
  const rail = ref(true)
</script>

