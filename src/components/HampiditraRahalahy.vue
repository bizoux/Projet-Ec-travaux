<template>

    <div class="bloc-modale" v-if="mampisehoFampidirana">

        <div class="overlay" v-on:click="asehoNaTsiaFamp()"></div>
        
        <div class="modale card">

            <div class="btn-modale btn btn-danger" v-on:click="asehoNaTsiaFamp()">X</div>
            <h1 class="styleTexte">Hampiditra Rahalahy</h1><br>
            
            <div class="Aucentre">

                <label class="form-label">Anarana</label>
                <input name="anarana" type="text" class="form-control" v-model="anarana" required><br>
                
            
            </div>

            <div>
                <label for="" class="form-label">Sary</label><br>
                <input name="sary" type="file" @change="onFileChange"/>
                <div v-if="HampisehoSary">
                    <center><img :src="HampisehoSary" alt="Image Preview" style="width: 250px;margin-top: 10px;" /></center>
                </div><br>
                <!-- <center><button @click="uploadImage">Upload</button></center> -->
            </div>
            



            
            <button class="btn btn-primary" v-on:click="Hampiditra">Hampiditra</button>
            

        </div>
        

    </div>
    
  
</template>

<script>
import axios from "axios";
export default{
    name:'HampiditraRahalahy', 
    props:['mampisehoFampidirana','asehoNaTsiaFamp'],
    data(){
        return{
        
            anarana:"",
            selectedFile: null,
            HampisehoSary: null,
            
        }
    },
    methods:{
        onFileChange(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.HampisehoSary = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile);
      }
    },

    // HAFATRA FANAMARIHANA
    HafatraFampidirana:function(){
      this.$swal({
        icon:'success',
        title:"Tafiditra soamatsara Rahalahy "+this.anarana,
        text:"Mirary soa!",
        timer:3500,
        showConfirmButton:false
      })
      },
    
    HafatraOlana:function(){
        this.$swal({
            icon:'error',
        title:'Misy olana fa hamarino tsara azafady',
        text:"Olana",
        timer:3900,
        showConfirmButton:false
      })
    },

    HafatraFanamarihana:function(){
        this.$swal({
            icon:'warning',
        title:'Fenoy azafady ilay anarana',
        text:"Olana",
        timer:2000,
        showConfirmButton:false
      })
    },


    
    Hampiditra:function() {
    
    if (!this.selectedFile) {
      alert("Misafidiana sary iray azafady indrindra");
      return;
    }
  
    const formData = new FormData();

    formData.append("anarana", this.anarana);
    formData.append("sary", this.selectedFile);
  
    axios.post("http://localhost:3000/hampiditraRahalahy", formData).then(response=>{
  
            this.HampisehoSary = null;
            this.HafatraFampidirana()
            console.log("avec succès eh");
            return window.location.reload();
            // this.RecuperationImage();
          }).catch(error=>{
            this.HafatraOlana();
              console.log("erreur");
          })
  },

},
};
</script>

<style scoped>
.form-label{
            
            font-weight: bold;
            background: linear-gradient(90deg, #c08678, #feb47b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
}
.form-control{
    font-size: 20px;
    font-weight: 400;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    
}
.Aucentre{
    /* border: 1px solid black; */
}

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
    bottom: 24%;
    /* AMBONY NY PLASINY */
    z-index: 1000;
}
.btn-modale{
    position: absolute;
    top: 10px;
    right: 10px;
}
.styleTexte{
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        color:white;
        /* border: 1px solid black; */
    }
.form-label{
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: white;
        font-size: 20px;
}
.btn-primary{
    font-size: 20px;
}
</style>