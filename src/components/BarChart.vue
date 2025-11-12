<template>
  <div>
    <Bar :data="data" :options="options" />
  </div>
</template>

<script setup>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Enregistrer les composants nécessaires
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Props depuis le parent
defineProps({
  data: Object,
  options: Object,
});
</script>