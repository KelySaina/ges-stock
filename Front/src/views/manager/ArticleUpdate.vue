<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import router from '@/router'
import NavBar from '@/components/NavBar.vue'
const route = useRoute()

const articleId = route.params.id

const token = localStorage.getItem('token')

// Réactif pour stocker les infos de l'utilisateur
const article = ref({
  name: '',
  description: '',
})

// États pour l'édition et le chargement
const isEditing = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Charger les infos de l'utilisateur depuis l'API
const fetchArticle = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/articles/${articleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    article.value = response.data
    article.value.isRestricted = Boolean(response.data.isRestricted)
  } catch (error) {
    console.error('Erreur chargement utilisateur:', error)
  }
}

// Mettre à jour les informations de l'utilisateur
const updateArt = async () => {
  isLoading.value = true
  try {
    await axios.put(
      `http://localhost:5000/api/articles/${articleId}`,
      {
        ...article.value,
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
const supprimerArt = async () => {
  const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cet article ?')

  if (!confirmation) return

  isLoading.value = true
  try {
    await axios.delete(`http://localhost:5000/api/articles/${articleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Redirection après suppression
    router.push('/manager/articles')
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Erreur lors de la suppression.'
  } finally {
    isLoading.value = false
  }
}

// Charger les données à l'affichage du composant
onMounted(async () => {
  fetchArticle()
})
</script>

<template>
  <div class="h-screen p-4">
    <NavBar page-name="Profile" />
    <div class="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md mt-10">
      <h2 class="text-2xl font-bold text-center mb-6">Article</h2>

      <!-- Message d'erreur -->
      <p v-if="errorMessage" class="text-red-500 text-center">{{ errorMessage }}</p>

      <!-- Champs utilisateur -->
      <div class="space-y-4">
        <div>
          <label class="block text-gray-300">Name</label>
          <input
            v-model="article.name"
            :disabled="!isEditing"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-gray-300">Description</label>
          <input
            v-model="article.description"
            type="email"
            :disabled="!isEditing"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
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
          v-if="!isEditing"
          @click="supprimerArt"
          class="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg"
        >
          Supprimer
        </button>

        <button
          v-if="isEditing"
          @click="updateArt"
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
