<template>
    <v-layout>
      <v-app-bar class="px-md-4" color="surface-variant" flat>
        <template #prepend>
          <v-app-bar-nav-icon
            v-if="$vuetify.display.smAndDown"
            @click="drawer = !drawer"
          />
        </template>
  
        <v-img
          class="me-sm-8"
          max-width="40"
          src="https://cdn.vuetifyjs.com/docs/images/logos/v.svg"
        />
  
        <template v-if="$vuetify.display.mdAndUp">
          <v-btn
            v-for="(item, i) in items"
            :key="i"
            :active="i === 0"
            class="me-2 text-none"
            slim
            v-bind="item"
          />
        </template>
  
        <v-spacer />
  
        <template #append>
          <v-btn
            class="ms-1 opacity-60"
            icon="mdi-bell-outline"
          />
  
          <v-btn class="ms-1" icon>
            <v-avatar image="Abrivard.jpg" />
  
            <v-menu activator="parent" origin="top">
              <v-list>
                <v-list-item link title="Update profile" />
  
                <v-list-item link title="Sign out" />
              </v-list>
            </v-menu>
          </v-btn>
        </template>
      </v-app-bar>
  
      <v-navigation-drawer
        v-if="$vuetify.display.smAndDown"
        v-model="drawer"
        location="top"
        temporary
        width="355"
      >
        <v-list class="py-0" slim>
          <v-list-item link prepend-icon="mdi-home-outline" title="Dashboard" />
  
          <v-list-group
            prepend-icon="mdi-account-multiple-outline"
            title="Customers"
          >
            <template #activator="{ props: activatorProps }">
              <v-list-item v-bind="activatorProps" />
            </template>
  
            <v-list-item
              link
              prepend-icon="mdi-account-plus-outline"
              title="Create New"
            />
  
            <v-list-group prepend-icon="mdi-magnify" title="Search">
              <template #activator="{ props: activatorProps }">
                <v-list-item v-bind="activatorProps" />
              </template>
  
              <v-list-item
                link
                prepend-icon="mdi-account-outline"
                title="By Name"
              />
  
              <v-list-item
                link
                prepend-icon="mdi-email-outline"
                title="By Email"
              />
  
              <v-list-item
                link
                prepend-icon="mdi-phone-outline"
                title="By Phone"
              />
            </v-list-group>
          </v-list-group>
  
          <v-list-item link prepend-icon="mdi-calendar" title="Calendar" />
  
          <v-list-item link prepend-icon="mdi-poll" title="Analytics" />
  
          <v-divider />
  
          <v-list-item link prepend-icon="mdi-inbox-outline" title="Inbox" />
  
          <v-list-item
            link
            prepend-icon="mdi-bell-outline"
            title="Notifications"
          />
  
          <v-divider />
  
          <v-list-item
            lines="two"
            link
            prepend-avatar="Abrivard.jpg"
            subtitle="Vuetify Engineer"
            title="John Leider"
          />
        </v-list>
      </v-navigation-drawer>
  
      <v-main>
        <v-toolbar color="surface" elevation="1" height="84">
          <template #title>
            <h2 class="text-h4 font-weight-bold">Dashboard</h2>
          </template>
        </v-toolbar>
  
        <div class="pa-4">
          <v-sheet
            border="dashed md"
            color="surface-light"
            height="500"
            rounded="lg"
            width="100%"
          />
        </div>
      </v-main>
    </v-layout>
  </template>