import mongoose from 'mongoose';

export class TeamActivityService {
  static async logActivity({
    userId,
    teamMemberId,
    type,
    action,
    description,
    teamProjectId,
    teamTaskId,
    metadata = {},
  }: {
    userId: string;
    teamMemberId?: string;
    type: string;
    action: string;
    description: string;
    teamProjectId?: string;
    teamTaskId?: string;
    metadata?: any;
  }) {
    try {
      // Import dynamically to avoid circular dependencies
      const { default: TeamActivity } = await import('@/models/TeamActivity');
      
      const activity = new TeamActivity({
        userId: new mongoose.Types.ObjectId(userId),
        teamMemberId: teamMemberId ? new mongoose.Types.ObjectId(teamMemberId) : undefined,
        type,
        action,
        description,
        teamProjectId: teamProjectId ? new mongoose.Types.ObjectId(teamProjectId) : undefined,
        teamTaskId: teamTaskId ? new mongoose.Types.ObjectId(teamTaskId) : undefined,
        metadata: {
          points: this.calculatePoints(type, action),
          priority: this.getPriority(type),
          ...metadata,
        },
        isImportant: this.isImportantActivity(type),
      });

      await activity.save();
      return activity;
    } catch (error) {
      console.error('Failed to log team activity:', error);
      throw error;
    }
  }

  static calculatePoints(type: string, action: string): number {
    const pointMap: Record<string, number> = {
      'team_task_created': 2,
      'team_task_completed': 10,
      'team_task_updated': 1,
      'team_task_assigned': 3,
      'team_project_created': 5,
      'team_project_completed': 15,
      'team_project_updated': 2,
      'team_project_assigned': 5,
      'team_member_added': 3,
      'team_member_updated': 1,
      'team_member_performance': 5,
      'team_activity': 1,
      'status_change': 1,
      'login': 1,
    };

    return pointMap[`${type}_${action}`] || pointMap[type] || 1;
  }

  static getPriority(type: string): string {
    const priorityMap: Record<string, string> = {
      'team_task_completed': 'high',
      'team_project_completed': 'high',
      'team_task_assigned': 'medium',
      'team_project_assigned': 'medium',
      'team_member_performance': 'medium',
      'default': 'low',
    };

    return priorityMap[type] || 'low';
  }

  static isImportantActivity(type: string): boolean {
    const importantTypes = [
      'team_task_completed',
      'team_project_completed',
      'team_task_assigned',
      'team_project_assigned',
      'team_member_performance',
    ];
    return importantTypes.includes(type);
  }

  static async updateTeamMemberLastActive(teamMemberId: string) {
    try {
      const { default: TeamMember } = await import('@/models/TeamMember');
      await TeamMember.findByIdAndUpdate(teamMemberId, {
        lastActive: new Date(),
      });
    } catch (error) {
      console.error('Failed to update team member last active:', error);
    }
  }

  static async updateTeamMemberPerformance(teamMemberId: string, points: number) {
    try {
      const { default: TeamMember } = await import('@/models/TeamMember');
      
      // Get current team member
      const teamMember = await TeamMember.findById(teamMemberId);
      if (!teamMember) return;

      // Calculate new performance
      const newPerformance = await this.calculateTeamMemberPerformance(teamMemberId);
      
      // Update team member
      await TeamMember.findByIdAndUpdate(teamMemberId, {
        $inc: { tasksCompleted: points > 0 ? 1 : 0 },
        $set: { 
          lastActive: new Date(),
          performance: newPerformance,
        },
      });
    } catch (error) {
      console.error('Failed to update team member performance:', error);
    }
  }

  static async calculateTeamMemberPerformance(teamMemberId: string): Promise<number> {
    try {
      const { default: TeamActivity } = await import('@/models/TeamActivity');
      const { default: TeamTask } = await import('@/models/TeamTask');
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get activities for the last 30 days
      const activities = await TeamActivity.find({
        teamMemberId,
        createdAt: { $gte: thirtyDaysAgo },
      });

      if (activities.length === 0) return 85; // Default

      // Calculate points from activities
      const activityPoints = activities.reduce((sum, activity) => 
        sum + (activity.metadata?.points || 0), 0);
      
      // Get completed team tasks
      const completedTasks = await TeamTask.countDocuments({
        assignedToId: teamMemberId,
        status: 'completed',
        updatedAt: { $gte: thirtyDaysAgo },
      });

      // Get team task completion rate
      const totalTasks = await TeamTask.countDocuments({
        assignedToId: teamMemberId,
        updatedAt: { $gte: thirtyDaysAgo },
      });

      const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      // Calculate performance (60% activity points, 40% task completion rate)
      const maxActivityPoints = 10 * 30; // Max 10 points per day
      const activityScore = Math.min(100, (activityPoints / maxActivityPoints) * 100) * 0.6;
      const taskScore = taskCompletionRate * 0.4;
      
      const totalScore = Math.round(activityScore + taskScore);
      
      return Math.min(100, Math.max(0, totalScore));
    } catch (error) {
      console.error('Failed to calculate team member performance:', error);
      return 85;
    }
  }

  // New method for team task completion
  static async logTeamTaskCompletion(teamTask: any, teamMemberId: string, userId: string) {
    await this.logActivity({
      userId,
      teamMemberId,
      type: 'team_task',
      action: 'completed',
      description: `Team task "${teamTask.title}" completed`,
      teamTaskId: teamTask._id,
      teamProjectId: teamTask.teamProjectId,
      metadata: {
        points: 10,
        teamTaskTitle: teamTask.title,
        teamProjectName: teamTask.teamProjectName,
        completionTime: new Date().toISOString(),
      },
    });

    // Update team member performance
    await this.updateTeamMemberPerformance(teamMemberId, 10);
  }

  // New method for team project completion
  static async logTeamProjectCompletion(teamProject: any, teamMemberIds: string[], userId: string) {
    for (const memberId of teamMemberIds) {
      await this.logActivity({
        userId,
        teamMemberId: memberId,
        type: 'team_project',
        action: 'completed',
        description: `Team project "${teamProject.name}" completed`,
        teamProjectId: teamProject._id,
        metadata: {
          points: 15,
          teamProjectName: teamProject.name,
          completionDate: new Date().toISOString(),
        },
      });

      // Update team member performance
      await this.updateTeamMemberPerformance(memberId, 15);
    }
  }
}