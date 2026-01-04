import { useQuery } from '@tanstack/vue-query'
import apiClient from '@/api/http'
import { PERSON_ID } from '@/constants'
import { useLanguage } from './useLanguage'

export interface ContactInfo {
  label: string
  link?: string
  icon: string
}

export interface PersonalInfo {
  name: string
  title: string
  heroDescription?: string
  contactInfo?: ContactInfo[]
}

export function usePersonalInfo() {
  const { language } = useLanguage()

  return useQuery<PersonalInfo>({
    queryKey: ['personal', language],
    queryFn: async () => {
      // Accept-Language header is set automatically by axios interceptor
      const response = await apiClient.get(`person/${PERSON_ID}`)
      return response.data
    }
  })
}