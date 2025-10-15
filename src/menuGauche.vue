<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer app permanent>
        <v-list>
          <v-list-item to="/" title="Dashboard" prepend-icon="mdi-view-dashboard" />
          <v-list-item to="/test" title="Utilisateurs" prepend-icon="mdi-account" />
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-app-bar app color="primary" dark flat>
          <v-app-bar-title>Dashboard 2025</v-app-bar-title>
        </v-app-bar>

        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>
