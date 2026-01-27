import Notification from '@/models/Notification';
import { 
  NotificationData, 
  NotificationType, 
  ProjectNotificationData, 
  TaskNotificationData,
  CreateNotificationOptions 
} from '@/types/notification';
import mongoose from 'mongoose';

export class NotificationService {
  // ============ HELPER METHODS ============
  
  /**
   * Convert userId to ObjectId
   */
  private static toObjectId(userId: string | mongoose.Types.ObjectId): mongoose.Types.ObjectId {
    if (typeof userId === 'string') {
      return new mongoose.Types.ObjectId(userId);
    }
    return userId;
  }

  /**
   * Create notification data with proper typing
   */
  private static createNotificationData(
    userId: string | mongoose.Types.ObjectId,
    title: string,
    message: string,
    type: NotificationType = 'info',
    options: CreateNotificationOptions = {}
  ): NotificationData {
    return {
      userId: this.toObjectId(userId),
      title,
      message,
      type,
      isRead: options.isRead || false,
      actionUrl: options.actionUrl || '',
      metadata: options.metadata || {},
      createdAt: new Date()
    };
  }

  // ============ PROJECT NOTIFICATIONS ============
  
  /**
   * Notify when a project is created
   */
  static async notifyProjectCreated(project: any, userId: string | mongoose.Types.ObjectId): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        'New Project Created 🎉',
        `Your project "${project.name}" has been successfully created. Start adding tasks and team members!`,
        'success',
        {
          actionUrl: `/projects/${project._id}`,
          metadata: {
            projectId: project._id.toString(),
            projectName: project.name,
            event: 'project_created',
            timestamp: new Date().toISOString()
          }
        }
      );
      
      const notification = await Notification.create(notificationData);
      console.log('✅ Project creation notification created:', notification._id);
      return notification;
    } catch (error: any) {
      console.error('❌ Error creating project creation notification:', error);
      throw new Error(`Failed to create project notification: ${error.message}`);
    }
  }

  /**
   * Notify when a project is completed
   */
  static async notifyProjectCompleted(project: any, userId: string | mongoose.Types.ObjectId): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        'Project Completed! 🎊',
        `Congratulations! Project "${project.name}" has been completed successfully.`,
        'success',
        {
          actionUrl: `/projects/${project._id}`,
          metadata: {
            projectId: project._id.toString(),
            projectName: project.name,
            event: 'project_completed',
            completionDate: new Date().toISOString()
          }
        }
      );
      
      const notification = await Notification.create(notificationData);
      console.log('✅ Project completion notification created:', notification._id);
      return notification;
    } catch (error: any) {
      console.error('❌ Error creating project completion notification:', error);
      throw new Error(`Failed to create project completion notification: ${error.message}`);
    }
  }

  /**
   * Notify when a project is delayed
   */
  static async notifyProjectDelayed(project: any, userId: string | mongoose.Types.ObjectId): Promise<any> {
    try {
      const deadline = new Date(project.deadline);
      const now = new Date();
      const daysLate = Math.max(0, Math.ceil((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24)));
      
      const notificationData = this.createNotificationData(
        userId,
        'Project Delayed ⚠️',
        `Project "${project.name}" is ${daysLate} day${daysLate !== 1 ? 's' : ''} past deadline. Please review the timeline.`,
        'warning',
        {
          actionUrl: `/projects/${project._id}`,
          metadata: {
            projectId: project._id.toString(),
            projectName: project.name,
            daysLate,
            originalDeadline: project.deadline,
            event: 'project_delayed'
          }
        }
      );
      
      const notification = await Notification.create(notificationData);
      console.log('✅ Project delayed notification created:', notification._id);
      return notification;
    } catch (error: any) {
      console.error('❌ Error creating project delayed notification:', error);
      throw new Error(`Failed to create project delayed notification: ${error.message}`);
    }
  }

  // ============ TASK NOTIFICATIONS ============

  /**
   * Notify when a task is created
   */
  static async notifyTaskCreated(task: any, userId: string | mongoose.Types.ObjectId): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        'New Task Assigned 📝',
        `Task "${task.title}" has been created${task.assignedToName ? ` and assigned to ${task.assignedToName}` : ''}.`,
        'info',
        {
          actionUrl: `/tasks?projectId=${task.projectId}`,
          metadata: {
            taskId: task._id?.toString() || task.id,
            taskTitle: task.title,
            projectId: task.projectId,
            projectName: task.projectName,
            assignedTo: task.assignedToName,
            priority: task.priority,
            dueDate: task.dueDate,
            event: 'task_created'
          }
        }
      );
      
      const notification = await Notification.create(notificationData);
      console.log('✅ Task creation notification created:', notification._id);
      return notification;
    } catch (error: any) {
      console.error('❌ Error creating task creation notification:', error);
      throw new Error(`Failed to create task notification: ${error.message}`);
    }
  }

  /**
   * Notify when a task status is updated
   */
  static async notifyTaskStatusUpdated(
    task: any, 
    oldStatus: string, 
    newStatus: string, 
    userId: string | mongoose.Types.ObjectId
  ): Promise<any> {
    try {
      const statusEmoji: Record<string, string> = {
        'todo': '📋',
        'in_progress': '🔄',
        'in_review': '👀',
        'completed': '✅',
        'blocked': '🚫'
      };

      const notificationData = this.createNotificationData(
        userId,
        `Task Status Updated ${statusEmoji[newStatus] || '📝'}`,
        `Task "${task.title}" status changed from ${oldStatus.replace('_', ' ')} to ${newStatus.replace('_', ' ')}.`,
        newStatus === 'completed' ? 'success' : 
        newStatus === 'blocked' ? 'warning' : 'info',
        {
          actionUrl: `/tasks?projectId=${task.projectId}`,
          metadata: {
            taskId: task._id?.toString() || task.id,
            taskTitle: task.title,
            oldStatus,
            newStatus,
            projectId: task.projectId,
            projectName: task.projectName,
            updatedAt: new Date().toISOString(),
            event: 'task_status_updated'
          }
        }
      );
      
      const notification = await Notification.create(notificationData);
      console.log('✅ Task status update notification created:', notification._id);
      return notification;
    } catch (error: any) {
      console.error('❌ Error creating task status update notification:', error);
      throw new Error(`Failed to create task status update notification: ${error.message}`);
    }
  }

  /**
   * Notify when a task is approaching deadline (3 days before)
   */
  static async notifyTaskDueSoon(task: any, userId: string | mongoose.Types.ObjectId): Promise<any> {
    try {
      if (!task.dueDate) return null;

      const dueDate = new Date(task.dueDate);
      const now = new Date();
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue > 3) return null; // Only notify if due within 3 days

      const notificationData = this.createNotificationData(
        userId,
        'Task Due Soon ⏰',
        `Task "${task.title}" is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}.`,
        daysUntilDue <= 1 ? 'warning' : 'info',
        {
          actionUrl: `/tasks?projectId=${task.projectId}`,
          metadata: {
            taskId: task._id?.toString() || task.id,
            taskTitle: task.title,
            daysUntilDue,
            dueDate: task.dueDate,
            projectId: task.projectId,
            projectName: task.projectName,
            event: 'task_due_soon'
          }
        }
      );
      
      const notification = await Notification.create(notificationData);
      console.log('✅ Task due soon notification created:', notification._id);
      return notification;
    } catch (error: any) {
      console.error('❌ Error creating task due soon notification:', error);
      throw new Error(`Failed to create task due soon notification: ${error.message}`);
    }
  }

  /**
   * Notify when a task is overdue
   */
  static async notifyTaskOverdue(task: any, userId: string | mongoose.Types.ObjectId): Promise<any> {
    try {
      if (!task.dueDate) return null;

      const dueDate = new Date(task.dueDate);
      const now = new Date();
      
      if (now < dueDate) return null; // Not overdue yet

      const daysOverdue = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

      const notificationData = this.createNotificationData(
        userId,
        'Task Overdue ⚠️',
        `Task "${task.title}" is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue.`,
        'error',
        {
          actionUrl: `/tasks?projectId=${task.projectId}`,
          metadata: {
            taskId: task._id?.toString() || task.id,
            taskTitle: task.title,
            daysOverdue,
            originalDueDate: task.dueDate,
            projectId: task.projectId,
            projectName: task.projectName,
            event: 'task_overdue'
          }
        }
      );
      
      const notification = await Notification.create(notificationData);
      console.log('✅ Task overdue notification created:', notification._id);
      return notification;
    } catch (error: any) {
      console.error('❌ Error creating task overdue notification:', error);
      throw new Error(`Failed to create task overdue notification: ${error.message}`);
    }
  }

  /**
   * Notify when a task is deleted
   */
  static async notifyTaskDeleted(task: any, userId: string | mongoose.Types.ObjectId): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        'Task Deleted 🗑️',
        `Task "${task.title}" has been deleted from project "${task.projectName}".`,
        'info',
        {
          actionUrl: `/tasks?projectId=${task.projectId}`,
          metadata: {
            taskTitle: task.title,
            projectId: task.projectId,
            projectName: task.projectName,
            deletedAt: new Date().toISOString(),
            event: 'task_deleted'
          }
        }
      );
      
      const notification = await Notification.create(notificationData);
      console.log('✅ Task deletion notification created:', notification._id);
      return notification;
    } catch (error: any) {
      console.error('❌ Error creating task deletion notification:', error);
      throw new Error(`Failed to create task deletion notification: ${error.message}`);
    }
  }

  // ============ GENERAL NOTIFICATION METHODS ============

  /**
   * Create a custom notification
   */
  static async createNotification(
    userId: string | mongoose.Types.ObjectId,
    title: string,
    message: string,
    type: NotificationType = 'info',
    options: CreateNotificationOptions = {}
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(userId, title, message, type, options);
      
      const notification = await Notification.create(notificationData);
      console.log('✅ Custom notification created:', notification._id);
      return notification;
    } catch (error: any) {
      console.error('❌ Error creating custom notification:', error);
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string | mongoose.Types.ObjectId): Promise<any> {
    try {
      const notification = await Notification.findOneAndUpdate(
        {
          _id: notificationId,
          userId: this.toObjectId(userId)
        },
        { isRead: true, readAt: new Date() },
        { new: true }
      );
      
      if (!notification) {
        throw new Error('Notification not found or unauthorized');
      }
      
      console.log('✅ Notification marked as read:', notificationId);
      return notification;
    } catch (error: any) {
      console.error('❌ Error marking notification as read:', error);
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string | mongoose.Types.ObjectId): Promise<any> {
    try {
      const result = await Notification.updateMany(
        {
          userId: this.toObjectId(userId),
          isRead: false
        },
        { isRead: true, readAt: new Date() }
      );
      
      console.log(`✅ Marked ${result.modifiedCount} notifications as read for user`);
      return result;
    } catch (error: any) {
      console.error('❌ Error marking all notifications as read:', error);
      throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: string, userId: string | mongoose.Types.ObjectId): Promise<any> {
    try {
      const result = await Notification.findOneAndDelete({
        _id: notificationId,
        userId: this.toObjectId(userId)
      });
      
      if (!result) {
        throw new Error('Notification not found or unauthorized');
      }
      
      console.log('✅ Notification deleted:', notificationId);
      return result;
    } catch (error: any) {
      console.error('❌ Error deleting notification:', error);
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }

  /**
   * Get all notifications for a user
   */
  static async getUserNotifications(
    userId: string | mongoose.Types.ObjectId, 
    options: { unreadOnly?: boolean; limit?: number } = {}
  ): Promise<any[]> {
    try {
      const { unreadOnly = false, limit = 50 } = options;
      
      const query: any = {
        userId: this.toObjectId(userId)
      };
      
      if (unreadOnly) {
        query.isRead = false;
      }
      
      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
      
      console.log(`✅ Retrieved ${notifications.length} notifications for user`);
      return notifications;
    } catch (error: any) {
      console.error('❌ Error getting user notifications:', error);
      throw new Error(`Failed to get notifications: ${error.message}`);
    }
  }

  /**
   * Get notification count for a user
   */
  static async getNotificationCount(
    userId: string | mongoose.Types.ObjectId, 
    unreadOnly: boolean = true
  ): Promise<number> {
    try {
      const query: any = {
        userId: this.toObjectId(userId)
      };
      
      if (unreadOnly) {
        query.isRead = false;
      }
      
      const count = await Notification.countDocuments(query);
      console.log(`✅ Notification count for user: ${count} (unread only: ${unreadOnly})`);
      return count;
    } catch (error: any) {
      console.error('❌ Error getting notification count:', error);
      throw new Error(`Failed to get notification count: ${error.message}`);
    }
  }

  /**
   * Clear all notifications for a user
   */
  static async clearAllNotifications(userId: string | mongoose.Types.ObjectId): Promise<any> {
    try {
      const result = await Notification.deleteMany({
        userId: this.toObjectId(userId)
      });
      
      console.log(`✅ Cleared ${result.deletedCount} notifications for user`);
      return result;
    } catch (error: any) {
      console.error('❌ Error clearing notifications:', error);
      throw new Error(`Failed to clear notifications: ${error.message}`);
    }
  }
}