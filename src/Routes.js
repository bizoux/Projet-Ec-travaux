                            // ROUTE EC TRAVAUX


    import { createRouter, createWebHistory } from "vue-router";

    // ROUTE EC_TRAVAUX
    import { supabase } from '@/supabaseClient';
    import db from "./db"; // ✅ chemin correct puisque route.js est dans src/

    // CHATBOT
    import Chatbot from "./components/Chatbot.vue";



    // AUTHENTIFICATION

    import Authentification from "./components/Authentification.vue";
    import SeConnecter from "./components/SeConnecter.vue";
    import Inscrire from "./components/Inscrire.vue";
    import MdpOublier from "./components/MdpOublier.vue";
    import NouveauMdp from "./components/NouveauMdp.vue";


    // PAGE PRINCIPALE EC TRAVAUX

    import Accueil from "./components/Accueil.vue";
    import Dashboard from "./components/Dashboard.vue";
    import bde from "./components/bde.vue";
    import Materiel from "./components/Materiel.vue";
    import MainOeuvre from "./components/MainOeuvre.vue";
    import Materiaux from "./components/Materiaux.vue";
    import Sdp from "./components/Sdp.vue";
    import NouveauProjet from "./components/NouveauProjet.vue";
    import ProjetExistant from "./components/ProjetExistant.vue";
    import designA from "./components/designA.vue";
    import travaux from "./components/Travaux.vue";

    // import Inscrire from "./components/Inscrire.vue";
    // import Register from "./components/Register.vue";
    // import SeConnecter from "./components/SeConnecter.vue";
    // import ForgotPassword from './components/ForgotPassword.vue'
    // import UpdatePassword from './components/UpdatePassword.vue'
    // import Home from "./components/Home.vue";
    // import Accueil from "./components/Accueil.vue";
    // import admin from "./components/admin.vue";
    // import Dashboard from "./components/dashboard.vue";
    import Devis from "./components/Devis.vue";
    import designation from "./components/Designation.vue";
    // import test from "./components/test.vue";
    // import MaterielTest from "./components/MaterielTest.vue";

    // import Parent from "./components/Parent.vue";
    // import ChildA from "./components/ChildA.vue";
    // import ChildB from "./components/ChildB.vue";





    const routes = [
        {
            path:"/",
            name:"Authentification",
            component: Authentification,
            meta:{
                title:"Se connecter | Ec Travaux",
            }
        },

        {
            path:"/SeConnecter",
            name:"SeConnecter",
            component: SeConnecter,
            meta:{
                title:"SeConnecter",
            }
        },
        {
            path:"/Inscrire",
            name:"Inscrire",
            component: Inscrire,
            meta:{
                // requiresAuth: true,
                title:"Inscription",
            }
        },
        {
            path:"/MdpOublier",
            name:"MdpOublier",
            component: MdpOublier,
            meta:{
                title:"MdpOublier",
            }
        },
        {
            path:"/nouveau-mot-de-passe",
            name:"NouveauMdp",
            component: NouveauMdp,
            meta:{
                title:"Nouveau mot de passe",
            }
        },

        {
            path:"/Accueil",
            name:"Accueil",
            component: Accueil,
            meta:{
                requiresAuth: true,
                title:"Accueil",
            },
    
            children: [

                { path: '', redirect: { name: 'Dashboard' } },

                { 
                    path: "/Accueil_Ec_travaux" , 
                    name: 'Dashboard', 
                    component: Dashboard,
                    meta:{
                        requiresAuth: true,
                        title:"Accueil",
                    } 
                },

                { 
                    path: '/NouveauProjet', 
                    component: NouveauProjet,
                    meta:{
                            requiresAuth: true,
                            title:"Nouveau projet",
                        },
                    children: [

                    { path: 'Materiel', name: "Materiel",component: Materiel,meta:{requiresAuth: true,title:"Matériel"} },  
                    { path: 'MainOeuvre', name: "Main d'oeuvre",component: MainOeuvre,meta:{requiresAuth: true,title:"Main d'oeuvre"}  },
                    { path: 'Materiaux', name: "Materiaux",component: Materiaux,meta:{requiresAuth: true,title:"Matériaux"} },
                    { path: 'bde', name: "bde",component: bde,meta:{requiresAuth: true,title:"Bde"} },
                    { path: 'Sdp', name: "Sdp",component: Sdp,meta:{requiresAuth: true,title:"Sdp"} },
                    { path: '', redirect: { name: 'Materiel' } }
                ], 
                
                },

                { 
                    path: '/Designation', 
                    name: 'Designation', 
                    component: designation,
                    meta:{
                            requiresAuth: true,
                            title:"Désignation",
                        }, 
                },
                { 
                    path: '/Projet_existant', 
                    name: 'ProjetExistant', 
                    component: ProjetExistant,
                    meta:{
                            requiresAuth: true,
                            title:"Projet existant",
                        }, 
                },
                
                
        ],

        },


        
        {
            path:"/desA",
            name:"designA",
            component: designA,
            meta:{
                requiresAuth: true,
                title:"des",
            }
        },
        
        

        { 
            path: '/Devis', 
            name: 'Devis', 
            component: Devis 
        },

        { 
            path: '/Chatbot', 
            name: 'Chatbot', 
            component: Chatbot 
        },


        
        // { 
        //     path: '/Accueil', 
        //     name: 'Accueil', 
        //     component: Accueil 
        // },

        

        // { 
        //     path: '/admin', 
        //     name: 'admin', 
        //     component: admin 
        // },

        
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

    // Route guard offline/online
    router.beforeEach(async (to, from, next) => {
    let session = null;

    // Online → vérifier Supabase
    if (navigator.onLine) {
        const { data } = await supabase.auth.getSession();
        if (data.session) session = { email: data.session.user.email };
    }

    // Offline ou pas de session en ligne → vérifier session Dexie
    if (!session) {
        session = await db.Session.get(1); // récupère la session locale
    }

    // Bloquer l'accès à la page login si déjà connecté
    if (to.path === '/' && session) {
        next('/Accueil'); // 👈 redirection auto
    return;
    }

    // Routes protégées
    if (to.meta.requiresAuth && !session) {

        next('/'); // redirige vers login
    
    } else {

        next();
    
    }

    document.title = to.meta.title;
    });

    
    export default router