<script setup lang="ts">
import { computed } from 'vue'
import { usePersonalInfo } from '@/composables/usePersonalInfo'

const { data: personalData } = usePersonalInfo()

const currentYear = new Date().getFullYear()

const emailContact = computed(() => {
  return personalData.value?.contactInfo?.find(contact =>
    contact.icon === 'pi-envelope' || contact.label.includes('@')
  )
})

const linkedinContact = computed(() => {
  return personalData.value?.contactInfo?.find(contact =>
    contact.icon === 'pi-linkedin' || contact.label.toLowerCase().includes('linkedin')
  )
})

const githubContact = computed(() => {
  return personalData.value?.contactInfo?.find(contact =>
    contact.icon === 'pi-github' || contact.label.toLowerCase().includes('github')
  )
})
</script>

<template>
  <footer id="contact" class="border-t border-surface-300 dark:border-surface-700 mt-20">
    <div class="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
      <p class="text-surface-500 dark:text-surface-400">© {{ currentYear }} {{ personalData?.name || 'John Doe' }}. All rights reserved.</p>
      <div class="flex items-center gap-6">
        <a
          v-if="emailContact"
          :href="emailContact.link || `mailto:${emailContact.label}`"
          class="text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 flex items-center gap-2"
          :aria-label="`Email ${emailContact.label}`"
        >
          <i class="pi pi-envelope" aria-hidden="true"></i>
          {{ emailContact.label }}
        </a>
        <a
          v-if="linkedinContact"
          :href="linkedinContact.link"
          target="_blank"
          rel="noopener noreferrer"
          class="text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"
          aria-label="LinkedIn profile"
        >
          <i class="pi pi-linkedin text-xl" aria-hidden="true"></i>
        </a>
        <a
          v-if="githubContact"
          :href="githubContact.link"
          target="_blank"
          rel="noopener noreferrer"
          class="text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"
          aria-label="GitHub profile"
        >
          <i class="pi pi-github text-xl" aria-hidden="true"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>