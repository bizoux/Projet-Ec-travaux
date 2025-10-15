<template>

<v-app>
  
  <v-navigation-drawer
    style="background:linear-gradient(200deg,#02303065,#557497,#0c5e699a);"
    v-model="drawer"
    :rail="rail"
    :width="300"
    permanent
    @click="rail = false"
    class="FontPolice"
  >
  <div class="row">
    <div class="col-md-12 d-flex justify-content-center">
      <img src="../image/logoDGI.png" alt="" width="70px" class="p-2">
      
    </div>
  </div>
  
    <v-list-item
      lines="two"
      link
      prepend-avatar="Abrivard.jpg"
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

      <v-list-item to="/Accueil" prepend-icon="mdi-home-outline" title="Accueil" exact/>

      <v-list-item to="/Designation" prepend-icon="mdi-home-outline" title="Désignation"/>

          <v-list-group prepend-icon="mdi-file-document-outline" title="Génération de dévis">
            <template #activator="{ props: activatorProps }">
              <v-list-item v-bind="activatorProps" />
            </template>

            <v-list-item
              to="/Rahalahy"
              prepend-icon="mdi-folder-open-outline"
              title="Gérer un projet existant"
            />
            <v-list-item
              to="/NouveauProjet"
              prepend-icon="mdi-folder-plus-outline"
              title="Créer un nouveau projet"
            />

          </v-list-group>
                  

    </v-list>

    <template v-slot:append>

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


    </template>


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

  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { supabase } from "@/supabaseClient"
import db from "@/db"   // ✅ ton Dexie
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()


const drawer = ref(true)
const rail = ref(true)
const theme = useTheme()

const user = ref(null)
const displayName = ref('Invité')
const email = ref('')

// Toggle thème clair/sombre
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

onMounted(async () => {
  if (navigator.onLine) {
    // 🔐 En ligne → récupérer depuis Supabase
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    user.value = currentUser

    if (user.value) {
      displayName.value = user.value.user_metadata?.display_name || 'Invité'
      email.value = user.value.email || ''
    }
  } else {
    // 🔐 Hors ligne → récupérer depuis Dexie (Session)
    const session = await db.Session.get(1)
    if (session) {
      displayName.value = session.displayName || 'Invité'
      email.value = session.email || ''
    }
  }
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
  transition: 0.3s;
  background:rgb(30, 62, 110)
  
}

</style>

