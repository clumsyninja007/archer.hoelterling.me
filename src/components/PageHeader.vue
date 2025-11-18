<script setup lang="ts">
import ToggleSwitch from "primevue/toggleswitch";
import {onMounted, ref, watch} from "vue";
import Skeleton from 'primevue/skeleton';

interface PageHeaderProps {
  isLoading?: boolean;
  name?: string;
  title?: string;
}

const props = defineProps<PageHeaderProps>();

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
      <i :class="isDark ? 'pi pi-moon' : 'pi pi-sun'" class="text-white" aria-hidden="true"></i>
      <ToggleSwitch v-model="isDark" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" />
    </div>
    <template v-if="props.isLoading">
      <div class="flex flex-col items-center gap-4">
        <Skeleton height="4.5rem" width="30rem" />
        <Skeleton height="2.5rem" width="20rem" />
      </div>
    </template>
    <template v-else>
      <h1 class="font-semibold uppercase text-gray-100">{{props?.name}}</h1>
      <h2 class="mt-4 font-light uppercase text-gray-100">{{props?.title}}</h2>
    </template>
  </header>
</template>

<style scoped>

</style>
