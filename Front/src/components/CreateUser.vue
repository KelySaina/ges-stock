<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'
import axios from 'axios'

// Props & Emits
const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close'])

// User data model
const user = ref({
  username: '',
  email: '',
  roleId: '',
  password: '',
})

// Role list fetched from API
const roles = ref([])

// Loading state & error handling
const loading = ref(false)
const errorMessage = ref('')

// Fetch roles from API
onMounted(async () => {
  try {
    const roleResponse = await axios.get('http://localhost:5000/api/roles')
    roles.value = roleResponse.data
  } catch (error) {
    console.error('Erreur lors du chargement des rôles:', error)
  }
})

// Submit function
const createUser = async () => {
  if (!user.value.username || !user.value.email || !user.value.roleId || !user.value.password) {
    errorMessage.value = 'Veuillez remplir tous les champs.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await axios.post('http://localhost:5000/api/users', user.value)
    alert('Utilisateur créé avec succès !')
    // Reset form
    user.value = { username: '', email: '', role: '', password: '' }
    emit('close') // Close modal
  } catch (error) {
    errorMessage.value = "Erreur lors de la création de l'utilisateur."
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="props.isOpen" class="fixed inset-0 flex justify-center items-center">
    <div class="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-bold text-white mb-4">Créer un utilisateur</h2>

      <div v-if="errorMessage" class="border border-red-600 text-red-500 p-2 rounded mb-4">
        {{ errorMessage }}
      </div>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-gray-300">Nom</label>
        <input
          v-model="user.username"
          type="text"
          class="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          placeholder="Nom complet"
        />
      </div>

      <!-- Email -->
      <div class="mb-4">
        <label class="block text-gray-300">Email</label>
        <input
          v-model="user.email"
          type="email"
          class="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
        />
      </div>

      <!-- Role -->
      <div class="mb-4">
        <label class="block text-gray-300">Rôle</label>
        <select
          v-model="user.roleId"
          class="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
      </div>

      <!-- Password -->
      <div class="mb-4">
        <label class="block text-gray-300">Mot de passe</label>
        <input
          v-model="user.password"
          type="password"
          class="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          placeholder="Mot de passe"
        />
      </div>

      <!-- Buttons -->
      <div class="flex justify-end space-x-2">
        <button
          @click="$emit('close')"
          class="p-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Annuler
        </button>
        <button
          @click="createUser"
          :disabled="loading"
          class="p-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {{ loading ? 'Création...' : 'Créer' }}
        </button>
      </div>
    </div>
  </div>
</template>
