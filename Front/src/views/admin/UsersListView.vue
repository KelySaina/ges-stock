<script setup>
import { ref, computed, onMounted } from 'vue'
import { User, Mail, Briefcase, Grid, List } from 'lucide-vue-next'
import NavBar from '@/components/NavBar.vue'
import router from '@/router'
import CreateUser from '@/components/CreateUser.vue'
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

onMounted(fetchUser)

const search = ref('')

const openProfile = (userId) => {
  router.push(`/admin/user/profile/${userId}`)
}

const currentPage = ref(1)
const itemsPerPage = 5
const isGridView = ref(false)

// Pagination
const paginatedUsers = computed(() => {
  // Convert search query to lowercase for case-insensitive filtering
  const searchQuery = search.value ? search.value.toLowerCase() : ''

  // Filter users based on name or role
  const filteredUsers = users.value.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery) ||
      user.role_name.toLowerCase().includes(searchQuery),
  )

  // Apply pagination AFTER filtering
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredUsers.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage))
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const isModalOpen = ref(false)
</script>

<template>
  <div class="h-screen p-4">
    <NavBar page-name="Users" />
    <div class="p-6 bg-gray-900 min-h-screen text-white">
      <div class="flex justify-between items-center mb-4">
        <button
          class="p-2 px-8 bg-gray-700 rounded-lg hover:bg-gray-600"
          @click="isModalOpen = true"
        >
          Add new user
        </button>

        <input
          v-model="search"
          type="text"
          placeholder="Search by name, email or role"
          class="w-1/4 p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
        />

        <button
          @click="isGridView = !isGridView"
          class="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          <Grid v-if="!isGridView" class="w-5 h-5" />
          <List v-else class="w-5 h-5" />
        </button>
      </div>

      <div>
        <CreateUser
          :isOpen="isModalOpen"
          @close="
            () => {
              isModalOpen = false
              fetchUser()
            }
          "
        />
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
                <span>{{ user.username }}</span>
              </td>
              <td class="p-3 w-1/3">
                <span>{{ user.email }}</span>
              </td>
              <td class="p-3 w-1/3">
                <span>{{ user.role_name.charAt(0).toUpperCase() + user.role_name.slice(1) }}</span>
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
            <h3 class="text-lg font-semibold">{{ user.username }}</h3>
          </div>
          <p class="mt-2 flex items-center gap-2 text-gray-400">
            <Mail class="w-5 h-5" /> {{ user.email }}
          </p>
          <p class="mt-2 flex items-center gap-2 text-gray-400">
            <Briefcase class="w-5 h-5" />
            {{ user.role_name.charAt(0).toUpperCase() + user.role_name.slice(1) }}
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
          Back
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
