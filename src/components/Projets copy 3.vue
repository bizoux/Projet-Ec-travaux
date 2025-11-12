<template>
    <div class="container-fluid d-flex justify-content-center align-items-center bg-light">
      <div class="row text-center justify-content-center">
        <h1 class="mb-5">Localisation</h1>
  
        <!-- Card Madagascar -->
        <div class="col-12 col-md-6 mb-4">
          <div
            class="card shadow border-0 mx-auto"
            style="width: 18rem; cursor: pointer;"
            @click="goTo('madagascar')"
          >
            <img
              src="../image/fondformulaire2.jpg"
              class="card-img-top"
              alt="Madagascar"
            />
            <div class="card-body">
              <h5 class="card-title fw-bold">Madagascar</h5>
              <p class="card-text text-muted">
                Découvrez les paysages naturels et la biodiversité unique de Madagascar.
              </p>
              <button class="btn btn-danger w-100">Aller à Madagascar</button>
            </div>
          </div>
        </div>
  
        <!-- Card France -->
        <div class="col-12 col-md-6 mb-4">
          <div
            class="card shadow border-0 mx-auto"
            style="width: 18rem; cursor: pointer;"
            @click="goTo('france')"
          >
            <img
              src="../image/fondformulaire2.jpg"
              class="card-img-top"
              alt="France"
            />
            <div class="card-body">
              <h5 class="card-title fw-bold">France</h5>
              <p class="card-text text-muted">
                Explorez la culture, la gastronomie et les monuments emblématiques de France.
              </p>
              <button class="btn btn-primary w-100">Aller en France</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "LocalisationCenter",
    methods: {
      goTo(country) {
        this.$router.push(`/${country}`)
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
  </style>
  