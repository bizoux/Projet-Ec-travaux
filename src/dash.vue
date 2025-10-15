<template>
  <v-layout>
    <!-- Barre latérale -->
    <v-navigation-drawer app permanent>
      <v-list nav dense>
        <v-list-item title="Dashboard" prepend-icon="mdi-view-dashboard" />
        <v-list-item title="Utilisateurs" prepend-icon="mdi-account" />
        <v-list-item title="Paramètres" prepend-icon="mdi-cog" />
      </v-list>
    </v-navigation-drawer>

    <!-- Contenu principal -->
    <v-main>
      <!-- Barre supérieure -->
      <v-app-bar app color="primary" dark flat>
        <v-app-bar-title>Dashboard 2025</v-app-bar-title>
        <v-spacer />
        <v-btn icon><v-icon>mdi-bell</v-icon></v-btn>
        <v-btn icon><v-icon>mdi-account-circle</v-icon></v-btn>
      </v-app-bar>

      <!-- Contenu -->
      <v-container fluid>
        <!-- Cartes statistiques -->
        <v-row>
          <v-col cols="12" md="4" v-for="stat in stats" :key="stat.title">
            <v-card class="pa-4" elevation="3">
              <v-icon size="36" color="primary">{{ stat.icon }}</v-icon>
              <div class="text-subtitle-1 mt-2">{{ stat.title }}</div>
              <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
              <div class="text-caption text-grey mt-1">{{ stat.subtitle }}</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Tableau des utilisateurs -->
        <v-card class="mt-6" elevation="3">
          <v-card-title>Derniers utilisateurs</v-card-title>
          <v-table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Date d'inscription</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.email">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>{{ user.date }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref } from 'vue';

const stats = ref([
  { title: 'Utilisateurs actifs', value: '1 452', icon: 'mdi-account', subtitle: '+8% cette semaine' },
  { title: 'Commandes', value: '320', icon: 'mdi-cart', subtitle: '+12% cette semaine' },
  { title: 'Revenus', value: '18 200 €', icon: 'mdi-cash', subtitle: '+5% cette semaine' },
]);

const users = ref([
  { name: 'Alice Martin', email: 'alice@mail.com', role: 'Admin', date: '2025-05-27' },
  { name: 'Bruno Dupuis', email: 'bruno@mail.com', role: 'Utilisateur', date: '2025-05-26' },
  { name: 'Claire Dubois', email: 'claire@mail.com', role: 'Modérateur', date: '2025-05-25' },
]);
</script>
