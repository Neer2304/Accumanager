import mongoose from 'mongoose';

export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'assignment' 
  | 'mention'
  | 'reminder'
  | 'update'
  | 'alert';
export interface NotificationData {
  userId: string | mongoose.Types.ObjectId; // Allow both string and ObjectId
  title: string;
  message: string;
  type: NotificationType;
  isRead?: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  readAt?: Date;
}

// export interface ProjectNotificationData {
//   projectId: string;
//   projectName: string;
//   [key: string]: any;
// }

// export interface TaskNotificationData {
//   taskId: string;
//   taskTitle: string;
//   projectId?: string;
//   projectName?: string;
//   assignedTo?: string;
//   [key: string]: any;
// }

export interface CreateNotificationOptions {
  isRead?: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ProjectNotificationData {
  projectId: string;
  projectName: string;
  event: 
    | 'project_created' 
    | 'project_completed' 
    | 'project_delayed' 
    | 'project_deleted';
  deadline?: Date;
  daysLate?: number;
}

export interface TaskNotificationData {
  taskId: string;
  taskTitle: string;
  projectId: string;
  projectName: string;
  event: 
    | 'task_created' 
    | 'task_updated' 
    | 'task_status_changed' 
    | 'task_completed' 
    | 'task_deleted' 
    | 'task_assigned'
    | 'task_due_soon'
    | 'task_overdue';
  oldStatus?: string;
  newStatus?: string;
  assignedTo?: string;
  dueDate?: Date;
  daysUntilDue?: number;
  daysOverdue?: number;
}

export interface LeadNotificationData {
  leadId: string;
  leadName: string;
  event: 
    | 'lead_created' 
    | 'lead_updated' 
    | 'lead_status_changed' 
    | 'lead_assigned' 
    | 'lead_converted' 
    | 'lead_deleted';
  oldStatus?: string;
  newStatus?: string;
  source?: string;
  companyName?: string;
}

export interface ContactNotificationData {
  contactId: string;
  contactName: string;
  event: 
    | 'contact_created' 
    | 'contact_updated' 
    | 'contact_assigned' 
    | 'contact_lifecycle_changed'
    | 'contact_birthday'
    | 'contact_anniversary';
  oldStage?: string;
  newStage?: string;
  companyName?: string;
}

export interface DealNotificationData {
  dealId: string;
  dealName: string;
  dealValue: number;
  event: 
    | 'deal_created' 
    | 'deal_updated' 
    | 'deal_stage_changed' 
    | 'deal_assigned' 
    | 'deal_won' 
    | 'deal_lost'
    | 'deal_closing_soon'
    | 'deal_overdue';
  oldStage?: string;
  newStage?: string;
  probability?: number;
  expectedClosingDate?: Date;
  lossReason?: string;
}

export interface ActivityNotificationData {
  activityId: string;
  activityType: string;
  activitySubject: string;
  event: 
    | 'activity_created' 
    | 'activity_assigned' 
    | 'activity_completed' 
    | 'activity_reminder';
  dueDate?: Date;
  relatedEntity?: {
    type: string;
    id: string;
    name: string;
  };
}

export interface EventNotificationData {
  eventId: string;
  eventTitle: string;
  eventType: string;
  event: 
    | 'event_created' 
    | 'event_updated' 
    | 'event_invitation' 
    | 'event_starting_soon'
    | 'event_cancelled';
  startDateTime: Date;
  location?: string;
  minutesUntilStart?: number;
}

export interface CompanyNotificationData {
  companyId: string;
  companyName: string;
  event: 
    | 'company_created' 
    | 'company_updated' 
    | 'user_invited' 
    | 'user_joined'
    | 'subscription_status_changed'
    | 'subscription_expiring_soon';
  oldStatus?: string;
  newStatus?: string;
  plan?: string;
  daysUntilExpiry?: number;
}

export interface OrderNotificationData {
  orderId: string;
  orderNumber: string;
  event: 
    | 'order_created' 
    | 'order_updated' 
    | 'order_status_changed' 
    | 'order_shipped' 
    | 'order_delivered'
    | 'order_cancelled'
    | 'order_returned';
  oldStatus?: string;
  newStatus?: string;
  trackingNumber?: string;
  grandTotal?: number;
}

export interface EmployeeNotificationData {
  employeeId: string;
  employeeName: string;
  event: 
    | 'employee_onboarded' 
    | 'employee_status_changed' 
    | 'leave_requested' 
    | 'leave_approved' 
    | 'leave_rejected';
  oldStatus?: string;
  newStatus?: string;
  department?: string;
  designation?: string;
}

export interface MentionNotificationData {
  noteId: string;
  noteTitle?: string;
  entityType: string;
  entityId: string;
  entityName: string;
  mentionedBy: string;
  mentionedByName: string;
}

export interface AnalyticsNotificationData {
  event: 
    | 'monthly_report_ready' 
    | 'quarterly_report_ready' 
    | 'annual_report_ready'
    | 'milestone_achieved';
  period?: string;
  year?: number;
  metrics?: Record<string, any>;
  milestone?: string;
  value?: number;
}