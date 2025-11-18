<script setup lang="ts">
import HeroSection from '@/components/Home/HeroSection.vue'
import ProficienciesSection from '@/components/Home/ProficienciesSection.vue'
import ProjectsSection from '@/components/Home/ProjectsSection.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-50">
    <HeroSection />
    <ProficienciesSection />
    <ProjectsSection />
    <Footer />
  </div>
</template>

<style scoped>
</style>
