<script setup>
import { ref, computed } from 'vue'
import { User, Mail, Briefcase, Grid, List } from 'lucide-vue-next'
import NavBar from '@/components/NavBar.vue'
import router from '@/router'

const users = ref([
  { id: 1, name: 'Alice Dupont', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Jean Martin', email: 'jean@example.com', role: 'Utilisateur' },
  { id: 3, name: 'Sophie Bernard', email: 'sophie@example.com', role: 'Modérateur' },
  { id: 4, name: 'Thomas Durand', email: 'thomas@example.com', role: 'Utilisateur' },
  { id: 5, name: 'Emma Lefevre', email: 'emma@example.com', role: 'Admin' },
  { id: 6, name: 'Lucas Moreau', email: 'lucas@example.com', role: 'Utilisateur' },
  { id: 7, name: 'Chloé Simon', email: 'chloe@example.com', role: 'Modérateur' },
  { id: 8, name: 'Nathan Robert', email: 'nathan@example.com', role: 'Utilisateur' },
])

const openProfile = (userId) => {
  router.push(`/user/profile/${userId}`)
}

const currentPage = ref(1)
const itemsPerPage = 5
const isGridView = ref(false)

// Pagination
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return users.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage))
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
        <h2 class="text-2xl font-bold">All Users</h2>
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
              <th class="p-3 w-1/3">Mail</th>
              <th class="p-3 w-1/3">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in paginatedUsers"
              :key="user.id"
              class="border-b border-gray-700 hover:bg-gray-700 text-white"
              @click="openProfile(user.id)"
            >
              <td class="p-3 w-1/3">
                <span>{{ user.name }}</span>
              </td>
              <td class="p-3 w-1/3">
                <span>{{ user.email }}</span>
              </td>
              <td class="p-3 w-1/3">
                <span>{{ user.role }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Vue Grille -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="user in paginatedUsers"
          :key="user.id"
          class="bg-gray-800 p-4 rounded-lg shadow-md"
        >
          <div class="flex items-center gap-3">
            <User class="w-8 h-8 text-blue-400" />
            <h3 class="text-lg font-semibold">{{ user.name }}</h3>
          </div>
          <p class="mt-2 flex items-center gap-2 text-gray-400">
            <Mail class="w-5 h-5" /> {{ user.email }}
          </p>
          <p class="mt-2 flex items-center gap-2 text-gray-400">
            <Briefcase class="w-5 h-5" /> {{ user.role }}
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-6">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
        >
          Back
        </button>
        <span>Page {{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
