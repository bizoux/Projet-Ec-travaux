<template>
  <v-app>
    
  <div style="background: linear-gradient(200deg,#237979,#557497,#00bcd4);overflow: hidden;">

    <br>
    
      <center>
        <div style="width: 400px;display: flex;gap: 10px;margin: 5px;">
                  <input type="text" placeholder="anarana" class="form-control input-transparent" v-model="Fikarohana"/>
                  <!-- <button @click="Karoka()" class="btn btn-secondary">Fikarohana</button> -->
                  <router-link to="/" class="btn btn-primary">Hiverina</router-link>
        </div>
        </center>
      
        <!-- Valiny t@ fikarohana Hita-->  
      <center>
      <div style="width: 900px;">
          
        <div class="alert alert-danger" v-if="this.Fikarohana && MikarokaAnarana.length == 0">
          <span style="font-size: larger;">Ialana tsiny tsy ao anaty tabilao io anarana io Tompoko!</span>
        </div>
      </div>
      </center>
      
    
    
    
      <!-- Valiny t@ fikarohana tsy Hita-->  
      <center>
        <div style="width: 900px;">
            
          <div class="alert alert-success" v-if="this.Fikarohana && MikarokaAnarana.length > 0">
            <span style="font-size: larger;">Miisa {{MikarokaAnarana.length}} ny anaran'i {{ Fikarohana }}.</span> 
          </div>
        </div>
      </center>
      
      
      
      
    <div>
      <br>
      <br>
      <center>
      
      
      <div class="aligner" v-if="MikarokaAnarana.length">
        <h2 style="color: white;">FIANARANTSOA &nbsp;TSARAMANDROSO<h5 style="margin-top: 10px;"><h5>Anjara Fitondràna Micro</h5>------------<p style="color: white;">{{ formatDateMoisAnnee(IlayDaty) }}</p></h5></h2>
        
      </div>
      
      
      
      <table class="table-striped" v-if="MikarokaAnarana.length">
          <thead>
              
              <tr>
      
              <th class="daty table-dark" style="font-size: 23px;"><center>DATY</center></th>
              <th class="Mpitondra table-dark" style="font-size: 23px;"><center>MPITONDRA MICRO</center></th>
              
          
              </tr>
              
          </thead>
      
          <tbody>
            <tr style="background-color: rgb(79, 106, 136);color: white;">
              <td></td>
              <td><b style="font-size: 22px;">ORA</b><b style="margin-left: 40px;font-size: 22px;">Tapany Voalohany</b><b style="margin-left: 100px;font-size: 22px;">Tapany Faharoa</b></td>
            </tr>
              <tr v-for="Anjara in MikarokaAnarana" v-bind:key="Anjara.idAnjara">
    
                                                
                                                <!-- DATY FITSIDIHAN'NY MPIANDRAIKITRA-->
                  
                  <td class="toerana" style="font-size: 21px;">
                    <div v-if='formatDate(Anjara.Daty)' >{{formatDate(Anjara.Daty)}}</div>
                  </td>
                  
                  
                                                <!-- ANJARA ALAHADY -->
                  <td class="toerana">
    
                    <div v-if='formatDateJour(Anjara.Daty) == "Alahady"' style="font-size: 21px;">
                    
    
                      <b style="float: left;">09:45</b>
                      <b style="float: left;margin-left: 40px;">{{Anjara.Anarana1}} & {{Anjara.Anarana2}}</b>
                      <b style="float: right;">  {{Anjara.Anarana3}} & {{Anjara.Anarana4}}</b>
                      
                      
                    </div>
                    
                    
                                                <!-- ANJARA Alakamisy -->
    
                    <div v-else-if='formatDateJour(Anjara.Daty) == "Alakamisy"' style="font-size: 21px;color:rgba(40,127,186);">
                    
                      <b style="float: left;">18:15</b>
                      <b style="float: left;margin-left: 40px;">{{Anjara.Anarana1}} & {{Anjara.Anarana2}}</b>
                      <b style="float: right;">  {{Anjara.Anarana3}} & {{Anjara.Anarana4}}</b>
                      
                      
                                          
                    </div>
    
                  
                  </td>
    
                                                <!-- BOUTON FANAVAOZANA NY ANJARA -->
                  <td class="d-flex">
                      <button class="btn btn-success" @click="MampisehoModale(Anjara.idAnjara)"><font-awesome-icon icon="edit"></font-awesome-icon></button> 
                      &nbsp;<button class="btn btn-danger" @click="HamafaAnjara(Anjara.idAnjara,Anjara.Daty)"><font-awesome-icon icon="trash"></font-awesome-icon></button>  
                  </td>              
              </tr>
          </tbody>
    
      </table>
    
    <p v-if="MikarokaAnarana.length">Mazotoa rahalahy</p>
    </center>
    
    </div>
      
      
                                  <!-- BOUTON RAHA HAKA AZY NA HAMAFA AN'ILAY ANJARA -->
    
      <center v-if="MikarokaAnarana.length">
        <div>
          <button @click="genererPdf()" class="btn btn-secondary">Générer en pdf</button>
        </div>
        <br>
        <button class="btn btn-danger" @click="Hamafa()">Hamafa azy rehetra</button>
          
      </center>
          
          
                                  <!-- CHARGEMENT -->
              <div class="row">
          
                  <div class="col-md-4 chargement">
          
                  </div>
                  
                  
                  <div class="col-md-4 chargementImage">
                  <!-- Chargement de données -->
                    <br><br>
                    <img src="../image/loader-unscreen.gif" alt="imageChargement" v-if="this.loading">
                  </div>
                  
                  <div class="col-md-4 chargement">
          
                  </div>
          
          
              </div>
              
    
    </div>          
    
    <!-- MODALE AN'ILAY FANAOVANA FANOVANA ANJARA -->
    <modaleFanavaozanaAnjara v-bind:mampisehoModaleFanavaozana="mampisehoModaleFanavaozana" v-bind:HesorinaNaTsia="HesorinaNaTsia" v-bind:AnjaraOvana="AnjaraOvana"></modaleFanavaozanaAnjara> 
    
  </v-app>


</template>

<script>
import axios from "axios";
import moment from 'moment'; 
import jsPDF from "jspdf";
import "jspdf-autotable";
import modaleFanavaozanaAnjara from "./HanavaoAnjara.vue";

export default {
  name:"HavoakaPdf",
  components:{
    modaleFanavaozanaAnjara
  },
  data() {
    return {

      listaRahalahyRehetra:[],
      Fikarohana:'',
      mampisehoModaleFanavaozana:false,
      AnjaraOvana:this.$route.query.id,
      DatyAnjara:[],
      IlayDaty:''
      
    };
  },


  computed:{
   


   formattedList() {
   return this.listaRahalahyRehetra.map(item => ({
     ...item,
     Anarana1: item.Anarana1 === 'Celestin' ? 'Célestin' : item.Anarana1,
     Anarana2: item.Anarana2 === 'Celestin' ? 'Célestin' : item.Anarana2,
     Anarana3: item.Anarana3 === 'Celestin' ? 'Célestin' : item.Anarana3,
     Anarana4: item.Anarana4 === 'Celestin' ? 'Célestin' : item.Anarana4,
   }));
 },
 MikarokaAnarana() {
   return this.formattedList.filter(KarokaAnjara => {
     return (
       KarokaAnjara.Anarana1.toLowerCase().includes(this.Fikarohana.toLowerCase()) ||
       KarokaAnjara.Anarana2.toLowerCase().includes(this.Fikarohana.toLowerCase()) ||
       KarokaAnjara.Anarana3.toLowerCase().includes(this.Fikarohana.toLowerCase()) ||
       KarokaAnjara.Anarana4.toLowerCase().includes(this.Fikarohana.toLowerCase())
     );
   });
 },


     },

         mounted:function(){
            this.IreoMananaAnjara();
            this.IreoDaty();
            this.HakaDatyAnjara();
        },


  methods: {

                            /* HAMAFA ANJARA */

    AnjaraHoFafana(idAnjara){
      axios.delete("http://localhost:3000/AnjaraHoFafana/"+idAnjara).then(function(){
        return window.location.reload();
      });
    },


                              /* HAMAFA ANJARA IRAY */

    HamafaAnjara(idAnjara,Daty){
      
      this.$swal({
        title:"Tena vonona hamafa ny anjara tamin'ny "+this.formatDate(Daty)+" ve ianao?",
        icon:'warning',
        showCancelButton:true,
        confirmButtonText:'#3085d6',
        cancelButtonColor:'#d33',
        confirmButtonText:'Eny',
        cancelButtonText:'Tsia'
      }).then((result)=> {
        if(result.isConfirmed){
          this.$swal(
            {
              icon:'success',
              title:"Voafafa soamatsara ny anjara tamin'ny "+this.formatDate(Daty),
              text:'Mirary soa',
              timer:2500,
              showConfirmButton:false
            }
          )
          this.AnjaraHoFafana(idAnjara);

        }
        else
        {
          
          this.$swal({
          icon:'error',
          title:"Tsy tontosa ny famafana ny anjara",
        text:"echec",
        timer:2500,
        showConfirmButton:false
      }
    )

      

        }
      })
    },


                    /* MAMPISEHO MODALE */


    MampisehoModale(idAnjara){
      this.$router.push({ query:{id:idAnjara}})
      this.mampisehoModaleFanavaozana =! this.mampisehoModaleFanavaozana;
    },
    // MAMPISEHO
    HesorinaNaTsia:function(){

this.mampisehoModaleFanavaozana = !this.mampisehoModaleFanavaozana;

},


                          
                    /* HAMPISEHO NY DATY */

    formatDate(date){
          // Tableaux de traduction pour les jours et les mois en malgache
    const jours = ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'Alakamisy', 'Zoma', 'Sabotsy'];
    const mois = ['Janoary', 'Febroary', 'Martsa', 'Aprily', 'Mey', 'Jona', 'Jolay', 'Aogositra', 'Septambra', 'Oktobra', 'Novambra', 'Desambra'];

    // Convertir la date en objet Date
    const dateObj = new Date(date);

    // Extraire le jour de la semaine, le jour du mois, le mois et l'année
    const jourSemaine = jours[dateObj.getDay()];
    const jourMois = dateObj.getDate();
    const moisAnnee = mois[dateObj.getMonth()];
    const annee = dateObj.getFullYear();

    // Construire la date formatée en malgache
    return `${jourSemaine} ${jourMois} ${moisAnnee} ${annee}`;
        },


                  /* HAKA DATY HERINANDRO */

        formatDateJour(date){
          // Tableaux de traduction pour les jours et les mois en malgache
    const jours = ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'Alakamisy', 'Zoma', 'Sabotsy'];
    const mois = ['Janoary', 'Febroary', 'Martsa', 'Aprily', 'Mey', 'Jona', 'Jolay', 'Aogositra', 'Septambra', 'Oktobra', 'Novambra', 'Desambra'];

    // Convertir la date en objet Date
    const dateObj = new Date(date);

    // Extraire le jour de la semaine, le jour du mois, le mois et l'année
    const jourSemaine = jours[dateObj.getDay()];
    const jourMois = dateObj.getDate();
    const moisAnnee = mois[dateObj.getMonth()];
    const annee = dateObj.getFullYear();

    // Construire la date formatée en malgache
    return `${jourSemaine}`;
        },
        formatJour(date){
          // Tableaux de traduction pour les jours et les mois en malgache
    const jours = ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'Alakamisy', 'Zoma', 'Sabotsy'];
    const mois = ['Janoary', 'Febroary', 'Martsa', 'Aprily', 'Mey', 'Jona', 'Jolay', 'Aogositra', 'Septambra', 'Oktobra', 'Novambra', 'Desambra'];

    // Convertir la date en objet Date
    const dateObj = new Date(date);

    // Extraire le jour de la semaine, le jour du mois, le mois et l'année
    const jourSemaine = jours[dateObj.getDay()];
    const jourMois = dateObj.getDate();
    const moisAnnee = mois[dateObj.getMonth()];
    const annee = dateObj.getFullYear();

    // Construire la date formatée en malgache
    return `${jourMois}`;
        },


          /* HAKA VOLANA SY TAONA */

        formatDateMoisAnnee(date){
          // Tableaux de traduction pour les jours et les mois en malgache
    const jours = ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'Alakamisy', 'Zoma', 'Sabotsy'];
    const mois = ['Janoary', 'Febroary', 'Martsa', 'Aprily', 'Mey', 'Jona', 'Jolay', 'Aogositra', 'Septambra', 'Oktobra', 'Novambra', 'Desambra'];

    // Convertir la date en objet Date
    const dateObj = new Date(date);

    // Extraire le jour de la semaine, le jour du mois, le mois et l'année
    const jourSemaine = jours[dateObj.getDay()];
    const jourMois = dateObj.getDate();
    const moisAnnee = mois[dateObj.getMonth()];
    const annee = dateObj.getFullYear();

    // Construire la date formatée en malgache
    return `${moisAnnee} ${annee}`;
        },
        formatDateJourMois(date){
          // Tableaux de traduction pour les jours et les mois en malgache
    const jours = ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'Alakamisy', 'Zoma', 'Sabotsy'];
    const mois = ['Janoary', 'Febroary', 'Martsa', 'Aprily', 'Mey', 'Jona', 'Jolay', 'Aogositra', 'Septambra', 'Oktobra', 'Novambra', 'Desambra'];

    // Convertir la date en objet Date
    const dateObj = new Date(date);

    // Extraire le jour de la semaine, le jour du mois, le mois et l'année
    const jourSemaine = jours[dateObj.getDay()];
    const jourMois = dateObj.getDate();
    const moisAnnee = mois[dateObj.getMonth()];
    const annee = dateObj.getFullYear();

    // Construire la date formatée en malgache
    return `${jourSemaine} ${jourMois} ${moisAnnee} ${annee}`;
        },

        // LISITRA IREO MANANA ANJARA 

            IreoMananaAnjara:function(){
            axios.get("http://localhost:3000/Anjara").then((response)=>{
                this.listaRahalahyRehetra=response.data;
                
            })
        },
        // LISITRA IREO DATY 
        IreoDaty:function(){
            axios.get("http://localhost:3000/Anjara").then((response)=>{
                this.DatyAnjara=response.data;
                
            })
        },

        // LISITRA IREO DATY 
        HakaDatyAnjara:function(){
            axios.get("http://localhost:3000/Anjara").then((response)=>{
                this.IlayDaty=response.data[0].Daty;
                
            })
        },
            
        

        // HAMAFA NY LISITRA REHETRA

        HamafaAzyRehetra(){
      axios.delete("http://localhost:3000/HamafaAnjara").then(function(){
        return window.location.reload();
      });
    },
        
    Hamafa(){


      this.$swal({
        title:"Tena hamafa an'ireo lisitran'ny anjara ve ianao?",
        icon:'warning',
        showCancelButton:true,
        confirmButtonText:'#3085d6',
        cancelButtonColor:'#d33',
        confirmButtonText:'Eny',
        cancelButtonText:'Tsia'
      }).then((result)=> {
        if(result.isConfirmed){
          var mdpAdmin="Jaffrelot";
          var mdpEntrer=prompt("Saisissez votre mot de passe");
          if(mdpEntrer == mdpAdmin){

              this.$swal(
            {
              icon:'success',
              title:'Voafafa soamatsara',
              text:'ireo lisitra ny anjara',
              timer:2500,
              showConfirmButton:false
            }
          ),
          this.HamafaAzyRehetra();

          }
          else
          {
            
            this.$swal(
            {
              icon:'error',
              title:'Tsy tontosa ny famafana',
              text:"an'ireo lisitra ny anjara",
              timer:2500,
              showConfirmButton:false
            }
          )
         
            
          }
          
        
        }
        else
        {
          
          this.$swal({
        icon:'error',
        title:'Tsy tontosa ny famafana',
        text:"an'ireo lisitran'ny anjara",
        timer:2500,
        showConfirmButton:false
      }
          )
          
        }
      })
},



              /* HAMOKA AZY HO PIRINTY */

genererPdf() {
  const doc = new jsPDF("landscape", "mm", "a4");

  // Obtenir la largeur totale de la page
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Texte à centrer
  const text = "FIANARANTSOA TSARAMANDROSO";
  const Anjara = "Anjara Fitondràna Micro";
  const tiret = "--------------------------------";
  // const Volana = this.formatDateMoisAnnee(DatyAnjara);

  const Volana = this.DatyAnjara.map((item, index) => {
  const Daty = this.formatDateMoisAnnee(item.Daty);
  return [
    Daty
  ];
});


                          /* STYLE TEXTE 1 */

  // Utiliser alignement avec la position dynamique pour centrer
  doc.setFontSize(18); // Définir la taille de police
  doc.setFont("helvetica", "bold");
  doc.text(text, pageWidth / 2, 18, { align: "center" }); // Centrer horizontalement au milieu de la page
                          

                          /* STYLE TEXTE 2 */

  // Utiliser alignement avec la position dynamique pour centrer
  doc.setFontSize(15); // Définir la taille de police
  doc.setFont("helvetica", "normal");
  doc.text(Anjara, pageWidth / 2, 26, { align: "center" }); // Centrer horizontalement au milieu de la page

    
                          /* STYLE TEXTE 3 */

  // Utiliser alignement avec la position dynamique pour centrer
  doc.setFontSize(15); // Définir la taille de police
  doc.setFont("helvetica", "normal");
  doc.text(tiret, pageWidth / 2, 29, { align: "center" }); // Centrer horizontalement au milieu de la page
    
                          /* STYLE TEXTE 4 */

  // Utiliser alignement avec la position dynamique pour centrer
  doc.setFontSize(15); // Définir la taille de police
  doc.setFont("helvetica", "normal");
  doc.text(Volana[0], pageWidth / 2, 33, { align: "center" }); // Centrer horizontalement au milieu de la page



  // Double header : En-têtes imbriquées
  const headers = [
    [
      { content: "DATY"},
      { content: "",colSpan:1},
      { content: "MPITONDRA MICRO", colSpan: 2 },
    ],
    ["","ORA","Tapany Voalohany", "Tapany Faharoa"],
  ];

  const rows = this.listaRahalahyRehetra.map((item, index) => {
  const Daty = this.formatDate(item.Daty);
  const jour = this.formatJour(item.Daty);
  
  const Ora = Daty.includes("Alahady") ? "09:45" : "18:15"; // Condition sur la date
    return [
    Daty,
    Ora,
    item.Anarana1 + " & " + item.Anarana2,
    item.Anarana3 + " & " + item.Anarana4,
  ];
  
});     


  // Configuration du tableau
  doc.autoTable({
    head: headers,
    body: rows,

    didDrawCell: function (data) {
      // Vérifie si la cellule appartient à la deuxième ligne de l'en-tête
      if (data.section === "head" && data.row.index === 1) {
        // Change le fond en bleu
        doc.setFillColor(79, 106, 136); // Couleur bleu
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "F");

        // Change la couleur du texte
        doc.setTextColor(255, 255, 255);

        // Redessine le texte, centré
        const textX = data.cell.x + data.cell.width / 2; // Centrage horizontal
        const textY = data.cell.y + data.cell.height / 2 + 2; // Centrage vertical
        doc.text(data.cell.text, textX, textY, { align: "center" });
      }
    },


    startY: 40, // Position initiale du tableau
    theme: "grid",
    headStyles: {
      fillColor: [26, 189, 156],
      textColor: [255, 255, 255], // Blanc
      fontSize: 16,
      halign: "center"
    },

    styles: {
      fontSize: 14,
      halign: "center",
    },
    bodyStyles: {
      fillColor: [247, 249, 251], // Fond gris clair par défaut
      textColor: [0, 0, 0], // Texte noir
      cellPadding: 4
    },
    alternateRowStyles: {
      fillColor: [209, 221,239], // Couleur pour les lignes alternées
    },

    columnStyles: {
      0: { halign: "center" }, // Colonne "DATY" centré
    },
    
    margin: { top: 10, left: 10, right: 10 },
  });



                          // TEXTE FIN DU TABLEAU

  // Obtenir la position de la fin du tableau
  const finalY = doc.lastAutoTable.finalY || 180; // Dernière position du tableau généré

  // Ajouter le texte centré en bas
  doc.setTextColor(255, 0, 0); // Rouge
  doc.setFontSize(12);
  doc.text("Mazotoa rahalahy", pageWidth / 2, finalY + 10, { align: "center" });




  // Sauvegarder le fichier
  doc.save("Mpitondra_Micro_"+Volana[0]+".pdf");
}

  },
};
</script>

<style scoped>

.table-dark{
  background-color: rgba(26, 189, 156);
  color:white;
}      
.table-striped tbody tr:nth-of-type(odd){  
  background-color: rgb(247, 249, 251);
}

.table-striped tbody tr:nth-of-type(even){
  background-color: rgb(209, 221,239);
  color: rgb(0, 0, 0);
}

h4{
  font-weight:bold;
}
.aligner{
  display:flex;
  justify-content:center;
  gap:12px;
  padding-left:150px;
  padding-top: 20px;
  padding-bottom: 10px;
  border:1px solid rgb(230, 230, 230);
  /* border-right:1px solid rgb(230, 230, 230); */
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  width:1350px;
}

td{
      border-right:1px solid rgb(230, 230, 230);
      border-left:1px solid rgb(230, 230, 230);
      border-bottom:1px solid rgb(230, 230, 230);
      font-family:normal;
      padding: 12px;
    }
.table-dark{
      padding:6px;
    }
.toerana{
      text-align:center;
      font-size: 17px;
    }
.daty,.Mpitondra{
    width:750px;
}
span{
  font-style:italic;
}
p{
  color:red;
  font-style:italic;
}

table{
      border:1px solid rgb(230, 230, 230);;
      width:1350px;      
}

          /* STYLE INPUT RECHERCHE */

.input-transparent::placeholder{
  color: #ffffffad;
}

.input-transparent:focus {
  outline: none;
  background: rgba(255, 255, 255, 100);
  text-shadow: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><path fill='%238C92A0' d='M13.22 14.63a8 8 0 1 1 1.41-1.41l4.29 4.29a1 1 0 1 1-1.41 1.41l-4.29-4.29zm-.66-2.07a6 6 0 1 0-8.49-8.49 6 6 0 0 0 8.49 8.49z'></path></svg>");
  background-repeat: no-repeat;
background-position: 10px 10px;
background-size: 20px 20px;
}

.bg-gradient{
  padding: 40px;
  margin-left: -40px;
  margin-right: -40px;
  width: 350px;
  background-color:rgba(42, 123, 189, 0.514);
}


.input-transparent{
font-size: 16px;
line-height: 1.5;
text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
border: none;
background: rgba(255, 255, 255, 0.2);
background-image: url("../image/recherche.png");
background-repeat: no-repeat;
background-position: 10px 10px;
background-size: 20px 20px;
border-radius: 5px;
/* width: 300px; */
padding: .5em 1em .5em 2.5em;
margin-bottom: 0px;
}


</style>
