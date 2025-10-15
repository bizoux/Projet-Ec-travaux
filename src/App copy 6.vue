<template>
  
  <v-layout>
    <v-navigation-drawer
      image="src/image/fondformulaire.jpg"
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
            to="/Hampiditra"
            prepend-icon="mdi-account-plus"
            title="Hampiditra anjara"
          />

          <v-list-item
            to="/HavoakaPdf"
            prepend-icon="mdi-account-group-outline"
            title="Lisitra anjara"
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
            title="Lisitra"
          />
          <v-list-item
            link
            prepend-icon="mdi-account-group-outline"
            title="Anjara Fampirantiana"
          />

          
        </v-list-group>

        <v-list-item to="/FampiasanaAzy" prepend-icon="mdi-help" title="Fampiasana azy" />

        
      </v-list>
 
    </v-navigation-drawer>

    <v-main>
      
        <router-view></router-view>
        <v-footer class="text-center d-flex flex-column ga-2 py-4" color="indigo-lighten-1">
          <div class="d-flex ga-3">
            <v-btn
              v-for="icon in icons"
              :key="icon"
              :icon="icon"
              density="comfortable"
              variant="text"
            ></v-btn>
          </div>
      
          <v-divider class="my-2" thickness="2" width="50"></v-divider>
      
          <div class="text-caption font-weight-regular opacity-60">
            Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus commodo interdum. Praesent ut risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim a sit amet dui. Duis commodo vitae velit et faucibus. Morbi vehicula lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum tempor vel ut orci. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          </div>
      
          <v-divider></v-divider>
      
          <div>
            {{ new Date().getFullYear() }} — <strong>Jaffrelot</strong>
          </div>
        </v-footer>
    </v-main>           

  </v-layout>



</template>
<script setup>
import { ref } from 'vue'

const drawer = ref(true)
const rail = ref(true)
const icons = [
    'mdi-facebook',
    'mdi-twitter',
    'mdi-linkedin',
    'mdi-instagram',
  ]
</script>


