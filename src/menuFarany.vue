<template>
  
  <v-layout>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
    >
      <v-list-item
      lines="two"
      link
        prepend-avatar="Abrivard.jpg"
        subtitle="Engineer Fullstack"
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
       



      <v-list class="py-0" slim>
        <v-list-item to="/" prepend-icon="mdi-home-outline" title="Fandraisana" />

        <v-list-group
          prepend-icon="mdi-account-multiple-outline"
          title="Fitondrana Micro"
        >
          <template #activator="{ props: activatorProps }">
            <v-list-item v-bind="activatorProps" />
          </template>

          <v-list-item
            to="/Rahalahy"
            prepend-icon="mdi-account-plus-outline"
            title="Rahalahy"
          />
          <v-list-item
            link
            prepend-icon="mdi-account-group-outline"
            title="Anjara Fitondrana"
          />

          
        </v-list-group>

        <v-list-group
          prepend-icon="mdi-account-multiple-outline"
          title="Fampirantiana"
        >
          <template #activator="{ props: activatorProps }">
            <v-list-item v-bind="activatorProps" />
          </template>

          <v-list-item
            link
            prepend-icon="mdi-account-plus-outline"
            title="Rahalahy sy Ranabavy"
          />
          <v-list-item
            link
            prepend-icon="mdi-account-group-outline"
            title="Anjara Fampirantiana"
          />

          
        </v-list-group>

        

        
      </v-list>














      
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

      <div>
        <v-sheet
          border="dashed md"
          color="surface-light"
          height="900"
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

