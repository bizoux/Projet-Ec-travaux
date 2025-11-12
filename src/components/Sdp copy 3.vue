<template>
  <div class="chatbot-container card shadow-lg border-0 rounded-4 p-4">
    <div class="chatbot-header d-flex align-items-center justify-content-center mb-3">
      <h4 class="fw-bold text-primary m-0">
        🤖 Chatbot BTP Assistant
      </h4>
    </div>

    <!-- Zone des messages -->
    <div class="chatbot-messages p-3" ref="messagesContainer">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message mb-3"
        :class="msg.role"
      >
        <div class="message-bubble shadow-sm">
          <span v-if="msg.role === 'user'" class="fw-semibold text-dark">👷 Vous :</span>
          <span v-else class="fw-semibold text-primary">🤖 Bot :</span>
          <p class="m-0">{{ msg.content }}</p>
        </div>
      </div>
    </div>

    <!-- Zone de saisie -->
    <div class="chatbot-input mt-3 d-flex align-items-center">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        class="form-control shadow-sm me-2"
        type="text"
        placeholder="Écrire un message..."
      />
      <button class="btn btn-primary rounded-circle" @click="sendMessage">
        <font-awesome-icon icon="paper-plane" />
      </button>
    </div>
  </div>
</template>

<script>
import multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import db from '@/db';
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";


export default {
  components: {
    multiselect
  },
  data() {
    return {

      CodeBdeSelectionner:'',

      // Données chatbot

      messages : [],
      userInput : "",

      // modification sdp

      modifProjet:'',
      modifDesignation:'',
      modifUnite:'',
      modifQuantiteR:'',
      modifRendementJ:'',
      modifDureeJ:'',
      modifCoefficientK:'',
      modifTerminee:'',

      // modification main d'oeuvre

      ModifNomMainOeuvre:'',
      ModifQteUmainOeuvre:'',
      ModifUniteJmainOeuvre:'',
      ModifPuMainOeuvre:'', 
      ModifQteTotaleMainOeuvre:'',

      // id composant de prix main d'oeuvre

      idTacheMainOeuvre:'',
      idTacheModif:'',

      // id composant de prix materiel

      idTacheMaterielComp:'',
      idTacheModifMateriel:'',


      // modification materiel

      ModifNomMateriel:'',
      ModifQteUMateriel:'',
      ModifUniteJMateriel:'',
      ModifPuMateriel:'', 
      ModifQteTotaleMateriel:'',

      // selection

      ProjetSelectionner:'',
      CategorieSelectionner:'',
      MaterielSelectionner:'',
      MateriauxSelectionner:'',

      // attribut affichage modale main d'oeuvre

      nom:'',
      SalaireBase:'',
      HeureBase:'',
      heures: {
              base: 48,
              hs25: 8,
              hs50: 0,
              hs100: 0,
            },
            charges: {
              salariales: 25,
              prime: 0,
            },

      // attribut affichage modale

      afficherModaleSdp:false,
      afficherModale:false,
      afficherModaleMateriel:false,
      afficherModaleMateriaux:false,
      afficherModaleMainOeuvre:false,
      afficherModaleMaterielAjout:false,
      afficherModaleMateriauxAjout:false,
      modalModifTacheSdp:false,
      modalModifCompMainOeuvre:false,
      modalModifCompMateriel:false,


      // attribut pour faire sdp de chaque designation
    
    Num:'',
    unite:'',
    quantiteR:'',
    rendementJ:'',
    dureeJ:'',
    coefficientK:'',

      

      // attribut main d'oeuvre

    CodeMainOeuvre:'', 
    qteU:'', 
    uniteJ:'', 
    qteTotale:'', 
    Pu:'',

    // attribut materiel

    // Code:'',
    qteUMat:'',
    uniteJMat:'',
    qteTotaleMat:'',
    PuMat:'',

    
    // attribut materiaux

    id:'',
    qteUMater:'',
    uniteJMater:'',
    qteTotaleMater:'',
    PuMater:'',

      // SELECTED

      selectedDesBde:'',
      selectedTache:'',
      selectedMainOeuvre:'',
      selectedMateriel:'',
      selectedMateriaux:'',
      
      // LIST
      
      ProjetList:[],
      DesignationBdeList:[],
      MainOeuvreList:[],
      MaterielList:[],
      MateriauxList:[],
      tacheList:[],
      ListeDesignationProjet:[],
      ListeDesignationProjetModif:[],


      selected: null,
      sdp: {
        mainOeuvre: [],
        materiels: [],
        materiaux: [],
        tacheCorrespondant:[],
        totalMainOeuvre: 0,
        totalMateriels: 0,
        totalMateriaux:0,
        totalGeneral: 0
      },

      // attribut nouveau materiel

      // Réinitialiser formulaire
      
      Code : '',
      Materiels : '',
      Unite : '',
      Prix : '',
      Observation : ''



    }
  },

watch :{

qteU:function(val){
this.qteU = val;
this.qteTotale = val * this.selectedTache.dureeJ;
},

qteUMat:function(val){
this.qteUMat = val;
this.qteTotaleMat  = val * this.selectedTache.dureeJ;
},

qteUMater:function(val){
  this.qteUMater = val;
  this.qteTotaleMater  = val * this.selectedTache.dureeJ;
},

quantiteR:function(val) {
    this.calculerDuree();
  },
  rendementJ:function(val) {
    this.calculerDuree();
  },

            // MODIF  
  
modifQuantiteR:function(val) {
    this.calculerDureeModif();
  },
modifRendementJ:function(val) {
    this.calculerDureeModif();
  },

ModifQteUmainOeuvre:function(val){
this.ModifQteUmainOeuvre = val;
this.ModifQteTotaleMainOeuvre = val * this.selectedTache.dureeJ;
},

ModifQteUMateriel:function(val){
this.ModifQteUMateriel = val;
this.ModifQteTotaleMateriel = val * this.selectedTache.dureeJ;
}, 



},
   async mounted() {

    // await this.loadData();
    await this.ListeProjets();
    await this.ListeMainOeuvre();
    await this.ListeMateriel();
    await this.ListeMateriaux();
    await this.ListeDesignationBde();
    await this.ListeTaches();
    // await this.DesignationCorrespondantModif();
  
  },
  methods: {

  
  
  async sendMessage(){
    // Mets ta clé dans .env

  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!this.userInput.trim()) return;
  
    this.messages.push({ role: "user", content: this.userInput });
  
    const systemPrompt = `
    Tu es un assistant expert en BTP.
    Donne toujours des réponses TRÈS COURTES et precis et formatées clairement.
    N’explique rien, ne fais pas de phrases longues.
    Formate comme ceci :
  
    Quantité par m3(ou m2):
     ...
    Matériaux :
     .
     .
     .
  
    Si ce n’est pas une question de BTP, réponds simplement "Question non liée au BTP".
    `;
  
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-4o-mini", // ou "gpt-4-turbo" si disponible
          messages: [
            { role: "system", content: systemPrompt },
            ...this.messages,
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const botReply = response.data.choices[0].message.content.trim();
      this.messages.push({ role: "assistant", content: botReply });
      this.userInput = "";
    } catch (err) {
      console.error(err);
      this.messages.push({
        role: "assistant",
        content: "⚠️ Erreur lors de la génération de la réponse.",
      });
    }

  },  
  
  





    // SUPPRESSION

async supprimerMainOeuvre(idTacheM, nom) {
  try {
    const result = await this.$swal({
      title: "Etes vous sure de vouloir supprimer " + nom + " ?",
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
      didOpen: () => {
        const confirmBtn = document.querySelector('.swal2-confirm');
        const cancelBtn = document.querySelector('.swal2-cancel');
        if (confirmBtn && cancelBtn) {
          const maxWidth = Math.max(confirmBtn.offsetWidth, cancelBtn.offsetWidth);
          confirmBtn.style.width = cancelBtn.style.width = maxWidth + 'px';
        }
      }
    });

    if (result.isConfirmed) {
      // 🔥 Code de suppression
      await db.tache_main_oeuvre.delete(idTacheM);
      await this.chargerTache(this.selectedTache);

      await this.$swal({
        icon:'success',
        title:"Supprimé !",
        text: nom + " a été supprimé avec succès.",
        timer:2500,
        showConfirmButton:false
      });
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
},



        
        async supprimerMateriel(idTacheMateriel,nom) {

        try {
    const result = await this.$swal({
      title: "Etes vous sure de vouloir supprimer " + nom + " ?",
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
      didOpen: () => {
        const confirmBtn = document.querySelector('.swal2-confirm');
        const cancelBtn = document.querySelector('.swal2-cancel');
        if (confirmBtn && cancelBtn) {
          const maxWidth = Math.max(confirmBtn.offsetWidth, cancelBtn.offsetWidth);
          confirmBtn.style.width = cancelBtn.style.width = maxWidth + 'px';
        }
      }
    });

    if (result.isConfirmed) {
      // 🔥 Code de suppression
        await db.tache_materiel.delete(idTacheMateriel);
        await this.chargerTache(this.selectedTache);

      await this.$swal({

        icon:'success',
        title:"Supprimé !",
        text: nom + " a été supprimé avec succès.",
        timer:2500,
        showConfirmButton:false
        
    });
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }


},



    // NOTIFICATION

    async notifModifSdp(){
        
        this.$swal({
        icon:'success',
        title:'Modification sdp',
        text:"avec succès",
        timer:2500,
        showConfirmButton:false
      })
        
    },






  async notifSuppSdpMainOeuvre(){


        this.$swal({
        title: 'Êtes-vous sûr ?',
        text: "Cette action est irréversible !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          // 🔥 Ici tu mets ton code de suppression (API / DB / etc.)
          this.$swal(
            'Supprimé !',
            'Votre élément a été supprimé avec succès.',
            'success'
          )
        }
      })
  },




    async notifAjoutDesSdp(){
        
        this.$swal({
        icon:'success',
        title:'Ajout du Designation sdp ',
        text:"avec succès",
        timer:2500,
        showConfirmButton:false
      })
        
    },
    async notifModifSdpMainOeuvre(){
        
        this.$swal({
        icon:'success',
        title:"Modification de main d'ouvre",
        text:"avec succès",
        timer:2500,
        showConfirmButton:false
      })
        
    },
    async notifModifSdpMateriel(){
        
        this.$swal({
        icon:'success',
        title:"Modification de materiel",
        text:"avec succès",
        timer:2500,
        showConfirmButton:false
      })
        
    },
    async notifExisteDesSdp(){
        
        this.$swal({
        icon:'warning',
        title:'Cette désignation sdp ',
        text:"existe déja",
        timer:2500,
        showConfirmButton:false
      })
        
    },
    async notifExisteMainOeuvreSdp(){
        
        this.$swal({
        icon:'warning',
        title:"Cette main d'oeuvre",
        text:"existe déja",
        timer:2500,
        showConfirmButton:false
      })
        
    },
    async notifExisteMaterielSdp(){
        
        this.$swal({
        icon:'warning',
        title:'Cette materiel',
        text:"existe déja",
        timer:2500,
        showConfirmButton:false
      })
        
    },
    async notifExisteMateriauxSdp(){
        
        this.$swal({
        icon:'warning',
        title:'Cette matériaux',
        text:"existe déja",
        timer:2500,
        showConfirmButton:false
      })
        
    },
     

calculerDuree() {
    if (this.rendementJ && this.rendementJ !== 0) {
      this.dureeJ = (this.quantiteR / this.rendementJ).toFixed(2);
    } else {
      this.dureeJ = 0;
    }
  },

  calculerDureeModif() {
    if (this.modifRendementJ && this.modifRendementJ !== 0) {
      this.modifDureeJ = (this.modifQuantiteR / this.modifRendementJ).toFixed(2);
    } else {
      this.modifDureeJ = 0;
    }
  },

  /**
 * Met à jour la durée de la tache et recalcule qteTotale dans les tables liées.
 * idTache : id de la tache
 * newDuree : Number (durée en nombre)
 */
async updateRelatedQteTotale(idTache, newDuree) {
  if (!idTache) return;

  // s'assurer que newDuree est bien un Number
  const duree = Number(newDuree) || 0;

  try {
    await db.transaction('rw',
      db.taches,
      db.tache_main_oeuvre,
      db.tache_materiel,
      db.tache_materiaux,
      async () => {
        // 1) Mettre à jour la durée dans la table taches
        await db.taches.update(idTache, { dureeJ: duree });

        // 2) Mettre à jour qteTotale = qteU * duree dans chaque table liée
        await db.tache_main_oeuvre
          .where({ idTache })
          .modify((row) => {
            row.qteTotale = Number(row.qteU || 0) * duree;
          });

        await db.tache_materiel
          .where({ idTache })
          .modify((row) => {
            row.qteTotale = Number(row.qteU || 0) * duree;
          });

        await db.tache_materiaux
          .where({ idTache })
          .modify((row) => {
            row.qteTotale = Number(row.qteU || 0) * duree;
          });
      }
    );

    // Après la transaction, recharger les données affichées pour mettre à jour l'UI
    if (this.selectedTache && this.selectedTache.idTache === idTache) {
      await this.chargerTache(this.selectedTache);
    }
    await this.ListeTaches(); // si tu affiches la liste des taches ailleurs
    console.log(`updateRelatedQteTotale: mise à jour OK pour tache ${idTache}`);
  } catch (err) {
    console.error("Erreur updateRelatedQteTotale:", err);
  }
},


  async ModifierTacheSdp() {
    
  // suppose que this.selectedTache.idTache est la tache modifiée
  const id = this.selectedTache ? this.selectedTache.idTache : null;
  if (!id) return;

  // 1) Mettre à jour les champs de la tache (quantiteR, rendementJ, dureeJ, unite, coefficientK, terminee, ...)
  await db.taches.update(id, {
    idDevis: this.modifProjet,
    Num: this.modifDesignation,
    unite: this.modifUnite,
    quantiteR: Number(this.modifQuantiteR),
    rendementJ: Number(this.modifRendementJ),
    dureeJ: Number(this.modifDureeJ),
    coefficientK: Number(this.modifCoefficientK),
    terminee: this.modifTerminee
  });

  await this.notifModifSdp();

  // 2) Propager la nouvelle dureeJ dans les tables liées (qteTotale = qteU * dureeJ)
  await this.updateRelatedQteTotale(id, Number(this.modifDureeJ));

  // 3) Recharger la tâche complète (pour recalculer totalGeneral)
  const tache = await db.taches.get(id);

  // 4) Mettre à jour le prix unitaire dans la table bde
  await this.updatePrixUnitaireBde(tache);

  // 5) fermer modal, recharger UI
  this.modalModifTacheSdp = false;
  
  await this.ListeTaches();
  if (this.selectedTache) await this.chargerTache(this.selectedTache);
},



async modifierTacheMainOeuvre(){

 // Vérifier si déjà présent
  const existe = await db.tache_main_oeuvre
    .where({ 
      CodeMainOeuvre: this.ModifNomMainOeuvre, 
      idTache: this.selectedTache.idTache // ou la valeur dynamique de ta tâche
    }).first();

  if (existe && existe.idTacheM !== this.idTacheMainOeuvre) {
    await this.notifExisteMainOeuvreSdp();
    this.modalModifCompMainOeuvre = false;
    return;
  }

    await db.tache_main_oeuvre.update(this.idTacheMainOeuvre, {

    
      idTache:this.idTacheModif, 
      CodeMainOeuvre:this.ModifNomMainOeuvre, 
      qteU:this.ModifQteUmainOeuvre, 
      uniteJ:this.ModifUniteJmainOeuvre, 
      qteTotale:this.ModifQteTotaleMainOeuvre, 
      Pu:this.ModifPuMainOeuvre



  });

    this.modalModifCompMainOeuvre = false;
    await this.notifModifSdpMainOeuvre();
    await this.chargerTache(this.selectedTache);

},




async modifierTacheMateriel(){

 // Vérifier si déjà présent
  const existe = await db.tache_materiel
    .where({ 
      Code: this.ModifNomMateriel, 
      idTache: this.selectedTache.idTache // ou la valeur dynamique de ta tâche
    }).first();

  if (existe && existe.idTacheMateriel !== this.idTacheMaterielComp) {
    await this.notifExisteMaterielSdp();
    this.modalModifCompMateriel = false;
    return;
  }

    await db.tache_materiel.update(this.idTacheMaterielComp, {

    
      idTache:this.idTacheModifMateriel, 
      Code:this.ModifNomMateriel, 
      qteU:this.ModifQteUMateriel, 
      uniteJ:this.ModifUniteJMateriel, 
      qteTotale:this.ModifQteTotaleMateriel, 
      Pu:this.ModifPuMateriel



  });

    this.modalModifCompMateriel = false;
    await this.notifModifSdpMateriel();
    await this.chargerTache(this.selectedTache);

},





      // RECUPERER TRAVAUX

async RecupererTache(idTache,Designation) {
  // const trav = await db.Travaux.get(idTravaux);
  // if (trav) {
  //   this.idTravauxEnCours = trav.CodeTrav;
  //   this.modifNomTrav = trav.travaux;
  //   this.modalModifTrav = true;
  // }

  
  const tache = await db.taches.get(idTache);
  if (tache) {
    
    this.modalModifTacheSdp = true;
    this.modifProjet = tache.idDevis;
    this.modifDesignation = tache.Num;
    this.modifUnite = tache.unite,
    this.modifQuantiteR = tache.quantiteR,
    this.modifRendementJ = tache.rendementJ,
    this.modifDureeJ = tache.dureeJ,
    this.modifCoefficientK = tache.coefficientK,
    this.modifTerminee = tache.terminee
    await this.DesignationCorrespondantModif();

  }


},

async RecupererCompPrixMainOeuvre(idTacheM){


  const tacheMainOeuvre = await db.tache_main_oeuvre.get(idTacheM);
  if (tacheMainOeuvre) {
    this.modalModifCompMainOeuvre = true;
    this.idTacheMainOeuvre = idTacheM;
    this.idTacheModif = tacheMainOeuvre.idTache;
    this.ModifNomMainOeuvre = tacheMainOeuvre.CodeMainOeuvre;
    this.ModifQteUmainOeuvre = tacheMainOeuvre.qteU;
    this.ModifUniteJmainOeuvre = tacheMainOeuvre.uniteJ;
    this.ModifQteTotaleMainOeuvre = tacheMainOeuvre.qteTotale;
    this.ModifPuMainOeuvre = tacheMainOeuvre.Pu;
    


  }



},
async RecupererCompPrixMateriel(idTacheMateriel){

  const tacheMateriel = await db.tache_materiel.get(idTacheMateriel);
  if (tacheMateriel) {

      this.modalModifCompMateriel = true;
      this.idTacheMaterielComp = idTacheMateriel;
      this.idTacheModifMateriel = tacheMateriel.idTache;
      this.ModifNomMateriel = tacheMateriel.Code;
      this.ModifQteUMateriel = tacheMateriel.qteU;
      this.ModifUniteJMateriel = tacheMateriel.uniteJ;
      this.ModifQteTotaleMateriel = tacheMateriel.qteTotale;
      this.ModifPuMateriel = tacheMateriel.Pu;

  }

},

    // FORMAT

    formatQte(val) {
  if (val === null || val === undefined || isNaN(val)) {
    return '0,00';
  }
  return Number(val).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
},
    formatCoefficient(val) {
  if (val === null || val === undefined || isNaN(val)) {
    return '0,00';
  }
  return Number(val).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
},




    // FAIRE SDP DE CHAQUE DESIGNATION

  async ajouterTache(){

      // Vérifier si déjà présent
  const existe = await db.taches
    .where({ 
      idDevis: this.ProjetSelectionner, 
      Num: this.selectedDesBde.Num // ou la valeur dynamique de ta tâche
    }).first();

  if (existe) {
    await this.notifExisteDesSdp();
    this.afficherModaleSdp = false;
    return;
  }



  await db.taches.add({
    
    idDevis:this.ProjetSelectionner,
    Num:this.selectedDesBde.Num,
    unite:this.unite,
    quantiteR:Number(this.quantiteR),
    rendementJ:Number(this.rendementJ),
    dureeJ:Number(this.dureeJ),
    coefficientK:Number(this.coefficientK),
    terminee:false

    });

    this.afficherModaleSdp = false;
    await this.notifAjoutDesSdp();
    await this.ListeTaches();

},




    // AJOUT



 async ajouterMateriel() {

  const Code = parseInt(this.Code);
    // Ajouter le matériel
    await db.materiel.add({
      Code,
      Materiels: this.Materiels,
      Unite: this.Unite,
      Prix: this.Prix,
      Observation: this.Observation
    });

    // Réinitialiser formulaire
    this.Code = '';
    this.Materiels = '';
    this.Unite = '';
    this.Prix = '';
    this.Observation = '';

    await this.ListeMateriel();
    

    // await this.chargerMateriels();

    // if (navigator.onLine) {
    //   await syncToSupabase();
    // }
  },    


 async ajouterMainOeuvre() {

    await db.Mainoeuvre.add({
      nomCategorie: this.nom,
      salaireBase: parseFloat(this.SalaireBase),
      heureSupp: this.calculHeuresSupp({ salaireBase: this.SalaireBase }),
      totalPartiel: this.totalPartiel({ salaireBase: parseFloat(this.SalaireBase) }),
      chargeSalariales: this.chargesSalariales(this.totalPartiel({ salaireBase: parseFloat(this.SalaireBase) })),
      pmjFinal: this.pmjFinal({ salaireBase: parseFloat(this.SalaireBase) }),
      
    });

    this.afficherModaleMainOeuvre = false;
    await this.ListeMainOeuvre();

},



async ajouterTacheMainOeuvre() {

  // Vérifier si déjà présent
  const existe = await db.tache_main_oeuvre
    .where({ 
      CodeMainOeuvre: this.selectedMainOeuvre.CodeMainOeuvre, 
      idTache: this.selectedTache.idTache // ou la valeur dynamique de ta tâche
    }).first();

  if (existe) {
    await this.notifExisteMainOeuvreSdp();
    this.afficherModale = false;
    return;
  }

  // Ajout si pas trouvé
  await db.tache_main_oeuvre.add({
    idTache: this.selectedTache.idTache,
    CodeMainOeuvre: this.selectedMainOeuvre.CodeMainOeuvre,
    qteU: this.qteU,
    uniteJ: this.uniteJ,
    qteTotale: this.qteTotale,
    Pu: this.formatPrice(this.Pu)
  });

  this.afficherModale = false;
  this.annulerAjoutTacheMainOeuvre();
  // await this.loadData();
  await this.chargerTache(this.selectedTache);
  await this.ListeMainOeuvre();
  this.sdpMainOeuvre();
},


async ajouterTacheMateriel() {

  // Vérifier si déjà présent
  const existe = await db.tache_materiel
    .where({ 
      Code: this.selectedMateriel.Code, 
      idTache: this.selectedTache.idTache // ou la valeur dynamique de ta tâche
    }).first();

  if (existe) {
    await this.notifExisteMaterielSdp();
    this.afficherModaleMateriel = false;
    return;
  }

  // Ajout si pas trouvé
  await db.tache_materiel.add({
    idTache: this.selectedTache.idTache,
    Code: this.selectedMateriel.Code,
    qteU: this.qteUMat,
    uniteJ: this.uniteJMat,
    qteTotale: this.qteTotaleMat,
    Pu: this.PuMat
  });

  this.afficherModaleMateriel = false;
  this.annulerAjoutTacheMateriel();
  // await this.loadData();
  await this.chargerTache(this.selectedTache);
  await this.ListeMateriel();
  this.sdpMateriel();
},


async ajouterTacheMateriaux() {

  // Vérifier si déjà présent
  const existe = await db.tache_materiaux
    .where({ 
      idTache: this.selectedTache.idTache, 
      id: this.selectedMateriaux.id // ou la valeur dynamique de ta tâche
    }).first();

  if (existe) {
    await this.notifExisteMateriauxSdp();
    this.afficherModaleMateriaux = false;
    return;
  }

  // Ajout si pas trouvé
  await db.tache_materiaux.add({
    idTache: this.selectedTache.idTache,
    id: this.selectedMateriaux.id,
    qteU: this.qteUMater,
    uniteJ: this.uniteJMater,
    qteTotale: this.qteTotaleMater,
    Pu: this.PuMater
  });

  this.afficherModaleMateriaux = false;
  this.annulerAjoutTacheMateriaux();
  // await this.loadData();
  await this.chargerTache(this.selectedTache);
  await this.ListeMateriaux();
  this.sdpMateriaux();
},

annulerAjoutTacheMainOeuvre(){
  this.qteU = "",
  this.unteJ = "",
  this.qteTotale = "",
  this.Pu = ""
},

annulerAjoutTacheMateriel(){
  this.qteUMat = "",
  this.uniteJMat = "",
  this.qteTotaleMat = "",
  this.PuMat = ""
},

annulerAjoutTacheMateriaux(){
  this.qteUMater = "",
  this.uniteJMater = "",
  this.qteTotaleMater = "",
  this.PuMater = ""
},


    async test(){
        
        this.$swal({
        icon:'error',
        title:'Tsy tontosa ny famafana',
        text:"an'ireo lisitran'ny anjara",
        timer:2500,
        showConfirmButton:false
      })
        
    },

    async sdpTerminee(){
        
        this.$swal({
        icon:'success',
        title:'Ajout sdp',
        text:"Avec succès",
        timer:2500,
        showConfirmButton:false
      })
        
    },

    async sdpMainOeuvre(){
        
        this.$swal({
        icon:'success',
        title:"Ajout Main d'oeuvre",
        text:"Avec succès",
        timer:2500,
        showConfirmButton:false
      })
        
    },

    async sdpMateriel(){
        
        this.$swal({
        icon:'success',
        title:"Ajout Materiel",
        text:"Avec succès",
        timer:2500,
        showConfirmButton:false
      })
        
    },

    async sdpMateriaux(){
        
        this.$swal({
        icon:'success',
        title:"Ajout Materiaux",
        text:"Avec succès",
        timer:2500,
        showConfirmButton:false
      })
        
    },
     


    // MODALE

     SelectionMainOeuvre(item) {
    if (!item) return;
    this.Pu = item.pmjFinal;
    this.afficherModale = true;
    this.CategorieSelectionner = item.nomCategorie;
},

modaleMainOeuvre(){

  this.afficherModaleMainOeuvre = true;

},

modaleNouveauMateriel(){

  this.afficherModaleMaterielAjout = true;

},

modaleMateriaux(){

  this.afficherModaleMateriauxAjout = true;

},
     
  
  modaleSdp() {
  this.afficherModaleSdp = true;
},

  modaleMateriel(item) {
    if (!item) return;
  this.afficherModaleMateriel = true;
  this.PuMat = item.Prix;
  this.MaterielSelectionner = item.Materiels;
},

  modaleMateriaux(item) {
    if (!item) return;
  this.afficherModaleMateriaux = true;
  this.PuMater = item.Pu;
  this.MateriauxSelectionner = item.Materiaux;
},
    
     AffichageSdp:function(){
            this.afficherModaleSdp = !this.afficherModaleSdp;
        },

     AffichageMateriel:function(){
            this.afficherModaleMateriel = !this.afficherModaleMateriel;
        },

     AffichageMateriaux:function(){
            this.afficherModaleMateriaux = !this.afficherModaleMateriaux;
        },
     
     Affichage:function(){
            this.afficherModale = !this.afficherModale;
        },

     AffichageMainOeuvre:function(){

            this.afficherModaleMainOeuvre = !this.afficherModaleMainOeuvre;
        
          },

     AffichageMaterielModale:function(){

            this.afficherModaleMaterielAjout = !this.afficherModaleMaterielAjout;
        
          },

     AffichageMateriauxModale:function(){

            this.afficherModaleMateriauxAjout = !this.afficherModaleMateriauxAjout;
        
          },

    AffichageModifTacheSdp:function(){
            this.modalModifTacheSdp = !this.modalModifTacheSdp;
        }, 

    AffichageModifCompMainOeuvre:function(){

        this.modalModifCompMainOeuvre =!this.modalModifCompMainOeuvre;

    },
    AffichageModifCompMateriel:function(){

        this.modalModifCompMateriel =!this.modalModifCompMateriel;

    },
             


    // LISTE 

    async ListeProjets(){

          this.ProjetList = await db.Devis.toArray();

      },

    async ListeMainOeuvre(){

         this.MainOeuvreList = await db.Mainoeuvre.toArray();

    },

    async ListeMateriel(){

         this.MaterielList = await db.materiel.toArray();

    },

    async ListeMateriaux(){

         this.MateriauxList = await db.Materiaux.toArray();

    },


    async DesignationCorrespondant(){

      if (!this.ProjetSelectionner) {
        this.ListeDesignationProjet = [];
        return;
      }

      const bdeList = await db.bde
        .where("idDevis")               // ⚠️ champ clé étrangère vers projet
        .equals(this.ProjetSelectionner)
        .toArray();

        // 2. Vider la liste d'abord puis reconstruire
  this.ListeDesignationProjet = await Promise.all(
    bdeList.map(async (bde) => {
      const des = await db.designation.get(bde.CodeDes); // FK vers désignation
      return {
        Num: bde.Num,
        Unite:bde.Unite,
        Designation: des.Designation
      };
    })
  );


},



    async DesignationCorrespondantModif(){

      if (!this.modifProjet) {
        this.ListeDesignationProjetModif = [];
        return;
      }

      const bdeList = await db.bde
        .where("idDevis")               // ⚠️ champ clé étrangère vers projet
        .equals(this.modifProjet)
        .toArray();

        // 2. Vider la liste d'abord puis reconstruire
  this.ListeDesignationProjetModif = await Promise.all(
    bdeList.map(async (bde) => {
      const des = await db.designation.get(bde.CodeDes); // FK vers désignation
      return {
        Num: bde.Num,
        Designation: des.Designation,
        Unite:bde.Unite

      };
    })
  );


},


// CHANGEMENT AUTOMATIQUE DES VALEURS SELECTIONNER

UniteCorrespondant() {
    if (this.selectedDesBde) {
      this.unite = this.selectedDesBde.Unite; // 🔹 injection auto
    } else {
      this.unite = "";
    }
  },
async UniteCorrespondantModif() {
    if (this.modifDesignation) {
      const numBde = await db.bde.get(this.modifDesignation);
      this.modifUnite = numBde.Unite;
    }   


  },

async PuCorrespondant() {
    if (this.ModifNomMainOeuvre) {
      const tacheModifMain = await db.Mainoeuvre.get(this.ModifNomMainOeuvre);
      this.ModifPuMainOeuvre = tacheModifMain.pmjFinal;
    }
  },

async PuCorrespondantMateriel() {
    if (this.ModifNomMateriel) {
      const tacheModifMateriel = await db.materiel.get(this.ModifNomMateriel);
      this.ModifPuMateriel = tacheModifMateriel.Prix;
    }
  },

  


    async ListeTaches() {
  // On récupère toute la liste des taches
  const tacheList = await db.taches.toArray();

  // On prépare un tableau pour stocker le résultat final
  const resultat = [];

  // Pour chaque tache
  for (const tache of tacheList) {
    // On récupère le bde correspondant grâce à Num
    const bdeItem = await db.bde.get({ Num: tache.Num });

    if (bdeItem) {
      // On récupère la désignation correspondante grâce à CodeDes
      const des = await db.designation.get({ CodeDes: bdeItem.CodeDes });

      if (des) {
        // On crée un nouvel objet complet
        const elementComplet = {
          ...tache,                  // Données de tache
          Designation: des.Designation, // Nom de la désignation
          Description: des.Description  // Description de la désignation
        };

        // On ajoute dans le tableau résultat
        resultat.push(elementComplet);
      }
    }
  }

  // On met à jour la donnée pour Vue
  this.tacheList = resultat;
},


    async ListeDesignationBde(){

const listeBde = await db.bde.toArray();

         // On prépare un tableau pour stocker le résultat final
const resultat = [];

// Pour chaque élément dans sdpList
for (const bde of listeBde) {

// On récupère la désignation correspondante grâce à CodeDes
const des = await db.designation.get(bde.CodeDes);

// Si on trouve la désignation, on crée un nouvel objet
if (des) {
  const elementComplet = {
    ...bde,                 // On garde toutes les données de bde
    Designation: des.Designation,  // On ajoute la désignation
    Description: des.Description   // On ajoute la description
  };

  // On ajoute cet objet dans notre tableau résultat
  resultat.push(elementComplet);
}
}
  // console.log('Liste finale DesignationBdeList:', resultat);

  // On met à jour la donnée dans Vue pour l’utiliser ailleurs
  this.DesignationBdeList = resultat;

    },


async chargerTache(tache) {
    if (!tache) return;

  

  
  







    const Taches = await db.taches
      .where("idTache")
      .equals(tache.idTache)
      .toArray();

    const bde = await db.bde
      .where("Num")
      .equals(tache.Num)
      .toArray();

      this.CodeBdeSelectionner = bde[0].codeBde;

    const mainOeuvreTaches = await db.tache_main_oeuvre
      .where("idTache")
      .equals(tache.idTache)
      .toArray();

    const materielsTaches = await db.tache_materiel
      .where("idTache")
      .equals(tache.idTache)
      .toArray();

    const materiauxTaches = await db.tache_materiaux
      .where("idTache")
      .equals(tache.idTache)
      .toArray();

    const tacheCorrespondant = await Promise.all(Taches.map(async t => {
    
      const bdeItem = await db.bde.get(t.Num);

      if (bdeItem) {
      // On récupère la désignation correspondante grâce à CodeDes
      const des = await db.designation.get({ CodeDes: bdeItem.CodeDes });
        return { ...t, Designation: des.Designation };
    
    }
      
    }));



    const mainOeuvre = await Promise.all(mainOeuvreTaches.map(async t => {
      const mo = await db.Mainoeuvre.get(Number(t.CodeMainOeuvre));
      const total = mo.pmjFinal * t.qteTotale;
      return { ...t, nom: mo.nomCategorie, Pu: mo.pmjFinal, total };
      
    }));

    const materiels = await Promise.all(materielsTaches.map(async t => {
      const mat = await db.materiel.get(t.Code);
      const total = mat.Prix * t.qteTotale;
      return { ...t, nom: mat.Materiels, Pu: mat.Prix, total };
    }));

    const materiaux = await Promise.all(materiauxTaches.map(async t => {
      const materiaux = await db.Materiaux.get(t.id);
      const total = materiaux.Pu * t.qteTotale;
      return { ...t, nom: materiaux.Materiaux, Pu: materiaux.Pu, total };
      
    }));




    const totalMainOeuvre = mainOeuvre.reduce((sum, i) => sum + i.total, 0);
    const totalMateriels = materiels.reduce((sum, i) => sum + i.total, 0);
    const totalMateriaux = materiaux.reduce((sum, i) => sum + i.total, 0);

    this.sdp = {
      mainOeuvre,
      materiels,
      materiaux,
      tacheCorrespondant,
      totalMainOeuvre,
      totalMateriels,
      totalMateriaux,
      totalGeneral: totalMainOeuvre + totalMateriels + totalMateriaux
    };
    // --- Ici, totalGeneral est calculé, donc on peut mettre à jour BDE ---
  
  },


      async toggleTerminee(tache) {

          await db.taches.update(tache.idTache,{
          terminee: true  
          });
          await this.chargerTache();
          await this.sdpTerminee();
          await this.ListeTaches();
          await this.updatePrixUnitaireBde(tache);
      // this.loadTaches()
    },


  // MODIFICATION

  async updatePrixUnitaireBde(tache) {
  if (!tache) return;

  // Récupérer l'élément BDE correspondant à la tâche
  const bdeItem = await db.bde.get({ Num: tache.Num });

  if (bdeItem) {
    // Mettre à jour le prix unitaire avec le total général de sdp
    await db.bde.update(bdeItem.Num, {
      Pu: this.sdp.totalGeneral
    });

    console.log("Prix unitaire mis à jour dans BDE :", this.sdp.totalGeneral);
  } else {
    console.warn("BDE introuvable pour cette tâche :", tache.Num);
  }
},


    // AJOUT




  tauxHoraire(cat) {
      return cat.salaireBase / this.heures.base;
    },


  // CALCULE HEURE SUPPLEMENTAIRE

    calculHeuresSupp(cat) {
      const taux = this.tauxHoraire(cat);
      const hs25 = this.heures.hs25 * taux * 0.25;
      const hs50 = this.heures.hs50 * taux * 0.5;
      const hs100 = this.heures.hs100 * taux * 1.0;
      return hs25 + hs50 + hs100;
    },

    // CALCULE TOTAL PARTIEL

    totalPartiel(cat) {
      return cat.salaireBase + this.calculHeuresSupp(cat);
    },

    // CALCULE CHARGES SALARIALES

    chargesSalariales(total) {
      return total * (this.charges.salariales / 100);
    },

    // CALCULE PRIX MOYENS DE LA JOURNEE

    pmjFinal(cat) {
      const total = this.totalPartiel(cat);
      const charges = this.chargesSalariales(total);
      return total + charges;
    },


    
    async ajouterMainOeuvreA() {

    if (!this.selectedMainOeuvre) {
      alert("Veuillez choisir une main d'œuvre");
      return;
    }

    // Création de l'objet à insérer
    const newItem = {
      id: Date.now(), // ou autre identifiant
      nom: this.selectedMainOeuvre.nomCategorie,
      qteU: 1, // valeur par défaut
      uniteJ: "jour", // valeur par défaut
      qteTotale: 1, // valeur par défaut
      Pu: this.selectedMainOeuvre.pmjFinal,
      total: this.selectedMainOeuvre.pmjFinal
    };

    // Ajout dans le tableau mainOeuvre
    this.sdp.mainOeuvre.push(newItem);

    // Mise à jour du total main d'œuvre
    this.sdp.totalMainOeuvre = this.sdp.mainOeuvre.reduce((sum, mo) => sum + mo.total, 0);

    // Mise à jour du total général
    this.sdp.totalGeneral = this.sdp.totalMainOeuvre + this.sdp.totalMateriels;

    // Réinitialiser le select
    this.selectedMainOeuvre = null;
  },


    generatePDF() {
    const doc = new jsPDF();

    // Colonnes du tableau
    const columns = [
      { header: "Composante du prix", dataKey: "composante" },
      { header: "Qté unitaire", dataKey: "qteU" },
      { header: "Unité ou jour", dataKey: "uniteJ" },
      { header: "Quantité totale", dataKey: "qteTotale" },
      { header: "Prix unitaire sec", dataKey: "pu" },
      { header: "Total", dataKey: "total" }
    ];

    // Fonction pour formater prix (comme dans ton code)
    const formatPrice = this.formatPrice;
    const formatTotal = this.formatTotal;

    // Construire les lignes du tableau PDF
    const rows = [];

    // -- Section Main d'œuvre (titre)
    rows.push({
      composante: "Main d'œuvre",
      qteU: "",
      uniteJ: "",
      qteTotale: "",
      pu: "",
      total: "",
      isSection: true
    });

    // -- Lignes mainOeuvre
    this.sdp.mainOeuvre.forEach(item => {
      rows.push({
        composante: item.nom,
        qteU: item.qteU,
        uniteJ: item.uniteJ,
        qteTotale: item.qteTotale,
        pu: formatPrice(item.Pu),
        total: formatTotal(item.total)
      });
    });

    // -- Total partiel mainOeuvre
    rows.push({
      composante: "Total partiel",
      qteU: "",
      uniteJ: "",
      qteTotale: "",
      pu: "",
      total: formatTotal(this.sdp.totalMainOeuvre),
      isSubtotal: true
    });

    // -- Section Matériels (titre)
    rows.push({
      composante: "Matériels",
      qteU: "",
      uniteJ: "",
      qteTotale: "",
      pu: "",
      total: "",
      isSection: true
    });

    // -- Lignes matériels
    this.sdp.materiels.forEach(item => {
      rows.push({
        composante: item.nom,
        qteU: item.qteU,
        uniteJ: item.uniteJ,
        qteTotale: item.qteTotale,
        pu: formatPrice(item.Pu),
        total: formatTotal(item.total)
      });
    });

    // -- Total partiel matériels
    rows.push({
      composante: "Total partiel",
      qteU: "",
      uniteJ: "",
      qteTotale: "",
      pu: "",
      total: formatTotal(this.sdp.totalMateriels),
      isSubtotal: true
    });

    // -- Total général
    rows.push({
      composante: "Total des déboursés sec",
      qteU: "",
      uniteJ: "",
      qteTotale: "",
      pu: "",
      total: formatTotal(this.sdp.totalGeneral),
      isTotal: true
    });

    // -- Ligne Prix unitaire de règlement
    rows.push({
      composante: "Prix unitaire de règlement",
      qteU: "",
      uniteJ: "",
      qteTotale: "",
      pu: "",
      total: formatPrice(this.sdp.totalGeneral),
      isTotal: true
    });

    // Utiliser autoTable pour générer le tableau
    doc.autoTable({
      head: [columns.map(c => c.header)],
      body: rows.map(row => columns.map(c => row[c.dataKey] || "")),

      didParseCell: (data) => {
        const row = rows[data.row.index];

        // Style pour les sections (fusionner toutes les colonnes sur la 1ère colonne)
        if (row.isSection) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [220, 220, 220]; // gris clair
          if (data.column.index > 0) {
            data.cell.styles.fillColor = [255, 255, 255];
            data.cell.text = "";
          }
          if (data.column.index === 0) {
            // Centrer le titre section
            data.cell.styles.halign = "center";
            data.cell.colSpan = columns.length;
          }
        }

        // Style pour les sous-totaux
        if (row.isSubtotal) {
          if (data.column.index === 0) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.halign = "right";
          }
          if (data.column.index === columns.length - 1) {
            data.cell.styles.fontStyle = "bold";
          }
        }

        // Style pour les totaux finaux
        if (row.isTotal) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [200, 255, 200]; // vert clair
          if (data.column.index === 0) {
            data.cell.styles.halign = "left";
          }
        }
      },

      margin: { top: 20 },
      styles: { fontSize: 10 }
    });

    // Sauvegarder ou afficher le PDF
    doc.save("sdp.pdf");
  },


    formatTotal(val) {
      return val ? val.toLocaleString('fr-FR', { minimumFractionDigits: 2,maximumFractionDigits: 2 }) : '0,00'
    },
    
    formatPrice(val) {
      

      let multiple = 10;
  if (val >= 1000000) {
    multiple = 10000;
  } else if (val >= 100000) {
    multiple = 1000;
  } else if (val >= 10000) {
    multiple = 100;
  }

  // Arrondir vers le bas au multiple choisi
  const arrondi = Math.round(val / multiple) * multiple;

  // 4. Formater avec 2 décimales en français
  return arrondi.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

    },

    async loadData() {
  const mainOeuvreTaches = await db.tache_main_oeuvre.toArray()
  const materielsTaches = await db.tache_materiel.toArray()

  const mainOeuvre = await Promise.all(mainOeuvreTaches.map(async t => {
    const mo = await db.Mainoeuvre.get(Number(t.CodeMainOeuvre))
    const total = mo.pmjFinal * t.qteTotale
    return {
      id: t.idTacheM,
      nom: mo.nomCategorie,
      qteU: t.qteU,
      uniteJ: t.uniteJ,
      qteTotale: t.qteTotale,
      Pu: mo.pmjFinal,
      total
    }
  }))

  const materiels = await Promise.all(materielsTaches.map(async t => {
    const mat = await db.materiel.get(t.Code)
    const total = mat.Prix * t.qteTotale
    return {
      id: t.idTacheMateriel,
      nom: mat.Materiels,
      qteU: t.qteU,
      uniteJ: t.uniteJ,
      qteTotale: t.qteTotale,
      Pu: mat.Prix,
      total
    }
  }))

  // Calcul des totaux avec une boucle for (pas de reduce)
  let totalMainOeuvre = 0
  for (const item of mainOeuvre) {
    totalMainOeuvre += item.total
  }

  let totalMateriels = 0
  for (const item of materiels) {
    totalMateriels += item.total
  }

  this.sdp = {
    mainOeuvre,
    materiels,
    totalMainOeuvre,
    totalMateriels,
    totalGeneral: totalMainOeuvre + totalMateriels
  }
}


  }
 
}
</script>

<style scoped>

/* MODALE */

 .bloc-modale{

        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    
    }
    .overlay{
        background: rgba(0, 0, 0, 0.295);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    transition: backdrop-filter 0.3s ease, background 0.3s ease;
    /* AO AMBADIKAN'NY MODALE NY PLASINY */
    z-index: 9998;
    }
    .modale{
        background: linear-gradient(200deg,#02303065,#557497,#00bbd49a);
        color: #333;
        padding: 35px;
        position: fixed;
        /* AMBONY NY PLASINY */
        z-index: 10000;

    }
    .btn-modale{
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .styleTexte{
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
            color:white;
            text-align: center;
        }
    .form-label{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: white;
            font-size: 16px;
    }
    .btn-primary{
        font-size: 20px;
    }


/* Fond global */
body {
  background: linear-gradient(135deg, #a80c0c, #0b587cb0);
  min-height: 100vh;
  margin: 0;
}

/* Table dans un bloc clair */
.table-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  margin: 30px auto;
  max-width: 95%;
}

/* Style table Bootstrap amélioré */
.sdp-table {
  width: 100%;
}


.sdp-table thead th {
  background-color: #1e8cbe;
  color: white;
  text-align: center;
}

.sdp-table tbody tr:nth-child(even) {
  background-color: rgba(0, 88, 124, 0.05);
}

.sdp-table tbody tr:hover {
  background-color: rgba(0, 88, 124, 0.15);
  transition: background 0.3s;
}



/* Style table Bootstrap designation */
.sdp-tableDesignation {
  width: 100%;
}

.sdp-tableDesignation thead th {
  background: linear-gradient(700deg, #242222f8, #1e2020b0);
  color: white;
  text-align: center;
}

.sdp-tableDesignation tbody tr:nth-child(even) {
  background-color: rgba(0, 88, 124, 0.05);
}

.sdp-tableDesignation tbody tr:hover {
  background-color: rgba(0, 88, 124, 0.15);
  transition: background 0.3s;
}


/* bouton dans sweetalert */

.same-width-btn{

  width: 120px;
  text-align: center;


}

.message {
  margin: 0.5em 0;
  text-align: left;
  white-space: normal;      /* 🟢 retour à la ligne automatique */
  word-break: break-word;   /* 🟢 casse les mots trop longs */
  overflow: visible;        /* 🟢 pas de masquage du texte */
}



.chatbot-container {
  background: linear-gradient(200deg, #f9fbfc, #dbe7eb);
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px;
}

.chatbot-header {
  background: rgba(0, 123, 138, 0.1);
  border-radius: 15px;
  padding: 10px;
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 15px;
  scroll-behavior: smooth;
  max-height: 350px;
}

.message {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;
}

.message-bubble {
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 85%;
  line-height: 1.4;
}

.message.user .message-bubble {
  background: linear-gradient(200deg, #007b8a, #0d8c9a);
  color: #fff;
  align-self: flex-end;
}

.message.assistant .message-bubble {
  background: #ffffff;
  color: #333;
  align-self: flex-start;
}

.chatbot-input input {
  border-radius: 50px;
  padding: 10px 15px;
  border: 1px solid #cfd8dc;
  transition: 0.2s;
}

.chatbot-input input:focus {
  border-color: #007b8a;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 138, 0.25);
}

.chatbot-input button {
  background-color: #007b8a;
  border: none;
  color: white;
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chatbot-input button:hover {
  background-color: #056e7a;
}

/* Animation d'apparition */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scroll personnalisé */
.chatbot-messages::-webkit-scrollbar {
  width: 6px;
}
.chatbot-messages::-webkit-scrollbar-thumb {
  background: #007b8a;
  border-radius: 10px;
}
.chatbot-messages::-webkit-scrollbar-track {
  background: transparent;
}




</style>
