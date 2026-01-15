import { useTheme } from '@mui/material/styles';

// Light theme colors (good for white text on dark backgrounds)
const LIGHT_THEME_COLORS = [
  '#1e40af', // Deep Blue
  '#047857', // Emerald Green
  '#7c3aed', // Violet
  '#dc2626', // Crimson Red
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#be185d', // Pink 700
  '#0f766e', // Teal 700
  
  // Pastel colors (good for dark text)
  '#e0f2fe', // Light Blue
  '#fef3c7', // Light Yellow
  '#fce7f3', // Light Pink
  '#dcfce7', // Light Green
  '#fef9c3', // Light Yellow
  '#e0e7ff', // Light Indigo
  '#f3e8ff', // Light Purple
  '#fefce8', // Light Yellow
  
  // Neutral colors
  '#1f2937', // Gray 800 (for light text)
  '#374151', // Gray 700 (for light text)
  '#4b5563', // Gray 600 (for light text)
  '#6b7280', // Gray 500 (for light text)
];

// Dark theme colors (brighter for better visibility on dark backgrounds)
const DARK_THEME_COLORS = [
  '#60a5fa', // Blue 400
  '#34d399', // Green 400
  '#a78bfa', // Violet 400
  '#f87171', // Red 400
  '#fbbf24', // Yellow 400
  '#2dd4bf', // Teal 400
  '#f472b6', // Pink 400
  '#818cf8', // Indigo 400
  
  // Medium colors for dark theme
  '#3b82f6', // Blue 500
  '#10b981', // Green 500
  '#8b5cf6', // Violet 500
  '#ef4444', // Red 500
  '#f59e0b', // Yellow 500
  '#06b6d4', // Cyan 500
  '#f97316', // Orange 500
  '#ec4899', // Pink 500
  
  // Light colors for dark theme (for dark text)
  '#dbeafe', // Blue 100
  '#dcfce7', // Green 100
  '#f3e8ff', // Purple 100
  '#fee2e2', // Red 100
  '#fef3c7', // Yellow 100
  '#cffafe', // Cyan 100
  '#ffedd5', // Orange 100
  '#fce7f3', // Pink 100
];

// Function to determine text color based on background color
const getContrastTextColor = (backgroundColor: string): string => {
  try {
    // Remove # if present
    const hex = backgroundColor.replace('#', '');
    
    // Handle short hex codes
    const fullHex = hex.length === 3 
      ? hex.split('').map(c => c + c).join('')
      : hex;
    
    // Convert to RGB
    const r = parseInt(fullHex.substr(0, 2), 16);
    const g = parseInt(fullHex.substr(2, 2), 16);
    const b = parseInt(fullHex.substr(4, 2), 16);
    
    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light backgrounds, white for dark backgrounds
    // Using a threshold of 0.6 for better contrast
    return luminance > 0.6 ? '#000000' : '#ffffff';
  } catch (error) {
    // Fallback to black
    return '#000000';
  }
};

export const useThemeColors = () => {
  const theme = useTheme();
  
  const isDarkMode = theme.palette.mode === 'dark';
  
  const noteColors = isDarkMode 
    ? DARK_THEME_COLORS  // Use dark theme colors
    : LIGHT_THEME_COLORS; // Use light theme colors
  
  const getColorWithContrast = (color: string) => {
    const textColor = getContrastTextColor(color);
    return {
      backgroundColor: color,
      color: textColor,
    };
  };
  
  // Get a random color from the appropriate palette
  const getRandomColor = (): string => {
    return noteColors[Math.floor(Math.random() * noteColors.length)];
  };
  
  // Get color styles for a note card
  const getNoteCardStyles = (noteColor?: string) => {
    const color = noteColor || getRandomColor();
    const textColor = getContrastTextColor(color);
    
    return {
      backgroundColor: color,
      color: textColor,
      borderColor: textColor === '#ffffff' 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(0, 0, 0, 0.1)',
    };
  };
  
  return {
    noteColors,
    getColorWithContrast,
    getRandomColor,
    getNoteCardStyles,
    isDarkMode,
  };
};