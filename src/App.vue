<!--suppress CssUnresolvedCustomProperty -->
<script setup lang="ts">
import Divider from 'primevue/divider';
import PageHeader from "@/components/PageHeader.vue";
import WorkExperienceSection from "@/components/WorkExperience/WorkExperienceSection.vue";
import EducationSection from "@/components/Education/EducationSection.vue";
import SkillsSection from "@/components/Skills/SkillsSection.vue";
import ContactSection from "@/components/Contact/ContactSection.vue";
</script>

<template>
  <PageHeader />
  <main class="flex-1 flex justify-center">
    <div class="max-w-6xl w-full flex shadow-md shadow-surface-300 dark:shadow-surface-900">
      <div class="bg-surface-300 dark:bg-surface-700 flex-1 p-8">
        <ContactSection />
        <Divider class="custom-divider" />
        <EducationSection />
        <Divider class="custom-divider" />
        <SkillsSection />
      </div>
      <div class="bg-surface-200 dark:bg-surface-600 flex-2 p-8">
        <WorkExperienceSection />
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
