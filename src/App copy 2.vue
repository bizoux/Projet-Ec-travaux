<template>
    <v-app>
      <v-btn color="primary" @click="alert('Hello')">
        Cliquez ici
      </v-btn>
  
      <v-card class="mt-4">
        <v-card-title>Titre de la carte</v-card-title>
        <v-card-text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. In dolorum cumque placeat voluptate earum enim labore tenetur accusamus esse consequatur deleniti necessitatibus maxime doloribus, veniam accusantium rem. Laudantium, ullam minus.
        </v-card-text>
      </v-card>

      <v-container>
        <v-row>
          <v-col>Colonne 1 (pleine largeur sur mobile)</v-col>
          <v-col>Colonne 2</v-col>
        </v-row>
      </v-container>



      <v-form @submit.prevent="submit" v-model="valid">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          required
        ></v-text-field>
        
        <v-btn type="submit" :disabled="!valid">Envoyer</v-btn>
      </v-form>




    </v-app>
  </template>
  <script>
    export default {
      data: () => ({
        valid: false,
        email: '',
        emailRules: [
          v => !!v || 'Email requis',
          v => /.+@.+\..+/.test(v) || 'Email invalide',
        ],
      }),
      methods: {
        submit() {
          console.log('Formulaire valide !');
        },
      },
    };
    </script>