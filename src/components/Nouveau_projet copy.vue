<template>
    <div class="d-flex justify-content-center align-items-center p-4 fond center-container">
      <div class="card modern-card p-3" style="max-width: 720px; width:100%;">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 class="mb-1">Créer un projet</h5>
            <small class="text-muted">Remplissez le formulaire pour démarrer</small>
          </div>
          <div class="text-end">
            <small class="badge bg-light text-dark">EC Travaux</small>
          </div>
        </div>
  
        <form>
          <div class="row g-3">
            <div class="col-md-6">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control" 
                  id="clientName"
                  placeholder="Nom du client"
                  required
                />
                <label for="clientName">Nom du maître d'ouvrage <b style="color: red;">*</b></label>
                <div class="invalid-feedback">er</div>
              </div>
            </div>
  
            <div class="col-md-6">
              <div class="form-floating">
                <input

                  type="text"
                  class="form-control"
                  id="projectTitle"
                  placeholder="Titre du projet"
                  required
                />
                <label for="projectTitle">Titre du projet</label>
                <div class="invalid-feedback">err</div>
              </div>
            </div>
  
            <div class="col-12">
              <div class="form-floating">
                <textarea

                  class="form-control"
                  placeholder="Description"
                  id="description"
                  style="height:100px"
                ></textarea>
                <label for="description">Description (optionnelle)</label>
                <div class="invalid-feedback">des</div>
              </div>
            </div>
  
            <div class="col-md-6">
              <label class="form-label">Budget estimé</label>
              <div class="input-group">
                <span class="input-group-text">Ar</span>
                <input

                  type="number"
                  class="form-control"

                  min="0"
                  placeholder="Ex: 1500000"
                />
                <div class="invalid-feedback"></div>
              </div>
            </div>
  
            <div class="col-md-6">
              <label class="form-label">Date de début</label>
              <input

                type="date"
                class="form-control"
       
              />
              <div class="invalid-feedback">f</div>
            </div>
  
            <div class="col-12 d-flex justify-content-between align-items-center mt-2">
              <div class="small text-muted">Aperçu : </div>
  
              <div>
                <button type="button" class="btn btn-outline-secondary me-2" @click="resetForm" :disabled="loading">
                  Réinitialiser
                </button>
  
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Envoyer
                </button>
              </div>
            </div>
  
            <div v-if="success" class="col-12 mt-3">
              <div class="alert alert-success mb-0" role="alert">
                ✔️ Formulaire envoyé avec succès — les données sont prêtes.
              </div>
            </div>
  
          </div>
        </form>
  
        <div class="mt-3">
          <div class="progress" style="height:8px; border-radius:8px;">
            <div class="progress-bar" role="progressbar"></div>
          </div>
          <div class="d-flex justify-content-between small text-muted mt-1">
            <div>Complété: %</div>
            <div>champs manquants</div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
export default{
    name:"Nouveau_projet"
}
</script>

<style>

.fond {
  background: linear-gradient(180deg, #eaf3ff, #f6fbff);
}
.center-container {
    min-height: 100%;          /* raikitra amin'ny haavo efijery */
  }
</style>