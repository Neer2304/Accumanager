// lib/i18n/LanguageProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAppSelector } from '@/store/store'

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
  translations: Record<string, string>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { data: aboutData } = useAppSelector((state) => state.adminAbout)
  const [language, setLanguage] = useState('en')
  const [translations, setTranslations] = useState<Record<string, string>>({})

  const t = (key: string): string => {
    return translations[key] || key
  }

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en'
    setLanguage(savedLanguage)
    
    if (aboutData?.labels) {
      setTranslations(aboutData.labels)
    }
  }, [aboutData])

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
    // Here you would load language-specific translations
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  )
}