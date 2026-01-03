export interface BilingualContent<T> {
  en: T
  de: T
}

export type PersonalInfoPayload = BilingualContent<{
  name?: string
  title?: string
  heroDescription?: string
}>

export interface WorkExperiencePayload extends BilingualContent<{
  title: string
  company: string
  location: string
  startDate: string
  endDate?: string
  skills: string[]
}> {
  id?: number  // For updates
}

export interface EducationPayload extends BilingualContent<{
  school: string
  degree?: string
  major?: string
  startDate?: string
  endDate?: string
}> {
  id?: number
}

export interface ProjectPayload extends BilingualContent<{
  title: string
  description: string
  longDescription: string
  technologies: string[]
  imageUrl?: string
  liveUrl?: string
  githubUrl?: string
  displayOrder: number
}> {
  id?: number
}

export type SkillsPayload = BilingualContent<string[]>

export interface ContactInfoItem {
  label: string
  link?: string
  icon: string
}

export type ContactInfoPayload = BilingualContent<ContactInfoItem[]>