<script setup lang="ts">
import {useQuery} from "@tanstack/vue-query";
import apiClient from "@/api/http.ts";
import {PERSON_ID} from "@/constants.ts";

interface EducationProps {
  school: string;
  degree?: string;
  major?: string;
  startDate?: string;
  endDate?: string;
}

const {data, isLoading} = useQuery<EducationProps[]>({
  queryKey: ['personal', 'education'],
  queryFn: async () => {
    const response = await apiClient.get(`person/${PERSON_ID}/education`);
    return response.data;
  }
})

const formatDate = (value?: string) => {
  if (!value) {
    return undefined;
  }

  return new Date(value).toLocaleString('en-US', {
    year: 'numeric'
  });
}
</script>

<template>
  <h3 class="font-bold">Education</h3>
  <template v-if="isLoading">
    <div class="mt-4">
      <skeleton width="60%" height="1.5rem" />
      <skeleton width="60%" height="1.5rem" />
      <skeleton width="60%" height="1.5rem" />
      <div>
        <skeleton width="40px" height="1.5rem" /> - <skeleton width="40px" height="1.5rem" />
      </div>
    </div>
  </template>
  <template v-else>
    <div v-for="education in data" :key="education.school" class="mt-4">
      <h4 class="text-base font-semibold">{{education.school}}</h4>
      <h5 class="font-light">
        {{education.degree}}
        <br v-if="education.degree && education.major" />
        {{education.major}}
      </h5>
      <h5 v-if="education.startDate || education.endDate" class="font-semibold">
        {{education.startDate ? `${formatDate(education.startDate)} - ` : ''}}{{formatDate(education.endDate)}}
      </h5>
    </div>
  </template>
</template>

<style scoped>

</style>
