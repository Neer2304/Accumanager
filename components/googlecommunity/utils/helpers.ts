// components/googlecommunity/utils/helpers.ts
import { PostType } from '@/types/community';

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
};

// Get category color
export const getCategoryColor = (category: string, darkMode: boolean): string => {
  switch (category?.toLowerCase()) {
    case 'questions': return '#4285f4';
    case 'announcements': return '#9c27b0';
    case 'feedback': return '#00bcd4';
    case 'ideas': return '#34a853';
    case 'help': return '#f57c00';
    default: return darkMode ? '#5f6368' : '#5f6368';
  }
};