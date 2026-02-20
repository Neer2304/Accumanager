// components/googleadminlegal/components/types.ts
export interface LegalDocument {
  _id: string;
  type: string;
  title: string;
  content: string;
  version: string;
  lastUpdated: string;
  lastUpdatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
  createdAt?: string;
}

export interface DocumentTypeConfig {
  type: string;
  label: string;
  description: string;
  apiEndpoint: string;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}