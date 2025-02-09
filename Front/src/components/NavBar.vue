<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { HomeIcon, UsersIcon, MenuIcon, HistoryIcon, PowerIcon } from 'lucide-vue-next'

const router = useRouter()
const sidebarOpen = ref(false)
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user_role')
  router.push('/login')
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const props = defineProps({
  pageName: String,
})
</script>
<template>
  <!-- Sidebar -->
  <aside
    :class="`w-64 bg-white dark:bg-gray-800 p-5 transition-transform duration-300 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-64'
    } fixed inset-y-0 left-0 shadow-lg z-50`"
  >
    <h1 class="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-between">
      <span>{{ props.pageName }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6 cursor-pointer"
        @click="sidebarOpen = false"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </h1>
    <nav class="mt-5 space-y-2">
      <a
        href="/dashboard"
        class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <HomeIcon class="w-5 h-5 mr-2" /> Dashboard
      </a>
      <a
        href="#"
        class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <HistoryIcon class="w-5 h-5 mr-2" /> History
      </a>
      <a
        href="users"
        class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <UsersIcon class="w-5 h-5 mr-2" /> Users
      </a>
    </nav>
  </aside>

  <!-- Main Content -->
  <div class="flex flex-col flex-1">
    <!-- Header -->
    <header
      class="bg-white dark:bg-gray-800 p-4 shadow-md flex justify-between items-center rounded-md"
    >
      <button @click="toggleSidebar" class="md:hidden text-gray-700 dark:text-gray-200">
        <MenuIcon class="w-6 h-6" />
      </button>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ props.pageName }}</h2>
      <nav class="grid gap-2 grid-cols-3 hidden md:grid">
        <a
          href="/dashboard"
          class="flex items-center justify-center p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <HomeIcon class="w-5 h-5 mr-2" /> Dashboard
        </a>
        <a
          href="#"
          class="flex items-center justify-center p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <HistoryIcon class="w-5 h-5 mr-2" /> History
        </a>
        <a
          href="/users"
          class="flex items-center justify-center p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <UsersIcon class="w-5 h-5 mr-2" /> Users
        </a>
      </nav>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <button
            class="flex items-center space-x-2 text-white hover:cursor-pointer hover:border-2 rounded-[50%] p-1 hover:bg-red-500"
            @click="logout"
          >
            <PowerIcon />
          </button>
        </div>
      </div>
    </header>
  </div>
</template>
