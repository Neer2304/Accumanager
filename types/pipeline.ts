// types/pipeline.ts
export interface PipelineStage {
  _id: string;
  id?: string; // For frontend use
  companyId: string;
  companyName?: string;
  name: string;
  order: number;
  probability: number;
  color: string;
  category: 'open' | 'won' | 'lost';
  isActive: boolean;
  isDefault: boolean;
  dealCount?: number;
  totalValue?: number;
  requiredFields?: string[];
  allowedStages?: string[];
  autoAdvance: boolean;
  autoAdvanceDays?: number;
  notifyOnEnter: boolean;
  notifyOnExit: boolean;
  notifyUsers?: string[];
  customFields?: Array<{
    name: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'select';
    required: boolean;
    options?: string[];
  }>;
  createdBy: string;
  createdByName: string;
  updatedBy?: string;
  updatedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStageFormData {
  name: string;
  probability: string;
  color: string;
  category: 'open' | 'won' | 'lost';
  isActive: boolean;
  autoAdvance: boolean;
  autoAdvanceDays: string;
  notifyOnEnter: boolean;
  notifyOnExit: boolean;
  notifyUsers: string[];
  requiredFields: string[];
  allowedStages: string[];
  customFields: Array<{
    name: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'select';
    required: boolean;
    options?: string[];
  }>;
}

export interface PipelineStageStats {
  totalStages: number;
  activeStages: number;
  totalDeals: number;
  totalValue: number;
  avgProbability: number;
}

export interface StageReorderItem {
  id: string;
  order: number;
}

export interface PipelineStageFilters {
  category?: string;
  isActive?: boolean;
  search?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  stages?: PipelineStage[];
  stage?: PipelineStage;
  error?: string;
  message?: string;
  total?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}