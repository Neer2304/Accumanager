// components/googleadminsupport/types.ts
export interface SupportTicket {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  replies: Array<{
    message: string;
    isAdmin: boolean;
    createdAt: string;
  }>;
}

export interface SupportStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  urgent: number;
}

export interface SupportFilters {
  search: string;
  status: string;
  priority: string;
}

export interface SupportHeaderProps {
  onRefresh: () => void;
  loading: boolean;
  darkMode?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}

export interface SupportStatsProps {
  stats: SupportStats;
  darkMode?: boolean;
}

export interface SupportFiltersProps {
  filters: SupportFilters;
  onFilterChange: (key: keyof SupportFilters, value: string) => void;
  onClearFilters: () => void;
  darkMode?: boolean;
}

export interface SupportTableProps {
  tickets: SupportTicket[];
  loading: boolean;
  filteredCount: number;
  totalCount: number;
  onViewTicket: (ticket: SupportTicket) => void;
  darkMode?: boolean;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}

export interface SupportDialogProps {
  open: boolean;
  ticket: SupportTicket | null;
  replyMessage: string;
  onReplyChange: (message: string) => void;
  onSendReply: () => void;
  onUpdateStatus: (ticketId: string, status: string) => void;
  onClose: () => void;
  darkMode?: boolean;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
}

export interface SupportAlertsProps {
  error: string | null;
  success: string | null;
  onErrorClose: () => void;
  onSuccessClose: () => void;
  darkMode?: boolean;
}