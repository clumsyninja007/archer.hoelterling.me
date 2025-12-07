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
  githubUrl?: string
  displayOrder: number
}

export function useProjects() {
  const { language } = useLanguage()

  return useQuery<Project[]>({
    queryKey: ['projects', language],
    queryFn: async () => {
      const response = await apiClient.get(`person/${PERSON_ID}/projects`, {
        headers: {
          'Accept-Language': language.value
        }
      })
      return response.data
    }
  })
}