<script setup lang="ts">
import {useQuery} from "@tanstack/vue-query";
import apiClient from "@/api/http.ts";
import {PERSON_ID} from "@/constants.ts";
import Skeleton from "primevue/skeleton";

const {data, isLoading} = useQuery<string[]>({
  queryKey: ['personal', 'skills'],
  queryFn: async () => {
    const response = await apiClient.get(`person/${PERSON_ID}/skills`);
    return response.data;
  }
})

const skeletonPt = {
  root: {
    class: 'bg-surface-300! dark:bg-[var(--p-skeleton-background)]! inline-block! align-middle!'
  }
}
</script>

<template>
  <h3>Skills</h3>
  <div class="mt-4">
    <ul class="ml-5.5 list-disc">
      <template v-if="isLoading">
        <li>
          <Skeleton height="1rem" width="7rem" :pt="skeletonPt" />
        </li>
        <li>
          <Skeleton height="1rem" width="7rem" :pt="skeletonPt" />
        </li>
        <li>
          <Skeleton height="1rem" width="7rem" :pt="skeletonPt" />
        </li>
      </template>
      <template v-else>
        <li v-for="skill in data" :key="skill">
          {{skill}}
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped>

</style>
