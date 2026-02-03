// contexts/ThemeContexts.tsx
'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { useColorScheme, ColorScheme } from '@/hooks/useColorScheme'

interface ThemeContextType {
  mode: 'light' | 'dark'
  customScheme: ColorScheme | null
  autoSwitch: boolean
  toggleTheme: () => void
  setMode: (mode: 'light' | 'dark') => void
  applyCustomScheme: (scheme: ColorScheme | null) => void
  toggleAutoSwitch: () => void
  currentScheme: ColorScheme
  getComponentStyle: (component: string) => any
  getButtonStyle: (type: string) => any
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}

// Component to handle CssBaseline with SSR
const CssBaselineWrapper = () => {
  return <CssBaseline />
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    const saved = localStorage.getItem('theme-mode') as 'light' | 'dark'
    return saved || 'light'
  })

  const [customScheme, setCustomScheme] = useState<ColorScheme | null>(() => {
    if (typeof window === 'undefined') return null
    const saved = localStorage.getItem('custom-scheme')
    return saved ? JSON.parse(saved) : null
  })

  const [autoSwitch, setAutoSwitch] = useState(() => {
    if (typeof window === 'undefined') return true
    const saved = localStorage.getItem('theme-auto-switch')
    return saved ? JSON.parse(saved) : true
  })

  // Watch for system preference changes
  useEffect(() => {
    if (!autoSwitch) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (autoSwitch) {
        setMode(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [autoSwitch])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('theme-mode', mode)
    localStorage.setItem('custom-scheme', customScheme ? JSON.stringify(customScheme) : '')
    localStorage.setItem('theme-auto-switch', JSON.stringify(autoSwitch))
  }, [mode, customScheme, autoSwitch])

  // Get color scheme with preferences
  const colorSchemeHook = useColorScheme(
    customScheme ? {
      headerColor: customScheme.colors.components.header,
      buttonColor: customScheme.colors.buttons.primary,
      textColor: customScheme.colors.text.primary,
      backgroundColor: customScheme.colors.background,
      cardColor: customScheme.colors.components.card,
      accentColor: customScheme.colors.accent,
    } : undefined
  )

  const currentScheme = customScheme || colorSchemeHook.currentScheme

  // Create MUI theme based on configuration
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
        h1: {
          fontWeight: 700,
          color: currentScheme.colors.text.primary,
        },
        h2: {
          fontWeight: 600,
          color: currentScheme.colors.text.primary,
        },
        h3: {
          fontWeight: 600,
          color: currentScheme.colors.text.primary,
        },
        h4: {
          fontWeight: 500,
          color: currentScheme.colors.text.primary,
        },
        h5: {
          fontWeight: 500,
          color: currentScheme.colors.text.primary,
        },
        h6: {
          fontWeight: 500,
          color: currentScheme.colors.text.primary,
        },
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

  const toggleAutoSwitch = () => {
    setAutoSwitch(prev => !prev)
  }

  // Get style objects
  const getComponentStyle = (component: string) => {
    return colorSchemeHook.getComponentStyles(component as any)
  }

  const getButtonStyle = (type: string) => {
    return colorSchemeHook.getButtonStyles(type as any)
  }

  const contextValue: ThemeContextType = {
    mode,
    customScheme,
    autoSwitch,
    toggleTheme,
    setMode,
    applyCustomScheme,
    toggleAutoSwitch,
    currentScheme,
    getComponentStyle,
    getButtonStyle,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>
        <CssBaselineWrapper />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  )
}