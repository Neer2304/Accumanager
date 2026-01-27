// utils/dateUtils.ts

// Format date to readable string
export const formatDate = (dateString: string | Date): string => {
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    if (isYesterday) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If within the last week
    const diffInDays = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays < 7) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `${days[date.getDay()]} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Return full date for older posts
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString: string | Date): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    if (diffInSeconds < 0) {
      return 'in the future';
    }
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
};

// Format date for display in post cards (shorter version)
export const formatPostDate = (dateString: string | Date): string => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    }
    
    if (diffInDays === 1) {
      return 'Yesterday';
    }
    
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks}w ago`;
    }
    
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months}m ago`;
    }
    
    const years = Math.floor(diffInDays / 365);
    return `${years}y ago`;
  } catch (error) {
    console.error('Error formatting post date:', error);
    return '';
  }
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (dateString: string | Date): string => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

// Get time difference in human readable format
export const getTimeDifference = (date1: string | Date, date2: string | Date): string => {
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return 'Invalid dates';
    }
    
    const diffInSeconds = Math.abs(Math.floor((d2.getTime() - d1.getTime()) / 1000));
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''}`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
  } catch (error) {
    console.error('Error calculating time difference:', error);
    return 'Error';
  }
};