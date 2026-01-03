import { useMutation, useQueryClient } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'
import type { WorkExperiencePayload } from '@/types/mutations'

export function useUpdateWorkExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: WorkExperiencePayload) => {
      if (!payload.id) throw new Error('Experience ID is required for update')

      const response = await apiClient.put(
        `person/${PERSON_ID}/experience/${payload.id}`,
        {
          en: payload.en,
          de: payload.de
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal', 'experience'] })
    }
  })
}