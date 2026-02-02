// app/api/team/performance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
import TeamTask from '@/models/TeamTask';
import TeamProject from '@/models/TeamProject';
import { verifyToken } from '@/lib/jwt';
import { PerformanceService } from '@/services/performanceService';
import mongoose from 'mongoose';

// Helper functions (moved outside the route handler)
function calculateWeeklyTrends(tasks: any[]) {
  const weeklyData: Record<string, number> = {};
  
  tasks.forEach(task => {
    const weekNumber = getWeekNumber(new Date(task.updatedAt || task.createdAt));
    const weekKey = `Week ${weekNumber}`;
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = 0;
    }
    
    if (task.status === 'completed') {
      weeklyData[weekKey]++;
    }
  });
  
  return Object.entries(weeklyData).map(([week, taskCount]) => ({ week, tasks: taskCount }));
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function calculateDepartmentBreakdown(teamPerformance: any[]) {
  const departmentMap: Record<string, { members: number; avgPerformance: number; totalTasks: number }> = {};
  
  teamPerformance.forEach(member => {
    if (!departmentMap[member.department]) {
      departmentMap[member.department] = { members: 0, avgPerformance: 0, totalTasks: 0 };
    }
    
    departmentMap[member.department].members++;
    departmentMap[member.department].avgPerformance += member.performance;
    departmentMap[member.department].totalTasks += member.tasksCompleted;
  });
  
  // Calculate averages
  Object.keys(departmentMap).forEach(dept => {
    departmentMap[dept].avgPerformance = Math.round(departmentMap[dept].avgPerformance / departmentMap[dept].members);
  });
  
  return departmentMap;
}

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'week';
    const department = searchParams.get('department');
    const sortBy = searchParams.get('sortBy') || 'performance';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build filter
    const filter: any = { userId: decoded.userId, isActive: true };
    if (department && department !== 'all') {
      filter.department = department;
    }

    // Get team members
    const teamMembers = await TeamMember.find(filter)
      .sort({ [sortBy]: -1 })
      .limit(limit)
      .lean();

    // Calculate performance for each member
    const teamPerformance = await Promise.all(teamMembers.map(async (member) => {
      // Calculate comprehensive performance
      const performance = await PerformanceService.calculateTeamMemberPerformance(member._id.toString());
      
      // Get trend data
      const trends = await PerformanceService.getPerformanceTrends(member._id.toString(), 
        range === 'week' ? 7 : range === 'month' ? 30 : 90
      );

      // Get member's tasks and projects
      const tasks = await TeamTask.find({
        assignedToId: member._id,
        updatedAt: { 
          $gte: new Date(Date.now() - (range === 'week' ? 7 : range === 'month' ? 30 : range === 'quarter' ? 90 : 7) * 24 * 60 * 60 * 1000)
        },
      }).lean();

      const projects = await TeamProject.find({
        assignedTeamMembers: member._id,
        updatedAt: { 
          $gte: new Date(Date.now() - (range === 'week' ? 7 : range === 'month' ? 30 : range === 'quarter' ? 90 : 7) * 24 * 60 * 60 * 1000)
        },
      }).lean();

      // Identify strengths and areas for improvement
      const strengths: string[] = [];
      const improvements: string[] = [];

      if (performance.breakdown.taskCompletion >= 80) {
        strengths.push('High task completion rate');
      } else {
        improvements.push('Improve task completion rate');
      }

      if (performance.breakdown.onTimeDelivery >= 85) {
        strengths.push('Excellent on-time delivery');
      } else {
        improvements.push('Need to meet deadlines better');
      }

      if (performance.breakdown.overdueTasks === 0) {
        strengths.push('No overdue tasks');
      } else if (performance.breakdown.overdueTasks > 2) {
        improvements.push('Reduce overdue tasks');
      }

      if (member.currentWorkload > 90) {
        improvements.push('Workload too high - consider redistribution');
      } else if (member.currentWorkload < 50) {
        improvements.push('Can take on more work');
      }

      return {
        id: member._id.toString(),
        name: member.name,
        email: member.email,
        role: member.role,
        department: member.department,
        avatar: member.avatar,
        performance: performance.score,
        tasksCompleted: performance.breakdown.completedTasks,
        projectsInvolved: projects.length,
        efficiency: performance.breakdown.workloadEfficiency,
        lastActive: member.lastActive,
        workload: member.currentWorkload,
        trends: {
          daily: trends.slice(-7), // Last 7 days
          weekly: calculateWeeklyTrends(tasks),
        },
        strengths,
        areasForImprovement: improvements,
        detailedMetrics: performance.breakdown,
        recommendations: performance.recommendations,
      };
    }));

    // Calculate team statistics
    const teamStats = {
      totalMembers: teamPerformance.length,
      activeMembers: teamPerformance.filter(m => m.workload > 0).length,
      averagePerformance: teamPerformance.length > 0 
        ? Math.round(teamPerformance.reduce((sum, m) => sum + m.performance, 0) / teamPerformance.length)
        : 0,
      totalTasksCompleted: teamPerformance.reduce((sum, m) => sum + m.tasksCompleted, 0),
      averageWorkload: teamPerformance.length > 0 
        ? Math.round(teamPerformance.reduce((sum, m) => sum + m.workload, 0) / teamPerformance.length)
        : 0,
      departmentBreakdown: calculateDepartmentBreakdown(teamPerformance),
    };

    return NextResponse.json({
      success: true,
      data: teamPerformance,
      statistics: teamStats,
      range,
      generatedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Get team performance error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}