<script setup lang="ts">
import Button from 'primevue/button'
import { useLanguage } from '@/composables/useLanguage'

const { setLanguage, language } = useLanguage()
</script>

<template>
  <div class="flex items-center gap-2">
    <Button
      label="EN"
      :severity="language === 'en' ? 'info' : 'secondary'"
      size="small"
      text
      aria-label="Switch to English"
      @click="setLanguage('en')"
    />
    <Button
      label="DE"
      :severity="language === 'de' ? 'info' : 'secondary'"
      size="small"
      text
      aria-label="Switch to German"
      @click="setLanguage('de')"
    />
  </div>
</template>

<style scoped>
</style>
