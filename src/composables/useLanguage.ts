import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

export type Language = 'en' | 'de'

export function useLanguage() {
  const { locale } = useI18n()

  const setLanguage = (lang: Language) => {
    locale.value = lang
    localStorage.setItem('hoelterling-language', lang)
  }

  const language = computed(() => locale.value as Language)
  const isEnglish = computed(() => locale.value === 'en')
  const isGerman = computed(() => locale.value === 'de')

  return {
    language,
    setLanguage,
    isEnglish,
    isGerman
  }
}