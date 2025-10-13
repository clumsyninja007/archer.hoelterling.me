<script setup lang="ts">
import ToggleSwitch from "primevue/toggleswitch";
import {useQuery} from "@tanstack/vue-query";
import apiClient from "@/api/http.ts";
import {onMounted, ref, watch} from "vue";
import Skeleton from 'primevue/skeleton';

interface PersonalInfo {
  name: string;
  title: string;
}

const {data, isLoading} = useQuery<PersonalInfo>({
  queryKey: ["personal"],
  queryFn: async () => {
    const response = await apiClient.get('personal/1')
    return response.data
  }
})

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
    <template v-if="isLoading">
      <div class="flex flex-col items-center gap-4">
        <Skeleton height="4.5rem" width="30rem" />
        <Skeleton height="2.5rem" width="20rem" />
      </div>
    </template>
    <template v-else>
      <h1 class="text-7xl font-semibold uppercase text-gray-100">{{data?.name}}</h1>
      <h2 class="text-4xl mt-4 font-light uppercase text-gray-100">{{data?.title}}</h2>
    </template>
  </header>
</template>

<style scoped>

</style>
