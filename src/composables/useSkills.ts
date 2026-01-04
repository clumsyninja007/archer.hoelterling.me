import { useQuery } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'
import { useLanguage } from './useLanguage'

export function useSkills() {
  const { language } = useLanguage()

  return useQuery<string[]>({
    queryKey: ['personal', 'skills', language],
    queryFn: async () => {
      // Accept-Language header is set automatically by axios interceptor
      const response = await apiClient.get(`person/${PERSON_ID}/skills`)
      return response.data
    }
  })
}