import { useMutation, useQueryClient } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'

export interface UpdateProjectPayload {
  id: number
  en: ProjectData
  de: ProjectData
}

export interface ProjectData {
  title: string
  description: string
  longDescription: string
  technologies: string[]
  imageUrl?: string
  liveUrl?: string
  demoUrl?: string
  githubUrl?: string
  displayOrder: number
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateProjectPayload) => {
      const response = await apiClient.put(
        `person/${PERSON_ID}/projects/${payload.id}`,
        {
          en: payload.en,
          de: payload.de
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })
}
