import { useQuery } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'

export interface ContactInfo {
  label: string
  link?: string
  icon: string
}

export interface PersonalInfo {
  name: string
  title: string
  contactInfo?: ContactInfo[]
}

export function usePersonalInfo() {
  return useQuery<PersonalInfo>({
    queryKey: ['personal'],
    queryFn: async () => {
      const response = await apiClient.get(`person/${PERSON_ID}`)
      return response.data
    }
  })
}