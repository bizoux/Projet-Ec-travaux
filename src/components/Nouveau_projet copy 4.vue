<template>
    <v-container class="d-flex justify-center align-center fill-height">
      <v-card class="pa-6" max-width="550" elevation="10" rounded="xl">
        <v-card-title class="text-h6 font-weight-bold mb-1">
          Créer un projet
        </v-card-title>
        <v-card-subtitle class="mb-4">
          Remplissez le formulaire pour démarrer
        </v-card-subtitle>
  
        <v-form ref="form" @submit.prevent="ajoutNouveauProjet()">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="NomMaitreOuvr"
                label="Nom du maître d’ouvrage"
                prepend-icon="mdi-account"
                :rules="[v => !!v || 'Nom obligatoire']"
                variant="outlined"
                clearable
              />
            </v-col>
  
            <v-col cols="12">
              <v-text-field
                v-model="Entreprise"
                label="Entreprise"
                prepend-icon="mdi-office-building"
                :rules="[v => !!v || 'Entreprise requis']"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="Adresse"
                label="Adresse"
                prepend-icon="mdi-map-marker"
                :rules="[v => !!v || 'Adresse requis']"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="TacheEffect"
                label="Tache à effectuer"
                prepend-icon="mdi-hammer-wrench"
                :rules="[v => !!v || 'Tache à effectuer requis']"
                variant="outlined"
                clearable
              />
            </v-col>
  

          </v-row>
  
          <v-card-actions class="d-flex justify-end mt-2">
              <v-btn color="primary" :loading="loading" type="submit" class="ml-3">
                Enregistrer
              </v-btn>
            <v-btn color="secondary" variant="tonal" @click="resetForm">
              Réinitialiser
            </v-btn>
          </v-card-actions>
  
        </v-form>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref,getCurrentInstance } from 'vue'
  import db from '@/db';
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const form = ref(false)
  const NomMaitreOuvr = ref('');
  const Entreprise = ref('');
  const Adresse = ref('');
  const TacheEffect = ref('');
  const { proxy } = getCurrentInstance();

  const annuler = () => {
      form.value.reset()
    };

    const resetForm = async () => {

        annuler();

    }
    

  const ajoutNouveauProjet = async () => {
      try {
        if (!NomMaitreOuvr.value || !Entreprise.value || !Adresse.value || !TacheEffect.value) {
          throw new Error("Veuillez remplir tous les champs !");
        }
       const nouveauProjetId = await db.Projet.add({
          NomMaitreOuvr: NomMaitreOuvr.value,
          Entreprise: Entreprise.value,
          Adresse: Adresse.value,
          TacheEffect: TacheEffect.value
        });

        proxy.$swal.fire({
          icon: 'success',
          title: 'Projet ajouté',
          text: 'avec succès',
          timer: 1500,
          showConfirmButton: false
        });
        resetForm();
        
        router.push({ name: 'Materiel', query:{ idProj: nouveauProjetId }});




      } catch (error) {
        proxy.$swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.message,
          timer: 950,
          showConfirmButton: false
        });
      }
    };
  


  </script>
  
  <style scoped>
  .v-card {
    background: linear-gradient(180deg, #ffffffcc, #f8f9ffcc);
    backdrop-filter: blur(8px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  }
  .fond{
    background: linear-gradient(180deg, #eaf3ff, #f6fbff);
  }
  ::v-deep .v-field{
  background: rgb(248, 249, 250);
  border-radius: 15px;
}
  </style>
  