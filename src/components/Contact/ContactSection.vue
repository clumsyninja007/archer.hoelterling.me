<script setup lang="ts">
import Chip from "primevue/chip";
import LinkCard from "@/components/LinkCard.vue";
</script>

<template>
  <h3 class="font-bold">Contact</h3>
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
</template>

<style scoped>

</style>
