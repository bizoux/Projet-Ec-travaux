

<template>
  <div>
    <input name="image" type="file" @change="onFileChange"/>
    <div v-if="imagePreview">
        <img :src="imagePreview" alt="Image Preview" style="max-width: 300px; margin-top: 20px;" />
    </div>
    <button @click="uploadImage">Upload</button>
  </div>

  <hr>
  <br>

  <div>
    <img :src="imageUrl" alt="Image" v-if="imageUrl" />
    <button @click="fetchImage">Load Image</button>
  </div>

  <!-- <img :src="image" alt=""><hr><br> -->

<CENTER>
  <div>
    <table border="1">
      <thead>
        <tr>
          <th>Image</th>
          <th>Nom</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="image in images" :key="image.id">
          <td>
            <img :src="`http://localhost:3000/image/${image.id}`" alt="Image" width="100" />
          </td>
          <td>{{ image.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</CENTER>


</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      selectedFile: null,
      imagePreview: null,
      imageUrl: null,
      images:[]
    };
  },
  mounted() {
    this.RecuperationImage();
  },
  methods: {
    async RecuperationImage() {
      try{
        const response = await axios.get("http://localhost:3000/sary");
        this.images = response.data;
        console.log("avec succès!");
      }
      catch(error){
        console.log(error);
      }


    },


    async fetchImage() {
      const imageId = 80; // Remplace avec l'ID de l'image que tu veux afficher
      this.imageUrl = `http://localhost:3000/image/${imageId}`;
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile);
      }
    },


     uploadImage:function() {
    
  if (!this.selectedFile) {
    alert("Choisissez un fichier s'il vous plait");
    return;
  }

  const formData = new FormData();
  formData.append("image", this.selectedFile);

  axios.post("http://localhost:3000/upload", formData).then(response=>{

          this.imagePreview = null;
          alert("upload image avec succès");
          console.log("avec succès eh");
          this.RecuperationImage();
        }).catch(error=>{
            console.log("erreur");
        })
}

  }
};

</script>



















                                      <!-- LA PREMIERE METHODE UPLOAD IMAGE -->



<!-- <template>
  <div>
    <input type="file" @change="onFileChange" />
    <div v-if="imagePreview">
        <img :src="imagePreview" alt="Image Preview" style="max-width: 300px; margin-top: 20px;" />
    </div>
    <button @click="uploadImage">Upload</button>
  </div>
  <hr>
  <br>

  <div>
    <img :src="imageUrl" alt="Image" v-if="imageUrl" />
    <button @click="fetchImage">Load Image</button>
  </div>

  <img :src="image" alt=""><hr><br>


  <div>
    <table border="1">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="image in images" :key="image.id">
          <td>
            <img :src="`http://localhost:3000/image/${image.id}`" alt="Image" width="100" />
          </td>
          <td>{{ image.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>



</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      selectedFile: null,
      imagePreview: null,
      imageUrl: null,
      images:[]
    };
  },
  mounted() {
    this.RecuperationImage();
  },
  methods: {
    async RecuperationImage() {
      try {
        const response = await fetch("http://localhost:3000/sary");
        this.images = await response.json();
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },


    async fetchImage() {
      const imageId = 1; // Remplace avec l'ID de l'image que tu veux afficher
      this.imageUrl = `http://localhost:3000/image/${imageId}`;
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile);
      }
    },
    async uploadImage() {
      if (!this.selectedFile) {
        alert("Choisissez un fichier s'il vous plait");
        return;
      }

      const formData = new FormData();
      formData.append("image", this.selectedFile);

      try {
        await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData
        });
        alert("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image");
      }
    }
  }
};

</script> -->
