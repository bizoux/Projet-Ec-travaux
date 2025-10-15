                        // ROUTE EC TRAVAUX



import { createRouter, createWebHistory } from "vue-router";

// ROUTE EC_TRAVAUX
import { supabase } from '@/supabaseClient';

// import Inscrire from "./components/Inscrire.vue";
// import Register from "./components/Register.vue";
// import SeConnecter from "./components/SeConnecter.vue";
// import ForgotPassword from './components/ForgotPassword.vue'
// import UpdatePassword from './components/UpdatePassword.vue'


// import Home from "./components/Home.vue";
// import Accueil from "./components/Accueil.vue";
// import admin from "./components/admin.vue";
// import Dashboard from "./components/dashboard.vue";
import bde from "./components/bde.vue";
import Materiel from "./components/Materiel.vue";
import MainOeuvre from "./components/MainOeuvre.vue";
import Materiaux from "./components/Materiaux.vue";
import Sdp from "./components/Sdp.vue";
import travaux from "./components/Travaux.vue";
import NouveauProjet from "./components/NouveauProjet.vue";
// import Devis from "./components/Devis.vue";
// import designation from "./components/Designation.vue";
// import test from "./components/test.vue";

// import MaterielTest from "./components/MaterielTest.vue";




const routes = [

    {
        path:"/",
        name:"travaux",
        component: travaux,
        meta:{
            title:"travaux",
        }
    },
    {
        path:"/NouveauProjet",
        name:"NouveauProjet",
        component: NouveauProjet,
        children: [
      { path: 'Materiel', component: Materiel },  // route "/Materiel"
      { path: 'MainOeuvre', component: MainOeuvre },
      { path: 'Materiaux', component: Materiaux },
      { path: 'bde', component: bde },
      { path: 'Sdp', component: Sdp }
    ],
        meta:{
            title:"Nouveau projet",
        },
        
    },

    // { 
    //     path: '/Accueil', 
    //     name: 'Accueil', 
    //     component: Accueil 
    // },

    // { 
    //     path: '/Devis', 
    //     name: 'Devis', 
    //     component: Devis 
    // },

    { 
        path: '/Travaux', 
        name: 'Travaux', 
        component: travaux 
    },

    // { 
    //     path: '/Designation', 
    //     name: 'Designation', 
    //     component: designation 
    // },

    // { 
    //     path: '/admin', 
    //     name: 'admin', 
    //     component: admin 
    // },
    { 
        path: '/bde', 
        name: 'bde', 
        component: bde 
    },
    
    // { 
    //     path: '/Register', 
    //     name: 'Register', 
    //     component: Register 
    // },
    // { 
    //     path: '/Connexion', 
    //     name: 'SeConnecter', 
    //     component: SeConnecter 
    // },
    // {
    //     path: '/forgot-password',
    //     name: 'ForgotPassword',
    //     component: ForgotPassword
    // },
    // {
    //     path: '/update-password',
    //     name: 'UpdatePassword',
    //     component: UpdatePassword
    // },

    // { 
    //     path: '/Inscrire', 
    //     name: 'Inscrire', 
    //     component: Inscrire 
    // },

    // { 
    //     path: '/Home', 
    //     name: 'Home', 
    //     component: Home, 
    //     meta: { 
    //         requiresAuth: true,
    //         title:"Home"
    //      }
    // },

    // {
    //   path: '/dashboard',
    //   name: 'Dashboard',
    //   component: Dashboard,
    //   meta: { requiresAuth: true }
    // },
    
    {
        path:"/Materiel",
        name:"Materiel",
        component: Materiel,
        meta:{
            title:"Materiel",
        }
    },

    {
        path:"/MainOeuvre",
        name:"MainOeuvre",
        component: MainOeuvre,
        meta:{
            title:"Main d'oeuvre",
        }
    },

    {
        path:"/Materiaux",
        name:"Materiaux",
        component: Materiaux,
        meta:{
            title:"Materiaux",
        }
    },

    {
        path:"/Sdp",
        name:"Sdp",
        component: Sdp,
        meta:{
            title:"Sdp",
        }
    },

    // {
    //     path:"/test",
    //     name:"test",
    //     component: test,
    //     meta:{
    //         title:"test",
    //     }
    // },


  
    
    
];


const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

// Protéger les routes
router.beforeEach(async (to, from, next) => {
    const { data: { session } } = await supabase.auth.getSession()
    // ❌ Bloquer l'accès à /login si déjà connecté
  if (to.path === '/Connexion' && session) {
    next(false) // Reste sur la page actuelle
  }
    if (to.meta.requiresAuth && !session) {
      next('/Connexion')
    } else {
      next()
    }
  })
  
  export default router