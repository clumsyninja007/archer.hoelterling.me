import { useQuery } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'
import type { Project } from './useProjects'

export interface BilingualProjects {
  en: Project[]
  de: Project[]
}

export function useProjectsBilingual() {
  return useQuery<BilingualProjects>({
    queryKey: ['projects', 'bilingual'],
    queryFn: async () => {
      const [enResponse, deResponse] = await Promise.all([
        apiClient.get(`person/${PERSON_ID}/projects`, {
          headers: { 'Accept-Language': 'en' }
        }),
        apiClient.get(`person/${PERSON_ID}/projects`, {
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
