import { useMutation, useQueryClient } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'

export function useDeleteWorkExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (experienceId: number) => {
      const response = await apiClient.delete(`person/${PERSON_ID}/experience/${experienceId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal', 'experience'] })
    }
  })
}