// contexts/AdvanceThemeContexts.tsx
'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { ColorScheme } from '@/hooks/useColorScheme'

// Predefined color schemes for advance section only - EXPORT THIS
export const ADVANCE_COLOR_SCHEMES: ColorScheme[] = [
  {
    id: 'advance-modern',
    name: 'Advance Modern',
    description: 'Modern theme for advanced features',
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      accent: '#06b6d4',
      background: '#0f172a',
      surface: '#1e293b',
      text: {
        primary: '#f1f5f9',
        secondary: '#cbd5e1',
        accent: '#38bdf8',
        onDark: '#ffffff',
        onLight: '#000000',
      },
      buttons: {
        primary: '#8b5cf6',
        secondary: '#64748b',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        text: '#ffffff',
      },
      components: {
        header: '#1e293b',
        sidebar: '#1e293b',
        card: '#1e293b',
        input: '#334155',
        border: '#475569',
        hover: '#2d3748',
        active: '#8b5cf6',
      },
    },
  },
  {
    id: 'advance-light',
    name: 'Advance Light',
    description: 'Light theme for advanced features',
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#f8fafc',
      surface: '#ffffff',
      text: {
        primary: '#1e293b',
        secondary: '#64748b',
        accent: '#0ea5e9',
        onDark: '#ffffff',
        onLight: '#000000',
      },
      buttons: {
        primary: '#3b82f6',
        secondary: '#94a3b8',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        text: '#ffffff',
      },
      components: {
        header: '#ffffff',
        sidebar: '#f1f5f9',
        card: '#ffffff',
        input: '#ffffff',
        border: '#e2e8f0',
        hover: '#f1f5f9',
        active: '#3b82f6',
      },
    },
  },
  {
    id: 'advance-purple',
    name: 'Advance Purple',
    description: 'Purple theme for advanced features',
    colors: {
      primary: '#7c3aed',
      secondary: '#db2777',
      accent: '#0891b2',
      background: '#1e1b4b',
      surface: '#312e81',
      text: {
        primary: '#e0e7ff',
        secondary: '#c7d2fe',
        accent: '#818cf8',
        onDark: '#ffffff',
        onLight: '#000000',
      },
      buttons: {
        primary: '#7c3aed',
        secondary: '#8b5cf6',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        text: '#ffffff',
      },
      components: {
        header: '#312e81',
        sidebar: '#1e1b4b',
        card: '#4338ca',
        input: '#4f46e5',
        border: '#6366f1',
        hover: '#4f46e5',
        active: '#7c3aed',
      },
    },
  },
  {
    id: 'advance-ocean',
    name: 'Advance Ocean',
    description: 'Ocean blue theme for advanced features',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0d9488',
      accent: '#8b5cf6',
      background: '#0c4a6e',
      surface: '#0369a1',
      text: {
        primary: '#e0f2fe',
        secondary: '#bae6fd',
        accent: '#7dd3fc',
        onDark: '#ffffff',
        onLight: '#000000',
      },
      buttons: {
        primary: '#0284c7',
        secondary: '#0d9488',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        text: '#ffffff',
      },
      components: {
        header: '#0369a1',
        sidebar: '#0c4a6e',
        card: '#0284c7',
        input: '#0ea5e9',
        border: '#38bdf8',
        hover: '#0d9488',
        active: '#7dd3fc',
      },
    },
  },
  {
    id: 'advance-forest',
    name: 'Advance Forest',
    description: 'Forest green theme for advanced features',
    colors: {
      primary: '#059669',
      secondary: '#65a30d',
      accent: '#d97706',
      background: '#064e3b',
      surface: '#065f46',
      text: {
        primary: '#d1fae5',
        secondary: '#a7f3d0',
        accent: '#10b981',
        onDark: '#ffffff',
        onLight: '#000000',
      },
      buttons: {
        primary: '#10b981',
        secondary: '#65a30d',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        text: '#ffffff',
      },
      components: {
        header: '#065f46',
        sidebar: '#064e3b',
        card: '#059669',
        input: '#10b981',
        border: '#34d399',
        hover: '#65a30d',
        active: '#a7f3d0',
      },
    },
  },
]

// Simplified theme interface for advance section only
interface AdvanceThemeContextType {
  mode: 'light' | 'dark'
  customScheme: ColorScheme | null
  toggleTheme: () => void
  setMode: (mode: 'light' | 'dark') => void
  applyCustomScheme: (scheme: ColorScheme | null) => void
  currentScheme: ColorScheme
}

const AdvanceThemeContext = createContext<AdvanceThemeContextType | undefined>(undefined)

export const useAdvanceThemeContext = () => {
  const context = useContext(AdvanceThemeContext)
  if (!context) {
    throw new Error('useAdvanceThemeContext must be used within AdvanceThemeProvider')
  }
  return context
}

// Calculate contrast ratio
const getContrastRatio = (color1: string, color2: string): number => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  const brighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (brighter + 0.05) / (darker + 0.05)
}

const getTextColorForBackground = (backgroundColor: string): string => {
  const contrastWithWhite = getContrastRatio(backgroundColor, '#ffffff')
  const contrastWithBlack = getContrastRatio(backgroundColor, '#000000')
  return contrastWithWhite > contrastWithBlack ? '#ffffff' : '#000000'
}

export const AdvanceThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark'
    const saved = localStorage.getItem('advance-theme-mode') as 'light' | 'dark'
    return saved || 'dark'
  })

  const [customScheme, setCustomScheme] = useState<ColorScheme | null>(() => {
    if (typeof window === 'undefined') return null
    const saved = localStorage.getItem('advance-custom-scheme')
    return saved ? JSON.parse(saved) : null
  })

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('advance-theme-mode', mode)
    localStorage.setItem('advance-custom-scheme', customScheme ? JSON.stringify(customScheme) : '')
  }, [mode, customScheme])

  // Get current scheme
  const currentScheme = useMemo(() => {
    if (customScheme) return customScheme
    
    // Default scheme based on mode
    return mode === 'dark' 
      ? ADVANCE_COLOR_SCHEMES.find(s => s.id === 'advance-modern')!
      : ADVANCE_COLOR_SCHEMES.find(s => s.id === 'advance-light')!
  }, [mode, customScheme])

  // Create MUI theme
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: currentScheme.colors.primary,
          light: currentScheme.colors.primary + 'CC',
          dark: currentScheme.colors.primary + '99',
        },
        secondary: {
          main: currentScheme.colors.secondary,
        },
        background: {
          default: currentScheme.colors.background,
          paper: currentScheme.colors.surface,
        },
        text: {
          primary: currentScheme.colors.text.primary,
          secondary: currentScheme.colors.text.secondary,
        },
        error: {
          main: currentScheme.colors.buttons.error,
        },
        warning: {
          main: currentScheme.colors.buttons.warning,
        },
        info: {
          main: currentScheme.colors.accent,
        },
        success: {
          main: currentScheme.colors.buttons.success,
        },
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 600 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 500 },
        h5: { fontWeight: 500 },
        h6: { fontWeight: 500 },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
            },
            containedPrimary: {
              background: `linear-gradient(135deg, ${currentScheme.colors.buttons.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${currentScheme.colors.buttons.primary}CC 0%, ${currentScheme.colors.secondary}CC 100%)`,
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: '12px',
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              background: currentScheme.colors.components.header,
              borderBottom: `1px solid ${currentScheme.colors.components.border}`,
              boxShadow: 'none',
            },
          },
        },
      },
    })
  }, [mode, currentScheme])

  // Theme controls
  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light')
  }

  const applyCustomScheme = (scheme: ColorScheme | null) => {
    setCustomScheme(scheme)
  }

  const contextValue: AdvanceThemeContextType = {
    mode,
    customScheme,
    toggleTheme,
    setMode,
    applyCustomScheme,
    currentScheme,
  }

  return (
    <AdvanceThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </AdvanceThemeContext.Provider>
  )
}