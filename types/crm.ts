// ============================================
// CRM TYPES - Complete Type Definitions
// ============================================

export interface CustomerInteraction {
  _id: string;
  customerId: string;
  customerName?: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'whatsapp' | 'sms' | 'support';
  direction?: 'inbound' | 'outbound';
  subject: string;
  content: string;
  duration?: number; // in minutes
  outcome?: 'successful' | 'failed' | 'followup_required' | 'no_answer';
  followUpDate?: string;
  followUpCompleted?: boolean;
  assignedTo?: string;
  assignedToName?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  attachments?: {
    name: string;
    url: string;
    size: number;
  }[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName?: string;
}

export interface FollowUpTask {
  _id: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  taskType: 'call' | 'email' | 'meeting' | 'payment' | 'delivery' | 'quote' | 'proposal' | 'other';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'overdue' | 'cancelled';
  title: string;
  description: string;
  dueDate: string;
  completedAt?: string;
  completedBy?: string;
  assignedTo: string;
  assignedToName?: string;
  reminderSent: boolean;
  reminderDate?: string;
  relatedTo?: {
    type: 'order' | 'lead' | 'invoice' | 'payment';
    id: string;
    reference: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Lead {
  _id: string;
  leadId: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  source: 'website' | 'referral' | 'walk_in' | 'call' | 'social_media' | 'email_marketing' | 'sms_campaign' | 'exhibition' | 'other';
  sourceDetails?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  stage: 'cold' | 'warm' | 'hot';
  expectedValue: number;
  probability: number; // 0-100
  assignedTo: string;
  assignedToName?: string;
  nextFollowUp: string;
  lastContacted?: string;
  tags: string[];
  notes: string;
  convertedToCustomer?: string; // customerId
  convertedAt?: string;
  convertedBy?: string;
  lostReason?: string;
  lostAt?: string;
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface LoyaltyProgram {
  _id: string;
  customerId: string;
  customerName?: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  pointsHistory: {
    date: string;
    points: number;
    type: 'earned' | 'redeemed' | 'expired';
    reason: string;
    orderId?: string;
    balance: number;
  }[];
  tierHistory: {
    date: string;
    from: string;
    to: string;
    reason: string;
  }[];
  referralCount: number;
  referralCodes: {
    code: string;
    usedBy?: string;
    usedAt?: string;
    pointsAwarded: number;
  }[];
  birthday?: string;
  anniversary?: string;
  preferences: {
    communication: {
      email: boolean;
      sms: boolean;
      whatsapp: boolean;
    };
    categories: string[];
  };
  lastRewardClaimed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDocument {
  _id: string;
  customerId: string;
  customerName?: string;
  type: 'invoice' | 'receipt' | 'contract' | 'gst_certificate' | 'pan_card' | 'aadhar' | 'business_proof' | 'other';
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedByName?: string;
  uploadedAt: string;
  expiryDate?: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  tags: string[];
}

export interface CustomerAnalytics {
  _id: string;
  customerId: string;
  customerName?: string;
  lifetimeValue: number;
  averageOrderValue: number;
  orderFrequency: number; // days between orders
  churnRisk: 'low' | 'medium' | 'high';
  churnScore: number; // 0-100
  healthScore: number; // 0-100
  healthStatus: 'excellent' | 'good' | 'at_risk' | 'churned';
  preferredCategories: {
    category: string;
    count: number;
    revenue: number;
  }[];
  preferredPaymentMethod: string;
  averageDiscount: number;
  returnRate: number; // percentage
  lastOrderFeedback?: string;
  rating?: number; // 1-5
  npsScore?: number; // -100 to 100
  engagementScore: number; // 0-100
  lastEngagementDate?: string;
  predictedNextOrderDate?: string;
  predictedLTV: number;
  segment: 'vip' | 'regular' | 'new' | 'at_risk' | 'churned' | 'wholesale' | 'retail';
  calculatedAt: string;
}

export interface AuditLog {
  _id: string;
  userId: string;
  userName?: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'export' | 'import' | 'login' | 'logout';
  entityType: 'customer' | 'order' | 'product' | 'lead' | 'interaction' | 'task' | 'document' | 'user' | 'settings';
  entityId: string;
  entityName?: string;
  oldValue?: any;
  newValue?: any;
  changes?: {
    field: string;
    old: any;
    new: any;
  }[];
  ipAddress: string;
  userAgent: string;
  location?: string;
  timestamp: string;
}

export interface CustomerSegment {
  _id: string;
  name: string;
  description: string;
  type: 'dynamic' | 'static';
  criteria: {
    field: string;
    operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in' | 'between';
    value: any;
  }[];
  customerCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  color: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface BulkOperation {
  _id: string;
  type: 'email' | 'sms' | 'whatsapp' | 'status_update' | 'tag_add' | 'tag_remove' | 'delete' | 'export';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  filters: any;
  affectedCount: number;
  processedCount: number;
  failedCount: number;
  results?: any[];
  errorLog?: {
    customerId: string;
    error: string;
  }[];
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  fileUrl?: string; // for exports
}