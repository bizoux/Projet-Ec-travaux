<template>
  <v-app>
    <v-main>
      <!-- Ici tu peux afficher soit ton auth card, soit une autre page via router -->
    <v-fade-transition mode="out-in">
      <router-view />
    </v-fade-transition>
    
    </v-main>
  </v-app>
</template>

<style scoped>





</style>
