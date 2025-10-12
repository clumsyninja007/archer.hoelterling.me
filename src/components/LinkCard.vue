<script setup lang="ts">
import Chip from "primevue/chip";

interface LinkCardProps {
  label: string;
  link: string;
  target?: string;
  icon: string;
}

const props = defineProps<LinkCardProps>();
</script>

<template>
  <a :href="props.link" class="no-underline block" target="_blank" rel="noreferrer">
    <Chip
      :label="props.label"
      :icon="'pi ' + props.icon"
      :pt="{ root: { class: 'w-full' } }"
    />
  </a>
</template>

<style scoped>
a:hover :deep(.p-chip-label) {
  text-decoration: underline;
}
</style>
