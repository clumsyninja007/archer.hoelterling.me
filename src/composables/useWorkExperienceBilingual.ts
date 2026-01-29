import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'
import type { WorkExperienceProps } from '@/components/WorkExperience/WorkExperience.vue'

interface BilingualWorkExperience {
  en: WorkExperienceProps
  de: WorkExperienceProps
}

export function useWorkExperienceBilingual(experienceId: Ref<number | null>) {
  // Create computed to make query key reactive
  const queryKey = computed(() => ['personal', 'experience', experienceId.value, 'bilingual'])
  const enabled = computed(() => !!experienceId.value)

  return useQuery<BilingualWorkExperience>({
    queryKey,
    queryFn: async () => {
      if (!experienceId.value) {
        throw new Error('No experience ID provided')
      }

      // Fetch both English and German versions in parallel
      const [enResponse, deResponse] = await Promise.all([
        apiClient.get(`person/${PERSON_ID}/experience`, {
          headers: { 'Accept-Language': 'en' }
        }),
        apiClient.get(`person/${PERSON_ID}/experience`, {
          headers: { 'Accept-Language': 'de' }
        })
      ])

      // Find the specific experience in both arrays
      const enExperience = enResponse.data.find((exp: WorkExperienceProps) => exp.id === experienceId.value)
      const deExperience = deResponse.data.find((exp: WorkExperienceProps) => exp.id === experienceId.value)

      if (!enExperience || !deExperience) {
        throw new Error('Work experience not found')
      }

      return {
        en: enExperience,
        de: deExperience
      }
    },
    enabled
  })
}