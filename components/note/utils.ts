import { NotePriority, NoteStatus } from './types';

export const getPriorityColor = (priority: NotePriority) => {
  const colors: Record<NotePriority, string> = {
    low: '#10b981', // green
    medium: '#f59e0b', // yellow
    high: '#ef4444', // red
    critical: '#dc2626', // dark red
  };
  return colors[priority] || '#6b7280';
};

export const getStatusColor = (status: NoteStatus) => {
  const colors: Record<NoteStatus, string> = {
    draft: '#9ca3af',
    active: '#3b82f6',
    archived: '#8b5cf6',
    deleted: '#ef4444',
  };
  return colors[status] || '#6b7280';
};

export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    personal: '#3b82f6',
    work: '#10b981',
    ideas: '#8b5cf6',
    todo: '#f59e0b',
    reference: '#6b7280',
    general: '#9ca3af',
  };
  return colors[category] || '#6b7280';
};

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