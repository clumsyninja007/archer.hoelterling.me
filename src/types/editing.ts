export type ContentType = 'text' | 'textarea' | 'array' | 'object'

export interface FieldConfig {
  name: string
  label: string
  type: ContentType
  required?: boolean
  placeholder?: string
}

export interface EditFormData {
  en: string
  de: string
}