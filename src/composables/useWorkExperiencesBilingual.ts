import { useQuery } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'
import type { WorkExperienceProps } from '@/components/WorkExperience/WorkExperience.vue'

export interface BilingualWorkExperiences {
  en: WorkExperienceProps[]
  de: WorkExperienceProps[]
}

export function useWorkExperiencesBilingual() {
  return useQuery<BilingualWorkExperiences>({
    queryKey: ['personal', 'experience', 'bilingual'],
    queryFn: async () => {
      // Fetch both English and German versions in parallel
      const [enResponse, deResponse] = await Promise.all([
        apiClient.get(`person/${PERSON_ID}/experience`, {
          headers: { 'Accept-Language': 'en' }
        }),
        apiClient.get(`person/${PERSON_ID}/experience`, {
          headers: { 'Accept-Language': 'de' }
        })
      ])

      return {
        en: enResponse.data,
        de: deResponse.data
      }
    }
  })
}