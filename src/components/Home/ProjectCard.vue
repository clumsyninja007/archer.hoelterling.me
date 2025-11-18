<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'

interface ProjectCardProps {
  title: string
  description: string
  longDescription: string
  technologies: string[]
  image: string
  liveUrl?: string
  githubUrl?: string
}

const props = defineProps<ProjectCardProps>()

const isFlipped = ref(false)

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

const openLink = (url?: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="project-card-container">
    <div class="project-card" :class="{ 'is-flipped': isFlipped }">
      <!-- Front of Card -->
      <div class="project-card-face project-card-front">
        <Card class="h-full overflow-hidden">
          <template #header>
            <div class="bg-surface-200 dark:bg-surface-700 h-48 flex items-center justify-center overflow-hidden">
              <img
                :src="props.image"
                :alt="props.title"
                class="w-full h-full object-cover"
                @error="(e) => (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect width=%22400%22 height=%22200%22 fill=%22%23334155%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 fill=%22%2394a3b8%22 font-family=%22Arial%22 font-size=%2220%22 text-anchor=%22middle%22 dy=%22.3em%22%3EProject Image%3C/text%3E%3C/svg%3E'"
              />
            </div>
          </template>
          <template #title>
            <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-50">{{ props.title }}</h3>
          </template>
          <template #content>
            <p class="text-surface-600 dark:text-surface-300 mb-4">{{ props.description }}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <Tag
                v-for="tech in props.technologies"
                :key="tech"
                :value="tech"
                severity="info"
                class="text-sm"
              />
            </div>
          </template>
          <template #footer>
            <div class="flex gap-2 flex-wrap">
              <Button
                label="More Details"
                severity="secondary"
                size="small"
                outlined
                icon="pi pi-info-circle"
                @click="toggleFlip"
              />
              <Button
                v-if="props.liveUrl"
                label="Live Site"
                severity="info"
                size="small"
                @click="() => openLink(props.liveUrl)"
              />
              <Button
                v-if="props.githubUrl"
                label="GitHub"
                severity="secondary"
                size="small"
                outlined
                @click="() => openLink(props.githubUrl)"
              />
            </div>
          </template>
        </Card>
      </div>

      <!-- Back of Card -->
      <div class="project-card-face project-card-back">
        <Card class="h-full overflow-hidden">
          <template #title>
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-50">{{ props.title }}</h3>
              <Button
                icon="pi pi-times"
                severity="secondary"
                text
                rounded
                @click="toggleFlip"
                aria-label="Close details"
              />
            </div>
          </template>
          <template #content>
            <div class="space-y-4 overflow-y-auto max-h-[320px] pr-2 scrollable-content">
              <div>
                <h4 class="font-semibold text-surface-900 dark:text-surface-50 mb-2">About This Project</h4>
                <p class="text-surface-600 dark:text-surface-300 whitespace-pre-line">{{ props.longDescription }}</p>
              </div>

              <div>
                <h4 class="font-semibold text-surface-900 dark:text-surface-50 mb-2">Technologies Used</h4>
                <div class="flex flex-wrap gap-2">
                  <Tag
                    v-for="tech in props.technologies"
                    :key="tech"
                    :value="tech"
                    severity="info"
                    class="text-sm"
                  />
                </div>
              </div>
            </div>
          </template>
          <template #footer>
            <div class="flex gap-2 flex-wrap">
              <Button
                v-if="props.liveUrl"
                label="Live Site"
                severity="info"
                size="small"
                icon="pi pi-external-link"
                @click="() => openLink(props.liveUrl)"
              />
              <Button
                v-if="props.githubUrl"
                label="GitHub"
                severity="secondary"
                size="small"
                outlined
                icon="pi pi-github"
                @click="() => openLink(props.githubUrl)"
              />
              <Button
                label="Back"
                severity="secondary"
                size="small"
                outlined
                icon="pi pi-arrow-left"
                @click="toggleFlip"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card-container {
  perspective: 1000px;
  height: 100%;
  min-height: 500px;
}

.project-card {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.project-card.is-flipped {
  transform: rotateY(180deg);
}

.project-card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.project-card-front {
  z-index: 2;
  transform: rotateY(0deg);
}

.project-card-back {
  transform: rotateY(180deg);
}

.scrollable-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: transparent;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

.dark .scrollable-content {
  scrollbar-color: rgba(107, 114, 128, 0.5) transparent;
}

.dark .scrollable-content::-webkit-scrollbar-thumb {
  background-color: rgba(107, 114, 128, 0.5);
}

.dark .scrollable-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.7);
}
</style>