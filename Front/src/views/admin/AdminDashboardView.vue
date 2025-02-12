<script setup>
import { UsersIcon, BoxIcon } from 'lucide-vue-next'
import StockChart from '@/components/StockChart.vue'
import NavBar from '@/components/NavBar.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'

const users = ref([])
const token = localStorage.getItem('token')

const fetchUser = async () => {
  const userResponse = await axios.get('http://localhost:5000/api/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  users.value = userResponse.data
}

const articles = ref([])
const fetchArticles = async () => {
  const articleResponse = await axios.get('http://localhost:5000/api/articles', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  articles.value = articleResponse.data
}

onMounted(() => {
  fetchUser()
  fetchArticles()
})
</script>

<template>
  <div class="h-screen p-4">
    <NavBar />
    <!-- Dashboard Content -->
    <main class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <!-- Card -->
        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between"
        >
          <div>
            <h3 class="text-4xl font-bold text-gray-900 dark:text-white">{{ users.length }}</h3>
            <p class="text-gray-600 dark:text-gray-300">Users</p>
          </div>
          <UsersIcon size="48" color="white" />
        </div>

        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between"
        >
          <div>
            <h3 class="text-4xl font-bold text-gray-900 dark:text-white">{{ articles.length }}</h3>
            <p class="text-gray-600 dark:text-gray-300">Articles</p>
          </div>
          <BoxIcon size="48" color="white" />
        </div>
      </div>
      <div>
        <StockChart />
      </div>
    </main>
  </div>
</template>

<style>
/* Permet d'activer le dark mode si activé */
.dark {
  background-color: #1a202c;
  color: white;
}
</style>
