// services/performanceService.ts
import mongoose from 'mongoose';

export class PerformanceService {
  static async calculateTeamMemberPerformance(teamMemberId: string): Promise<{
    score: number;
    breakdown: any;
    recommendations: string[];
  }> {
    const TeamMember = mongoose.model('TeamMember');
    const TeamTask = mongoose.model('TeamTask');
    const TeamProject = mongoose.model('TeamProject');
    
    const teamMember = await TeamMember.findById(teamMemberId);
    if (!teamMember) throw new Error('Team member not found');
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Fetch all relevant data
    const [tasks, projects, completedTasks, overdueTasks] = await Promise.all([
      TeamTask.find({
        assignedToId: teamMemberId,
        updatedAt: { $gte: thirtyDaysAgo },
      }),
      TeamProject.find({
        assignedTeamMembers: teamMemberId,
        updatedAt: { $gte: thirtyDaysAgo },
      }),
      TeamTask.countDocuments({
        assignedToId: teamMemberId,
        status: 'completed',
        updatedAt: { $gte: thirtyDaysAgo },
      }),
      TeamTask.countDocuments({
        assignedToId: teamMemberId,
        status: { $ne: 'completed' },
        dueDate: { $lt: new Date() },
        updatedAt: { $gte: thirtyDaysAgo },
      }),
    ]);
    
    // Calculate metrics
    const totalTasks = tasks.length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    
    // Task completion rate
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // On-time completion
    const onTimeTasks = tasks.filter(task => 
      task.status === 'completed' && 
      task.dueDate && 
      new Date(task.dueDate) >= new Date()
    ).length;
    const onTimeRate = totalTasks > 0 ? (onTimeTasks / totalTasks) * 100 : 0;
    
    // Project involvement score
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const projectProgress = projects.length > 0 
      ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length 
      : 0;
    
    // Workload efficiency
    const estimatedHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const actualHours = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
    const efficiencyRatio = estimatedHours > 0 ? (actualHours / estimatedHours) * 100 : 100;
    
    // Calculate weighted score
    const weights = {
      taskCompletion: 0.30,    // 30%
      onTimeDelivery: 0.25,    // 25%
      projectContribution: 0.20, // 20%
      workloadEfficiency: 0.15,  // 15%
      quality: 0.10,            // 10% (placeholder for future quality metrics)
    };
    
    const scores = {
      taskCompletion: taskCompletionRate,
      onTimeDelivery: onTimeRate,
      projectContribution: projectProgress,
      workloadEfficiency: Math.min(100, efficiencyRatio),
      quality: 90, // Default, can be replaced with actual quality metrics
    };
    
    // Calculate total score
    const totalScore = Object.entries(scores).reduce((total, [key, score]) => {
      return total + (score * weights[key as keyof typeof weights]);
    }, 0);
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (taskCompletionRate < 70) {
      recommendations.push('Focus on completing assigned tasks. Consider reducing workload if overwhelmed.');
    }
    
    if (onTimeRate < 80) {
      recommendations.push('Improve time management skills. Consider breaking tasks into smaller subtasks.');
    }
    
    if (overdueTasks > 2) {
      recommendations.push(`You have ${overdueTasks} overdue tasks. Prioritize completing these first.`);
    }
    
    if (activeProjects > 3) {
      recommendations.push('You are assigned to multiple active projects. Consider discussing workload with manager.');
    }
    
    // Update team member record
    teamMember.performance = Math.round(totalScore);
    teamMember.efficiency = Math.round(efficiencyRatio);
    teamMember.tasksCompleted = completedTasks;
    teamMember.projectsCompleted = completedProjects;
    teamMember.currentWorkload = Math.min(100, (activeProjects * 20) + (totalTasks * 5)); // Simplified workload calculation
    
    await teamMember.save();
    
    return {
      score: Math.round(totalScore),
      breakdown: {
        taskCompletion: Math.round(taskCompletionRate),
        onTimeDelivery: Math.round(onTimeRate),
        projectContribution: Math.round(projectProgress),
        workloadEfficiency: Math.round(efficiencyRatio),
        overdueTasks,
        activeProjects,
        completedTasks,
        completedProjects,
      },
      recommendations,
    };
  }
  
  static async updateTeamPerformance(teamMemberIds: string[]) {
    const results = [];
    
    for (const memberId of teamMemberIds) {
      try {
        const performance = await this.calculateTeamMemberPerformance(memberId);
        results.push({
          memberId,
          ...performance,
        });
      } catch (error) {
        console.error(`Failed to calculate performance for member ${memberId}:`, error);
      }
    }
    
    return results;
  }
  
  static async getPerformanceTrends(teamMemberId: string, days: number = 30) {
    const TeamActivity = mongoose.model('TeamActivity');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const activities = await TeamActivity.find({
      teamMemberId,
      createdAt: { $gte: startDate },
      'metadata.points': { $exists: true },
    }).sort({ createdAt: 1 });
    
    // Group by day
    const dailyPerformance: Record<string, { points: number; tasks: number; projects: number }> = {};
    
    activities.forEach(activity => {
      const date = activity.createdAt.toISOString().split('T')[0];
      
      if (!dailyPerformance[date]) {
        dailyPerformance[date] = { points: 0, tasks: 0, projects: 0 };
      }
      
      dailyPerformance[date].points += activity.metadata?.points || 0;
      
      if (activity.type === 'team_task') {
        dailyPerformance[date].tasks++;
      } else if (activity.type === 'team_project') {
        dailyPerformance[date].projects++;
      }
    });
    
    // Convert to array format for charts
    const trendData = Object.entries(dailyPerformance).map(([date, data]) => ({
      date,
      score: Math.min(100, data.points * 10), // Convert points to score (0-100)
      tasksCompleted: data.tasks,
      projectsActive: data.projects,
      dailyPoints: data.points,
    }));
    
    return trendData;
  }
}