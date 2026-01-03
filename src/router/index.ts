import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/resume',
    name: 'Resume',
    component: () => import('@/views/Resume.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { requiresAuth: true, requiresRole: 'content-admin' }
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: () => import('@/views/AccessDenied.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Global navigation guard for authentication
router.beforeEach(async (to, _, next) => {
  if (to.meta.requiresAuth) {
    const { isInitialized, init, isAuthenticated, isAdmin, login } = useAuth()

    // Initialize Keycloak if not already done
    if (!isInitialized.value) {
      try {
        await init()
      } catch (error: unknown) {
        // If initialization fails but it's not a "login_required" error, log it
        const err = error as { error?: string }
        if (err?.error !== 'login_required') {
          console.error('Failed to initialize auth:', error)
        }
        // Continue to check authentication status anyway
      }
    }

    if (!isAuthenticated.value) {
      // Not authenticated, redirect to Keycloak login
      await login(`${window.location.origin}${to.fullPath}`)
      return
    }

    // Check if route requires specific role
    if (to.meta.requiresRole) {
      if (!isAdmin.value) {
        // Authenticated but doesn't have required role
        next('/access-denied')
        return
      }
    }
  }

  next()
})

export default router
