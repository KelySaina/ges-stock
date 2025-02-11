<script setup>
import { ref, computed, onMounted } from 'vue'
import { format, parseISO, isWithinInterval } from 'date-fns'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'
import axios from 'axios'

const transactions = ref([])
const token = localStorage.getItem('token')
const fetchHistory = async () => {
  const response = await axios.get('http://localhost:5000/api/history', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  transactions.value = response.data
}

onMounted(fetchHistory)

const selectedDate = ref(null)
const startDate = ref(null)
const endDate = ref(null)

const filteredTransactions = computed(() => {
  return transactions.value.filter((t) => {
    const transactionDate = parseISO(t.created_at)
    const today = format(new Date(), 'yyyy-MM-dd')

    if (selectedDate.value) {
      return format(transactionDate, 'yyyy-MM-dd') === format(selectedDate.value, 'yyyy-MM-dd')
    }
    if (startDate.value && endDate.value) {
      return isWithinInterval(transactionDate, { start: startDate.value, end: endDate.value })
    }

    // Afficher uniquement les transactions d'aujourd'hui par défaut
    return format(transactionDate, 'yyyy-MM-dd') === today
  })
})

const totalIn = computed(() => filteredTransactions.value.filter((t) => t.type === 'in').length)
const totalOut = computed(() => filteredTransactions.value.filter((t) => t.type === 'out').length)

const perPage = 5
const currentPage = ref(1)
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredTransactions.value.slice(start, start + perPage)
})

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / perPage))

const minEndDate = computed(() => (startDate.value ? format(startDate.value, 'yyyy-MM-dd') : null))

const clearFilters = () => {
  selectedDate.value = null
  startDate.value = null
  endDate.value = null
}
</script>

<template>
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
    <!-- Filtres et statistiques -->
    <div class="col-span-1 space-y-4">
      <!-- Statistiques -->
      <div class="space-y-4">
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4">
          <TrendingUp class="text-green-500 w-8 h-8" />
          <div>
            <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">Ajouts</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ totalIn }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4">
          <TrendingDown class="text-red-500 w-8 h-8" />
          <div>
            <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">Sorties</p>
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ totalOut }}</p>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-gray-300 mb-2">Filtres</h2>
        <div class="grid grid-cols-2 gap-2 text-white">
          <button @click="clearFilters" class="p-2 bg-gray-700 text-white rounded-md col-span-2">
            Aujourd'hui
          </button>
          <label for="">Entre deux dates</label>
          <div class="col-span-2 flex justify-between">
            <input
              type="date"
              @change="selectedDate = null"
              v-model="startDate"
              class="p-2 bg-gray-700 text-white rounded-md"
            />
            <input
              type="date"
              @change="selectedDate = null"
              v-model="endDate"
              class="p-2 bg-gray-700 text-white rounded-md"
              :min="minEndDate"
            />
          </div>
          <label for="">Une date precise</label>
          <input
            type="date"
            v-model="selectedDate"
            @change="
              () => {
                startDate = null
                endDate = null
              }
            "
            class="p-2 bg-gray-700 text-white rounded-md col-span-2"
          />
        </div>
      </div>
    </div>

    <!-- Liste des transactions -->
    <div class="col-span-2 bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 class="text-lg font-semibold text-gray-300 mb-4">Historique des Transactions</h2>
      <div class="space-y-2">
        <div
          v-for="transaction in paginatedTransactions"
          :key="transaction.id"
          :class="[
            'p-2 rounded-md shadow-md flex justify-between items-center',
            transaction.type === 'in' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200',
          ]"
        >
          <span class="text-sm">
            {{ transaction.role_name.charAt(0).toUpperCase() + transaction.role_name.slice(1) }}
            <b>{{ transaction.username }}</b> a
            {{ transaction.type === 'in' ? 'ajouté' : 'retiré' }}
            <span v-if="transaction.operation === 'INSERT'">
              un nouvel article {{ transaction.article_name }} <br /><b
                >Quantité: {{ transaction.sc_qty }}</b
              >
            </span>
            <span v-else>
              {{ transaction.quantity }} {{ transaction.article_name }} <br /><b>
                Quantité: {{ transaction.sc_qty }} ->
                {{ transaction.sc_qty + (transaction.quantity - transaction.old_quantity) }}
              </b>
            </span>
          </span>

          <span class="text-sm">
            {{ format(new Date(transaction.created_at), 'dd-MM-yyyy HH:mm') }}
          </span>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 bg-gray-700 text-white rounded-md disabled:opacity-50"
        >
          Précédent
        </button>
        <span class="text-gray-300">Page {{ currentPage }} sur {{ totalPages }}</span>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 bg-gray-700 text-white rounded-md disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>
