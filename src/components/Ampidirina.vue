<template>
  <v-app>
    
    <!-- <v-toolbar color="blue" elevation="4" height="84">
      <template #title>
        <h2 class="text-h4 font-weight-bold"><font-awesome-icon icon="file-alt" spin/>&nbsp;&nbsp;Anjara Fitondrana Micro</h2>
      </template>
    
    </v-toolbar> -->

    <!-- NAVIGATION -->
    <div class="container-fluid couleurContainer">
    
    
    
    <div class="row ligne1">
    
    
    </div>
    
    
    <!-- LIGNE 3 -->
    <div class="row ligne3Col3">
    
    
    <div class="col-md-12">
    
      <!-- Contenu de la page Ajout du déclaration-->
      
      
      <div class="formulaire">
      
        <form @submit.prevent="HampiditraAnjara(),MessageAjout()"> 
          <center>
     
            <br><br>
            <div class="form-group" style="width: 260px; height: 220px;padding:8px;background-color: rgba(206, 203, 203, 0.5);border-radius: 10px;">
    
              <div class="retour">
                <router-link to="/HavoakaPdf">Hijery ny anjara</router-link><br>
                
                <router-link to="/Rahalahy">Hijery ny lisitra rahalahy</router-link>
              </div>
              <br>
              <label style="color:rgb(14, 14, 14);font-size:16px;width:77px;margin-right: 200px;"><b>Volana</b> <span style="color:red">*</span></label>
              <input type="month" class="form-control" name="Daty" v-model="Hampiditra.Daty" required>
            
              <br>
              <div style="display: flex;justify-content: center;">
                <input type="submit" class="btnAjout" value="Hampiditra">&nbsp;&nbsp;
                <input type="reset" class="btnAnnuler" value="Hanala">
              </div>
            
            
            </div>
    
          
          </center>    
        </form>
    
      </div>
        
    
    </div>
    
    </div>
    
    
    </div>
            
    
    <!-- <imprimer :message="Anarana"></imprimer> -->
  </v-app>

  
      
          
  </template>
  <script>
  import imprimer from "./HavoakaPdf.vue"
  import axios from "axios";
  export default{
      name:"Ampidirina",
      components:{
        imprimer
      },
      data(){
          return{
          Anarana:"bonjour",
          activeMenuItem: '',
          //Logo:"src/image/logoDGI.png",
          pageProtegee:true,
          Hampiditra:{
              Daty:"",
              Rahalahy1:"",
              Rahalahy2:"",
              Rahalahy3:"",
              Rahalahy4:""
          },
        listaRahalahy:[],
      }
      },
      methods:{
        AnaranaRahalahy:function(){
              axios.get("http://localhost:3000/Rahalahy").then((response)=>{
              this.listaRahalahy=response.data;    
            
          })
          },
        MessageAjout:function(){
        this.$swal({
          icon:'success',
          title:"Tafiditra soamatsara ny anjaran'ny Rahalahy tsirairay",
          text:'mirary soa eh!',
          timer:2500,
          showConfirmButton:false
        })
        },
          HampiditraAnjara:function(){
            const Daty = this.Hampiditra.Daty;
  
          axios.post("http://localhost:3000/Rahalahy/HampiditraAnjara", {Daty}).then(response=>{
              this.MessageAjout();
              console.log("avec succès");
          }).catch(error=>{
              console.log("erreur");
          })
      },
      selectMenuItem(item) {
          this.activeMenuItem = item;
          // Ajoutez ici la logique pour afficher la page correspondante
          this.$router.push({ path:'/'+ item});
        },
        activerMenu:function(){
          this.activeMenuItem = 'Declaration';
          this.pageProtegee=true;
          this.$router.push('/HampiditraAnjara');
        }
      }
  }
  </script>
  <style scoped>
    .dropdown{
      text-align: end;
    }
    .ligne1{
    background:#3a3f51e7;
  
  }
    .ligne1Col2{
      height:45px;
    }
  .btnAnnuler{
    background-color:rgb(229, 83, 83);
      color: #fff;
      cursor:pointer;
      border:none;
      border-radius:4px;
      padding: 5px;
      width:100px;
  }
  
  .btnAnnuler:hover{
    background-color:rgb(229, 83, 83,0.8);
      color: #fff;
      cursor:pointer;
      border:none;
      border-radius:4px;
      padding: 5px;
      width:100px;
      transition:0.2s;
  }
  .btnAjout{
    background-color:rgb(36, 161, 250);
      color: #fff;
      cursor:pointer;
      border:none;
      border-radius:4px;
      padding: 5px;
      width:100px;
  }
  
  .btnAjout:hover{
    background-color:rgba(36, 161, 250,0.8);
      color: #fff;
      cursor:pointer;
      border:none;
      border-radius:4px;
      padding: 5px;
      width:100px;
      transition:0.2s;
  }
  .retour{
    font-weight:bold;
    text-align:center;
  }
  label{
    color:white;
  }
  .formulaire{
    margin-top:135px;
    border-radius:50px;
    padding:20px;
    /* background-image:url("src/image/FondApp.jpg"); */
    background-size:cover;
    background-repeat:no-repeat;
    
  }
  .ligne3Col3{
  
    min-height:80vh;
  }
  .ligne2Col2{
    display:flex;
    align-items: center;
    justify-content:center;
    background:white;
    height:50px;
    background-image:url("src/image/FondApp.jpg");
    background-size:cover;
    color:white;
  
  }
  .ligne2{
    background: white;
  }
  #aligner{
    display: flex;
    justify-content: space-between;
  }
  #alignerFin{
    display: flex;
    justify-content:space-between;
  }
  .btn{
    display: flex;
    justify-content: right;
  }
  #deconnexion{
      background-color:rgb(36, 161, 250);
      color: #fff;
      cursor:pointer;
      border:none;
      border-radius:4px;
      padding: 5px;
  }
  #deconnexion:hover{
    background-color:rgba(36, 161, 250,0.9);
  }
  .ligne1Col2{
    display:flex;
    justify-content: right;
    padding: 5px;
  }
  .couleurContainer{
    background-image:url("src/image/FondApp.jpg");
      background-size:cover;
      background-repeat:no-repeat;
      background-position: center;
      min-height: 100vh;
  }
  h1{
      margin-left:20%;
      border-radius:10px;
  }
  .sidebar {
      width: 250px;
      background-color: #3a3f51;
      color: #fff;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      padding: 25px;
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif, 'Times New Roman', Times, serif;
    }
    
    .logo img {
      max-width: 37%;
      
    }
    
    .menu {
      list-style-type: none;
      padding: 0;
      margin: 20px 0;
    }
    
    .menu li {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 20px;
      transition: background-color 0.5s;
    }
    .menu li:hover{
      cursor: pointer;
      transition: background-color 0.5s;
      background-color: #747881;
    
    }
    
    .menu li.active {
      background-color: #272b36;
    }
    
    .menu li span {
      margin-left: 20px;
    }
  </style>