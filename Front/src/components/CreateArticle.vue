<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import axios from 'axios'

// Props & Emits
const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close'])

// article data model
const article = ref({
  name: '',
  description: '',
})

// Loading state & error handling
const loading = ref(false)
const errorMessage = ref('')

const token = localStorage.getItem('token')

// Submit function
const createArticle = async () => {
  if (!article.value.name || !article.value.description) {
    errorMessage.value = 'Veuillez remplir tous les champs.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await axios.post('http://localhost:5000/api/articles', article.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    alert('article ajouté avec succès !')

    // Reset form
    article.value = { name: '', description: '' }
    emit('close') // Close modal
  } catch (error) {
    errorMessage.value = "Erreur lors de la ajout de l'article."
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="props.isOpen" class="fixed inset-0 flex justify-center items-center">
    <div class="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-bold text-white mb-4">Ajouter un article</h2>

      <div v-if="errorMessage" class="border border-red-600 text-red-500 p-2 rounded mb-4">
        {{ errorMessage }}
      </div>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-gray-300">Nom</label>
        <input
          v-model="article.name"
          type="text"
          class="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          placeholder="Name"
        />
      </div>

      <!-- Email -->
      <div class="mb-4">
        <label class="block text-gray-300">Description</label>
        <input
          v-model="article.description"
          type="text"
          class="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          placeholder="Description"
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
          @click="createArticle"
          :disabled="loading"
          class="p-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {{ loading ? 'Création...' : 'Créer' }}
        </button>
      </div>
    </div>
  </div>
</template>
