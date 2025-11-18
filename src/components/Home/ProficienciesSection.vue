<script setup lang="ts">
import Tag from 'primevue/tag'
import { useSkills } from '@/composables/useSkills'

const { data: skills } = useSkills()
</script>

<template>
  <section class="max-w-7xl mx-auto px-6 py-16">
    <h2 class="text-3xl font-bold mb-8">Key Proficiencies</h2>
    <div class="flex flex-wrap gap-3">
      <Tag
        v-for="skill in skills"
        :key="skill"
        :value="skill"
        severity="primary"
        class="px-4 py-2 text-base"
      />
    </div>
  </section>
</template>

<style scoped>
</style>
