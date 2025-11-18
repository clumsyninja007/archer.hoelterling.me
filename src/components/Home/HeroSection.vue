<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { usePersonalInfo } from '@/composables/usePersonalInfo'

const router = useRouter()
const { data: personalData } = usePersonalInfo()

const navigateToResume = () => {
  router.push('/resume')
}
</script>

<template>
  <section class="bg-surface-800 text-surface-50 py-12 md:py-20">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="flex-shrink-0 order-first md:order-last">
        <div class="w-48 h-48 md:w-64 md:h-64 rounded-full bg-surface-700 overflow-hidden">
          <img
            src="https://assets.archerharmony.com/archer-outdoor-selfie.jpeg"
            :alt="`${personalData?.name || 'Professional'} headshot`"
            class="w-full h-full object-cover"
            @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
          />
        </div>
      </div>

      <div class="flex-1 text-center md:text-left md:pr-4">
        <h1 class="text-3xl md:text-5xl font-bold mb-4">
          {{ personalData?.title || 'Senior Software Engineer & Problem Solver' }}
        </h1>
        <p class="text-surface-300 text-base md:text-lg mb-8 max-w-xl mx-auto md:mx-0">
          With over 10 years of experience, I build scalable and efficient web
          applications, turning complex problems into elegant software solutions.
        </p>
        <Button
          label="View My Resume"
          severity="info"
          size="large"
          @click="navigateToResume"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
