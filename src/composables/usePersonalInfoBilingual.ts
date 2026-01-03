import { useQuery } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'
import type { PersonalInfo } from './usePersonalInfo'

export interface BilingualPersonalInfo {
  en: PersonalInfo
  de: PersonalInfo
}

export function usePersonalInfoBilingual() {
  return useQuery<BilingualPersonalInfo>({
    queryKey: ['personal', 'bilingual'],
    queryFn: async () => {
      const [enResponse, deResponse] = await Promise.all([
        apiClient.get(`person/${PERSON_ID}`, {
          headers: { 'Accept-Language': 'en' }
        }),
        apiClient.get(`person/${PERSON_ID}`, {
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