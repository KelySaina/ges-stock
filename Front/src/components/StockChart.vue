<script setup>
import { defineProps, computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'

// Enregistrement des composants Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

// Props pour les données du graphique
const props = defineProps({
  labels: Array,
  stockMovement: Object,
})

// Génération dynamique des datasets pour chaque article
const chartData = computed(() => ({
  labels: props.labels,
  datasets: Object.keys(props.stockMovement).map((article, index) => ({
    label: `Mouvements - ${article}`,
    data: props.stockMovement[article],
    borderColor: `hsl(${index * 60}, 70%, 50%)`,
    backgroundColor: `hsl(${index * 60}, 70%, 70%, 0.2)`,
    borderWidth: 2,
    pointRadius: 4,
    fill: true,
  })),
}))

// Options du graphique
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: { color: 'white' },
    },
  },
  scales: {
    x: { ticks: { color: 'white' } },
    y: { ticks: { color: 'white' }, beginAtZero: true },
  },
}
</script>

<template>
  <div class="bg-gray-800 p-4 rounded-lg shadow-md mt-6">
    <h2 class="text-white text-2xl font-bold mb-4">Stock movement - Current Month</h2>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
