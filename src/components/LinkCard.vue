<script setup lang="ts">
import Chip from "primevue/chip";

interface LinkCardProps {
  label: string;
  link?: string;
  target?: string;
  icon: string;
}

const props = defineProps<LinkCardProps>();
</script>

<template>
  <a v-if="!!props.link" :href="props.link" class="no-underline block" target="_blank" rel="noopener noreferrer">
    <Chip
      :label="props.label"
      :icon="'pi ' + props.icon"
      :pt="{ root: { class: 'w-full' } }"
    />
  </a>
  <Chip
    v-else
    :label="props.label"
    :icon="'pi ' + props.icon"
    :pt="{ root: { class: 'w-full' } }"
  />
</template>

<style scoped>
a:hover :deep(.p-chip-label) {
  text-decoration: underline;
}
</style>
