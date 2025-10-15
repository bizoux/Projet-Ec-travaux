<template>
  <div>
    <form @submit.prevent="uploadImage">
      <input type="file" @change="onFileChange" />
      <button type="submit">Upload Image</button>
    </form>

    <!-- <div v-if="images.length">
      <h3>Images stockées :</h3>
      <div v-for="(image, index) in images" :key="index">
        <img :src="`data:image/jpeg;base64,${image.image}`" alt="Uploaded image"/>
      </div>
    </div> -->

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
</template>

<script>
import axios from 'axios';

export default {
  name:"image",
  data() {
    return {
      selectedFile: null,
      images: []
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    uploadImage() {
      let formData = new FormData();
      formData.append('image', this.selectedFile);

      axios.post('http://localhost:3000/upload', formData)
        .then(response => {
          console.log(response.data);
          this.fetchImages();
        })
        .catch(error => {
          console.error("There was an error uploading the image!", error);
        });
    },
    RecuperationImage() {
      axios.get('http://localhost:3000/images')
        .then(response => {
          this.images = response.data.map(image => ({
            data: btoa(
              new Uint8Array(image.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            )
          }));
        })
        .catch(error => {
          console.error("There was an error fetching the images!", error);
        });
    },


    async fetchImages() {

      try{
        const response = await axios.get("http://localhost:3000/sary");
        this.images = response.data;
        console.log("avec succès!");
      }
      catch(error){
        console.log(error);
      }


    },


  },
  mounted() {
    this.fetchImages();
  }
};
</script>
