// lib/theme/ThemeProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAppSelector } from '@/store/store'

interface ThemeContextType {
  theme: Record<string, string>
  darkMode: boolean
  toggleDarkMode: () => void
  setThemeVariable: (key: string, value: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider')
  }
  return context
}

export function ThemeProviders({ children }: { children: ReactNode }) {
  const { data: aboutData } = useAppSelector((state) => state.adminAbout)
  const [darkMode, setDarkMode] = useState(false)
  const [theme, setTheme] = useState<Record<string, string>>({})

  const applyTheme = (themeConfig: any, isDark: boolean) => {
    const root = document.documentElement
    const themeToApply = isDark && themeConfig.darkMode ? {
      ...themeConfig,
      backgroundColor: '#202124',
      textColor: '#e8eaed',
      textSecondary: '#9aa0a6',
      textMuted: '#5f6368',
      borderColor: '#3c4043',
    } : themeConfig

    // Apply CSS variables
    Object.entries(themeToApply).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--${key}`, value)
      }
    })

    setTheme(themeToApply)
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', String(newDarkMode))
    if (aboutData?.theme) {
      applyTheme(aboutData.theme, newDarkMode)
    }
  }

  const setThemeVariable = (key: string, value: string) => {
    document.documentElement.style.setProperty(`--${key}`, value)
    setTheme(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)

    if (aboutData?.theme) {
      applyTheme(aboutData.theme, savedDarkMode)
    }
  }, [aboutData])

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleDarkMode, setThemeVariable }}>
      {children}
    </ThemeContext.Provider>
  )
}