<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Button from 'primevue/button'
import { usePersonalInfo } from '@/composables/usePersonalInfo'

const { data } = usePersonalInfo()

const isDark = ref<boolean>(false)

// Initialize theme
onMounted(() => {
  const stored = localStorage.getItem('theme')
  if (stored) {
    isDark.value = stored === 'dark'
  } else {
    // Default to system preference
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  updateTheme()
})

// Watch for changes
watch(isDark, () => {
  updateTheme()
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
})

function updateTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
}
</script>

<template>
  <header class="border-b border-surface-300 dark:border-surface-700 bg-surface-100 dark:bg-surface-900 text-surface-900 dark:text-surface-50">
    <nav class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between" aria-label="Main navigation">
      <div class="flex items-center gap-2">
        <i class="pi pi-briefcase text-blue-500 text-2xl" aria-hidden="true"></i>
        <span class="text-xl font-bold">{{ data?.name || 'John Doe' }}</span>
      </div>

      <div class="flex items-center gap-8">
        <router-link to="/" class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Home</router-link>
        <a href="/#projects" class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Projects</a>
        <router-link to="/resume" class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Resume</router-link>
        <a href="/#contact" class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Contact</a>

        <div class="flex items-center gap-2 ml-4">
          <Button label="EN" severity="info" size="small" text aria-label="Switch to English" />
          <Button label="DE" severity="secondary" size="small" text aria-label="Switch to German" />
          <Button
            :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'"
            severity="secondary"
            size="small"
            text
            @click="toggleTheme"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          />
          <Button icon="pi pi-code" severity="secondary" size="small" text aria-label="View source code" />
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>