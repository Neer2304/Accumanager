export type NotePriority = 'low' | 'medium' | 'high' | 'critical';
export type NoteStatus = 'draft' | 'active' | 'archived' | 'deleted';
export type ShareRole = 'viewer' | 'editor' | 'commenter';
export type ReferenceType = 'note' | 'task' | 'event' | 'customer' | 'invoice';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Reference {
  type: ReferenceType;
  id: string;
  title: string;
}

export interface Reminder {
  datetime: string;
  repeat: RepeatType;
  notified: boolean;
}

export interface NoteVersion {
  content: string;
  version: number;
  createdAt: string;
  userId: string;
  changeSummary?: string;
}

export interface SharedUser {
  userId: string;
  role: ShareRole;
  addedAt: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  userId: string;
  tags: string[];
  category: string;
  priority: NotePriority;
  status: NoteStatus;
  projectId?: string;
  eventId?: string;
  taskId?: string;
  color: string;
  icon: string;
  coverImage?: string;
  sharedWith: SharedUser[];
  isPublic: boolean;
  publicSlug?: string;
  attachments: Attachment[];
  references: Reference[];
  reminders: Reminder[];
  versions: NoteVersion[];
  currentVersion: number;
  wordCount: number;
  readTime: number;
  lastReadAt?: string;
  readCount: number;
  editCount: number;
  aiSummary?: string;
  aiTags?: string[];
  sentiment?: SentimentType;
  keywords?: string[];
  isEncrypted: boolean;
  passwordProtected: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  archivedAt?: string;
}

export interface NoteStats {
  totalNotes: number;
  totalWords: number;
  avgWords: number;
  categories: Array<{ _id: string; count: number }>;
  priorities: Array<{ _id: NotePriority; count: number }>;
  statuses: Array<{ _id: NoteStatus; count: number }>;
  recentActivity: Note[];
  dailyNotes: Array<{ _id: string; count: number }>;
  topTags: Array<{ tag: string; count: number }>;
}

export interface NoteFilters {
  search: string;
  category: string;
  tag: string;
  priority: string;
  status: string;
  sortBy: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'category' | 'wordCount' | 'readCount';
  sortOrder: 'asc' | 'desc';
  showShared: boolean;
  page: number;
  limit: number;
  dateFrom?: string;
  dateTo?: string;
  hasPassword?: boolean;
  isPublic?: boolean;
  projectId?: string;
  eventId?: string;
  taskId?: string;
  showArchived?: boolean;
}

export interface NoteFormData {
  title: string;
  content: string;
  summary: string;
  category: string;
  priority: NotePriority;
  tags: string[];
  color: string;
  icon: string;
  coverImage?: string;
  isPublic: boolean;
  password?: string;
  removePassword?: boolean;
  projectId?: string;
  eventId?: string;
  taskId?: string;
  attachments?: File[];
  references?: Reference[];
  reminders?: Reminder[];
  isEncrypted?: boolean;
}

export interface BulkActionRequest {
  noteIds: string[];
  action: 'archive' | 'restore' | 'delete' | 'change-category' | 'change-priority' | 'add-tags' | 'remove-tags' | 'make-public' | 'make-private' | 'move-to-project' | 'add-reminder';
  data?: any;
}

export interface ShareNoteRequest {
  userIds: string[];
  role: ShareRole;
  expirationDate?: string;
}

export interface NoteCreateRequest {
  title: string;
  content: string;
  summary?: string;
  category?: string;
  priority?: NotePriority;
  tags?: string[];
  color?: string;
  icon?: string;
  isPublic?: boolean;
  password?: string;
  projectId?: string;
  eventId?: string;
  taskId?: string;
}

export interface NoteUpdateRequest {
  title?: string;
  content?: string;
  summary?: string;
  category?: string;
  priority?: NotePriority;
  tags?: string[];
  color?: string;
  icon?: string;
  isPublic?: boolean;
  password?: string;
  removePassword?: boolean;
  status?: NoteStatus;
  projectId?: string | null;
  eventId?: string | null;
  taskId?: string | null;
}

export interface NoteSearchResult {
  notes: Note[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Default values
export const defaultNoteFilters: NoteFilters = {
  search: '',
  category: '',
  tag: '',
  priority: '',
  status: 'active',
  sortBy: 'updatedAt',
  sortOrder: 'desc',
  showShared: false,
  page: 1,
  limit: 20,
};

export const defaultNoteFormData: NoteFormData = {
  title: '',
  content: '',
  summary: '',
  category: 'general',
  priority: 'medium',
  tags: [],
  color: '#ffffff',
  icon: '📝',
  isPublic: false,
  password: '',
  removePassword: false,
};

export const defaultNote: Partial<Note> = {
  title: '',
  content: '',
  summary: '',
  category: 'general',
  priority: 'medium',
  tags: [],
  status: 'draft',
  color: '#ffffff',
  icon: '📝',
  sharedWith: [],
  isPublic: false,
  attachments: [],
  references: [],
  reminders: [],
  versions: [],
  currentVersion: 1,
  wordCount: 0,
  readTime: 0,
  readCount: 0,
  editCount: 0,
  isEncrypted: false,
  passwordProtected: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Utility functions
export const getPriorityColor = (priority: NotePriority): string => {
  const colors = {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#d97706',
    low: '#059669',
  };
  return colors[priority];
};

export const getStatusColor = (status: NoteStatus): string => {
  const colors = {
    active: '#10b981',
    draft: '#6b7280',
    archived: '#f59e0b',
    deleted: '#ef4444',
  };
  return colors[status];
};

export const getStatusLabel = (status: NoteStatus): string => {
  const labels = {
    active: 'Active',
    draft: 'Draft',
    archived: 'Archived',
    deleted: 'Deleted',
  };
  return labels[status];
};

export const getPriorityLabel = (priority: NotePriority): string => {
  const labels = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };
  return labels[priority];
};

// Categories for dropdown
export const NOTE_CATEGORIES = [
  'general',
  'personal',
  'work',
  'ideas',
  'todo',
  'reference',
  'journal',
  'meeting',
  'project',
  'learning',
  'research',
  'temporary',
  'archive',
];

// Icons for notes
export const NOTE_ICONS = [
  '📝', '📋', '📚', '💡', '🎯', '📅', '👥', '💰', '🔒', '🌟',
  '📌', '🎨', '📊', '🔔', '💭', '✏️', '📖', '🎉', '🚀', '⭐',
  '🔍', '📈', '📉', '📋', '📎', '📁', '📂', '🗂️', '🗒️', '🗓️',
  '📆', '📋', '📝', '📄', '📑', '🔖', '🏷️', '📌', '📍', '📏',
];

// Colors for notes
export const NOTE_COLORS = [
  '#ffffff', '#f3f4f6', '#fee2e2', '#fef3c7', '#d1fae5',
  '#dbeafe', '#e0e7ff', '#f3e8ff', '#fce7f3', '#f5f5f4',
  '#dcfce7', '#f0f9ff', '#fefce8', '#fff7ed', '#fef2f2',
  '#eff6ff', '#f5f3ff', '#fdf2f8', '#fafaf9', '#ecfdf5',
];

// Helper to calculate read time
export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

// Helper to calculate word count
export const calculateWordCount = (content: string): number => {
  return content.trim().split(/\s+/).length;
};

// Helper to extract hashtags from content
export const extractTagsFromContent = (content: string): string[] => {
  const tagRegex = /#(\w+)/g;
  const matches = content.match(tagRegex) || [];
  return [...new Set(matches.map(tag => tag.substring(1)))];
};

// Helper to validate note
export interface NoteValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateNote = (note: Partial<NoteFormData>): NoteValidationResult => {
  const errors: string[] = [];

  if (!note.title?.trim()) {
    errors.push('Title is required');
  } else if (note.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (!note.content?.trim()) {
    errors.push('Content is required');
  } else if (note.content.length > 50000) {
    errors.push('Content must be less than 50,000 characters');
  }

  if (note.tags && note.tags.some(tag => tag.length > 50)) {
    errors.push('Tags must be less than 50 characters each');
  }

  if (note.tags && note.tags.length > 20) {
    errors.push('Maximum 20 tags allowed');
  }

  if (note.summary && note.summary.length > 500) {
    errors.push('Summary must be less than 500 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Interface for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  requiresPassword?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  pages?: number;
}