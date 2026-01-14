export type NotePriority = 'low' | 'medium' | 'high' | 'critical';
export type NoteStatus = 'draft' | 'active' | 'archived' | 'deleted';

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
  sharedWith: Array<{
    userId: string;
    role: 'viewer' | 'editor' | 'commenter';
    addedAt: string;
  }>;
  isPublic: boolean;
  publicSlug?: string;
  attachments: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: string;
  }>;
  references: Array<{
    type: 'note' | 'task' | 'event' | 'customer' | 'invoice';
    id: string;
    title: string;
  }>;
  reminders: Array<{
    datetime: string;
    repeat: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    notified: boolean;
  }>;
  versions: Array<{
    content: string;
    version: number;
    createdAt: string;
    userId: string;
    changeSummary?: string;
  }>;
  currentVersion: number;
  wordCount: number;
  readTime: number;
  lastReadAt?: string;
  readCount: number;
  editCount: number;
  aiSummary?: string;
  aiTags?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
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
}

export interface NoteFilters {
  search: string;
  category: string;
  tag: string;
  priority: string;
  status: string;
  sortBy: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'category';
  sortOrder: 'asc' | 'desc';
  showShared: boolean;
  page: number;
  limit: number;
}