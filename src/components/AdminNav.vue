<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
const { user, logout } = useAuth()

const handleLogout = async () => {
  await logout()
}

const goToAdmin = () => {
  router.push('/admin')
}
</script>

<template>
  <div class="bg-cyan-600 dark:bg-cyan-700 text-white py-2 px-4 shadow-md">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <i class="pi pi-shield text-xl"></i>
        <div>
          <span class="font-semibold">Admin Mode</span>
          <span v-if="user" class="text-cyan-100 text-sm ml-2">
            {{ user.email || user.username }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Button
          label="Dashboard"
          icon="pi pi-home"
          text
          severity="secondary"
          size="small"
          class="text-white hover:bg-cyan-700 dark:hover:bg-cyan-600"
          @click="goToAdmin"
        />
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          text
          severity="secondary"
          size="small"
          class="text-white hover:bg-cyan-700 dark:hover:bg-cyan-600"
          @click="handleLogout"
        />
      </div>
    </div>
  </div>
</template>
