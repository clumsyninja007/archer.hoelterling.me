<script setup lang="ts">
import LinkCard from "@/components/LinkCard.vue";
import type { ContactInfo } from "@/composables/usePersonalInfo";
import Skeleton from "primevue/skeleton";

interface ContactProps {
  isLoading?: boolean;
  contactInfo?: ContactInfo[];
}

const props = defineProps<ContactProps>();
</script>

<template>
  <h3 class="font-bold">{{ $t('sections.contact') }}</h3>
  <div class="flex flex-col gap-3 mt-4">
    <template v-if="props.isLoading">
      <skeleton width="100%" height="1.5rem" borderRadius="16px" />
    </template>
    <template v-else>
      <LinkCard
        v-for="info in props.contactInfo" :key="info.label"
        :label="info.label"
        :link="info.link"
        :icon="info.icon"
      />
    </template>
  </div>
</template>

<style scoped>

</style>
