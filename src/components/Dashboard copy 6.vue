<template>
  <div>
    <h3 class="text-center mb-4">Répartition des projets</h3>
    <apexchart 
      type="donut" 
      height="300" 
      :series="series" 
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

// --- Données dynamiques ---
const series = ref([45, 30, 25]) // Valeurs initiales
const chartOptions = ref({
  labels: ['Terminés', 'En cours', 'En retard'],
  legend: { position: 'bottom' },
  colors: ['#4caf50', '#1976d2', '#f44336'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: { width: 300 },
      legend: { position: 'bottom' }
    }
  }]
})

// --- Simulation de mise à jour dynamique ---
onMounted(() => {
  setInterval(() => {
    // Génère des valeurs aléatoires qui totalisent 100
    const t = Math.floor(Math.random() * 50) + 20
    const e = Math.floor(Math.random() * 30) + 10
    const r = 100 - t - e
    series.value = [t, e, r]
  }, 3000)
})
</script>

<script>
export default {
  components: { apexchart: VueApexCharts }
}
</script>
