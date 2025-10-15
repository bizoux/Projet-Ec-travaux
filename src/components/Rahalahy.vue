<template>

  <v-app>
    <!-- <v-toolbar color="blue" elevation="4" height="84">
      <template #title>
        <h2 class="text-h4 font-weight-bold">Rahalahy</h2>
      </template>
    
    </v-toolbar> -->
  
    
  <div class="fond container-fluid">
                  
          <!-- LIGNE 1         -->
  <br><br><div class="row">
            
            <div class="col-md-4">
              
            </div>
            
            <div class="col-md-3">
              
              <input type="text" placeholder="anarana" class="form-control input-transparent" v-model="fikarohanaRahalahy" style="height: 45px;"/>        
            </div>
            
            <div class="d-flex col-md-5">
              <router-link to="/" class="btn btn-primary">Hiverina</router-link>
            </div>
          
          
          </div>
          
            
                
          <br>
  
  
          <!-- LIGNE 2 -->
  
          <!-- Valiny t@ fikarohanaRahalahy ts Hita-->
          <div class="row">
            
            <div class="col-md-2">
              
            </div>
            
            <div class="col-md-7">
              <div class="alert alert-danger text-center" v-if="this.fikarohanaRahalahy && filtreAnarana.length == 0">
                <span style="font-size: larger;">Ialana tsiny tsy ao anaty tabilao io anarana io Tompoko!</span>
              </div>
            </div>
            
            <div class="d-flex col-md-3">
              
            </div>
          
          </div>
          
          <!-- LIGNE 3 -->
  
          <!-- fikarohanaRahalahy HITA -->
          <div class="row">
            <div class="col-md-2">
              
            </div>
            
            <div class="col-md-7">
              <div class="alert alert-success text-center" v-if="this.fikarohanaRahalahy && filtreAnarana.length > 0">
                <span style="font-size: larger;">Miisa {{filtreAnarana.length}} ny anaran'i {{ fikarohanaRahalahy }}.</span>
              </div>
            </div>
            
            <div class="d-flex col-md-3">
              
          </div>
          
          
          
          </div>
              
  
              <!-- LIGNE 4 -->
  
              <!-- Hampiditra rahalahy -->
              <div class="row">
                
                <div class="col-md-2">
                  
                </div>
                
                <div class="d-flex col-md-7 justify-content-center">
                  <button v-on:click="Hampiseho" class="btn btn-info">Hampiditra</button>
                </div>
                
                <div class="d-flex col-md-3">
                  
                </div>
              
              
              
              </div>
          
          
          
              <br>
  
  
    
  
          
      <!-- HAFATRA FAMPIDIRANA RAHALAHY   -->
      <HampiditraRahalahy v-bind:mampisehoFampidirana="mampisehoFampidirana" v-bind:asehoNaTsiaFamp="asehoNaTsiaFamp"></HampiditraRahalahy>
      
      
      
      <!-- HAFATRA FANAVAOZANA RAHALAHY -->
      <!-- <HanavaoAnarana v-bind:id="id" v-bind:mampisehoFanavaozanaAnarana="mampisehoFanavaozanaAnarana" v-bind:asehoNaTsiaFanavaozanaAnarana="asehoNaTsiaFanavaozanaAnarana"></HanavaoAnarana> -->
  
  </div>        
  
  
     <section id="products" class="container products-section">
   
       <div class="products-filter">
         <input type="radio" checked="true" id="all" name="products" value="all" v-model="selectedCategory"/>
         <label for="all">
           Izy rehetra
           <span class="product-amount"></span>
         </label>
         <input type="radio" id="tsaramandroso" name="products" value="tsaramandroso" v-model="selectedCategory"/>
         <label for="tsaramandroso">
           Tsaramandroso
           <span class="product-amount"></span>
         </label>
         <input type="radio" id="mangarivotra" name="products" value="mangarivotra" v-model="selectedCategory"/>
         <label for="mangarivotra">
           Mangarivotra
           <span class="product-amount"></span>
         </label>
   
         <span class="glider"></span>
       </div>
   
      <div class="products-area">
   
         
          <div class="product-item" v-for="(rahalahy,index) in filtreAnarana" :key="rahalahy.idRahalahy">
          
            <img :src="`http://localhost:3000/SaryRahalahy/${rahalahy.idRahalahy}`" alt="SaryRahalahy">
            <div class="product-details">
              <h3 class="product-title">{{ rahalahy.Anarana }}</h3>
              <p class="product-author">{{ rahalahy.Fiangonana }}</p>
              <p class="price-title"><button class="btn btn-success"><font-awesome-icon icon="edit"/></button></p>
              <p class="product-price"><button class="btn btn-danger" @click="HamafaAnarana(rahalahy.idRahalahy,rahalahy.Anarana)"><font-awesome-icon icon="trash"/></button></p>
  
              
            </div>
          </div>
         
   
      </div>
      
    </section><br>
  
  
  
  
     <!-- CHARGEMENT -->
  <div class="row">
      
      <div class="col-md-4">
  
      </div>
      
      
      <div class="col-md-4 chargementImage">
  
          <img src="../image/loader-unscreen.gif" alt="imageChargement" v-if="this.chargement">
      
      </div>
      
      <div class="col-md-4 chargement">
  
      </div>
  
  
  </div> 
  
  

  </v-app>

    
      

<!-- FIN -->
    
</template>

<script>
import HampiditraRahalahy from "./HampiditraRahalahy.vue";
import axios from "axios";
export default{
    name:"Rahalahy",
    components:{
        HampiditraRahalahy
    },
    data() {
            return {

                Lisitra:[],
                fikarohanaRahalahy:"",
                mampisehoFampidirana:false,
                // mampisehoFanavaozanaAnarana:false,
                selectedCategory: 'all',
                chargement:true,


            }
        },
        computed:{
            filtreAnarana(){


            //     return this.Lisitra.filter(rahalahy =>
            //     rahalahy.Anarana.toLowerCase().includes(this.fikarohanaRahalahy.toLowerCase())
            // )
              


      if (this.selectedCategory === 'all') {

      return this.Lisitra.filter(rahalahy =>
                rahalahy.Anarana.toLowerCase().includes(this.fikarohanaRahalahy.toLowerCase())
            );
    } else if (this.selectedCategory === 'tsaramandroso') {

      return this.Lisitra.filter(rahalahy => rahalahy.Fiangonana === "FIANARANTSOA TSARAMANDROSO" && rahalahy.Anarana.toLowerCase().includes(this.fikarohanaRahalahy.toLowerCase()));
      
    } else if (this.selectedCategory === 'mangarivotra') {

      return this.Lisitra.filter(rahalahy => rahalahy.Fiangonana === "FIANARANTSOA MANGARIVOTRA" && rahalahy.Anarana.toLowerCase().includes(this.fikarohanaRahalahy.toLowerCase()));
    }

            }
            
            
        },
        mounted:function(){

            this.lisitraRahalahy();
    
        },
     
        methods: {
         
              isaRahalahy(Lisitra){


              // RAHALAHY TSARAMANDROSO
              let tsaramandroso = Lisitra.filter(function(item){
                      return item.Fiangonana === "FIANARANTSOA TSARAMANDROSO";
              });

              // RAHALAHY MANGARIVOTRA
              let mangarivotra = Lisitra.filter(function(item){
                      return item.Fiangonana === "FIANARANTSOA MANGARIVOTRA";
              });


                document.querySelector(".products-filter label[for=all] span.product-amount").textContent = Lisitra.length;
                document.querySelector(".products-filter label[for=tsaramandroso] span.product-amount").textContent = tsaramandroso.length;
                document.querySelector(".products-filter label[for=mangarivotra] span.product-amount").textContent = mangarivotra.length;

              }, 

          lisitraRahalahy:function(){
            axios.get("http://localhost:3000/LisitraRahalahy").then(response=>{

                this.Lisitra=response.data;
                this.isaRahalahy(this.Lisitra);
                this.chargement = false;
                
            }).catch(error=>{

                alert("Erreur");

            });
            
        },
        // MAMPISEHO
        asehoNaTsiaFamp:function(){

            this.mampisehoFampidirana = !this.mampisehoFampidirana;
            
        },

        // hampiseho fanamarihana
        Hampiseho:function(){
      this.mampisehoFampidirana=true;
    },

    AnararaFafana(idRahalahy){
      axios.delete("http://localhost:3000/RahalahyFafana/"+idRahalahy).then(function(){
        return window.location.reload();
        // this.$router.push('/MpiaraManompo');
      });
    },

    HamafaAnarana(idRahalahy,Anarana){
      this.$swal({
        title:"Tena vonona hamafa ny anaran'ny Rahalahy "+Anarana+" ve ianao?",
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
              title:"Voafafa soamatsara ny anaran'i Rahalahy "+Anarana,
              text:'Mirary soa',
              timer:2500,
              showConfirmButton:false
            }
          )
          this.AnararaFafana(idRahalahy);

        }
        else
        {
          
          this.$swal({
            icon:'error',
        title:"Tsy tontosa ny famafana ny anaran'ny Rahalahy "+Anarana,
        text:"echec",
        timer:2500,
        showConfirmButton:false
      }
          )
        }
      })
    },




        
    }

}

</script>


<style scoped>



.table-dark{
  background-color: rgba(40,127,186);
  color:white;
}      
.table-striped tbody tr:nth-of-type(odd){  
  background-color: rgb(255, 254, 255);
}

.table-striped tbody tr:nth-of-type(even){
  background-color: rgb(244,244,244);
  color: rgb(0, 0, 0);
}


.table-dark{
      padding:6px;
}
.toerana{
      text-align:center;
      font-size: 18px;
}

th{
    font-size: 25px;
}




/* TEST */


.products-section .products-filter .glider{
    
    position: absolute;
    display: flex;
    height: 2px;
    width: calc(100% / 5);
    background-color: rgb(255, 255, 255);
    z-index: 1;
    transition: 0.25s ease-out;
    bottom: -10px;
  }
  

  .products-section .products-filter input[id="all"]:checked ~ .glider {
   transform: translateX(-170%);
 }
 .products-section .products-filter input[id="tsaramandroso"]:checked ~ .glider {
   transform: translateX(-2%);
 }
 .products-section .products-filter input[id="mangarivotra"]:checked ~ .glider {
   transform: translateX(166%);
 }


  .products-section .products-filter input[type="radio"] {
    position: absolute;
    visibility: hidden;
    display: none;
  }
 

  .products-section .products-filter input[type="radio"]:checked + label {
   color: #ffffff;
 }
 
 
 .products-section .products-filter input[type="radio"]:checked + label > .product-amount {
   background: grey;
 }

 
 .products-section .products-filter label .product-amount {
   font-family: "Space Mono";
   font-style: normal;
   font-weight: 400;
   font-size: 18px;
   line-height: 22px;
   color: #fff;
   background: #3b3b3b;
   border-radius: 30px;
   width: 40px;
   height: 40px;
   display: flex;
   align-items: center;
   justify-content: center;
   margin-left: 16px;
 }
 

 .products-section .products-filter label {
   /* border: 1px solid black; */
   display: flex;
   align-items: center;
   justify-content: center;
   height: 54px;
   width: calc(100% / 2);
   cursor: pointer;
   font-style: normal;
   font-weight: 600;
   font-size: 28px;
   line-height: 31px;
   transition: color 0.15s ease-in;
   color: grey;
 }
 
 .products-section .products-area {
   /* border: 1px solid black; */
   margin-top: 60px;
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   row-gap: 35px;
   column-gap: 51px;
 }
 
 
 .products-section .products-filter {
   display: flex;
   justify-content: center;
   align-items: center;
   position: relative;
   /* border: 1px solid black; */
 }
 

 .products-section .products-area .product-item {
  background: linear-gradient(45deg, #466166, #2b2b2b);
  border-radius: 20px;
  cursor: pointer;
  color: white;
  width: 400px;
}

 .products-section .products-area .product-item img {
  width: 100%;
  height: 295px;
   object-fit: cover;
   border-radius: 20px 20px 0 0;
 }

 .products-section .products-area .product-item .product-details {
  padding: 25px 30px;
}

/* STYLE RECHERCHE */



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