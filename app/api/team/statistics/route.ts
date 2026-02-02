import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
import TeamActivity from '@/models/TeamActivity';
import TeamProject from '@/models/TeamProject';
import TeamTask from '@/models/TeamTask';
import { verifyToken } from '@/lib/jwt';

// GET - Get comprehensive team statistics
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Get basic team member statistics
      const teamStats = await TeamMember.aggregate([
        { $match: { userId: decoded.userId } },
        {
          $group: {
            _id: null,
            totalMembers: { $sum: 1 },
            activeMembers: { 
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } 
            },
            avgPerformance: { $avg: '$performance' },
            totalCompletedTasks: { $sum: '$tasksCompleted' },
          },
        },
      ]);

      // Get department distribution
      const departmentStats = await TeamMember.aggregate([
        { $match: { userId: decoded.userId } },
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 },
            avgPerformance: { $avg: '$performance' },
          },
        },
        { $sort: { count: -1 } },
      ]);

      // Get activity trends (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const activityTrends = await TeamActivity.aggregate([
        {
          $match: {
            userId: decoded.userId,
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
            totalPoints: { $sum: '$metadata.points' },
          },
        },
        { $sort: { '_id': 1 } },
        { $limit: 7 },
      ]);

      // Get team project statistics
      const projectStats = await TeamProject.aggregate([
        { $match: { userId: decoded.userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            avgProgress: { $avg: '$progress' },
          },
        },
      ]);

      // Get team task completion rate
      const taskStats = await TeamTask.aggregate([
        { $match: { userId: decoded.userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      // Get team task completion efficiency
      const taskEfficiency = await TeamTask.aggregate([
        { $match: { userId: decoded.userId, status: 'completed' } },
        {
          $group: {
            _id: null,
            totalEstimated: { $sum: '$estimatedHours' },
            totalActual: { $sum: '$actualHours' },
            avgProgress: { $avg: '$progress' },
          },
        },
      ]);

      // Get top performers (based on performance and completed tasks)
      const topPerformers = await TeamMember.find({ 
        userId: decoded.userId,
        status: 'active'
      })
        .sort({ performance: -1, tasksCompleted: -1 })
        .limit(5)
        .select('name email role department performance tasksCompleted teamProjects teamTasks')
        .lean();

      // Get recent high-priority activities
      const recentImportantActivities = await TeamActivity.find({
        userId: decoded.userId,
        isImportant: true,
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('teamMemberId', 'name role avatar')
      .lean();

      // Calculate project workload distribution
      const projectWorkload = await TeamMember.aggregate([
        { $match: { userId: decoded.userId } },
        {
          $project: {
            name: 1,
            teamProjectsCount: { $size: { $ifNull: ['$teamProjects', []] } },
            teamTasksCount: { $size: { $ifNull: ['$teamTasks', []] } },
          },
        },
        { $sort: { teamTasksCount: -1 } },
        { $limit: 5 },
      ]);

      const statistics = {
        team: teamStats[0] || {
          totalMembers: 0,
          activeMembers: 0,
          avgPerformance: 0,
          totalCompletedTasks: 0,
        },
        departments: departmentStats,
        activityTrends,
        projects: projectStats.reduce((acc, curr) => ({
          ...acc,
          [curr._id]: { count: curr.count, avgProgress: curr.avgProgress || 0 },
        }), {}),
        tasks: taskStats.reduce((acc, curr) => ({
          ...acc,
          [curr._id]: curr.count,
        }), {}),
        efficiency: taskEfficiency[0] || {
          totalEstimated: 0,
          totalActual: 0,
          avgProgress: 0,
        },
        topPerformers,
        recentImportantActivities,
        projectWorkload,
        generatedAt: new Date().toISOString(),
      };

      // Calculate overall team performance
      const overallPerformance = {
        score: statistics.team.avgPerformance || 0,
        grade: statistics.team.avgPerformance >= 90 ? 'A' :
               statistics.team.avgPerformance >= 80 ? 'B' :
               statistics.team.avgPerformance >= 70 ? 'C' :
               statistics.team.avgPerformance >= 60 ? 'D' : 'F',
        description: statistics.team.avgPerformance >= 90 ? 'Excellent' :
                     statistics.team.avgPerformance >= 80 ? 'Good' :
                     statistics.team.avgPerformance >= 70 ? 'Average' :
                     statistics.team.avgPerformance >= 60 ? 'Needs Improvement' : 'Poor',
      };

      return NextResponse.json({
        success: true,
        data: {
          ...statistics,
          overallPerformance,
        },
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Get team statistics error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}