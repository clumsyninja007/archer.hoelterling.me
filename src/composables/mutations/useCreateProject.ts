import { useMutation, useQueryClient } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'

export interface ProjectPayload {
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

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ProjectPayload) => {
      const response = await apiClient.post(`person/${PERSON_ID}/projects`, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })
}
