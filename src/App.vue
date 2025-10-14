<!--suppress CssUnresolvedCustomProperty -->
<script setup lang="ts">
import Divider from 'primevue/divider';
import Chip from 'primevue/chip';
import LinkCard from "@/components/LinkCard.vue";
import PageHeader from "@/components/PageHeader.vue";
import WorkExperience, {type WorkExperienceProps} from "@/components/WorkExperience.vue";
import {useQuery} from "@tanstack/vue-query";
import apiClient from "@/api/http.ts";
import WorkExperienceSkeleton from "@/components/WorkExperienceSkeleton.vue";
import {PERSON_ID} from "@/constants.ts";

const {data, isLoading} = useQuery<WorkExperienceProps[]>({
  queryKey: ['personal', 'experience'],
  queryFn: async () => {
    const response = await apiClient.get(`person/${PERSON_ID}/experience`);
    return response.data;
  }
})
</script>

<template>
  <PageHeader />
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
          <LinkCard
            label="Philadelphia, PA"
            icon="pi-map-marker"
          />
        </div>

        <Divider class="custom-divider" />

        <h3 class="text-5xl font-bold">Education</h3>
        <div class="mt-4">
          <h4 class="text-xl font-semibold">Humboldt State University</h4>
          <h5 class="font-light">Bachelor of Science<br />Computer Science</h5>
          <h5 class="font-semibold">2012 - 2016</h5>
        </div>

        <Divider class="custom-divider" />

        <h3 class="text-5xl font-bold">Skills</h3>
        <div class="mt-4">
          <ul class="ml-5.5 list-disc">
            <li>
              .NET Core
            </li>
            <li>
              C#
            </li>
            <li>
              JavaScript
            </li>
            <li>
              TypeScript
            </li>
            <li>
              React.js
            </li>
            <li>
              Node.js
            </li>
            <li>
              Vue.js
            </li>
            <li>
              Microsoft SQL Server
            </li>
            <li>
              MySql
            </li>
            <li>
              Git
            </li>
            <li>
              GitLab CI/CD
            </li>
            <li>
              AWS
            </li>
            <li>
              Agile Development
            </li>
            <li>
              Python
            </li>
            <li>
              PowerShell
            </li>
          </ul>
        </div>
      </div>
      <div class="bg-surface-200 dark:bg-surface-600 flex-2 p-8">
        <h3 class="text-5xl font-bold">Work Experience</h3>
        <WorkExperienceSkeleton v-if="isLoading" />
        <template v-else-if="!!data">
          <WorkExperience
            v-for="experience in data"
            :key="experience.company + '_' + experience.title"
            :title="experience.title"
            :company="experience.company"
            :location="experience.location"
            :startDate="experience.startDate"
            :endDate="experience.endDate"
            :skills="experience.skills"
          />
        </template>
        <p v-else>No experience found</p>
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
