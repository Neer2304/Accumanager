// components/googleadminterms/types.ts
export interface TermsHistory {
  _id: string;
  version: string;
  title: string;
  effectiveDate: string;
  isActive: boolean;
  createdAt: string;
  description?: string;
}

export interface TermsFormData {
  version: string;
  title: string;
  description: string;
  effectiveDate: string;
}

export interface TermsHeaderProps {
  onCreateClick: () => void;
  darkMode?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}

export interface TermsListProps {
  termsHistory: TermsHistory[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
  darkMode?: boolean;
}

export interface TermsDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TermsFormData) => void;
  darkMode?: boolean;
}

export interface TermsAlertsProps {
  error: string | null;
  success: string | null;
  onErrorClose: () => void;
  onSuccessClose: () => void;
  darkMode?: boolean;
}