export interface Note {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  priority: string;
  tags: string[];
  status: string;
  wordCount: number;
  readTime: number;
  readCount: number;
  isPublic: boolean;
  passwordProtected: boolean;
  createdAt: string;
  updatedAt: string;
  color: string;
  icon: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  summary: string;
  category: string;
  priority: string;
  tags: string[];
  color: string;
  icon: string;
  isPublic: boolean;
  password: string;
  removePassword: boolean;
}

export const CATEGORIES = ['general', 'work', 'personal', 'ideas', 'projects', 'learning', 'tasks', 'meetings'];
export const PRIORITIES = ['low', 'medium', 'high', 'critical'];
export const ICONS = ['📝', '📋', '📚', '💡', '🎯', '📅', '👥', '💰', '🔒', '🌟', '📌', '🎨', '📊', '🔔', '💭', '✏️', '📖', '🎉', '🚀', '⭐'];