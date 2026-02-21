import Notification from "@/models/Notification";
import {
  NotificationData,
  NotificationType,
  ProjectNotificationData,
  TaskNotificationData,
  CreateNotificationOptions,
} from "@/types/notification";
import mongoose from "mongoose";

export class NotificationService {
  // ============ HELPER METHODS ============

  /**
   * Convert userId to ObjectId
   */
  private static toObjectId(
    userId: string | mongoose.Types.ObjectId,
  ): mongoose.Types.ObjectId {
    if (typeof userId === "string") {
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
    type: NotificationType = "info",
    options: CreateNotificationOptions = {},
  ): NotificationData {
    return {
      userId: this.toObjectId(userId),
      title,
      message,
      type,
      isRead: options.isRead || false,
      actionUrl: options.actionUrl || "",
      metadata: options.metadata || {},
      createdAt: new Date(),
    };
  }

  // Add these methods to your NotificationService class in services/notificationService.ts

  // ============ PRODUCT NOTIFICATIONS ============

  /**
   * Notify when a product is created
   */
  static async notifyProductCreated(
    product: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "New Product Created 📦",
        `Product "${product.name}" has been created successfully.`,
        "success",
        {
          actionUrl: `/products/${product._id}`,
          metadata: {
            productId: product._id.toString(),
            productName: product.name,
            category: product.category,
            price: product.basePrice,
            event: "product_created",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Product creation notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating product creation notification:", error);
      throw new Error(
        `Failed to create product notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a product is updated
   */
  static async notifyProductUpdated(
    product: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Product Updated ✏️",
        `Product "${product.name}" has been updated.`,
        "info",
        {
          actionUrl: `/products/${product._id}`,
          metadata: {
            productId: product._id.toString(),
            productName: product.name,
            event: "product_updated",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Product update notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating product update notification:", error);
      throw new Error(
        `Failed to create product update notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a product is deleted
   */
  static async notifyProductDeleted(
    product: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Product Deleted 🗑️",
        `Product "${product.name}" has been deleted.`,
        "info",
        {
          metadata: {
            productId: product._id?.toString(),
            productName: product.name,
            event: "product_deleted",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Product deletion notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating product deletion notification:", error);
      throw new Error(
        `Failed to create product deletion notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when product stock is low
   */
  static async notifyProductLowStock(
    product: any,
    stockLevel: number,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Low Stock Alert ⚠️",
        `Product "${product.name}" is running low on stock. Current stock: ${stockLevel} units.`,
        "warning",
        {
          actionUrl: `/products/${product._id}`,
          priority: "high",
          metadata: {
            productId: product._id.toString(),
            productName: product.name,
            stockLevel,
            event: "product_low_stock",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Product low stock notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating product low stock notification:", error);
      throw new Error(
        `Failed to create product low stock notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when product is out of stock
   */
  static async notifyProductOutOfStock(
    product: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Out of Stock Alert ❌",
        `Product "${product.name}" is now out of stock.`,
        "error",
        {
          actionUrl: `/products/${product._id}`,
          priority: "high",
          metadata: {
            productId: product._id.toString(),
            productName: product.name,
            event: "product_out_of_stock",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Product out of stock notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating product out of stock notification:",
        error,
      );
      throw new Error(
        `Failed to create product out of stock notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when product price changes
   */
  static async notifyProductPriceChanged(
    product: any,
    oldPrice: number,
    newPrice: number,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const priceChange = newPrice - oldPrice;
      const direction = priceChange > 0 ? "increased" : "decreased";
      const emoji = priceChange > 0 ? "📈" : "📉";

      const notificationData = this.createNotificationData(
        userId,
        `Product Price ${direction === "increased" ? "Increased" : "Decreased"} ${emoji}`,
        `Product "${product.name}" price has ${direction} from ₹${oldPrice} to ₹${newPrice}.`,
        priceChange > 0 ? "info" : "warning",
        {
          actionUrl: `/products/${product._id}`,
          metadata: {
            productId: product._id.toString(),
            productName: product.name,
            oldPrice,
            newPrice,
            priceChange: Math.abs(priceChange),
            direction,
            event: "product_price_changed",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Product price change notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating product price change notification:",
        error,
      );
      throw new Error(
        `Failed to create product price change notification: ${error.message}`,
      );
    }
  }

  // ============ PROJECT NOTIFICATIONS ============

  /**
   * Notify when a project is created
   */
  static async notifyProjectCreated(
    project: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "New Project Created 🎉",
        `Your project "${project.name}" has been successfully created. Start adding tasks and team members!`,
        "success",
        {
          actionUrl: `/projects/${project._id}`,
          metadata: {
            projectId: project._id.toString(),
            projectName: project.name,
            event: "project_created",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Project creation notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating project creation notification:", error);
      throw new Error(
        `Failed to create project notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a project is completed
   */
  static async notifyProjectCompleted(
    project: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Project Completed! 🎊",
        `Congratulations! Project "${project.name}" has been completed successfully.`,
        "success",
        {
          actionUrl: `/projects/${project._id}`,
          metadata: {
            projectId: project._id.toString(),
            projectName: project.name,
            event: "project_completed",
            completionDate: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Project completion notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating project completion notification:",
        error,
      );
      throw new Error(
        `Failed to create project completion notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a project is delayed
   */
  static async notifyProjectDelayed(
    project: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const deadline = new Date(project.deadline);
      const now = new Date();
      const daysLate = Math.max(
        0,
        Math.ceil((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24)),
      );

      const notificationData = this.createNotificationData(
        userId,
        "Project Delayed ⚠️",
        `Project "${project.name}" is ${daysLate} day${daysLate !== 1 ? "s" : ""} past deadline. Please review the timeline.`,
        "warning",
        {
          actionUrl: `/projects/${project._id}`,
          metadata: {
            projectId: project._id.toString(),
            projectName: project.name,
            daysLate,
            originalDeadline: project.deadline,
            event: "project_delayed",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Project delayed notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating project delayed notification:", error);
      throw new Error(
        `Failed to create project delayed notification: ${error.message}`,
      );
    }
  }

  // ============ TASK NOTIFICATIONS ============

  /**
   * Notify when a task is created
   */
  static async notifyTaskCreated(
    task: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "New Task Assigned 📝",
        `Task "${task.title}" has been created${task.assignedToName ? ` and assigned to ${task.assignedToName}` : ""}.`,
        "info",
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
            event: "task_created",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Task creation notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating task creation notification:", error);
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
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const statusEmoji: Record<string, string> = {
        todo: "📋",
        in_progress: "🔄",
        in_review: "👀",
        completed: "✅",
        blocked: "🚫",
      };

      const notificationData = this.createNotificationData(
        userId,
        `Task Status Updated ${statusEmoji[newStatus] || "📝"}`,
        `Task "${task.title}" status changed from ${oldStatus.replace("_", " ")} to ${newStatus.replace("_", " ")}.`,
        newStatus === "completed"
          ? "success"
          : newStatus === "blocked"
            ? "warning"
            : "info",
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
            event: "task_status_updated",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Task status update notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating task status update notification:",
        error,
      );
      throw new Error(
        `Failed to create task status update notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a task is approaching deadline (3 days before)
   */
  static async notifyTaskDueSoon(
    task: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      if (!task.dueDate) return null;

      const dueDate = new Date(task.dueDate);
      const now = new Date();
      const daysUntilDue = Math.ceil(
        (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysUntilDue > 3) return null; // Only notify if due within 3 days

      const notificationData = this.createNotificationData(
        userId,
        "Task Due Soon ⏰",
        `Task "${task.title}" is due in ${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""}.`,
        daysUntilDue <= 1 ? "warning" : "info",
        {
          actionUrl: `/tasks?projectId=${task.projectId}`,
          metadata: {
            taskId: task._id?.toString() || task.id,
            taskTitle: task.title,
            daysUntilDue,
            dueDate: task.dueDate,
            projectId: task.projectId,
            projectName: task.projectName,
            event: "task_due_soon",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Task due soon notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating task due soon notification:", error);
      throw new Error(
        `Failed to create task due soon notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a task is overdue
   */
  static async notifyTaskOverdue(
    task: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      if (!task.dueDate) return null;

      const dueDate = new Date(task.dueDate);
      const now = new Date();

      if (now < dueDate) return null; // Not overdue yet

      const daysOverdue = Math.ceil(
        (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      const notificationData = this.createNotificationData(
        userId,
        "Task Overdue ⚠️",
        `Task "${task.title}" is ${daysOverdue} day${daysOverdue !== 1 ? "s" : ""} overdue.`,
        "error",
        {
          actionUrl: `/tasks?projectId=${task.projectId}`,
          metadata: {
            taskId: task._id?.toString() || task.id,
            taskTitle: task.title,
            daysOverdue,
            originalDueDate: task.dueDate,
            projectId: task.projectId,
            projectName: task.projectName,
            event: "task_overdue",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Task overdue notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating task overdue notification:", error);
      throw new Error(
        `Failed to create task overdue notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a task is deleted
   */
  static async notifyTaskDeleted(
    task: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Task Deleted 🗑️",
        `Task "${task.title}" has been deleted from project "${task.projectName}".`,
        "info",
        {
          actionUrl: `/tasks?projectId=${task.projectId}`,
          metadata: {
            taskTitle: task.title,
            projectId: task.projectId,
            projectName: task.projectName,
            deletedAt: new Date().toISOString(),
            event: "task_deleted",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Task deletion notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating task deletion notification:", error);
      throw new Error(
        `Failed to create task deletion notification: ${error.message}`,
      );
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
    type: NotificationType = "info",
    options: CreateNotificationOptions = {},
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        title,
        message,
        type,
        options,
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Custom notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating custom notification:", error);
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(
    notificationId: string,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notification = await Notification.findOneAndUpdate(
        {
          _id: notificationId,
          userId: this.toObjectId(userId),
        },
        { isRead: true, readAt: new Date() },
        { new: true },
      );

      if (!notification) {
        throw new Error("Notification not found or unauthorized");
      }

      console.log("✅ Notification marked as read:", notificationId);
      return notification;
    } catch (error: any) {
      console.error("❌ Error marking notification as read:", error);
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const result = await Notification.updateMany(
        {
          userId: this.toObjectId(userId),
          isRead: false,
        },
        { isRead: true, readAt: new Date() },
      );

      console.log(
        `✅ Marked ${result.modifiedCount} notifications as read for user`,
      );
      return result;
    } catch (error: any) {
      console.error("❌ Error marking all notifications as read:", error);
      throw new Error(
        `Failed to mark all notifications as read: ${error.message}`,
      );
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(
    notificationId: string,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const result = await Notification.findOneAndDelete({
        _id: notificationId,
        userId: this.toObjectId(userId),
      });

      if (!result) {
        throw new Error("Notification not found or unauthorized");
      }

      console.log("✅ Notification deleted:", notificationId);
      return result;
    } catch (error: any) {
      console.error("❌ Error deleting notification:", error);
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }

  /**
   * Get all notifications for a user
   */
  static async getUserNotifications(
    userId: string | mongoose.Types.ObjectId,
    options: { unreadOnly?: boolean; limit?: number } = {},
  ): Promise<any[]> {
    try {
      const { unreadOnly = false, limit = 50 } = options;

      const query: any = {
        userId: this.toObjectId(userId),
      };

      if (unreadOnly) {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      console.log(
        `✅ Retrieved ${notifications.length} notifications for user`,
      );
      return notifications;
    } catch (error: any) {
      console.error("❌ Error getting user notifications:", error);
      throw new Error(`Failed to get notifications: ${error.message}`);
    }
  }

  /**
   * Get notification count for a user
   */
  static async getNotificationCount(
    userId: string | mongoose.Types.ObjectId,
    unreadOnly: boolean = true,
  ): Promise<number> {
    try {
      const query: any = {
        userId: this.toObjectId(userId),
      };

      if (unreadOnly) {
        query.isRead = false;
      }

      const count = await Notification.countDocuments(query);
      console.log(
        `✅ Notification count for user: ${count} (unread only: ${unreadOnly})`,
      );
      return count;
    } catch (error: any) {
      console.error("❌ Error getting notification count:", error);
      throw new Error(`Failed to get notification count: ${error.message}`);
    }
  }

  // ... existing methods ...

  /**
   * Notify when a team member is added
   */
  static async notifyTeamMemberAdded(
    teamMember: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      return await this.createNotification(
        userId,
        "Team Member Added 👥",
        `${teamMember.name} (${teamMember.role}) has been added to your team.`,
        "info",
        {
          actionUrl: `/team/members/${teamMember._id}`,
          metadata: {
            teamMemberId: teamMember._id.toString(),
            teamMemberName: teamMember.name,
            role: teamMember.role,
            department: teamMember.department,
            event: "team_member_added",
          },
        },
      );
    } catch (error: any) {
      console.error("Error creating team member added notification:", error);
      throw error;
    }
  }

  /**
   * Notify when a team member is assigned to a project
   */
  static async notifyProjectAssignment(
    project: any,
    teamMember: any,
    userId: string | mongoose.Types.ObjectId,
    action: "assigned" | "unassigned",
  ): Promise<any> {
    try {
      const actionText =
        action === "assigned" ? "assigned to" : "unassigned from";

      return await this.createNotification(
        userId,
        `Team Member ${action === "assigned" ? "Assigned" : "Unassigned"} 📋`,
        `${teamMember.name} has been ${actionText} project "${project.name}".`,
        "info",
        {
          actionUrl: `/projects/${project._id}`,
          metadata: {
            projectId: project._id.toString(),
            projectName: project.name,
            teamMemberId: teamMember._id.toString(),
            teamMemberName: teamMember.name,
            action: action,
            event: "project_assignment_changed",
          },
        },
      );
    } catch (error: any) {
      console.error("Error creating project assignment notification:", error);
      throw error;
    }
  }

  /**
   * Notify when multiple team members are assigned to a project
   */
  static async notifyBulkProjectAssignment(
    project: any,
    teamMembers: any[],
    userId: string | mongoose.Types.ObjectId,
    action: "assigned" | "unassigned",
  ): Promise<any[]> {
    const notifications = [];

    for (const member of teamMembers) {
      try {
        const notification = await this.notifyProjectAssignment(
          project,
          member,
          userId,
          action,
        );
        notifications.push(notification);
      } catch (error) {
        console.error(
          `Failed to create notification for ${member.name}:`,
          error,
        );
      }
    }

    // Also create a summary notification
    try {
      const summaryNotification = await this.createNotification(
        userId,
        "Team Members Updated 👥",
        `${teamMembers.length} team member(s) ${action} to project "${project.name}".`,
        "info",
        {
          actionUrl: `/projects/${project._id}`,
          metadata: {
            projectId: project._id.toString(),
            projectName: project.name,
            assignedCount: action === "assigned" ? teamMembers.length : 0,
            unassignedCount: action === "unassigned" ? teamMembers.length : 0,
            action: action,
            event: "bulk_project_assignment",
          },
        },
      );
      notifications.push(summaryNotification);
    } catch (error) {
      console.error("Failed to create summary notification:", error);
    }

    return notifications;
  }

  /**
   * Notify when team member performance is updated
   */
  static async notifyPerformanceUpdate(
    teamMember: any,
    oldPerformance: number,
    newPerformance: number,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const performanceChange = newPerformance - oldPerformance;
      const direction = performanceChange > 0 ? "improved" : "decreased";
      const emoji = performanceChange > 0 ? "📈" : "📉";

      return await this.createNotification(
        userId,
        `Performance Update ${emoji}`,
        `${teamMember.name}'s performance ${direction} from ${oldPerformance}% to ${newPerformance}%.`,
        performanceChange > 0 ? "success" : "warning",
        {
          actionUrl: `/team/members/${teamMember._id}`,
          metadata: {
            teamMemberId: teamMember._id.toString(),
            teamMemberName: teamMember.name,
            oldPerformance,
            newPerformance,
            change: performanceChange,
            direction,
            event: "performance_updated",
          },
        },
      );
    } catch (error: any) {
      console.error("Error creating performance update notification:", error);
      throw error;
    }
  }

  /**
   * Notify when team member status changes
   */
  static async notifyTeamMemberStatusChange(
    teamMember: any,
    oldStatus: string,
    newStatus: string,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const statusConfig: Record<
        string,
        { emoji: string; type: NotificationType }
      > = {
        active: { emoji: "🟢", type: "success" },
        away: { emoji: "🟡", type: "warning" },
        offline: { emoji: "⚫", type: "info" },
      };

      const config = statusConfig[newStatus] || { emoji: "🔵", type: "info" };

      return await this.createNotification(
        userId,
        `Status Changed ${config.emoji}`,
        `${teamMember.name} is now ${newStatus}.`,
        config.type,
        {
          actionUrl: `/team/members/${teamMember._id}`,
          metadata: {
            teamMemberId: teamMember._id.toString(),
            teamMemberName: teamMember.name,
            oldStatus,
            newStatus,
            event: "status_changed",
          },
        },
      );
    } catch (error: any) {
      console.error("Error creating status change notification:", error);
      throw error;
    }
  }

  /**
   * Notify about important team milestones
   */
  static async notifyTeamMilestone(
    milestone: string,
    description: string,
    userId: string | mongoose.Types.ObjectId,
    metadata?: any,
  ): Promise<any> {
    try {
      return await this.createNotification(
        userId,
        `Team Milestone 🎉`,
        description,
        "success",
        {
          metadata: {
            milestone,
            ...metadata,
            event: "team_milestone",
          },
        },
      );
    } catch (error: any) {
      console.error("Error creating team milestone notification:", error);
      throw error;
    }
  }

  // ============ LEAD NOTIFICATIONS ============

  /**
   * Notify when a lead is created
   */
  static async notifyLeadCreated(
    lead: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "New Lead Created 🎯",
        `${lead.fullName || `${lead.firstName} ${lead.lastName}`} has been added as a lead. Source: ${lead.source?.replace("_", " ") || "Unknown"}`,
        "success",
        {
          actionUrl: `/leads/${lead._id}`,
          metadata: {
            leadId: lead._id.toString(),
            leadName: lead.fullName || `${lead.firstName} ${lead.lastName}`,
            leadEmail: lead.email,
            leadPhone: lead.phone,
            source: lead.source,
            companyName: lead.companyName,
            event: "lead_created",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Lead creation notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating lead creation notification:", error);
      throw new Error(`Failed to create lead notification: ${error.message}`);
    }
  }

  /**
   * Notify when a lead status is updated
   */
  static async notifyLeadStatusChanged(
    lead: any,
    oldStatus: string,
    newStatus: string,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const statusEmoji: Record<string, string> = {
        new: "🆕",
        contacted: "📞",
        qualified: "✅",
        disqualified: "❌",
        converted: "🎉",
        lost: "💔",
      };

      const notificationData = this.createNotificationData(
        userId,
        `Lead Status Updated ${statusEmoji[newStatus] || "📝"}`,
        `${lead.fullName || `${lead.firstName} ${lead.lastName}`} status changed from ${oldStatus.replace("_", " ")} to ${newStatus.replace("_", " ")}.`,
        newStatus === "converted"
          ? "success"
          : newStatus === "lost" || newStatus === "disqualified"
            ? "warning"
            : "info",
        {
          actionUrl: `/leads/${lead._id}`,
          metadata: {
            leadId: lead._id.toString(),
            leadName: lead.fullName || `${lead.firstName} ${lead.lastName}`,
            oldStatus,
            newStatus,
            updatedAt: new Date().toISOString(),
            event: "lead_status_updated",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Lead status update notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating lead status update notification:",
        error,
      );
      throw new Error(
        `Failed to create lead status update notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a lead is assigned
   */
  static async notifyLeadAssigned(
    lead: any,
    assignedTo: string | mongoose.Types.ObjectId,
    assignedBy: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        assignedTo,
        "Lead Assigned to You 📋",
        `${lead.fullName || `${lead.firstName} ${lead.lastName}`} has been assigned to you${lead.companyName ? ` from ${lead.companyName}` : ""}.`,
        "assignment",
        {
          actionUrl: `/leads/${lead._id}`,
          metadata: {
            leadId: lead._id.toString(),
            leadName: lead.fullName || `${lead.firstName} ${lead.lastName}`,
            assignedBy: assignedBy.toString(),
            companyName: lead.companyName,
            event: "lead_assigned",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Lead assignment notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating lead assignment notification:", error);
      throw new Error(
        `Failed to create lead assignment notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a lead is converted to contact/deal
   */
  static async notifyLeadConverted(
    lead: any,
    contact: any,
    deal: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Lead Converted Successfully! 🎉",
        `${lead.fullName || `${lead.firstName} ${lead.lastName}`} has been converted to a contact and deal.`,
        "success",
        {
          actionUrl: `/contacts/${contact._id}`,
          metadata: {
            leadId: lead._id.toString(),
            leadName: lead.fullName || `${lead.firstName} ${lead.lastName}`,
            contactId: contact._id.toString(),
            contactName: contact.fullName,
            dealId: deal._id.toString(),
            dealName: deal.name,
            dealValue: deal.dealValue,
            convertedAt: new Date().toISOString(),
            event: "lead_converted",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Lead conversion notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating lead conversion notification:", error);
      throw new Error(
        `Failed to create lead conversion notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a lead is deleted
   */
  static async notifyLeadDeleted(
    lead: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Lead Deleted 🗑️",
        `${lead.fullName || `${lead.firstName} ${lead.lastName}`} has been deleted.`,
        "info",
        {
          metadata: {
            leadName: lead.fullName || `${lead.firstName} ${lead.lastName}`,
            leadEmail: lead.email,
            deletedAt: new Date().toISOString(),
            event: "lead_deleted",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Lead deletion notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating lead deletion notification:", error);
      throw new Error(
        `Failed to create lead deletion notification: ${error.message}`,
      );
    }
  }

  // ============ CONTACT NOTIFICATIONS ============

  /**
   * Notify when a contact is created
   */
  static async notifyContactCreated(
    contact: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "New Contact Created 👤",
        `${contact.fullName} has been added as a contact${contact.companyName ? ` from ${contact.companyName}` : ""}.`,
        "success",
        {
          actionUrl: `/contacts/${contact._id}`,
          metadata: {
            contactId: contact._id.toString(),
            contactName: contact.fullName,
            contactEmail: contact.emails?.find((e: any) => e.isPrimary)?.email,
            contactPhone: contact.phones?.find((p: any) => p.isPrimary)?.number,
            companyName: contact.companyName,
            lifecycleStage: contact.lifecycleStage,
            event: "contact_created",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Contact creation notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating contact creation notification:", error);
      throw new Error(
        `Failed to create contact notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a contact is assigned
   */
  static async notifyContactAssigned(
    contact: any,
    assignedTo: string | mongoose.Types.ObjectId,
    assignedBy: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        assignedTo,
        "Contact Assigned to You 📋",
        `${contact.fullName} has been assigned to you${contact.companyName ? ` from ${contact.companyName}` : ""}.`,
        "assignment",
        {
          actionUrl: `/contacts/${contact._id}`,
          metadata: {
            contactId: contact._id.toString(),
            contactName: contact.fullName,
            assignedBy: assignedBy.toString(),
            companyName: contact.companyName,
            event: "contact_assigned",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Contact assignment notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating contact assignment notification:",
        error,
      );
      throw new Error(
        `Failed to create contact assignment notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a contact's lifecycle stage changes
   */
  static async notifyContactLifecycleChanged(
    contact: any,
    oldStage: string,
    newStage: string,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const stageEmoji: Record<string, string> = {
        lead: "🎯",
        prospect: "🔍",
        customer: "💼",
        churned: "📉",
        inactive: "💤",
      };

      const notificationData = this.createNotificationData(
        userId,
        `Contact Lifecycle Updated ${stageEmoji[newStage] || "🔄"}`,
        `${contact.fullName} moved from ${oldStage} to ${newStage}.`,
        newStage === "customer"
          ? "success"
          : newStage === "churned"
            ? "warning"
            : "info",
        {
          actionUrl: `/contacts/${contact._id}`,
          metadata: {
            contactId: contact._id.toString(),
            contactName: contact.fullName,
            oldStage,
            newStage,
            updatedAt: new Date().toISOString(),
            event: "contact_lifecycle_changed",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Contact lifecycle update notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating contact lifecycle update notification:",
        error,
      );
      throw new Error(
        `Failed to create contact lifecycle update notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify on contact birthday
   */
  static async notifyContactBirthday(
    contact: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "🎂 Birthday Today!",
        `Today is ${contact.fullName}'s birthday. Send them your wishes!`,
        "info",
        {
          actionUrl: `/contacts/${contact._id}`,
          metadata: {
            contactId: contact._id.toString(),
            contactName: contact.fullName,
            birthday: contact.birthday,
            event: "contact_birthday",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Contact birthday notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating contact birthday notification:", error);
      throw new Error(
        `Failed to create contact birthday notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify on contact anniversary
   */
  static async notifyContactAnniversary(
    contact: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "🎉 Anniversary Today!",
        `${contact.fullName} is celebrating their anniversary with your company.`,
        "info",
        {
          actionUrl: `/contacts/${contact._id}`,
          metadata: {
            contactId: contact._id.toString(),
            contactName: contact.fullName,
            anniversary: contact.anniversary,
            event: "contact_anniversary",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Contact anniversary notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating contact anniversary notification:",
        error,
      );
      throw new Error(
        `Failed to create contact anniversary notification: ${error.message}`,
      );
    }
  }

  // ============ DEAL NOTIFICATIONS ============

  /**
   * Notify when a deal is created
   */
  static async notifyDealCreated(
    deal: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "New Deal Created 💰",
        `${deal.name} worth ${deal.currency || "USD"} ${deal.dealValue?.toLocaleString()} has been created.`,
        "success",
        {
          actionUrl: `/deals/${deal._id}`,
          metadata: {
            dealId: deal._id.toString(),
            dealName: deal.name,
            dealValue: deal.dealValue,
            currency: deal.currency || "USD",
            probability: deal.probability,
            expectedClosingDate: deal.expectedClosingDate,
            accountName: deal.accountName,
            contactName: deal.contactName,
            event: "deal_created",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Deal creation notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating deal creation notification:", error);
      throw new Error(`Failed to create deal notification: ${error.message}`);
    }
  }

  /**
   * Notify when a deal stage changes
   */
  static async notifyDealStageChanged(
    deal: any,
    oldStage: string,
    newStage: string,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const stageEmoji: Record<string, string> = {
        lead_in: "📥",
        qualification: "🔍",
        needs_analysis: "📊",
        proposal: "📄",
        negotiation: "🤝",
        closed_won: "🏆",
        closed_lost: "💔",
      };

      const notificationData = this.createNotificationData(
        userId,
        `Deal Stage Updated ${stageEmoji[newStage] || "🔄"}`,
        `${deal.name} moved from ${oldStage.replace("_", " ")} to ${newStage.replace("_", " ")}.`,
        newStage === "closed_won"
          ? "success"
          : newStage === "closed_lost"
            ? "warning"
            : "info",
        {
          actionUrl: `/deals/${deal._id}`,
          metadata: {
            dealId: deal._id.toString(),
            dealName: deal.name,
            oldStage,
            newStage,
            dealValue: deal.dealValue,
            probability: deal.probability,
            updatedAt: new Date().toISOString(),
            event: "deal_stage_changed",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Deal stage update notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating deal stage update notification:", error);
      throw new Error(
        `Failed to create deal stage update notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a deal is won
   */
  static async notifyDealWon(
    deal: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Deal Won! 🏆🎉",
        `Congratulations! Deal "${deal.name}" worth ${deal.currency || "USD"} ${deal.dealValue?.toLocaleString()} has been won.`,
        "success",
        {
          actionUrl: `/deals/${deal._id}`,
          metadata: {
            dealId: deal._id.toString(),
            dealName: deal.name,
            dealValue: deal.dealValue,
            currency: deal.currency || "USD",
            accountName: deal.accountName,
            contactName: deal.contactName,
            wonAt: deal.wonAt || new Date().toISOString(),
            event: "deal_won",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Deal won notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating deal won notification:", error);
      throw new Error(
        `Failed to create deal won notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a deal is lost
   */
  static async notifyDealLost(
    deal: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Deal Lost 💔",
        `Deal "${deal.name}" worth ${deal.currency || "USD"} ${deal.dealValue?.toLocaleString()} has been lost. Reason: ${deal.lossReason || "Not specified"}`,
        "warning",
        {
          actionUrl: `/deals/${deal._id}`,
          metadata: {
            dealId: deal._id.toString(),
            dealName: deal.name,
            dealValue: deal.dealValue,
            currency: deal.currency || "USD",
            lossReason: deal.lossReason,
            lostToCompetitor: deal.lostToCompetitor,
            lostAt: deal.lostAt || new Date().toISOString(),
            event: "deal_lost",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Deal lost notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating deal lost notification:", error);
      throw new Error(
        `Failed to create deal lost notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a deal is assigned
   */
  static async notifyDealAssigned(
    deal: any,
    assignedTo: string | mongoose.Types.ObjectId,
    assignedBy: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        assignedTo,
        "Deal Assigned to You 💼",
        `${deal.name} worth ${deal.currency || "USD"} ${deal.dealValue?.toLocaleString()} has been assigned to you.`,
        "assignment",
        {
          actionUrl: `/deals/${deal._id}`,
          metadata: {
            dealId: deal._id.toString(),
            dealName: deal.name,
            dealValue: deal.dealValue,
            currency: deal.currency || "USD",
            assignedBy: assignedBy.toString(),
            expectedClosingDate: deal.expectedClosingDate,
            event: "deal_assigned",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Deal assignment notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating deal assignment notification:", error);
      throw new Error(
        `Failed to create deal assignment notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when deal is approaching expected closing date
   */
  static async notifyDealClosingSoon(
    deal: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      if (!deal.expectedClosingDate) return null;

      const closingDate = new Date(deal.expectedClosingDate);
      const now = new Date();
      const daysUntilClosing = Math.ceil(
        (closingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysUntilClosing > 7) return null; // Only notify if within 7 days

      const notificationData = this.createNotificationData(
        userId,
        "Deal Closing Soon ⏰",
        `Deal "${deal.name}" worth ${deal.currency || "USD"} ${deal.dealValue?.toLocaleString()} is expected to close in ${daysUntilClosing} day${daysUntilClosing !== 1 ? "s" : ""}.`,
        daysUntilClosing <= 2 ? "warning" : "info",
        {
          actionUrl: `/deals/${deal._id}`,
          metadata: {
            dealId: deal._id.toString(),
            dealName: deal.name,
            dealValue: deal.dealValue,
            daysUntilClosing,
            expectedClosingDate: deal.expectedClosingDate,
            probability: deal.probability,
            event: "deal_closing_soon",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Deal closing soon notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating deal closing soon notification:", error);
      throw new Error(
        `Failed to create deal closing soon notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when deal is overdue
   */
  static async notifyDealOverdue(
    deal: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      if (!deal.expectedClosingDate) return null;

      const closingDate = new Date(deal.expectedClosingDate);
      const now = new Date();

      if (now < closingDate) return null; // Not overdue yet

      const daysOverdue = Math.ceil(
        (now.getTime() - closingDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      const notificationData = this.createNotificationData(
        userId,
        "Deal Overdue ⚠️",
        `Deal "${deal.name}" worth ${deal.currency || "USD"} ${deal.dealValue?.toLocaleString()} is ${daysOverdue} day${daysOverdue !== 1 ? "s" : ""} overdue.`,
        "error",
        {
          actionUrl: `/deals/${deal._id}`,
          metadata: {
            dealId: deal._id.toString(),
            dealName: deal.name,
            dealValue: deal.dealValue,
            daysOverdue,
            originalClosingDate: deal.expectedClosingDate,
            event: "deal_overdue",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Deal overdue notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating deal overdue notification:", error);
      throw new Error(
        `Failed to create deal overdue notification: ${error.message}`,
      );
    }
  }

  // ============ ACTIVITY NOTIFICATIONS ============

  /**
   * Notify when an activity is created
   */
  static async notifyActivityCreated(
    activity: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const typeEmoji: Record<string, string> = {
        call: "📞",
        email: "📧",
        meeting: "👥",
        task: "📝",
        note: "📌",
        reminder: "⏰",
      };

      const notificationData = this.createNotificationData(
        userId,
        `New ${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} ${typeEmoji[activity.type] || "📋"}`,
        `${activity.subject} has been scheduled${activity.relatedTo?.length ? ` for ${activity.relatedTo[0].name}` : ""}.`,
        "info",
        {
          actionUrl: `/activities/${activity._id}`,
          metadata: {
            activityId: activity._id.toString(),
            activityType: activity.type,
            activitySubject: activity.subject,
            relatedEntity: activity.relatedTo?.[0],
            dueDate: activity.dueDate,
            event: "activity_created",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Activity creation notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating activity creation notification:", error);
      throw new Error(
        `Failed to create activity notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when an activity is assigned
   */
  static async notifyActivityAssigned(
    activity: any,
    assignedTo: string | mongoose.Types.ObjectId,
    assignedBy: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        assignedTo,
        `${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} Assigned to You 📋`,
        `${activity.subject} has been assigned to you.`,
        "assignment",
        {
          actionUrl: `/activities/${activity._id}`,
          metadata: {
            activityId: activity._id.toString(),
            activityType: activity.type,
            activitySubject: activity.subject,
            assignedBy: assignedBy.toString(),
            dueDate: activity.dueDate,
            event: "activity_assigned",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Activity assignment notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating activity assignment notification:",
        error,
      );
      throw new Error(
        `Failed to create activity assignment notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when an activity is completed
   */
  static async notifyActivityCompleted(
    activity: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Activity Completed ✅",
        `${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} "${activity.subject}" has been marked as completed.`,
        "success",
        {
          actionUrl: `/activities/${activity._id}`,
          metadata: {
            activityId: activity._id.toString(),
            activityType: activity.type,
            activitySubject: activity.subject,
            completedAt: activity.completedAt || new Date().toISOString(),
            event: "activity_completed",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Activity completion notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating activity completion notification:",
        error,
      );
      throw new Error(
        `Failed to create activity completion notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a note is created
   */
  static async notifyNoteCreated(
    note: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "New Note Created 📝",
        `Your note "${note.title}" has been created successfully.`,
        "success",
        {
          actionUrl: `/notes/${note._id}`,
          metadata: {
            noteId: note._id.toString(),
            noteTitle: note.title,
            category: note.category,
            priority: note.priority,
            wordCount: note.wordCount,
            readTime: note.readTime,
            event: "note_created",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Note creation notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating note creation notification:", error);
      throw new Error(`Failed to create note notification: ${error.message}`);
    }
  }

  /**
   * Notify when a note is updated
   */
  static async notifyNoteUpdated(
    note: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Note Updated ✏️",
        `Your note "${note.title}" has been updated.`,
        "info",
        {
          actionUrl: `/notes/${note._id}`,
          metadata: {
            noteId: note._id.toString(),
            noteTitle: note.title,
            event: "note_updated",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Note update notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating note update notification:", error);
      throw new Error(
        `Failed to create note update notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a note is deleted
   */
  static async notifyNoteDeleted(
    note: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Note Deleted 🗑️",
        `Your note "${note.title}" has been deleted.`,
        "info",
        {
          metadata: {
            noteTitle: note.title,
            event: "note_deleted",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Note deletion notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating note deletion notification:", error);
      throw new Error(
        `Failed to create note deletion notification: ${error.message}`,
      );
    }
  }

  // ============ EVENT NOTIFICATIONS ============

  /**
   * Notify when an event is created
   */
  static async notifyEventCreated(
    event: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        `New Event: ${event.title} 📅`,
        `${event.type.charAt(0).toUpperCase() + event.type.slice(1)} scheduled for ${new Date(event.startDateTime).toLocaleString()}`,
        "info",
        {
          actionUrl: `/calendar/events/${event._id}`,
          metadata: {
            eventId: event._id.toString(),
            eventTitle: event.title,
            eventType: event.type,
            startDateTime: event.startDateTime,
            endDateTime: event.endDateTime,
            location: event.location,
            isVirtual: event.isVirtual,
            event: "event_created",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Event creation notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating event creation notification:", error);
      throw new Error(`Failed to create event notification: ${error.message}`);
    }
  }

  /**
   * Notify when an event invitation is sent
   */
  static async notifyEventInvitation(
    event: any,
    attendeeId: string | mongoose.Types.ObjectId,
    invitedBy: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        attendeeId,
        "Event Invitation 📧",
        `You are invited to: ${event.title} on ${new Date(event.startDateTime).toLocaleString()}`,
        "info",
        {
          actionUrl: `/calendar/events/${event._id}`,
          metadata: {
            eventId: event._id.toString(),
            eventTitle: event.title,
            eventType: event.type,
            startDateTime: event.startDateTime,
            location: event.location || "Virtual Meeting",
            invitedBy: invitedBy.toString(),
            event: "event_invitation",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Event invitation notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating event invitation notification:", error);
      throw new Error(
        `Failed to create event invitation notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when an event is starting soon
   */
  static async notifyEventStartingSoon(
    event: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      if (!event.startDateTime) return null;

      const startTime = new Date(event.startDateTime);
      const now = new Date();
      const minutesUntilStart = Math.ceil(
        (startTime.getTime() - now.getTime()) / (1000 * 60),
      );

      if (minutesUntilStart > 30 || minutesUntilStart < 0) return null; // Only notify within 30 minutes

      const notificationData = this.createNotificationData(
        userId,
        "Event Starting Soon ⏰",
        `${event.title} starts in ${minutesUntilStart} minute${minutesUntilStart !== 1 ? "s" : ""}`,
        minutesUntilStart <= 5 ? "warning" : "info",
        {
          actionUrl: `/calendar/events/${event._id}`,
          metadata: {
            eventId: event._id.toString(),
            eventTitle: event.title,
            startDateTime: event.startDateTime,
            minutesUntilStart,
            meetingLink: event.meetingLink,
            event: "event_starting_soon",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Event starting soon notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating event starting soon notification:",
        error,
      );
      throw new Error(
        `Failed to create event starting soon notification: ${error.message}`,
      );
    }
  }

  // ============ COMPANY & TEAM NOTIFICATIONS ============

  /**
   * Notify when a company is created
   */
  static async notifyCompanyCreated(
    company: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Company Created 🏢",
        `${company.name} has been created successfully.`,
        "success",
        {
          actionUrl: `/settings/company`,
          metadata: {
            companyId: company._id.toString(),
            companyName: company.name,
            companyEmail: company.email,
            industry: company.industry,
            subscription: company.subscription?.plan,
            event: "company_created",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Company creation notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating company creation notification:", error);
      throw new Error(
        `Failed to create company notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a user is invited to company
   */
  static async notifyUserInvited(
    user: any,
    company: any,
    invitedBy: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        user._id,
        "Invitation to Join Company 📧",
        `You have been invited to join ${company.name}. Click to accept or decline.`,
        "info",
        {
          actionUrl: `/user-companies/invitations`,
          priority: "high",
          metadata: {
            companyId: company._id.toString(),
            companyName: company.name,
            invitedBy: invitedBy.toString(),
            invitationStatus: "pending",
            event: "user_invited",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ User invitation notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating user invitation notification:", error);
      throw new Error(
        `Failed to create user invitation notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when a user joins company
   */
  static async notifyUserJoined(
    user: any,
    company: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "New Team Member Joined 👋",
        `${user.name} has joined ${company.name}.`,
        "success",
        {
          actionUrl: `/team/members/${user._id}`,
          metadata: {
            userId: user._id.toString(),
            userName: user.name,
            userEmail: user.email,
            companyId: company._id.toString(),
            companyName: company.name,
            joinedAt: new Date().toISOString(),
            event: "user_joined",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ User joined notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating user joined notification:", error);
      throw new Error(
        `Failed to create user joined notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when subscription status changes
   */
  static async notifySubscriptionStatusChanged(
    company: any,
    oldStatus: string,
    newStatus: string,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const statusEmoji: Record<string, string> = {
        trial: "🔹",
        active: "✅",
        inactive: "⭕",
        expired: "⚠️",
        cancelled: "❌",
      };

      const notificationData = this.createNotificationData(
        userId,
        `Subscription ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} ${statusEmoji[newStatus] || "🔄"}`,
        `Your subscription has ${newStatus === "active" ? "been activated" : `changed from ${oldStatus} to ${newStatus}`}.`,
        newStatus === "active"
          ? "success"
          : newStatus === "expired" || newStatus === "cancelled"
            ? "warning"
            : "info",
        {
          actionUrl: `/settings/billing`,
          metadata: {
            companyId: company._id.toString(),
            companyName: company.name,
            oldStatus,
            newStatus,
            plan: company.subscription?.plan,
            endDate: company.subscription?.endDate,
            event: "subscription_status_changed",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Subscription status notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating subscription status notification:",
        error,
      );
      throw new Error(
        `Failed to create subscription status notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when subscription is about to expire
   */
  static async notifySubscriptionExpiringSoon(
    company: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      if (!company.subscription?.endDate) return null;

      const endDate = new Date(company.subscription.endDate);
      const now = new Date();
      const daysUntilExpiry = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysUntilExpiry > 7 || daysUntilExpiry < 0) return null; // Only notify within 7 days

      const notificationData = this.createNotificationData(
        userId,
        "Subscription Expiring Soon ⏳",
        `Your ${company.subscription.plan} subscription will expire in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? "s" : ""}. Renew now to avoid interruption.`,
        "warning",
        {
          actionUrl: `/settings/billing`,
          priority: "high",
          metadata: {
            companyId: company._id.toString(),
            companyName: company.name,
            plan: company.subscription?.plan,
            daysUntilExpiry,
            expiryDate: company.subscription?.endDate,
            event: "subscription_expiring_soon",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Subscription expiring soon notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating subscription expiring notification:",
        error,
      );
      throw new Error(
        `Failed to create subscription expiring notification: ${error.message}`,
      );
    }
  }

  // ============ ORDER NOTIFICATIONS ============

  /**
   * Notify when an order is created
   */
  static async notifyOrderCreated(
    order: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "New Order Created 📦",
        `Order #${order.orderNumber} worth ${order.currency || "USD"} ${order.grandTotal?.toLocaleString()} has been created.`,
        "success",
        {
          actionUrl: `/orders/${order._id}`,
          metadata: {
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            grandTotal: order.grandTotal,
            currency: order.currency || "USD",
            status: order.status,
            itemsCount: order.items?.length,
            event: "order_created",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Order creation notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating order creation notification:", error);
      throw new Error(`Failed to create order notification: ${error.message}`);
    }
  }

  /**
   * Notify when order status changes
   */
  static async notifyOrderStatusChanged(
    order: any,
    oldStatus: string,
    newStatus: string,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const statusEmoji: Record<string, string> = {
        draft: "📝",
        confirmed: "✅",
        processing: "⚙️",
        shipped: "🚚",
        delivered: "📬",
        cancelled: "❌",
        returned: "↩️",
        refunded: "💰",
      };

      const notificationData = this.createNotificationData(
        userId,
        `Order Status Updated ${statusEmoji[newStatus] || "🔄"}`,
        `Order #${order.orderNumber} status changed from ${oldStatus} to ${newStatus}.`,
        newStatus === "delivered"
          ? "success"
          : newStatus === "cancelled" || newStatus === "returned"
            ? "warning"
            : "info",
        {
          actionUrl: `/orders/${order._id}`,
          metadata: {
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            oldStatus,
            newStatus,
            trackingNumber: order.trackingNumber,
            updatedAt: new Date().toISOString(),
            event: "order_status_changed",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Order status update notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating order status update notification:",
        error,
      );
      throw new Error(
        `Failed to create order status update notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when order is shipped
   */
  static async notifyOrderShipped(
    order: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Order Shipped! 🚚",
        `Order #${order.orderNumber} has been shipped${order.trackingNumber ? ` with tracking #${order.trackingNumber}` : ""}.`,
        "success",
        {
          actionUrl: `/orders/${order._id}`,
          metadata: {
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            trackingNumber: order.trackingNumber,
            carrier: order.carrier,
            estimatedDelivery: order.estimatedDelivery,
            shippedAt: new Date().toISOString(),
            event: "order_shipped",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Order shipped notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating order shipped notification:", error);
      throw new Error(
        `Failed to create order shipped notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when order is delivered
   */
  static async notifyOrderDelivered(
    order: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Order Delivered! 📬",
        `Order #${order.orderNumber} has been delivered successfully.`,
        "success",
        {
          actionUrl: `/orders/${order._id}`,
          metadata: {
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            deliveredAt: order.deliveredAt || new Date().toISOString(),
            event: "order_delivered",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Order delivered notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating order delivered notification:", error);
      throw new Error(
        `Failed to create order delivered notification: ${error.message}`,
      );
    }
  }

  // ============ NOTE & MENTION NOTIFICATIONS ============

  /**
   * Notify when a user is mentioned in a note
   */
  static async notifyUserMentioned(
    note: any,
    mentionedUserId: string | mongoose.Types.ObjectId,
    mentionedBy: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        mentionedUserId,
        "You Were Mentioned 📢",
        `${note.createdByName || "Someone"} mentioned you in a note${note.entityName ? ` about ${note.entityName}` : ""}.`,
        "mention",
        {
          actionUrl: `/${note.entityType?.toLowerCase()}s/${note.entityId}`,
          priority: "high",
          metadata: {
            noteId: note._id.toString(),
            noteTitle: note.title || "Untitled",
            noteContent: note.content.substring(0, 100),
            entityType: note.entityType,
            entityId: note.entityId?.toString(),
            entityName: note.entityName,
            mentionedBy: mentionedBy.toString(),
            event: "user_mentioned",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ User mention notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating user mention notification:", error);
      throw new Error(
        `Failed to create user mention notification: ${error.message}`,
      );
    }
  }

  // ============ EMPLOYEE NOTIFICATIONS ============

  /**
   * Notify when a new employee is onboarded
   */
  static async notifyEmployeeOnboarded(
    employee: any,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "New Employee Onboarded 👋",
        `${employee.fullName} has joined as ${employee.designation} in ${employee.department}.`,
        "success",
        {
          actionUrl: `/employees/${employee._id}`,
          metadata: {
            employeeId: employee._id.toString(),
            employeeName: employee.fullName,
            employeeEmail: employee.email,
            designation: employee.designation,
            department: employee.department,
            joiningDate: employee.joiningDate,
            event: "employee_onboarded",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Employee onboarded notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating employee onboarded notification:",
        error,
      );
      throw new Error(
        `Failed to create employee onboarded notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when employee status changes
   */
  static async notifyEmployeeStatusChanged(
    employee: any,
    oldStatus: string,
    newStatus: string,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const statusEmoji: Record<string, string> = {
        active: "✅",
        inactive: "⭕",
        on_leave: "🏖️",
        terminated: "🚫",
        resigned: "📤",
      };

      const notificationData = this.createNotificationData(
        userId,
        `Employee Status Updated ${statusEmoji[newStatus] || "🔄"}`,
        `${employee.fullName}'s status changed from ${oldStatus.replace("_", " ")} to ${newStatus.replace("_", " ")}.`,
        newStatus === "active"
          ? "success"
          : newStatus === "on_leave"
            ? "info"
            : "warning",
        {
          actionUrl: `/employees/${employee._id}`,
          metadata: {
            employeeId: employee._id.toString(),
            employeeName: employee.fullName,
            oldStatus,
            newStatus,
            updatedAt: new Date().toISOString(),
            event: "employee_status_changed",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Employee status update notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating employee status update notification:",
        error,
      );
      throw new Error(
        `Failed to create employee status update notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when employee leave is requested
   */
  static async notifyLeaveRequested(
    employee: any,
    leaveRequest: any,
    managerId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        managerId,
        "Leave Requested 📅",
        `${employee.fullName} has requested ${leaveRequest.days} days of leave from ${new Date(leaveRequest.startDate).toLocaleDateString()}.`,
        "info",
        {
          actionUrl: `/employees/${employee._id}/leave`,
          priority: "high",
          metadata: {
            employeeId: employee._id.toString(),
            employeeName: employee.fullName,
            leaveRequestId: leaveRequest._id?.toString(),
            leaveType: leaveRequest.type,
            days: leaveRequest.days,
            startDate: leaveRequest.startDate,
            endDate: leaveRequest.endDate,
            reason: leaveRequest.reason,
            event: "leave_requested",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Leave request notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating leave request notification:", error);
      throw new Error(
        `Failed to create leave request notification: ${error.message}`,
      );
    }
  }

  // ============ DASHBOARD & ANALYTICS NOTIFICATIONS ============

  /**
   * Notify when monthly report is ready
   */
  static async notifyMonthlyReportReady(
    companyId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId,
    reportData: any,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Monthly Report Ready 📊",
        `Your ${reportData.month} ${reportData.year} report is ready. Deals: ${reportData.totalDeals || 0}, Revenue: ${reportData.revenue || 0}`,
        "info",
        {
          actionUrl: `/dashboard/reports/monthly`,
          metadata: {
            companyId: companyId.toString(),
            month: reportData.month,
            year: reportData.year,
            totalDeals: reportData.totalDeals,
            wonDeals: reportData.wonDeals,
            revenue: reportData.revenue,
            conversionRate: reportData.conversionRate,
            reportUrl: reportData.reportUrl,
            event: "monthly_report_ready",
            timestamp: new Date().toISOString(),
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log("✅ Monthly report notification created:", notification._id);
      return notification;
    } catch (error: any) {
      console.error("❌ Error creating monthly report notification:", error);
      throw new Error(
        `Failed to create monthly report notification: ${error.message}`,
      );
    }
  }

  /**
   * Notify when milestone is achieved
   */
  static async notifyMilestoneAchieved(
    milestone: string,
    value: number,
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const notificationData = this.createNotificationData(
        userId,
        "Milestone Achieved! 🎯",
        `Congratulations! You've reached ${milestone}: ${value.toLocaleString()}`,
        "success",
        {
          metadata: {
            milestone,
            value,
            achievedAt: new Date().toISOString(),
            event: "milestone_achieved",
          },
        },
      );

      const notification = await Notification.create(notificationData);
      console.log(
        "✅ Milestone achievement notification created:",
        notification._id,
      );
      return notification;
    } catch (error: any) {
      console.error(
        "❌ Error creating milestone achievement notification:",
        error,
      );
      throw new Error(
        `Failed to create milestone achievement notification: ${error.message}`,
      );
    }
  }

  /**
   * Clear all notifications for a user
   */
  static async clearAllNotifications(
    userId: string | mongoose.Types.ObjectId,
  ): Promise<any> {
    try {
      const result = await Notification.deleteMany({
        userId: this.toObjectId(userId),
      });

      console.log(`✅ Cleared ${result.deletedCount} notifications for user`);
      return result;
    } catch (error: any) {
      console.error("❌ Error clearing notifications:", error);
      throw new Error(`Failed to clear notifications: ${error.message}`);
    }
  }
}
