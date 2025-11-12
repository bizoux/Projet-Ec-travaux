<template>

<v-app>
  
  <v-navigation-drawer
    style="background: rgb(34, 36, 33);backdrop-filter: blur(20px);"
    v-model="drawer"
    :rail="rail"
    :width="300"
    permanent
    @click="rail = false"
    class="FontPolice"
  >
  <div class="row">
    <div class="col-md-12 d-flex justify-content-center">
      <img :src="logo" alt="" width="100px" class="p-2" style="border-radius: 100%;">
      
    </div>
  </div>
  
    <v-list-item
      lines="two"
      link
      :prepend-avatar="profil"
      :subtitle="email"
      nav
    >
      <template #title>
        <strong style="letter-spacing: 1px;">{{ displayName }}</strong>
      </template>

      <template v-slot:append>
        <v-btn
          icon="mdi-chevron-left"
          variant="text"
          @click.stop="rail = !rail"
        ></v-btn>
      </template>
    </v-list-item>


    <v-list class="py-0" slim>

      <v-list-item to="/Accueil_Ec_travaux" prepend-icon="mdi-home-outline" title="Accueil" rounded="shaped" exact/>
      
      <!-- <v-list-item to="/Projets" prepend-icon="mdi-domain" title="Projets" rounded="shaped"/> -->
      
      <v-list-item to="/Projets" :active="route.path.startsWith('/Projets') || route.path.startsWith('/NouveauProjet')|| route.path.startsWith('/Nouveau_projet')|| route.path.startsWith('/Projet_existant')"  prepend-icon="mdi-domain" title="Projets" rounded="shaped"/>
               

    </v-list>


            <!-- 🚪 Déconnexion stylée en bas -->
      <div
        class="logout-container"
        style="
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          border-top: 1px solid rgba(255,255,255,0.2);
          background: linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.2));
          backdrop-filter: blur(3px);
        "
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-list-item
            v-bind="props"
            @click="confirmLogout"
          >
            <v-icon
              start
              :color="isHovering ? 'red-darken-2' : 'red-darken-1'"
              style="transition: transform 0.3s;"
              :style="isHovering ? 'transform: translateX(-3px) rotate(-15deg);' : ''"
            >
              mdi-logout
            </v-icon>
            <span class="ms-2">Déconnexion</span>
          </v-list-item>
        </v-hover>
      </div>



  </v-navigation-drawer>

  <v-app-bar style="background:rgb(65, 80, 180);backdrop-filter: blur(3px);">
    <v-toolbar-title class="font-bold text-white fontPolice">
      {{currentTitle}}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    
    <span class="badge rounded-pill px-3 py-2"
            :class="estEnLigne ? 'bg-success' : 'bg-danger'">
        {{ estEnLigne ? '🟢 En ligne' : '🔴 Hors ligne' }}
    </span>

    <v-btn @click="toggleTheme" icon>
      <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>
  </v-app-bar>

  <v-main>
  
  <v-fade-transition mode="out-in">
    <router-view></router-view>
  </v-fade-transition>
  
  </v-main>

  </v-app>
</template>

<script setup>
import { ref, onMounted,watch } from 'vue'
import { useTheme } from 'vuetify'
import { supabase } from "@/supabaseClient"
import db from "@/db"   // ✅ ton Dexie
import { useRouter,useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import profil from '@/assets/user.png'
import logo from '@/assets/LogoEcTravau.jpg'


const router = useRouter()
const route = useRoute()




const drawer = ref(true)
const rail = ref(true)
const theme = useTheme()

const user = ref(null)
const displayName = ref('Invité')
const email = ref('')

// Route

const currentTitle = ref('Accueil')

const estEnLigne = ref(navigator.onLine);

// En ligne ou hors ligne

async function mettreAJourEtatConnexion() {
  estEnLigne.value = navigator.onLine;
}



// Toggle thème clair/sombre
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

watch(
  () => route.meta.title,
  (newTitle) => {
    currentTitle.value = newTitle || 'Application BTP'
  },
  { immediate: true }
)


onMounted(async () => {
  if (navigator.onLine) {
    //  En ligne → récupérer depuis Supabase

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    user.value = currentUser

    if (user.value) {
      displayName.value = user.value.user_metadata?.display_name || 'rakoto'
      email.value = user.value.email || ''
    }
  } else {
    //  Hors ligne → récupérer depuis Dexie (Session)
    
    const session = await db.Session.get(1)
    if (session) {
      displayName.value = session.displayName || 'Invité'
      email.value = session.email || ''
    }
  }

  window.addEventListener('offline', () => mettreAJourEtatConnexion());
  window.addEventListener('online', () => mettreAJourEtatConnexion());


})


async function logoutUser() {
  try {
    if (navigator.onLine) {
      // ✅ En ligne → déconnexion complète côté Supabase
      await supabase.auth.signOut()
    }

    // ✅ Hors ligne OU en ligne → on nettoie toujours Dexie
    await db.Session.clear()

    // ✅ Réinitialiser l'UI
    user.value = null
    displayName.value = 'Invité'
    email.value = ''

    // ✅ Redirection
    router.push('/') // page de connexion
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error.message)

    // 🚑 Même en cas d’erreur (offline ou autre), on déconnecte localement
    await db.Session.clear()
    user.value = null
    displayName.value = 'Invité'
    email.value = ''
    router.push('/')
  }
}

// ✅ Déconnexion avec confirmation
async function confirmLogout() {
  const result = await Swal.fire({
    title: 'Se déconnecter ?',
    text: "Vous allez être redirigé vers la page d'accueil.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, déconnecter',
    cancelButtonText: 'Annuler',
    background: 'rgba(250, 250, 250, 0.95)',
    backdrop: `rgba(0,0,0,0.4)`
  })

  if (result.isConfirmed) {
    await logoutUser()
    Swal.fire({
      title: 'Déconnecté !',
      text: 'Vous êtes maintenant déconnecté.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })
  }
}




</script>
<style scoped>

  .FontPolice{
    font-family: 'MaRoboto', sans-serif;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.836);
  }

.logout-container {
  user-select: none;
}

.v-list-item:hover {
  transition: 0.4s;
  
}

.v-list-item--active{
  background:rgb(65, 80, 180);

}
.fontPolice{

font-family:'MaRoboto',sans-serif;

}

</style>

