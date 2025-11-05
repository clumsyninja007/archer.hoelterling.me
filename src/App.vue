<!--suppress CssUnresolvedCustomProperty -->
<script setup lang="ts">
import Divider from 'primevue/divider';
import PageHeader from "@/components/PageHeader.vue";
import WorkExperienceSection from "@/components/WorkExperience/WorkExperienceSection.vue";
import EducationSection from "@/components/Education/EducationSection.vue";
import SkillsSection from "@/components/Skills/SkillsSection.vue";
import ContactSection from "@/components/Contact/ContactSection.vue";
import {useQuery} from "@tanstack/vue-query";
import apiClient from "@/api/http.ts";
import {PERSON_ID} from "@/constants.ts";

const dividerPt = {
  root: {
    class: 'before:border-t-surface-900! dark:before:border-t-surface-50!'
  }
}

export interface ContactInfo {
  label: string;
  link?: string;
  icon: string;
}

interface PersonalInfo {
  name: string;
  title: string;
  contactInfo?: ContactInfo[]
}

const {data, isLoading} = useQuery<PersonalInfo>({
  queryKey: ["personal"],
  queryFn: async () => {
    const response = await apiClient.get(`person/${PERSON_ID}`)
    return response.data
  }
})
</script>

<template>
  <PageHeader
    :is-loading="isLoading"
    :name="data?.name"
    :title="data?.title"
  />
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
</template>

<style scoped></style>
