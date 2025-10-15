<template>
  <v-container>
    <v-row dense>
      <v-col
        v-for="(card, i) in stats"
        :key="i"
        cols="12" sm="6" md="3"
      >
        <v-card class="pa-4" elevation="2" rounded="xl">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h6 font-weight-medium">{{ card.title }}</div>
              <div class="text-h5 font-weight-bold mt-1">{{ card.value }}</div>
              <div class="text-caption" :class="card.trend > 0 ? 'text-success' : 'text-error'">
                {{ card.trend > 0 ? '+' : '' }}{{ card.trend }}% vs last week
              </div>
            </div>
            <v-avatar
              size="48"
              :color="card.color"
              variant="tonal"
            >
              <v-icon :icon="card.icon" size="28"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const stats = [
  {
    title: 'Utilisateurs',
    value: '1,234',
    trend: 12,
    icon: 'mdi-account-group',
    color: 'blue'
  },
  {
    title: 'Ventes',
    value: '€8,450',
    trend: 5.4,
    icon: 'mdi-cart',
    color: 'green'
  },
  {
    title: 'Visites',
    value: '25,300',
    trend: -2.1,
    icon: 'mdi-eye',
    color: 'orange'
  },
  {
    title: 'Commandes',
    value: '310',
    trend: 7.2,
    icon: 'mdi-truck-delivery',
    color: 'purple'
  }
]
</script>
