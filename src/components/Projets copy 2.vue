<template>
    <div class="center-container">
      <div class="cards">
        <div class="card" @click="goTo('madagascar')">
          <img src="https://flagcdn.com/w320/mg.png" alt="Drapeau Madagascar" />
          <h2>Madagascar</h2>
        </div>
  
        <div class="card" @click="goTo('france')">
          <img src="https://flagcdn.com/w320/fr.png" alt="Drapeau France" />
          <h2>France</h2>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "LocalisationCenter",
    methods: {
      goTo(country) {
        // Mampiasa router (vue-router)
        this.$router.push(`/${country}`)
      }
    }
  }
  </script>
  
  <style scoped>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden; /* tsy hisy scroll mihitsy */
  }
  
  .center-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #e3f2fd, #f9fbe7);
  }
  
  /* Layout an'ny cards */
  .cards {
    display: flex;
    gap: 40px;
  }
  
  /* Style an'ny card tsirairay */
  .card {
    width: 180px;
    height: 220px;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  }
  
  .card img {
    width: 100px;
    height: 70px;
    border-radius: 8px;
    object-fit: cover;
    margin-bottom: 15px;
  }
  
  .card h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
    text-align: center;
  }
  </style>
  