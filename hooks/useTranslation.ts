// hooks/useTranslation.ts
import { useLanguage } from '@/lib/i18n/LanguageProvider'

export function useTranslation() {
  const { t, language, setLanguage } = useLanguage()
  
  return {
    t,
    language,
    setLanguage,
  }
}