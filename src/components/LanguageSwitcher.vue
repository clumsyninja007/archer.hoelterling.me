<script setup lang="ts">
import Button from 'primevue/button'

// TODO: Implement actual language switching logic when it is added
const switchLanguage = (lang: string) => {
  console.log(`Switching to ${lang}`)
}
</script>

<template>
  <div class="flex items-center gap-2">
    <Button
      label="EN"
      severity="info"
      size="small"
      text
      aria-label="Switch to English"
      @click="switchLanguage('en')"
    />
    <Button
      label="DE"
      severity="secondary"
      size="small"
      text
      aria-label="Switch to German"
      @click="switchLanguage('de')"
    />
  </div>
</template>

<style scoped>
</style>
