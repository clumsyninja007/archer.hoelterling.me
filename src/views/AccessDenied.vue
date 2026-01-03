<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
const { isAuthenticated, user, logout } = useAuth()

const handleLogout = async () => {
  await logout()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
    <div class="max-w-2xl w-full mx-4">
      <div class="bg-surface-0 dark:bg-surface-900 rounded-lg shadow-lg p-8">
        <div class="text-center mb-6">
          <i class="pi pi-lock text-6xl text-red-500 mb-4"></i>
          <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">
            Access Denied
          </h1>
          <p class="text-surface-600 dark:text-surface-400">
            You don't have permission to access this page
          </p>
        </div>

        <div v-if="isAuthenticated && user" class="bg-surface-100 dark:bg-surface-800 rounded-lg p-4 mb-6">
          <p class="text-sm text-surface-600 dark:text-surface-400 mb-1">Currently logged in as:</p>
          <p class="font-semibold text-surface-900 dark:text-surface-0">
            {{ user.email || user.username }}
          </p>
          <p class="text-sm text-surface-600 dark:text-surface-400 mt-2">
            This account does not have the required administrator role.
          </p>
        </div>

        <div class="space-y-4">
          <div class="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p class="text-sm text-surface-700 dark:text-surface-300">
              If you believe you should have access, please contact the administrator.
            </p>
          </div>

          <div class="flex gap-3">
            <Button
              label="Go to Home"
              icon="pi pi-home"
              @click="goHome"
              class="flex-1"
            />
            <Button
              v-if="isAuthenticated"
              label="Logout"
              icon="pi pi-sign-out"
              severity="secondary"
              @click="handleLogout"
              class="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>