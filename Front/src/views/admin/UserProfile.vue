<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
const route = useRoute()

const userId = route.params.id

const token = localStorage.getItem('token')

// Réactif pour stocker les infos de l'utilisateur
const user = ref({
  username: '',
  email: '',
  role_name: '',
  isRestricted: 0,
})

const roles = ref([])

// États pour l'édition et le chargement
const isEditing = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const fetchRoles = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    roles.value = response.data
  } catch (error) {
    console.error('Erreur chargement utilisateur:', error)
  }
}

// Charger les infos de l'utilisateur depuis l'API
const fetchUser = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    user.value = response.data
    user.value.isRestricted = Boolean(response.data.isRestricted)
  } catch (error) {
    console.error('Erreur chargement utilisateur:', error)
  }
}

// Mettre à jour les informations de l'utilisateur
const updateUser = async () => {
  isLoading.value = true
  try {
    await axios.put(
      `http://localhost:5000/api/users/${userId}`,
      {
        ...user.value,
        isRestricted: user.value.isRestricted ? 1 : 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    isEditing.value = false
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Erreur lors de la mise à jour.'
  } finally {
    isLoading.value = false
  }
}

// Charger les données à l'affichage du composant
onMounted(async () => {
  fetchRoles()
  fetchUser()
})
</script>

<template>
  <div class="h-screen p-4">
    <NavBar page-name="Profile" />
    <div class="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md mt-10">
      <h2 class="text-2xl font-bold text-center mb-6">User Profile</h2>

      <!-- Message d'erreur -->
      <p v-if="errorMessage" class="text-red-500 text-center">{{ errorMessage }}</p>

      <!-- Champs utilisateur -->
      <div class="space-y-4">
        <div>
          <label class="block text-gray-300">Name</label>
          <input
            v-model="user.username"
            :disabled="!isEditing"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-gray-300">Email</label>
          <input
            v-model="user.email"
            type="email"
            :disabled="!isEditing"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-gray-300">Role</label>
          <select
            v-model="user.role_id"
            :disabled="!isEditing"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name.charAt(0).toUpperCase() + role.name.slice(1) }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="user.isRestricted" :disabled="!isEditing" id="restrict" />
          <label for="restrict" class="block text-gray-300">Restrict Account</label>
        </div>
      </div>

      <!-- Boutons -->
      <div class="flex justify-between mt-6">
        <button
          v-if="!isEditing"
          @click="isEditing = true"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
        >
          Modifier
        </button>

        <button
          v-if="isEditing"
          @click="updateUser"
          class="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg flex items-center"
          :disabled="isLoading"
        >
          <span
            v-if="isLoading"
            class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
          ></span>
          Sauvegarder
        </button>

        <button
          v-if="isEditing"
          @click="isEditing = false"
          class="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>
