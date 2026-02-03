// hooks/useThemeManager.ts
'use client'

import { useState, useEffect, useMemo } from 'react';
import { useColorScheme, ColorScheme } from '@/hooks/useColorScheme';
import { lightTheme, darkTheme } from '@/lib/theme';
import { createTheme, Theme } from '@mui/material/styles';

interface ThemeConfig {
  mode: 'light' | 'dark';
  customScheme?: ColorScheme | null;
  autoSwitch: boolean;
}

export const useThemeManager = () => {
  // Initialize from localStorage
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    if (typeof window === 'undefined') {
      return { mode: 'light', customScheme: null, autoSwitch: true };
    }
    
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark';
    const savedScheme = localStorage.getItem('custom-scheme');
    const savedAutoSwitch = localStorage.getItem('theme-auto-switch');
    
    return {
      mode: savedMode || 'light',
      customScheme: savedScheme ? JSON.parse(savedScheme) : null,
      autoSwitch: savedAutoSwitch ? JSON.parse(savedAutoSwitch) : true,
    };
  });

  // Watch for system preference changes if autoSwitch is enabled
  useEffect(() => {
    if (!themeConfig.autoSwitch || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeConfig.autoSwitch) {
        setThemeConfig(prev => ({ ...prev, mode: e.matches ? 'dark' : 'light' }));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeConfig.autoSwitch]);

  // Save to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('theme-mode', themeConfig.mode);
    localStorage.setItem('theme-auto-switch', JSON.stringify(themeConfig.autoSwitch));
    
    if (themeConfig.customScheme) {
      localStorage.setItem('custom-scheme', JSON.stringify(themeConfig.customScheme));
    } else {
      localStorage.removeItem('custom-scheme');
    }
  }, [themeConfig]);

  // Get custom color scheme with preferences
  const { currentScheme, getButtonStyles, getComponentStyles, ...colorUtils } = 
    useColorScheme(themeConfig.customScheme ? {
      headerColor: themeConfig.customScheme.colors.components.header,
      buttonColor: themeConfig.customScheme.colors.buttons.primary,
      textColor: themeConfig.customScheme.colors.text.primary,
      backgroundColor: themeConfig.customScheme.colors.background,
      cardColor: themeConfig.customScheme.colors.components.card,
      accentColor: themeConfig.customScheme.colors.accent,
    } : undefined);

  // Create MUI theme based on configuration
  const muiTheme = useMemo<Theme>(() => {
    if (themeConfig.customScheme) {
      // Create custom theme from color scheme
      return createTheme({
        palette: {
          mode: themeConfig.mode,
          primary: {
            main: currentScheme.colors.primary,
            light: currentScheme.colors.buttons.primary + 'CC',
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
          MuiAppBar: {
            styleOverrides: {
              root: {
                background: currentScheme.colors.components.header,
                borderBottom: `1px solid ${currentScheme.colors.components.border}`,
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                background: currentScheme.colors.components.sidebar,
                borderRight: `1px solid ${currentScheme.colors.components.border}`,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  background: currentScheme.colors.components.input,
                  '& fieldset': {
                    borderColor: currentScheme.colors.components.border,
                  },
                  '&:hover fieldset': {
                    borderColor: currentScheme.colors.components.hover,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: currentScheme.colors.components.active,
                  },
                },
              },
            },
          },
        },
      });
    }
    
    // Use default theme
    return themeConfig.mode === 'light' ? lightTheme : darkTheme;
  }, [themeConfig, currentScheme]);

  // Theme controls
  const toggleTheme = () => {
    setThemeConfig(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
    }));
  };

  const setThemeMode = (mode: 'light' | 'dark') => {
    setThemeConfig(prev => ({ ...prev, mode }));
  };

  const applyCustomScheme = (scheme: ColorScheme | null) => {
    setThemeConfig(prev => ({ ...prev, customScheme: scheme }));
  };

  const toggleAutoSwitch = () => {
    setThemeConfig(prev => ({ ...prev, autoSwitch: !prev.autoSwitch }));
  };

  // Get style objects for components
  const getComponentStyle = (component: string) => {
    return getComponentStyles(component as any);
  };

  const getButtonStyle = (type: string) => {
    return getButtonStyles(type as any);
  };

  return {
    // Current state
    theme: muiTheme,
    mode: themeConfig.mode,
    customScheme: themeConfig.customScheme,
    autoSwitch: themeConfig.autoSwitch,
    
    // Theme controls
    toggleTheme,
    setThemeMode,
    applyCustomScheme,
    toggleAutoSwitch,
    
    // Style utilities
    getComponentStyle,
    getButtonStyle,
    
    // Color utilities from useColorScheme
    currentScheme,
    ...colorUtils,
  };
};