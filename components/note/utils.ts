import { NotePriority, NoteStatus } from './types';

// export const getPriorityColor = (priority: NotePriority) => {
//   const colors: Record<NotePriority, string> = {
//     low: '#10b981', // green
//     medium: '#f59e0b', // yellow
//     high: '#ef4444', // red
//     critical: '#dc2626', // dark red
//   };
//   return colors[priority] || '#6b7280';
// };

export const getStatusColor = (status: NoteStatus) => {
  const colors: Record<NoteStatus, string> = {
    draft: '#9ca3af',
    active: '#3b82f6',
    archived: '#8b5cf6',
    deleted: '#ef4444',
  };
  return colors[status] || '#6b7280';
};

// export const getCategoryColor = (category: string) => {
//   const colors: Record<string, string> = {
//     personal: '#3b82f6',
//     work: '#10b981',
//     ideas: '#8b5cf6',
//     todo: '#f59e0b',
//     reference: '#6b7280',
//     general: '#9ca3af',
//   };
//   return colors[category] || '#6b7280';
// };

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const truncateText = (text: string, maxLength: number = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const calculateReadTime = (wordCount: number) => {
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
};

export const generateNoteColors = () => {
  const colors = [
    '#fef3c7', '#fde68a', '#fbbf24', // yellow
    '#dbeafe', '#93c5fd', '#3b82f6', // blue
    '#e0e7ff', '#a5b4fc', '#8b5cf6', // purple
    '#fce7f3', '#f9a8d4', '#ec4899', // pink
    '#dcfce7', '#86efac', '#22c55e', // green
    '#fef2f2', '#fca5a5', '#ef4444', // red
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getNoteIcon = (category: string) => {
  const icons: Record<string, string> = {
    personal: '👤',
    work: '💼',
    ideas: '💡',
    todo: '✅',
    reference: '📚',
    journal: '📔',
    meeting: '📅',
    project: '📋',
    general: '📝',
  };
  return icons[category] || '📝';
};

// Color utility functions with better color schemes

// Priority colors with better contrast
export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    critical: '#dc2626', // Red 600
    high: '#ea580c', // Orange 600
    medium: '#d97706', // Amber 600
    low: '#059669', // Emerald 600
  };
  return colors[priority] || '#6b7280'; // Gray 500 as fallback
};

// Category colors with better contrast
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    work: '#2563eb', // Blue 600
    personal: '#7c3aed', // Violet 600
    ideas: '#db2777', // Pink 600
    projects: '#0891b2', // Cyan 600
    learning: '#059669', // Emerald 600
    tasks: '#ea580c', // Orange 600
    meetings: '#9333ea', // Purple 600
    general: '#4b5563', // Gray 600
  };
  return colors[category] || '#6b7280'; // Gray 500 as fallback
};

// Get contrasting text color for any background
export const getContrastTextColor = (backgroundColor: string): string => {
  // Remove # if present
  const hex = backgroundColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// Generate a random color from the enhanced palette
export const getRandomColor = (): string => {
  const enhancedPalette = [
    '#1e40af', '#047857', '#7c3aed', '#dc2626', '#f59e0b', '#10b981',
    '#e0f2fe', '#fef3c7', '#fce7f3', '#dcfce7', '#fef9c3', '#e0e7ff',
    '#1f2937', '#374151', '#4b5563', '#6b7280',
  ];
  return enhancedPalette[Math.floor(Math.random() * enhancedPalette.length)];
};

// Get color based on note properties
export const getNoteColor = (note: any): string => {
  if (note.color) return note.color;
  
  // Fallback colors based on category
  const categoryColors: Record<string, string> = {
    work: '#e0f2fe', // Light blue
    personal: '#fce7f3', // Light pink
    ideas: '#fef3c7', // Light yellow
    projects: '#dcfce7', // Light green
    learning: '#e0e7ff', // Light indigo
    tasks: '#fef9c3', // Light yellow
    meetings: '#f3e8ff', // Light purple
  };
  
  return categoryColors[note.category] || '#ffffff';
};