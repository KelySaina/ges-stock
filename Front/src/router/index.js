import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import UsersListView from '@/views/admin/UsersListView.vue'
import UserProfile from '@/views/admin/UserProfile.vue'
import ManagerDashboardView from '@/views/manager/ManagerDashboardView.vue'
import EmployeeDashboardView from '@/views/employee/EmployeeDashboardView.vue'
import ArticleListView from '@/views/employee/ArticleListView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  {
    path: '/admin/dashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, role: 1 },
  },
  { path: '/admin/users', component: UsersListView, meta: { requiresAuth: true, role: 1 } },
  {
    path: '/admin/user/profile/:id',
    component: UserProfile,
    meta: { requiresAuth: true, role: 1 },
  },
  {
    path: '/manager/dashboard',
    component: ManagerDashboardView,
    meta: { requiresAuth: true, role: 2 },
  },
  {
    path: '/employee/transactions',
    component: EmployeeDashboardView,
    meta: { requiresAuth: true, role: 3 },
  },
  {
    path: '/employee/articles',
    component: ArticleListView,
    meta: { requiresAuth: true, role: 3 },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = Number(localStorage.getItem('user_role')) // Convertir en nombre

  if (to.path === '/login' && token && role) {
    // Rediriger vers le bon tableau de bord
    if (role === 1) next('/admin/dashboard')
    else if (role === 2) next('/manager/dashboard')
    else if (role === 3) next('/employee/transactions')
    else next('/login')
  } else if (to.meta.requiresAuth) {
    if (!token || !role) {
      next('/login')
    } else if (to.meta.role && to.meta.role !== role) {
      // Empêcher l'accès à un tableau de bord non autorisé
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
