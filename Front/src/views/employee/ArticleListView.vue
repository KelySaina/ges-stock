<script setup>
import { ref, computed, onMounted } from 'vue'
import { Briefcase, Grid, List, FileText } from 'lucide-vue-next'
import NavBar from '@/components/NavBar.vue'
import router from '@/router'
import axios from 'axios'

const articles = ref([])

const token = localStorage.getItem('token')

const fetchArticles = async () => {
  const articleResponse = await axios.get('http://localhost:5000/api/articles', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  articles.value = articleResponse.data.filter((article) => article.soft_del === 0)
}

onMounted(fetchArticles)

const search = ref('')

const openProfile = (artId) => {
  router.push(`/employee/transactions?artID=${artId}`)
}

const currentPage = ref(1)
const itemsPerPage = 5
const isGridView = ref(false)

// Pagination
const paginatedArticles = computed(() => {
  // Convert search query to lowercase for case-insensitive filtering
  const searchQuery = search.value ? search.value.toLowerCase() : ''

  // Filter users based on name or role
  const filteredUsers = articles.value.filter(
    (article) =>
      article.name.toLowerCase().includes(searchQuery) ||
      article.description.toLowerCase().includes(searchQuery),
  )

  // Apply pagination AFTER filtering
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredUsers.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(articles.value.length / itemsPerPage))
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
</script>

<template>
  <div class="h-screen p-4">
    <NavBar page-name="Users" />
    <div class="p-6 bg-gray-900 min-h-screen text-white">
      <div class="flex justify-between items-center mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Search by name or description"
          class="w-2/4 p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
        />

        <button
          @click="isGridView = !isGridView"
          class="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          <Grid v-if="!isGridView" class="w-5 h-5" />
          <List v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Vue Tableau -->
      <div v-if="!isGridView" class="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-gray-700 text-white">
              <th class="p-3 w-1/3">Name</th>
              <th class="p-3 w-2/3">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="article in paginatedArticles"
              :key="article.id"
              class="border-b border-gray-700 hover:bg-gray-700 text-white"
              @click="openProfile(article.id)"
            >
              <td class="p-3 w-1/3">
                <span>{{ article.name }}</span>
              </td>
              <td class="p-3 w-2/3">
                <span>{{ article.description }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Vue Grille -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="article in paginatedArticles"
          :key="article.id"
          class="bg-gray-800 p-4 rounded-lg shadow-md"
        >
          <div class="flex items-center gap-3">
            <Briefcase class="w-8 h-8 text-blue-400" />
            <h3 class="text-lg font-semibold">{{ article.name }}</h3>
          </div>
          <p class="mt-2 flex items-center gap-2 text-gray-400">
            <FileText class="w-5 h-5" /> {{ article.description }}
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-6">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-800 rounded-lg disabled:bg-gray-600"
        >
          Previous
        </button>
        <span>Page {{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-800 rounded-lg disabled:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
