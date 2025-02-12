<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'
import axios from 'axios'

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
)

// Reactive data for transactions
const transactions = ref([])
const selectedArticle = ref(null) // Track user-selected article

const token = localStorage.getItem('token')
const fetchHistory = async () => {
  const response = await axios.get('http://localhost:5000/api/history', {
    headers: { Authorization: `Bearer ${token}` },
  })
  transactions.value = response.data

  // Select a random article after fetching
  if (transactions.value.length) {
    const randomIndex = Math.floor(Math.random() * transactions.value.length)
    selectedArticle.value = transactions.value[randomIndex].article_name
  }
}

onMounted(fetchHistory)

// Define week days (Monday–Sunday)
const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

// Get start of the current week (Monday)
const getStartOfWeek = (date) => {
  const day = date.getDay() || 7 // Convert Sunday (0) to 7
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - day + 1)
}

// Process stock movements for the bar chart
const processStockSummary = computed(() => {
  if (!transactions.value.length) return {}

  const stockSummary = {}

  transactions.value.forEach(({ article_name, sc_qty }) => {
    if (!article_name || sc_qty === undefined) return
    stockSummary[article_name] = sc_qty
  })

  return stockSummary
})

// Function to generate a unique color based on article_id
const generateColor = (id) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const r = (hash * 37) % 255
  const g = (hash * 59) % 255
  const b = (hash * 83) % 255
  return `rgba(${r}, ${g}, ${b}, 0.6)` // Adjust transparency
}

// Compute bar chart data with unique colors per article
const barChartData = computed(() => ({
  labels: Object.keys(processStockSummary.value),
  datasets: Object.entries(processStockSummary.value).map(([article, stock]) => {
    // Find the corresponding article_id from history
    const articleEntry = transactions.value.find((t) => t.article_name === article)
    const articleId = articleEntry ? articleEntry.article_id : article // Fallback to article name if ID is missing

    return {
      label: article, // Set label to article name
      data: [stock], // Stock quantity
      backgroundColor: generateColor(String(articleId)), // Generate color based on article_id
      borderColor: generateColor(String(articleId)).replace('0.6', '1'), // Stronger border color
      borderWidth: 1,
    }
  }),
}))

// Compute data for line chart (selected article)
const processStockMovement = computed(() => {
  if (!transactions.value.length || !selectedArticle.value)
    return { labels: weekDays, inData: [], outData: [] }

  const now = new Date()
  const startOfWeek = getStartOfWeek(now)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  const inMovement = weekDays.reduce((acc, day) => ({ ...acc, [day]: 0 }), {})
  const outMovement = weekDays.reduce((acc, day) => ({ ...acc, [day]: 0 }), {})

  transactions.value.forEach(({ created_at, type, quantity, article_name }) => {
    if (!created_at || !article_name || quantity === undefined) return
    if (article_name !== selectedArticle.value) return

    const date = new Date(created_at)
    if (date >= startOfWeek && date <= endOfWeek) {
      const dayLabel = date.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase()
      if (weekDays.includes(dayLabel)) {
        if (type === 'in') inMovement[dayLabel] += quantity
        else outMovement[dayLabel] += quantity
      }
    }
  })

  return {
    labels: weekDays,
    inData: Object.values(inMovement),
    outData: Object.values(outMovement),
  }
})

// Compute data for line chart
const lineChartData = computed(() => ({
  labels: processStockMovement.value.labels,
  datasets: [
    {
      label: 'Entrées',
      data: processStockMovement.value.inData,
      borderColor: 'green',
      backgroundColor: 'rgba(0, 255, 0, 0.2)',
      borderWidth: 2,
      pointRadius: 4,
      fill: true,
    },
    {
      label: 'Sorties',
      data: processStockMovement.value.outData,
      borderColor: 'red',
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      borderWidth: 2,
      pointRadius: 4,
      fill: true,
    },
  ],
}))

// Chart options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top', labels: { color: 'white' } },
  },
  scales: {
    x: { ticks: { color: 'white' } },
    y: { ticks: { color: 'white' }, beginAtZero: true },
  },
}
</script>

<template>
  <div
    class="bg-gray-800 p-4 rounded-lg shadow-md mt-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
  >
    <!-- Title (Spans full width) -->
    <h2
      class="text-white text-2xl font-bold mb-4 col-span-1 md:col-span-2 lg:col-span-5 text-center lg:text-left"
    >
      Stock Movement - Current Week
    </h2>

    <!-- Bar Chart (Takes up full width on small screens, half on medium, 2/5 on large) -->
    <div class="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col items-center">
      <h3 class="text-white text-xl font-semibold mb-2 text-center lg:text-left">
        Total Stock Movements per Article
      </h3>
      <div class="w-full">
        <Bar v-if="barChartData.labels.length" :data="barChartData" :options="chartOptions" />
        <p v-else class="text-white text-center">No data available for this week.</p>
      </div>
    </div>

    <!-- Line Chart & Dropdown (Takes up full width on small, 3/5 on large) -->
    <div class="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col">
      <h3 class="text-white text-xl font-semibold mb-2 text-center lg:text-left">
        In & Out Movements for {{ selectedArticle }}
      </h3>

      <!-- Article Selector -->
      <div class="mb-4 w-full">
        <label for="article-select" class="text-white block text-lg font-semibold mb-1">
          Select an Article:
        </label>
        <select
          id="article-select"
          v-model="selectedArticle"
          class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option
            v-for="article in Object.keys(processStockSummary)"
            :key="article"
            :value="article"
          >
            {{ article }}
          </option>
        </select>
      </div>

      <div class="w-full">
        <Line
          v-if="selectedArticle && lineChartData.labels.length"
          :data="lineChartData"
          :options="chartOptions"
        />
        <p v-else class="text-white text-center">Select an article to view detailed movements.</p>
      </div>
    </div>
  </div>
</template>
