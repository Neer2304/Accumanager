import { connectToDatabase } from '@/lib/mongodb';
import Task from '@/models/Task';
import Project from '@/models/Project';
import { NotificationService } from './notificationService';

/**
 * Service to check and create notifications for due tasks and delayed projects
 * Run this as a cron job or call periodically
 */
export class NotificationCheckService {
  
  /**
   * Check for tasks that are due soon or overdue
   */
  static async checkTaskNotifications(): Promise<void> {
    try {
      await connectToDatabase();
      
      const now = new Date();
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      
      // Find tasks that are not completed and have due dates
      const tasks = await Task.find({
        status: { $ne: 'completed' },
        dueDate: { $exists: true, $ne: null }
      });
      
      console.log(`🔍 Checking ${tasks.length} tasks for notifications...`);
      
      for (const task of tasks) {
        const dueDate = new Date(task.dueDate);
        
        // Check for overdue tasks
        if (now > dueDate) {
          await NotificationService.notifyTaskOverdue(task, task.userId);
        }
        // Check for tasks due within 3 days
        else if (dueDate <= threeDaysFromNow) {
          await NotificationService.notifyTaskDueSoon(task, task.userId);
        }
      }
      
      console.log('✅ Task notifications check completed');
    } catch (error: any) {
      console.error('❌ Error checking task notifications:', error);
    }
  }
  
  /**
   * Check for delayed projects
   */
  static async checkProjectNotifications(): Promise<void> {
    try {
      await connectToDatabase();
      
      const now = new Date();
      
      // Find active projects that are past deadline
      const projects = await Project.find({
        status: { $in: ['active', 'delayed', 'in_progress'] },
        deadline: { $lt: now }
      });
      
      console.log(`🔍 Checking ${projects.length} projects for notifications...`);
      
      for (const project of projects) {
        await NotificationService.notifyProjectDelayed(project, project.userId);
      }
      
      console.log('✅ Project notifications check completed');
    } catch (error: any) {
      console.error('❌ Error checking project notifications:', error);
    }
  }
  
  /**
   * Run all notification checks
   */
  static async runAllChecks(): Promise<void> {
    try {
      console.log('🔄 Starting all notification checks...');
      await this.checkTaskNotifications();
      await this.checkProjectNotifications();
      console.log('✅ All notification checks completed');
    } catch (error: any) {
      console.error('❌ Error running notification checks:', error);
    }
  }
}