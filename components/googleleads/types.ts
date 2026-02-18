export interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  source: string;
  status: string;
  score: number;
  assignedTo?: string;
  assignedToName?: string;
  companyId: string;
  companyName?: string;
  position?: string;
  budget?: number;
  currency: string;
  interestLevel: string;
  createdAt: string;
  updatedAt?: string;
  lastContactedAt?: string;
  nextFollowUp?: string;
  tags: string[];
  notes?: string;
  convertedToContact?: string;
  convertedToDeal?: string;
}

export interface Company {
  _id: string;
  name: string;
  email: string;
  industry?: string;
  size?: string;
  userRole: string;
}

export interface Member {
  memberId: string;
  userId: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: string;
  status: string;
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  companyId: string;
  companyName: string;
  position: string;
  budget: string;
  currency: string;
  interestLevel: string;
  assignedTo: string;
  assignedToName: string;
  notes: string;
  tags: string;
}

export interface LeadStats {
  total: number;
  byStatus: Record<string, number>;
  conversionRate: number;
}

export interface GoogleColors {
  blue: string;
  red: string;
  green: string;
  yellow: string;
  grey: string;
  darkGrey: string;
  lightGrey: string;
  purple: string;
}

export interface LeadStatus {
  value: string;
  label: string;
  color: string;
  emoji: string;
}

export interface LeadSource {
  value: string;
  label: string;
  emoji: string;
}

export interface InterestLevel {
  value: string;
  label: string;
  color: string;
  emoji: string;
}