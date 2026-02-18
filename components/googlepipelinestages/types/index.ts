// components/googlepipelinestages/types/index.ts
export interface PipelineStage {
  _id: string;
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

export interface Company {
  _id: string;
  name: string;
  email: string;
  industry?: string;
  size?: string;
  userRole: string;
  plan: string;
}

export interface Member {
  userId: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: string;
}

export interface PipelineStats {
  totalStages: number;
  activeStages: number;
  totalDeals: number;
  totalValue: number;
  avgProbability: number;
}