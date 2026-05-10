import { TeamActivityService } from '@/services/teamActivityService';

// Define interfaces for better type safety
interface TeamTask {
  _id: string;
  title: string;
  assignedToId?: string;
  teamProjectId?: string;
  teamProjectName?: string;
  priority?: string;
  status?: string;
}

interface TeamProject {
  _id: string;
  name: string;
  description?: string;
}

interface TeamMember {
  _id: string;
  name: string;
  role?: string;
  department?: string;
  performance?: number;
}

interface TeamMemberUpdateData {
  name?: string;
  role?: string;
  department?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

export class TeamActivityHooks {
  // Hook for team task operations
  static async onTeamTaskCreated(teamTask: TeamTask, userId: string) {
    await TeamActivityService.logActivity({
      userId,
      teamMemberId: teamTask.assignedToId,
      type: 'team_task',
      action: 'created',
      description: `Team task "${teamTask.title}" created`,
      teamTaskId: teamTask._id,
      teamProjectId: teamTask.teamProjectId,
      metadata: {
        teamTaskTitle: teamTask.title,
        teamProjectName: teamTask.teamProjectName,
        priority: teamTask.priority,
      },
    });
  }

  static async onTeamTaskUpdated(teamTask: TeamTask, oldStatus: string, newStatus: string, userId: string) {
    const action = newStatus === 'completed' ? 'completed' : 'updated';
    
    await TeamActivityService.logActivity({
      userId,
      teamMemberId: teamTask.assignedToId,
      type: 'team_task',
      action,
      description: `Team task "${teamTask.title}" ${action}`,
      teamTaskId: teamTask._id,
      teamProjectId: teamTask.teamProjectId,
      metadata: {
        teamTaskTitle: teamTask.title,
        oldStatus,
        newStatus,
        points: newStatus === 'completed' ? 10 : 1,
      },
    });

    // Update team member performance if task completed
    if (teamTask.assignedToId && newStatus === 'completed') {
      await TeamActivityService.updateTeamMemberPerformance(teamTask.assignedToId, 10);
    }
  }

  static async onTeamTaskAssigned(teamTask: TeamTask, teamMember: TeamMember, userId: string) {
    await TeamActivityService.logActivity({
      userId,
      teamMemberId: teamMember._id,
      type: 'team_task',
      action: 'assigned',
      description: `Team task "${teamTask.title}" assigned to ${teamMember.name}`,
      teamTaskId: teamTask._id,
      teamProjectId: teamTask.teamProjectId,
      metadata: {
        teamTaskTitle: teamTask.title,
        teamMemberName: teamMember.name,
        points: 3,
      },
    });
  }

  // Hook for team project operations
  static async onTeamProjectCreated(teamProject: TeamProject, userId: string) {
    await TeamActivityService.logActivity({
      userId,
      type: 'team_project',
      action: 'created',
      description: `Team project "${teamProject.name}" created`,
      teamProjectId: teamProject._id,
      metadata: {
        teamProjectName: teamProject.name,
        points: 5,
      },
    });
  }

  static async onTeamProjectUpdated(teamProject: TeamProject, userId: string) {
    await TeamActivityService.logActivity({
      userId,
      type: 'team_project',
      action: 'updated',
      description: `Team project "${teamProject.name}" updated`,
      teamProjectId: teamProject._id,
      metadata: {
        teamProjectName: teamProject.name,
        points: 2,
      },
    });
  }

  static async onTeamProjectAssigned(teamProject: TeamProject, teamMember: TeamMember, userId: string) {
    await TeamActivityService.logActivity({
      userId,
      teamMemberId: teamMember._id,
      type: 'team_project',
      action: 'assigned',
      description: `Team project "${teamProject.name}" assigned to ${teamMember.name}`,
      teamProjectId: teamProject._id,
      metadata: {
        teamProjectName: teamProject.name,
        teamMemberName: teamMember.name,
        points: 5,
      },
    });
  }

  // Hook for team member operations
  static async onTeamMemberAdded(teamMember: TeamMember, userId: string) {
    await TeamActivityService.logActivity({
      userId,
      teamMemberId: teamMember._id,
      type: 'team_member',
      action: 'added',
      description: `Team member "${teamMember.name}" added to the team`,
      metadata: {
        teamMemberName: teamMember.name,
        role: teamMember.role,
        department: teamMember.department,
        points: 3,
      },
    });
  }

  static async onTeamMemberUpdated(teamMember: TeamMember, oldData: TeamMemberUpdateData, userId: string) {
    await TeamActivityService.logActivity({
      userId,
      teamMemberId: teamMember._id,
      type: 'team_member',
      action: 'updated',
      description: `Team member "${teamMember.name}" information updated`,
      metadata: {
        teamMemberName: teamMember.name,
        updatedFields: Object.keys(oldData),
        points: 1,
      },
    });
  }

  static async onTeamMemberPerformanceUpdate(teamMember: TeamMember, oldPerformance: number, newPerformance: number, userId: string) {
    const change = newPerformance - oldPerformance;
    const direction = change > 0 ? 'increased' : 'decreased';
    
    await TeamActivityService.logActivity({
      userId,
      teamMemberId: teamMember._id,
      type: 'team_member',
      action: 'performance_update',
      description: `Team member "${teamMember.name}" performance ${direction} from ${oldPerformance}% to ${newPerformance}%`,
      metadata: {
        teamMemberName: teamMember.name,
        oldPerformance,
        newPerformance,
        change,
        points: 5,
      },
    });
  }

  // Hook for general team activity
  static async onUserActivity(userId: string, teamMemberId?: string, action: string = 'active') {
    await TeamActivityService.logActivity({
      userId,
      teamMemberId,
      type: 'team_activity',
      action,
      description: `User is ${action}`,
    });

    if (teamMemberId) {
      await TeamActivityService.updateTeamMemberLastActive(teamMemberId);
    }
  }
}