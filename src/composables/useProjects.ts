import { useQuery } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'
import { useLanguage } from './useLanguage'

export interface Project {
  id: number
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

export function useProjects() {
  const { language } = useLanguage()

  return useQuery<Project[]>({
    queryKey: ['projects', language],
    queryFn: async () => {
      // Accept-Language header is set automatically by axios interceptor
      const response = await apiClient.get(`person/${PERSON_ID}/projects`)
      return response.data
    }
  })
}