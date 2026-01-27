import mongoose from 'mongoose';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

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

export interface ProjectNotificationData {
  projectId: string;
  projectName: string;
  [key: string]: any;
}

export interface TaskNotificationData {
  taskId: string;
  taskTitle: string;
  projectId?: string;
  projectName?: string;
  assignedTo?: string;
  [key: string]: any;
}

export interface CreateNotificationOptions {
  isRead?: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}