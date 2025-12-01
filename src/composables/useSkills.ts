import { useQuery } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'
import { useLanguage } from './useLanguage'

export function useSkills() {
  const { language } = useLanguage()

  return useQuery<string[]>({
    queryKey: ['personal', 'skills', language],
    queryFn: async () => {
      const response = await apiClient.get(`person/${PERSON_ID}/skills`, {
        headers: {
          'Accept-Language': language.value
        }
      })
      return response.data
    }
  })
}