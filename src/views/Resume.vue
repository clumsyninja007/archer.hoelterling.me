<!--suppress CssUnresolvedCustomProperty -->
<script setup lang="ts">
import Divider from 'primevue/divider';
import Skeleton from 'primevue/skeleton';
import WorkExperienceSection from "@/components/WorkExperience/WorkExperienceSection.vue";
import EducationSection from "@/components/Education/EducationSection.vue";
import SkillsSection from "@/components/Skills/SkillsSection.vue";
import ContactSection from "@/components/Contact/ContactSection.vue";
import { usePersonalInfo } from '@/composables/usePersonalInfo';

const dividerPt = {
  root: {
    class: 'before:border-t-surface-900! dark:before:border-t-surface-50!'
  }
}

const { data, isLoading } = usePersonalInfo()
</script>

<template>
  <div class="flex-1 flex flex-col bg-surface-50 dark:bg-surface-900">
    <header class="p-6 text-center bg-surface-800">
      <template v-if="isLoading">
        <div class="flex flex-col items-center gap-4">
          <Skeleton height="4.5rem" width="30rem" />
          <Skeleton height="2.5rem" width="20rem" />
        </div>
      </template>
      <template v-else>
        <h1 class="font-semibold uppercase text-gray-100">{{data?.name}}</h1>
        <h2 class="mt-4 font-light uppercase text-gray-100">{{data?.title}}</h2>
      </template>
    </header>
    <main class="flex-1 flex justify-center">
      <div class="max-w-6xl w-full flex flex-col-reverse md:flex-row shadow-md shadow-surface-300 dark:shadow-surface-900">
        <div class="bg-surface-300 dark:bg-surface-700 p-8">
          <ContactSection
            :is-loading="isLoading"
            :contact-info="data?.contactInfo"
          />
          <Divider :pt="dividerPt" />
          <EducationSection />
          <Divider :pt="dividerPt" />
          <SkillsSection />
        </div>
        <div class="bg-surface-200 dark:bg-surface-600 p-8 w-full">
          <WorkExperienceSection />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped></style>