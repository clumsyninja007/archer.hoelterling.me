<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import AdminNav from '@/components/AdminNav.vue'
import Toast from 'primevue/toast'
import { useAuth } from '@/composables/useAuth'

const { isAdmin } = useAuth()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Toast />
    <AdminNav v-if="isAdmin" />
    <Navbar />
    <RouterView />
  </div>
</template>

<style scoped></style>
