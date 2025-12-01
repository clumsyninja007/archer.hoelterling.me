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
  <footer id="contact" class="border-t border-surface-300 dark:border-surface-700 mt-12 md:mt-20">
    <div class="max-w-7xl mx-auto px-6 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
      <p class="text-surface-500 dark:text-surface-400 text-sm md:text-base text-center md:text-left">© {{ currentYear }} {{ personalData?.name || 'John Doe' }}. {{ $t('footer.rights') }}</p>
      <div class="flex items-center gap-4 md:gap-6">
        <a
          v-if="emailContact"
          :href="emailContact.link || `mailto:${emailContact.label}`"
          class="text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 flex items-center gap-2"
          :aria-label="`Email ${emailContact.label}`"
        >
          <i class="pi pi-envelope text-xl" aria-hidden="true"></i>
          <span class="hidden sm:inline">{{ emailContact.label }}</span>
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