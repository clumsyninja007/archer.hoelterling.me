<!--suppress CssUnresolvedCustomProperty -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import ToggleSwitch from 'primevue/toggleswitch';
import Divider from 'primevue/divider';
import Chip from 'primevue/chip';
import LinkCard from "@/components/LinkCard.vue";

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
</script>

<template>
  <header class="p-6 text-center bg-surface-800">
    <div class="!absolute top-4 right-4 z-10 flex items-center gap-2">
      <i :class="isDark ? 'pi pi-moon' : 'pi pi-sun'" class="text-white"></i>
      <ToggleSwitch v-model="isDark" />
    </div>
    <h1 class="text-7xl font-semibold uppercase text-gray-100">Archer Hoelterling</h1>
    <h2 class="text-4xl mt-4 font-light uppercase text-gray-100">Senior Software Engineer</h2>
  </header>
  <main class="flex-1 flex justify-center">
    <div class="max-w-6xl w-full flex shadow-md shadow-surface-300 dark:shadow-surface-900">
      <div class="bg-surface-300 dark:bg-surface-700 flex-1 p-8">
        <h3 class="text-5xl font-bold">Contact</h3>
        <div class="flex flex-col gap-3 mt-4">
          <Chip label="+1 707-601-9915" icon="pi pi-phone" />
          <LinkCard
            label="archerharmony@proton.me"
            link="mailto:archerharmony@proton.me"
            icon="pi-envelope"
          />
          <LinkCard
            label="LinkedIn"
            link="https://linkedin.com/in/archerharmony"
            icon="pi-linkedin"
          />
        </div>

        <Divider class="custom-divider" />
      </div>
      <div class="bg-surface-200 dark:bg-surface-600 flex-2 p-8">
        <h3 class="text-5xl font-bold">Work Experience</h3>
      </div>
    </div>
  </main>
</template>

<style>
.custom-divider:before {
  border-top-color: var(--p-surface-900) !important;
}

.dark .custom-divider:before {
  border-top-color: var(--p-surface-50) !important;
}
</style>
