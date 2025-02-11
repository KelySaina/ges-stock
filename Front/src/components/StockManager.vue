<script setup>
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const articles = ref([])
const searchQuery = ref('')
const selectedArticle = ref(null)
const transactionType = ref('in')
const quantity = ref(0)
const token = localStorage.getItem('token')
const msg = ref({ display: false, content: '' })

// Fetch articles from API (Replace with your actual endpoint)
const fetchArticles = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/articles', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = response.data
    articles.value = data.map((article) => ({
      id: article.id,
      name: article.name,
      description: article.description,
      created_by: article.created_by,
      created_at: new Date(article.created_at).toLocaleDateString(),
    }))
  } catch (error) {
    console.error('Error fetching articles:', error)
  }
}

// Filter articles dynamically based on user input
const filteredArticles = computed(() =>
  searchQuery.value
    ? articles.value.filter((article) =>
        article.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
      )
    : articles.value,
)

const selected = ref(false)

// Select an article
const selectArticle = (article) => {
  selectedArticle.value = article.id
  searchQuery.value = article.name + ' - ' + article.description
  selected.value = true
}

// Fetch articles on component mount
onMounted(async () => {
  fetchArticles()
  const route = useRoute()
  const artId = route.query.artID

  if (artId) {
    const response = await axios.get(`http://localhost:5000/api/articles/${artId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const article = response.data
    selectArticle(article)
  }
})

const validerTransaction = async () => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/transaction',
      {
        article_id: selectedArticle.value,
        quantity: quantity.value,
        action: transactionType.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const data = response.data
    msg.value.display = true
    msg.value.content = data
    selectedArticle.value = null
    searchQuery.value = ''
  } catch (error) {
    console.error('Error doing transaction:', error)
  }
}
</script>

<template>
  <div class="bg-gray-800 text-white p-6 rounded-2xl shadow-lg w-2/3 relative">
    <h2 class="text-lg font-bold mb-4">Transaction</h2>
    <p v-if="msg.display">{{ msg.content }}</p>

    <!-- In / Out Radio -->
    <div class="mt-4">
      <label class="block text-gray-300">Transaction Type</label>
      <div class="flex gap-4 mt-2">
        <label class="flex items-center gap-2">
          <input
            type="radio"
            v-model="transactionType"
            value="in"
            class="form-radio text-blue-500 bg-gray-800 border-gray-700"
          />
          In
        </label>
        <label class="flex items-center gap-2">
          <input
            type="radio"
            v-model="transactionType"
            value="out"
            class="form-radio text-blue-500 bg-gray-800 border-gray-700"
          />
          Out
        </label>
      </div>
    </div>

    <!-- Input with Filterable List -->
    <label class="block mb-2 text-gray-300">Select Article</label>
    <input
      v-model="searchQuery"
      @input="selected = false"
      placeholder="Search article..."
      class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <!-- Filtered Dropdown -->
    <ul
      v-if="searchQuery && filteredArticles.length && !selected"
      class="absolute bg-gray-800 w-full mt-1 rounded-md border border-gray-700 overflow-hidden"
    >
      <li
        v-for="article in filteredArticles"
        :key="article"
        @click="selectArticle(article)"
        class="p-2 cursor-pointer hover:bg-blue-600"
      >
        <b>{{ article.name }}</b> - {{ article.description }}
      </li>
    </ul>

    <!-- Quantity Input -->
    <div class="mt-4">
      <label class="block text-gray-300">Quantity</label>
      <input
        type="number"
        v-model="quantity"
        min="1"
        class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Validate Button -->
    <button
      @click="validerTransaction"
      class="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-md transition"
    >
      Validate
    </button>
  </div>
</template>

<style scoped>
/* Optional styling if needed */
</style>
