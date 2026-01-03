import { useMutation, useQueryClient } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'
import type { PersonalInfoPayload } from '@/types/mutations'

export function useUpdatePersonalInfo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PersonalInfoPayload) => {
      const response = await apiClient.put(`person/${PERSON_ID}`, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal'] })
    }
  })
}