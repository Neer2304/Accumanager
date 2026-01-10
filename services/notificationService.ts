// services/notificationService.js
import Notification from '@/models/Notification';

class NotificationService {
  // 1. Project-related notifications
  static async notifyProjectCreated(project, userId) {
    try {
      const notification = new Notification({
        userId,
        title: 'New Project Created',
        message: `Project "${project.name}" has been created successfully.`,
        type: 'success',
        actionUrl: `/projects/${project._id}`,
        metadata: {
          projectId: project._id,
          projectName: project.name,
          event: 'project_created'
        }
      });
      
      await notification.save();
      console.log('✅ Project notification created for user:', userId, 'Project:', project.name);
      return notification;
    } catch (error) {
      console.error('❌ Error creating project notification:', error);
      throw error;
    }
  }

  static async notifyProjectDelayed(project, userId) {
    try {
      const daysLate = Math.ceil((new Date() - new Date(project.deadline)) / (1000 * 60 * 60 * 24));
      
      const notification = new Notification({
        userId,
        title: 'Project Delayed ⚠️',
        message: `Project "${project.name}" is ${daysLate} days past deadline. Please take action.`,
        type: 'warning',
        actionUrl: `/projects/${project._id}`,
        metadata: {
          projectId: project._id,
          projectName: project.name,
          daysLate,
          event: 'project_delayed'
        }
      });
      
      await notification.save();
      console.log('✅ Delayed project notification created:', project.name);
      return notification;
    } catch (error) {
      console.error('❌ Error creating delayed project notification:', error);
      throw error;
    }
  }

  // Simple create notification method
  static async createNotification(data) {
    try {
      const notification = new Notification(data);
      await notification.save();
      console.log('✅ Notification created:', data.title);
      return notification;
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      throw error;
    }
  }
}

export { NotificationService };