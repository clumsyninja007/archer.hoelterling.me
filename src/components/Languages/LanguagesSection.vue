<script setup lang="ts">
import Skeleton from "primevue/skeleton";
import { useLanguages } from '@/composables/useLanguages';

const { data, isLoading } = useLanguages()

const skeletonPt = {
  root: {
    class: 'bg-surface-300! dark:bg-[var(--p-skeleton-background)]! inline-block! align-middle!'
  }
}
</script>

<template>
  <h3 class="font-bold">{{ $t('sections.languages') }}</h3>
  <div class="mt-4">
    <ul class="ml-5.5 list-disc">
      <template v-if="isLoading">
        <li>
          <Skeleton height="1rem" width="9rem" :pt="skeletonPt" />
        </li>
        <li>
          <Skeleton height="1rem" width="9rem" :pt="skeletonPt" />
        </li>
      </template>
      <template v-else>
        <li v-for="language in data" :key="language">
          {{language}}
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped>

</style>