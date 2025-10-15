<template>
  <div>
    <form @submit.prevent="uploadFile">
      <input type="file" @change="handleFileUpload" />
      <div v-if="imagePreview">
        <img :src="imagePreview" alt="Image Preview" style="max-width: 300px; margin-top: 20px;" />
      </div>
      <button type="submit">Upload</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      imagePreview: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(this.file);
      }
    },
    async uploadFile() {
      if (!this.file) {
        alert("Please select a file to upload");
        return;
      }

      const formData = new FormData();
      formData.append('file', this.file);

      try {
        const response = await axios.post('http://localhost:3000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('File uploaded successfully', response.data);
        // Clear the file input and preview after upload
        this.file = null;
        this.imagePreview = null;
      } catch (error) {
        console.error('Error uploading file', error);
      }
    },
  },
};
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
  margin-top: 20px;
}
</style>
