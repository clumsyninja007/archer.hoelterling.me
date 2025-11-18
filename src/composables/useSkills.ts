import { useQuery } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'

export function useSkills() {
  return useQuery<string[]>({
    queryKey: ['personal', 'skills'],
    queryFn: async () => {
      const response = await apiClient.get(`person/${PERSON_ID}/skills`)
      return response.data
    }
  })
}