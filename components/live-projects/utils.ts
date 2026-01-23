// components/live-projects/utils.ts
import { LiveProject } from './types';

export const getStatusColor = (status: LiveProject['status']): string => {
  const colorMap = {
    'active': 'success',
    'paused': 'warning',
    'completed': 'primary',
    'delayed': 'error'
  };
  return colorMap[status] || 'default';
};

export const calculateProgressColor = (progress: number): string => {
  if (progress > 80) return "success";
  if (progress > 50) return "warning";
  return "primary";
};

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'N/A';
  }
};

export const formatTime = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch {
    return 'Just now';
  }
};

export const calculateDaysRemaining = (deadline: string): number => {
  try {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  } catch {
    return 30;
  }
};