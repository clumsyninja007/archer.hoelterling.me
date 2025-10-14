<script setup lang="ts">
import WorkExperience, {
  type WorkExperienceProps
} from "@/components/WorkExperience/WorkExperience.vue";
import WorkExperienceSkeleton from "@/components/WorkExperience/WorkExperienceSkeleton.vue";
import {useQuery} from "@tanstack/vue-query";
import apiClient from "@/api/http.ts";
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
</template>

<style scoped>

</style>
