<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  HomeIcon,
  UsersIcon,
  MenuIcon,
  HistoryIcon,
  PowerIcon,
  ArrowLeftRightIcon,
  BriefcaseIcon,
} from 'lucide-vue-next'

const router = useRouter()
const sidebarOpen = ref(false)
const userRole = ref(null)
const pageName = ref('')

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user_role')
  router.push('/login')
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Retrieve user role from localStorage on component mount
onMounted(() => {
  userRole.value = Number(localStorage.getItem('user_role'))
  userRole.value == 1
    ? (pageName.value = 'Admin Dashboard')
    : userRole.value == 2
      ? (pageName.value = 'Manager Dashboard')
      : userRole.value == 3
        ? (pageName.value = 'Employee Dashboard')
        : (pageName.value = '')
})

// Compute roleName dynamically
const roleName = computed(() => {
  return userRole.value === 1
    ? 'admin'
    : userRole.value === 2
      ? 'manager'
      : userRole.value === 3
        ? 'employee'
        : ''
})
// Define navigation items dynamically based on role
const navigationLinks = computed(() => {
  const links = [
    { name: 'Dashboard', path: `/${roleName.value}/dashboard`, icon: HomeIcon, roles: [1, 2] },
    { name: 'History', path: `/${roleName.value}/history`, icon: HistoryIcon, roles: [1, 2] },
    { name: 'Users', path: `/${roleName.value}/users`, icon: UsersIcon, roles: [1] },
    {
      name: 'Transactions',
      path: `/${roleName.value}/transactions`,
      icon: ArrowLeftRightIcon,
      roles: [3],
    },
    { name: 'Articles', path: `/${roleName.value}/articles`, icon: BriefcaseIcon, roles: [2, 3] },
  ]
  return links.filter((link) => link.roles.includes(userRole.value))
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
      <span>{{ pageName }}</span>
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
      <template v-for="link in navigationLinks" :key="link.path">
        <a
          :href="link.path"
          class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <component :is="link.icon" class="w-5 h-5 mr-2" /> {{ link.name }}
        </a>
      </template>
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
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ pageName }}</h2>
      <nav class="grid gap-2 grid-cols-3 hidden md:grid">
        <template v-for="link in navigationLinks" :key="link.path">
          <a
            :href="link.path"
            class="flex items-center justify-center p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <component :is="link.icon" class="w-5 h-5 mr-2" /> {{ link.name }}
          </a>
        </template>
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
