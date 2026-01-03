<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { usePersonalInfo } from '@/composables/usePersonalInfo'
import { usePersonalInfoBilingual } from '@/composables/usePersonalInfoBilingual'
import { useUpdatePersonalInfo } from '@/composables/mutations/useUpdatePersonalInfo'
import { useAuth } from '@/composables/useAuth'
import EditableWrapper from '@/components/Admin/EditableWrapper.vue'

const router = useRouter()
const { data: personalData } = usePersonalInfo()
const { data: bilingualData } = usePersonalInfoBilingual()
const { isAdmin } = useAuth()
const { mutateAsync: updatePersonalInfo } = useUpdatePersonalInfo()

const navigateToResume = () => {
  router.push('/resume')
}

const titleCurrentValue = computed(() => ({
  en: bilingualData.value?.en.title ?? '',
  de: bilingualData.value?.de.title ?? ''
}))

const heroDescriptionCurrentValue = computed(() => ({
  en: bilingualData.value?.en.heroDescription ?? '',
  de: bilingualData.value?.de.heroDescription ?? ''
}))

const updateTitle = async (payload: { en: string; de: string }) => {
  if (!bilingualData.value) return

  await updatePersonalInfo({
    en: { ...bilingualData.value.en, title: payload.en },
    de: { ...bilingualData.value.de, title: payload.de }
  })
}

const updateHeroDescription = async (payload: { en: string; de: string }) => {
  if (!bilingualData.value) return

  await updatePersonalInfo({
    en: { ...bilingualData.value.en, heroDescription: payload.en },
    de: { ...bilingualData.value.de, heroDescription: payload.de }
  })
}
</script>

<template>
  <section class="bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-900 dark:from-cyan-800 dark:via-cyan-900 dark:to-surface-950 text-surface-50 py-12 md:py-20">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="flex-shrink-0 order-first md:order-last">
        <div class="w-48 h-48 md:w-64 md:h-64 rounded-full bg-surface-700 overflow-hidden">
          <img
            src="https://assets.archerharmony.com/archer-outdoor-selfie.jpeg"
            :alt="`${personalData?.name || 'Professional'} headshot`"
            class="w-full h-full object-cover"
            @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
          />
        </div>
      </div>

      <div class="flex-1 text-center md:text-left md:pr-4">
        <EditableWrapper
          v-if="isAdmin && bilingualData"
          content-type="text"
          :current-value="titleCurrentValue"
          label="Title"
          :mutation-fn="updateTitle"
        >
          <h1 class="text-3xl md:text-5xl font-bold mb-4">
            {{ personalData?.title }}
          </h1>
        </EditableWrapper>
        <h1 v-else class="text-3xl md:text-5xl font-bold mb-4">
          {{ personalData?.title }}
        </h1>

        <EditableWrapper
          v-if="isAdmin && bilingualData"
          content-type="textarea"
          :current-value="heroDescriptionCurrentValue"
          label="Hero Description"
          :mutation-fn="updateHeroDescription"
        >
          <p class="text-surface-300 text-base md:text-lg mb-8 max-w-xl mx-auto md:mx-0">
            {{ personalData?.heroDescription }}
          </p>
        </EditableWrapper>
        <p v-else class="text-surface-300 text-base md:text-lg mb-8 max-w-xl mx-auto md:mx-0">
          {{ personalData?.heroDescription }}
        </p>

        <Button
          :label="$t('hero.ctaButton')"
          severity="info"
          size="large"
          @click="navigateToResume"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
