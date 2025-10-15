<template>
  <v-app>

    <v-app-bar class="px-3">
      <v-spacer></v-spacer>

      <v-btn @click="toggleTheme" icon>
        <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    
    </v-app-bar>
      
    <v-main>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur reiciendis laudantium, eaque at porro perferendis aut labore aliquid expedita sequi facere rem deleniti libero, vel iusto et sapiente, sit distinctio.
  
    </v-main>    

   
    
    

  </v-app>
  
  
</template>

<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>



