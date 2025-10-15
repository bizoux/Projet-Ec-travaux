<template>
  
    <v-navigation-drawer
      style="background:linear-gradient(200deg,#02303065,#557497,#0c5e699a);"
      v-model="drawer"
      :rail="rail"
      :width="300"
      permanent
      @click="rail = false"
    >

<v-list-item
  lines="two"
  link
  prepend-avatar="Abrivard.jpg"
  :subtitle="email"
  nav
>
  <!-- SLOT TITLE pour personnaliser -->
  <template #title>
    <strong>{{ displayName }}</strong>
  </template>

  <template v-slot:append>
    <v-btn
      icon="mdi-chevron-left"
      variant="text"
      @click.stop="rail = !rail"
    ></v-btn>
  </template>
</v-list-item>



      <Navbar />
      <v-divider></v-divider>
       



      <v-list class="py-0" slim>
        <v-list-item to="/Accueil" prepend-icon="mdi-home-outline" title="Accueil"/>

        <v-list-group
          prepend-icon="mdi-file-document-outline"
          title="Génération de dévis"

        >
          <template #activator="{ props: activatorProps }">
            <v-list-item v-bind="activatorProps" />
          </template>

          <v-list-item
            to="/Rahalahy"
            prepend-icon="mdi-folder-open-outline"
            title="Gérer un projet existant"
          />
          <v-list-item
            to="/Accueil/NouveauProjet"
            prepend-icon="mdi-folder-plus-outline"
            title="Créer un nouveau projet"
          />


          
        </v-list-group>
 <!-- BOUTON DE DÉCONNEXION -->
  <v-divider class="my-2"></v-divider>
  <v-list-item
    link
    @click="logout"
  >
    <v-list-item-icon>
      <v-icon>mdi-logout</v-icon>
    </v-list-item-icon>
    <v-list-item-title>Déconnexion</v-list-item-title>
  </v-list-item>
        
      </v-list>
 
    </v-navigation-drawer>
    
    <v-app-bar style="background:linear-gradient(500deg,#02303065,#557497,#0c5e699a);backdrop-filter: blur(3px);">
      <v-spacer></v-spacer>

      <v-btn @click="toggleTheme" icon>
        <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

    </v-app-bar>

    <v-main>
      
        <router-view></router-view>
        
    </v-main>
               
 


</template>
<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'


const drawer = ref(true)
const rail = ref(true)
const theme = useTheme()

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<script>
import { supabase } from "@/supabaseClient";

export default {
  name: 'SidebarLayout',

  data() {
    return {
      drawer: true,
      rail: true,
      darkTheme: false,

      // Infos utilisateur
      user: null,
      displayName: 'Invité',
      email: ''
    }
  },

  async created() {
    // Récupérer l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser()
    this.user = user

    if (this.user) {
      this.displayName = this.user.user_metadata?.display_name || 'Invité'
      this.email = this.user.email || ''
    }
  },

  methods: {
    toggleTheme() {
      this.darkTheme = !this.darkTheme
      this.$vuetify.theme.dark = this.darkTheme
    }
  }
}
</script>


