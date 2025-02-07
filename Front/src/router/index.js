import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import UsersListView from '@/views/UsersListView.vue'
import UserProfile from '@/views/UserProfile.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: AdminDashboardView, meta: { requiresAuth: true } },
  { path: '/users', component: UsersListView, meta: { requiresAuth: true } },
  { path: '/user/profile/:id', component: UserProfile, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.path === '/login' && token) {
    next('/dashboard')
  } else if (to.path === '/dashboard' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
