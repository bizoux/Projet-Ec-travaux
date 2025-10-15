<template>

    <div class="bloc-modale" v-if="mampisehoModaleFanavaozana">

        <div class="overlay" v-on:click="HesorinaNaTsia()"></div>
        
        <div class="modale card">

            <div class="btn-modale btn btn-danger" v-on:click="HesorinaNaTsia()">X</div>
            <h1 class="styleTexte">Hanova ny anjara</h1><br>
            <div class="Aucentre">
                <center><h4>Tapany Voalohany</h4></center>
                <label for="" class="form-label">Anarana1</label>
                <select class="form-select" v-model="anaranaFenoina1">
                    <option v-for="rahalahy in AnaranaAzo" :key="rahalahy.idRahalahy" :value="rahalahy.Anarana">{{ rahalahy.Anarana }}</option>
                </select><br>

                <label for="" class="form-label">Anarana2</label>
                <select class="form-select" v-model="anaranaFenoina2">
                    <option v-for="rahalahy in AnaranaAzo" :key="rahalahy.idRahalahy" :value="rahalahy.Anarana">{{ rahalahy.Anarana }}</option>
                </select>
                <hr>

                <center><h4>Tapany Faharoa</h4></center>
                <label for="" class="form-label">Anarana3</label>
                <select class="form-select" v-model="anaranaFenoina3">
                    <option v-for="rahalahy in AnaranaAzo" :key="rahalahy.idRahalahy" :value="rahalahy.Anarana">{{ rahalahy.Anarana }}</option>
                </select><br>

                <label for="" class="form-label">Anarana4</label>
                <select class="form-select" v-model="anaranaFenoina4">
                    <option v-for="rahalahy in AnaranaAzo" :key="rahalahy.idRahalahy" :value="rahalahy.Anarana">{{ rahalahy.Anarana }}</option>
                </select>
                <br>

                
                

            </div>
            
            <button class="btn btn-primary" v-on:click="HanavaoAnjara">Hanavao</button>

        </div>
        
    </div>

    
                

    
</template>

<script>

import axios from "axios"
export default{
name:"HanavaoAnjara",
props:["AnjaraOvana","mampisehoModaleFanavaozana","HesorinaNaTsia"],
data(){
        return{
            
            anaranaFenoina1:'',
            anaranaFenoina2:'',
            anaranaFenoina3:'',
            anaranaFenoina4:'',
            AnaranaAzo:""

            
        }
    },
    mounted:function(){
         this.AnaranaTandrifyId();
         this.HakaAnarana();
        
    },
    watch: {

'$route.query.id': 'AnaranaTandrifyId'

    },
    methods:{

        // ANARANA REHETRA
        HakaAnarana:function(){
            
        axios.get("http://localhost:3000/Anarana").then(response => {

        this.AnaranaAzo=response.data;
        console.log(this.AnaranaAzo);
        


        }).catch(erreur=>{
            console.log(erreur);
        })
    },
        


    // HAFATRA FANAMARIHANA

    HafatraFanovana:function(){
      this.$swal({
        icon:'success',
        title:"Navaozina soamatsara ny anjara",
        text:"Mirary soa!",
        timer:3900,
        showConfirmButton:false
      })
      
      },



    
    // MAKA AN'ILAY ANJARA OVANA
        AnaranaTandrifyId() {

        const idAnjara=this.$route.query.id;

      axios.get("http://localhost:3000/MakaIdAnjara/"+idAnjara).then(response => {

        this.anaranaFenoina1=response.data[0].Anarana1;
        this.anaranaFenoina2=response.data[0].Anarana2;
        this.anaranaFenoina3=response.data[0].Anarana3;
        this.anaranaFenoina4=response.data[0].Anarana4;
        


        }).catch(erreur=>{
            console.log(erreur);
        })
    },


     // HANAVAO NY ANJARA
     HanavaoAnjara:function(){
            const Anarana1 = this.anaranaFenoina1;
            const Anarana2 = this.anaranaFenoina2;
            const Anarana3 = this.anaranaFenoina3;
            const Anarana4 = this.anaranaFenoina4;
            const idAnjara = this.$route.query.id;
            axios.put("http://localhost:3000/HanavaoAnjara/"+idAnjara,{Anarana1,Anarana2,Anarana3,Anarana4}).then(response=>{
                this.$router.push('/HavoakaPdf');
                this.HafatraFanovana();
              
              return window.location.reload();

 
        }).catch(erreur=>{
            console.log(erreur);
        });
         
        }
    
    
    }




}

</script>

<style scoped>

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

}
.overlay{
    background: rgba(0,0,0,0.5);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    transition: backdrop-filter 0.3s ease, background 0.3s ease;

    /* AO AMBADIKAN'NY MODALE NY PLASINY */
    z-index: 999;
    


}
.modale{
    background: linear-gradient(200deg,#237979,#557497,#00bcd4);
    color: #333;
    padding: 50px;
    position: fixed;
    bottom: 10%;
    /* AMBONY NY PLASINY */
    z-index: 1000;
}
.btn-modale{
    position: absolute;
    top: 10px;
    right: 10px;
}

.styleTexte{
    color: white;
}



</style>