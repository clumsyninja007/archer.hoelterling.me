<script setup lang="ts">
import ProjectCard from './ProjectCard.vue'
import { useProjects } from '@/composables/useProjects'
import { computed } from 'vue'

const { data: projects, isLoading } = useProjects()

const getZoomClass = (index: number): string => {
  const row = Math.floor(index / 2)
  const col = index % 2
  const isEvenRow = row % 2 === 0

  if (isEvenRow) {
    return col === 0 ? 'zoom-in-75' : 'zoom-in-50'
  } else {
    return col === 0 ? 'zoom-in-50' : 'zoom-in-75'
  }
}

const hasProjects = computed(() => projects.value && projects.value.length > 0)
</script>

<template>
  <section id="projects" class="max-w-7xl mx-auto px-6 py-16">
    <h2 class="text-3xl font-bold mb-8">{{ $t('sections.projects') }}</h2>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i" class="h-[500px] animate-pulse bg-surface-200 dark:bg-surface-700 rounded-lg"></div>
    </div>

    <!-- Projects grid -->
    <div v-else-if="hasProjects" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProjectCard
        v-for="(project, index) in projects"
        :key="project.id"
        v-animateonscroll="{
          enterClass: `animate-enter fade-in-10 ${getZoomClass(index)} animate-duration-1000`,
        }"
        :title="project.title"
        :description="project.description"
        :long-description="project.longDescription"
        :technologies="project.technologies"
        :image="project.imageUrl || '/projects/placeholder.png'"
        :live-url="project.liveUrl"
        :github-url="project.githubUrl"
      />
    </div>

    <!-- No projects message -->
    <p v-else class="text-center text-surface-600 dark:text-surface-300">
      {{ $t('messages.noProjects') }}
    </p>
  </section>
</template>

<style scoped>
</style>
