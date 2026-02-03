// hooks/useColorScheme.ts
import { useTheme } from '@mui/material/styles';
import { useCallback } from 'react';

// Type definitions
export interface ColorScheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      accent: string;
      onDark: string;
      onLight: string;
    };
    buttons: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      text: string;
    };
    components: {
      header: string;
      sidebar: string;
      card: string;
      input: string;
      border: string;
      hover: string;
      active: string;
    };
  };
}

export interface ComponentStyles {
  backgroundColor: string;
  color: string;
  borderColor?: string;
  hoverColor?: string;
  activeColor?: string;
}

export interface ColorPreferences {
  headerColor?: string;
  buttonColor?: string;
  textColor?: string;
  backgroundColor?: string;
  cardColor?: string;
  accentColor?: string;
}

// Predefined color schemes
const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Sleek dark theme with vibrant accents',
    colors: {
      primary: '#2563eb',
      secondary: '#7c3aed',
      accent: '#06b6d4',
      background: '#0f172a',
      surface: '#1e293b',
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
        accent: '#38bdf8',
        onDark: '#ffffff',
        onLight: '#000000',
      },
      buttons: {
        primary: '#3b82f6',
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
        active: '#3b82f6',
      },
    },
  },
  {
    id: 'soft-light',
    name: 'Soft Light',
    description: 'Gentle light theme with pastel colors',
    colors: {
      primary: '#60a5fa',
      secondary: '#a78bfa',
      accent: '#34d399',
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
        primary: '#93c5fd',
        secondary: '#cbd5e1',
        success: '#86efac',
        warning: '#fde047',
        error: '#fca5a5',
        text: '#1e293b',
      },
      components: {
        header: '#e2e8f0',
        sidebar: '#f1f5f9',
        card: '#ffffff',
        input: '#ffffff',
        border: '#e2e8f0',
        hover: '#f1f5f9',
        active: '#93c5fd',
      },
    },
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Blue-centric theme with ocean vibes',
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
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural green theme with earthy tones',
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
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm orange and purple sunset theme',
    colors: {
      primary: '#f97316',
      secondary: '#a855f7',
      accent: '#ec4899',
      background: '#7c2d12',
      surface: '#9a3412',
      text: {
        primary: '#fed7aa',
        secondary: '#fdba74',
        accent: '#fb923c',
        onDark: '#ffffff',
        onLight: '#000000',
      },
      buttons: {
        primary: '#ea580c',
        secondary: '#a855f7',
        success: '#059669',
        warning: '#f59e0b',
        error: '#dc2626',
        text: '#ffffff',
      },
      components: {
        header: '#9a3412',
        sidebar: '#7c2d12',
        card: '#ea580c',
        input: '#f97316',
        border: '#fb923c',
        hover: '#a855f7',
        active: '#fdba74',
      },
    },
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    description: 'Deep purple theme for night owls',
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      accent: '#06b6d4',
      background: '#312e81',
      surface: '#4f46e5',
      text: {
        primary: '#ede9fe',
        secondary: '#ddd6fe',
        accent: '#c4b5fd',
        onDark: '#ffffff',
        onLight: '#000000',
      },
      buttons: {
        primary: '#7c3aed',
        secondary: '#ec4899',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        text: '#ffffff',
      },
      components: {
        header: '#4f46e5',
        sidebar: '#312e81',
        card: '#7c3aed',
        input: '#8b5cf6',
        border: '#a78bfa',
        hover: '#ec4899',
        active: '#c4b5fd',
      },
    },
  },
  {
    id: 'minimal-gray',
    name: 'Minimal Gray',
    description: 'Clean monochrome theme',
    colors: {
      primary: '#6b7280',
      secondary: '#9ca3af',
      accent: '#3b82f6',
      background: '#f9fafb',
      surface: '#ffffff',
      text: {
        primary: '#111827',
        secondary: '#6b7280',
        accent: '#3b82f6',
        onDark: '#ffffff',
        onLight: '#000000',
      },
      buttons: {
        primary: '#6b7280',
        secondary: '#9ca3af',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        text: '#ffffff',
      },
      components: {
        header: '#e5e7eb',
        sidebar: '#f3f4f6',
        card: '#ffffff',
        input: '#ffffff',
        border: '#d1d5db',
        hover: '#f3f4f6',
        active: '#3b82f6',
      },
    },
  },
  {
    id: 'vibrant-rainbow',
    name: 'Vibrant Rainbow',
    description: 'Colorful theme for a lively interface',
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#1e293b',
      surface: '#334155',
      text: {
        primary: '#f1f5f9',
        secondary: '#cbd5e1',
        accent: '#fbbf24',
        onDark: '#ffffff',
        onLight: '#000000',
      },
      buttons: {
        primary: '#3b82f6',
        secondary: '#10b981',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        text: '#ffffff',
      },
      components: {
        header: '#334155',
        sidebar: '#1e293b',
        card: '#475569',
        input: '#475569',
        border: '#64748b',
        hover: '#4b5563',
        active: '#3b82f6',
      },
    },
  },
];

// Color combinations for notes/cards
const NOTE_COLOR_COMBINATIONS = [
  // Blue combinations
  { background: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  { background: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  { background: '#2563eb', text: '#ffffff', border: '#1d4ed8' },
  
  // Green combinations
  { background: '#dcfce7', text: '#166534', border: '#86efac' },
  { background: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  { background: '#059669', text: '#ffffff', border: '#047857' },
  
  // Purple combinations
  { background: '#f3e8ff', text: '#6b21a8', border: '#d8b4fe' },
  { background: '#faf5ff', text: '#7c3aed', border: '#e9d5ff' },
  { background: '#7c3aed', text: '#ffffff', border: '#6d28d9' },
  
  // Yellow combinations
  { background: '#fef9c3', text: '#854d0e', border: '#fde047' },
  { background: '#fefce8', text: '#a16207', border: '#fef08a' },
  { background: '#eab308', text: '#ffffff', border: '#ca8a04' },
  
  // Pink combinations
  { background: '#fce7f3', text: '#9d174d', border: '#f9a8d4' },
  { background: '#fdf2f8', text: '#be185d', border: '#fbcfe8' },
  { background: '#db2777', text: '#ffffff', border: '#be185d' },
  
  // Orange combinations
  { background: '#ffedd5', text: '#9a3412', border: '#fdba74' },
  { background: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  { background: '#ea580c', text: '#ffffff', border: '#c2410c' },
  
  // Teal combinations
  { background: '#ccfbf1', text: '#115e59', border: '#5eead4' },
  { background: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
  { background: '#0d9488', text: '#ffffff', border: '#0f766e' },
  
  // Gray combinations
  { background: '#f3f4f6', text: '#374151', border: '#d1d5db' },
  { background: '#f9fafb', text: '#4b5563', border: '#e5e7eb' },
  { background: '#6b7280', text: '#ffffff', border: '#4b5563' },
];

// Calculate contrast ratio for accessibility
const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.replace('#', ''), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const sR = r / 255;
    const sG = g / 255;
    const sB = b / 255;
    
    const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
    const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
    const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
    
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (brighter + 0.05) / (darker + 0.05);
};

// Determine if text color should be light or dark based on background
const getTextColorForBackground = (backgroundColor: string): string => {
  const contrastWithWhite = getContrastRatio(backgroundColor, '#ffffff');
  const contrastWithBlack = getContrastRatio(backgroundColor, '#000000');
  
  // Return color with better contrast (minimum 4.5:1 for normal text)
  return contrastWithWhite > contrastWithBlack ? '#ffffff' : '#000000';
};

export const useColorScheme = (customPreferences?: ColorPreferences) => {
  const theme = useTheme();
  
  // Get current scheme based on theme mode
  const getCurrentScheme = useCallback((): ColorScheme => {
    const defaultScheme = theme.palette.mode === 'dark' 
      ? COLOR_SCHEMES.find(s => s.id === 'modern-dark')!
      : COLOR_SCHEMES.find(s => s.id === 'soft-light')!;
    
    // Apply custom preferences if provided
    if (customPreferences) {
      return {
        ...defaultScheme,
        colors: {
          ...defaultScheme.colors,
          components: {
            ...defaultScheme.colors.components,
            ...(customPreferences.headerColor && { header: customPreferences.headerColor }),
            ...(customPreferences.cardColor && { card: customPreferences.cardColor }),
          },
          text: {
            ...defaultScheme.colors.text,
            ...(customPreferences.textColor && { primary: customPreferences.textColor }),
          },
          buttons: {
            ...defaultScheme.colors.buttons,
            ...(customPreferences.buttonColor && { primary: customPreferences.buttonColor }),
          },
        },
      };
    }
    
    return defaultScheme;
  }, [theme.palette.mode, customPreferences]);

  const currentScheme = getCurrentScheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Get component styles
  const getComponentStyles = useCallback((component: keyof ColorScheme['colors']['components']): ComponentStyles => {
    const bgColor = currentScheme.colors.components[component];
    const textColor = getTextColorForBackground(bgColor);
    
    return {
      backgroundColor: bgColor,
      color: textColor,
      borderColor: currentScheme.colors.components.border,
      hoverColor: currentScheme.colors.components.hover,
      activeColor: currentScheme.colors.components.active,
    };
  }, [currentScheme]);

  // Get button styles
  const getButtonStyles = useCallback((type: keyof ColorScheme['colors']['buttons']): ComponentStyles => {
    const bgColor = currentScheme.colors.buttons[type];
    const textColor = getTextColorForBackground(bgColor);
    
    return {
      backgroundColor: bgColor,
      color: textColor,
      borderColor: bgColor,
      hoverColor: `${bgColor}CC`, // Add opacity
      activeColor: `${bgColor}99`,
    };
  }, [currentScheme]);

  // Get note card styles (with customizable color)
  const getNoteCardStyles = useCallback((customColor?: string): ComponentStyles => {
    const colorCombination = customColor 
      ? NOTE_COLOR_COMBINATIONS.find(c => c.background === customColor) 
        || NOTE_COLOR_COMBINATIONS[0]
      : NOTE_COLOR_COMBINATIONS[Math.floor(Math.random() * NOTE_COLOR_COMBINATIONS.length)];
    
    return {
      backgroundColor: colorCombination.background,
      color: colorCombination.text,
      borderColor: colorCombination.border,
      hoverColor: `${colorCombination.background}DD`,
      activeColor: colorCombination.border,
    };
  }, []);

  // Get header styles
  const getHeaderStyles = useCallback((): ComponentStyles => {
    return getComponentStyles('header');
  }, [getComponentStyles]);

  // Get sidebar styles
  const getSidebarStyles = useCallback((): ComponentStyles => {
    return getComponentStyles('sidebar');
  }, [getComponentStyles]);

  // Get card styles
  const getCardStyles = useCallback((): ComponentStyles => {
    return getComponentStyles('card');
  }, [getComponentStyles]);

  // Get input styles
  const getInputStyles = useCallback((): ComponentStyles => {
    return getComponentStyles('input');
  }, [getComponentStyles]);

  // Generate gradient background
  const getGradientBackground = useCallback((angle: number = 90): string => {
    return `linear-gradient(${angle}deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`;
  }, [currentScheme]);

  // Get accessible color pair
  const getAccessibleColorPair = useCallback((backgroundColor: string): { background: string; text: string } => {
    const textColor = getTextColorForBackground(backgroundColor);
    return {
      background: backgroundColor,
      text: textColor,
    };
  }, []);

  // Get all color schemes
  const getAllColorSchemes = useCallback((): ColorScheme[] => {
    return COLOR_SCHEMES;
  }, []);

  // Get color scheme by ID
  const getColorSchemeById = useCallback((id: string): ColorScheme | undefined => {
    return COLOR_SCHEMES.find(scheme => scheme.id === id);
  }, []);

  // Get all note color combinations
  const getAllNoteColors = useCallback(() => {
    return NOTE_COLOR_COMBINATIONS;
  }, []);

  // Check if a color combination is accessible (WCAG compliant)
  const isAccessibleCombination = useCallback((background: string, text: string): boolean => {
    const ratio = getContrastRatio(background, text);
    return ratio >= 4.5; // WCAG AA standard for normal text
  }, []);

  return {
    // Current state
    currentScheme,
    isDarkMode,
    
    // Component styles
    getComponentStyles,
    getButtonStyles,
    getNoteCardStyles,
    getHeaderStyles,
    getSidebarStyles,
    getCardStyles,
    getInputStyles,
    
    // Utilities
    getGradientBackground,
    getAccessibleColorPair,
    getTextColorForBackground,
    getContrastRatio,
    
    // Color schemes management
    getAllColorSchemes,
    getColorSchemeById,
    getAllNoteColors,
    isAccessibleCombination,
    
    // Color preferences
    applyColorPreferences: (preferences: ColorPreferences) => {
      // This would typically be saved to localStorage or a backend
      console.log('Applying color preferences:', preferences);
      return { ...currentScheme, ...preferences };
    },
    
    // Quick style helpers
    primaryColor: currentScheme.colors.primary,
    secondaryColor: currentScheme.colors.secondary,
    accentColor: currentScheme.colors.accent,
    backgroundColor: currentScheme.colors.background,
    surfaceColor: currentScheme.colors.surface,
    textPrimary: currentScheme.colors.text.primary,
    textSecondary: currentScheme.colors.text.secondary,
    textAccent: currentScheme.colors.text.accent,
  };
};