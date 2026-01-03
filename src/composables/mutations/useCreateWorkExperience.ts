import { useMutation, useQueryClient } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'
import type { WorkExperiencePayload } from '@/types/mutations'

export function useCreateWorkExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Omit<WorkExperiencePayload, 'id'>) => {
      const response = await apiClient.post(`person/${PERSON_ID}/experience`, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal', 'experience'] })
    }
  })
}