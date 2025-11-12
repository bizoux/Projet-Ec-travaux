<template>
  <div style="background:linear-gradient(200deg, #eaf3ff, #0833571f);" class="fill-height">
    <!-- <button @click="$router.back()">Retour</button> -->
    <div class="container-fluid d-flex justify-content-center align-items-center center-container">
      <div class="row text-center justify-content-center g-5">
        
        <!-- Card Madagascar -->
        <div class="col-12 col-md-6 mb-4">
          <div
          class="card shadow border-0 mx-auto"
          style="width: 18rem; cursor: pointer;"
          @click="goTo('Nouveau_projet')"
          >
          <img
          src="../image/Nouveau_projet.jpg"
          class="card-img-top"
          alt="Madagascar"
          />
          <div class="card-body">
              <h5 class="card-title fw-bold">Nouveau projet</h5>
              <p class="card-text text-muted">
                Accéder au nouveau projet
              </p>
              <button class="btn btn-danger w-100">Nouveau projet</button>
            </div>
          </div>
        </div>
  
        <!-- Card France -->
        <div class="col-12 col-md-6 mb-4">
          <div
            class="card shadow border-0 mx-auto"
            style="width: 18rem; cursor: pointer;"
            @click="goTo('Projet_existant')"
          >
            <img
              src="../image/projet_existant.jpg"
              class="card-img-top"
              alt="France"
            />
            <div class="card-body">
              <h5 class="card-title fw-bold">Projet existant</h5>
              <p class="card-text text-muted">
                Accéder au projet existant
              </p>
              <button class="btn btn-primary w-100">Projet existant</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  export default {
    name: "Projets",
    methods: {
      goTo(Projet) {
        this.$router.push(`/${Projet}`)
      }
    }
  }
  </script>
  
  <style scoped>
  body, html {
    margin: 0;
    padding: 0;
    overflow: hidden; /* pas de scroll */
  }
  
  .card img {
    height: 180px;
    object-fit: cover;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }
  
  .card:hover {
    transform: translateY(-5px);
    transition: transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .center-container {
    min-height: 100%;          /* raikitra amin'ny haavo efijery */
  }
  </style>
  