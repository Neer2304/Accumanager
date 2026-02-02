import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import TeamProject from "@/models/TeamProject";
import TeamTask from "@/models/TeamTask";
import TeamActivity from "@/models/TeamActivity";
import { verifyToken } from "@/lib/jwt";
import { PaymentService } from "@/services/paymentService";
// import type { TeamActivity as TeamActivityType } from "@/models/TeamActivity";

// GET - Get dashboard data
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json({ 
        success: false,
        error: "Unauthorized" 
      }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Check subscription
      const subscription = await PaymentService.checkSubscription(decoded.userId);
      if (!subscription.isActive) {
        return NextResponse.json(
          {
            success: false,
            error: "Please upgrade your subscription to access team dashboard",
          },
          { status: 402 }
        );
      }

      // Get all team members for this user
      const teamMembers = await TeamMember.find({ 
        userId: decoded.userId,
        status: { $ne: 'archived' }
      })
        .select('name email role department status performance tasksCompleted joinDate lastActive avatar phone location skills bio')
        .sort({ lastActive: -1 })
        .lean();

      // Get all team projects for this user
      const teamProjects = await TeamProject.find({ 
        userId: decoded.userId 
      })
        .select('name description status progress dueDate startDate teamLead teamMembers category tags')
        .sort({ dueDate: 1 })
        .limit(10)
        .lean();

      // Get recent team activities
      const recentActivities = await TeamActivity.find({
        userId: decoded.userId
      })
        .populate('teamMemberId', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      // Get all team tasks for statistics
      const teamTasks = await TeamTask.find({
        userId: decoded.userId
      })
        .select('status priority dueDate assignedToId')
        .lean();

      // Calculate dashboard statistics
      const totalMembers = teamMembers.length;
      const activeMembers = teamMembers.filter(m => m.status === 'active').length;
      const totalProjects = teamProjects.length;
      const activeProjects = teamProjects.filter(p => 
        p.status === 'active' || p.status === 'planning'
      ).length;

      // Calculate average performance
      const avgPerformance = teamMembers.length > 0 
        ? Math.round(teamMembers.reduce((acc, m) => acc + (m.performance || 0), 0) / teamMembers.length)
        : 0;

      // Calculate task statistics
      const completedTasks = teamTasks.filter(t => t.status === 'completed').length;
      const pendingTasks = teamTasks.filter(t => 
        t.status === 'todo' || t.status === 'in_progress'
      ).length;
      
      // Calculate overdue tasks (tasks past due date)
      const overdueTasks = teamTasks.filter(t => {
        if (!t.dueDate || t.status === 'completed') return false;
        return new Date(t.dueDate) < new Date();
      }).length;

      // Format recent activities for frontend
      const formattedActivities = recentActivities.map((activity: any) => ({
        _id: activity._id.toString(),
        type: activity.type || 'general',
        description: activity.description || 'Activity',
        teamMemberName: activity.teamMemberId?.name || 'System',
        teamMemberAvatar: activity.teamMemberId?.avatar,
        timestamp: activity.createdAt,
        priority: activity.metadata?.priority || 'medium'
      }));

      // Format team members for frontend
      const formattedTeamMembers = teamMembers.map(member => ({
        _id: member._id.toString(),
        name: member.name,
        email: member.email,
        role: member.role,
        department: member.department,
        status: member.status,
        performance: member.performance || 0,
        tasksCompleted: member.tasksCompleted || 0,
        joinDate: member.joinDate,
        lastActive: member.lastActive,
        avatar: member.avatar,
        phone: member.phone,
        location: member.location,
        skills: member.skills || [],
        bio: member.bio
      }));

      // Format team projects for frontend
      const formattedTeamProjects = teamProjects.map(project => ({
        _id: project._id.toString(),
        name: project.name,
        description: project.description,
        status: project.status,
        progress: project.progress || 0,
        dueDate: project.dueDate,
        startDate: project.startDate,
        teamLead: project.teamLead,
        teamMembers: Array.isArray(project.teamMembers) ? project.teamMembers.length : 0,
        category: project.category,
        tags: project.tags || []
      }));

      // Get top performers
      const topPerformers = [...formattedTeamMembers]
        .sort((a, b) => (b.performance || 0) - (a.performance || 0))
        .slice(0, 3);

      // Get upcoming deadlines
      const upcomingDeadlines = [...formattedTeamProjects]
        .filter(p => p.status === 'active' && p.dueDate)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);

      // Calculate department performance
      const departmentPerformance = formattedTeamMembers.reduce((acc, member) => {
        if (!acc[member.department]) {
          acc[member.department] = {
            total: 0,
            count: 0,
            members: []
          };
        }
        acc[member.department].total += member.performance || 0;
        acc[member.department].count += 1;
        acc[member.department].members.push(member.name);
        return acc;
      }, {} as Record<string, { total: number; count: number; members: string[] }>);

      // Calculate performance distribution
      const highPerformers = formattedTeamMembers.filter(m => (m.performance || 0) >= 90).length;
      const averagePerformers = formattedTeamMembers.filter(m => 
        (m.performance || 0) >= 70 && (m.performance || 0) < 90
      ).length;
      const lowPerformers = formattedTeamMembers.filter(m => (m.performance || 0) < 70).length;

      // Get activity statistics
      const todaysActivities = formattedActivities.filter(a => {
        const activityDate = new Date(a.timestamp);
        const today = new Date();
        return activityDate.toDateString() === today.toDateString();
      }).length;

      const thisWeekActivities = formattedActivities.filter(a => {
        const activityDate = new Date(a.timestamp);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return activityDate >= weekAgo;
      }).length;

      const response = {
        success: true,
        data: {
          stats: {
            totalMembers,
            activeMembers,
            totalProjects,
            activeProjects,
            avgPerformance,
            completedTasks,
            pendingTasks,
            overdueTasks
          },
          teamMembers: formattedTeamMembers,
          teamProjects: formattedTeamProjects,
          recentActivities: formattedActivities,
          topPerformers,
          upcomingDeadlines,
          analytics: {
            departmentPerformance: Object.entries(departmentPerformance).map(([dept, data]) => ({
              department: dept,
              avgPerformance: Math.round(data.total / data.count),
              memberCount: data.count,
              members: data.members
            })),
            performanceDistribution: {
              high: highPerformers,
              average: averagePerformers,
              low: lowPerformers
            },
            activitySummary: {
              today: todaysActivities,
              thisWeek: thisWeekActivities,
              total: formattedActivities.length
            }
          },
          quickStats: {
            highPriorityTasks: teamTasks.filter(t => t.priority === 'high').length,
            dueThisWeek: teamTasks.filter(t => {
              if (!t.dueDate) return false;
              const dueDate = new Date(t.dueDate);
              const nextWeek = new Date();
              nextWeek.setDate(nextWeek.getDate() + 7);
              return dueDate <= nextWeek && dueDate >= new Date();
            }).length,
            unassignedTasks: teamTasks.filter(t => !t.assignedToId).length,
            blockedProjects: teamProjects.filter(p => p.status === 'blocked').length
          }
        }
      };

      return NextResponse.json(response);
      
    } catch (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
        },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Get dashboard error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}