<!--suppress CssUnresolvedCustomProperty -->
<script setup lang="ts">
import Skeleton from "primevue/skeleton";

const skeletonPt = {
  root: {
    class: 'bg-surface-300! dark:bg-[var(--p-skeleton-background)]!'
  }
}
</script>

<template>
  <div class="mt-4 p-4">
    <!-- Title -->
    <Skeleton width="60%" height="1.5rem" class="mb-3" :pt="skeletonPt" />

    <!-- Company + Location + Dates row -->
    <div class="flex justify-between mt-2">
      <div>
        <Skeleton width="8rem" height="1rem" class="mb-2" :pt="skeletonPt" />
        <Skeleton width="6rem" height="0.875rem" :pt="skeletonPt" />
      </div>
      <Skeleton width="9rem" height="1rem" :pt="skeletonPt" />
    </div>

    <!-- Skills list -->
    <div class="mt-4 ml-4">
      <Skeleton v-for="i in 3" :key="i" width="60%" height="1rem" class="mb-1" :pt="skeletonPt" />
    </div>
  </div>
</template>

<style scoped>
:deep(.p-skeleton) {
  --p-skeleton-wave-background: linear-gradient(
    90deg,
    #d4d4d8 25%,
    #e4e4e7 50%,
    #d4d4d8 75%
  );
}
</style>
