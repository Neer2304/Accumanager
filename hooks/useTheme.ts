// hooks/useTheme.ts
import { useThemeContext } from '@/lib/theme/ThemeProvider'

export function useTheme() {
  const { theme, darkMode, toggleDarkMode, setThemeVariable } = useThemeContext()
  
  return {
    theme,
    darkMode,
    toggleDarkMode,
    setThemeVariable,
  }
}