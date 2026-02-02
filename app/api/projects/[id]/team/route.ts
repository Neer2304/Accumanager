// app/api/projects/[id]/team/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/models/Project';
import TeamMember from '@/models/TeamMember';
import { verifyToken } from '@/lib/jwt';
import { PerformanceService } from '@/services/performanceService';
import mongoose from 'mongoose';

// Helper function: Map project category to department
function mapProjectCategoryToDepartment(category: string): string {
  const mapping: Record<string, string> = {
    'development': 'engineering',
    'design': 'design',
    'marketing': 'marketing',
    'sales': 'sales',
    'internal': 'product',
    'client': 'support',
    'engineering': 'engineering',
    'product': 'product',
    'support': 'support',
    'other': 'general',
  };
  return mapping[category] || 'general';
}

// Helper function: Get recommended team members for a project
async function getRecommendedMembersForProject(projectId: string, userId: string): Promise<any[]> {
  const ProjectModel = mongoose.model('Project');
  const TeamMemberModel = mongoose.model('TeamMember');
  
  const project = await ProjectModel.findById(projectId);
  if (!project) return [];

  // Get all active team members
  const teamMembers = await TeamMemberModel.find({
    userId: new mongoose.Types.ObjectId(userId),
    status: 'active',
    isActive: true,
  });

  // Score members based on multiple factors
  const scoredMembers = await Promise.all(teamMembers.map(async (member) => {
    try {
      const performance = await PerformanceService.calculateTeamMemberPerformance(member._id.toString());
      
      // Category matching (simplified)
      const categoryMatch = member.department === mapProjectCategoryToDepartment(project.category) ? 100 : 50;
      
      // Workload availability (lower workload = higher score)
      const workloadScore = Math.max(0, 100 - (member.currentWorkload || 0));
      
      // Experience score (years of experience)
      const experienceScore = Math.min(100, (member.experience || 0) * 20);
      
      const totalScore = 
        (categoryMatch * 0.3) + 
        (workloadScore * 0.3) + 
        (performance.score * 0.25) + 
        (experienceScore * 0.15);
      
      return {
        ...member.toObject(),
        _id: member._id.toString(),
        recommendationScore: Math.round(totalScore),
        categoryMatch,
        workloadScore: Math.round(workloadScore),
        performanceScore: performance.score,
        experience: member.experience || 0,
      };
    } catch (error) {
      console.error(`Error scoring member ${member._id}:`, error);
      return {
        ...member.toObject(),
        _id: member._id.toString(),
        recommendationScore: 0,
        categoryMatch: 0,
        workloadScore: 0,
        performanceScore: 0,
        experience: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }));

  // Filter out members with errors and sort by recommendation score
  return scoredMembers
    .filter(member => !member.error)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 5); // Top 5 recommendations
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' }, 
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get project
    const project = await Project.findOne({
      _id: id,
      userId: decoded.userId,
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get team members
    const teamMembers = await TeamMember.find({
      userId: decoded.userId,
      isActive: true,
    }).lean();

    // Calculate each member's contribution to this project
    const projectTeamAnalysis = await Promise.all(teamMembers.map(async (member) => {
      try {
        // Get tasks assigned to this member for this project
        const Task = mongoose.model('Task');
        const memberTasks = await Task.find({
          projectId: id,
          assignedToId: member._id,
        }).lean();

        // Get performance data
        const performance = await PerformanceService.calculateTeamMemberPerformance(member._id.toString());
        
        // Calculate project-specific metrics
        const completedTasks = memberTasks.filter((t: any) => t.status === 'completed').length;
        const inProgressTasks = memberTasks.filter((t: any) => t.status === 'in_progress').length;
        const overdueTasks = memberTasks.filter((t: any) => 
          t.status !== 'completed' && 
          t.dueDate && 
          new Date(t.dueDate) < new Date()
        ).length;

        // Calculate workload percentage for this project
        const totalProjectTasks = await Task.countDocuments({ projectId: id });
        const projectWorkload = totalProjectTasks > 0 
          ? (memberTasks.length / totalProjectTasks) * 100 
          : 0;

        // Calculate last contribution date
        let lastContribution = null;
        if (memberTasks.length > 0) {
          const latestDate = Math.max(...memberTasks.map((t: any) => 
            new Date(t.updatedAt || t.createdAt).getTime()
          ));
          lastContribution = new Date(latestDate);
        }

        return {
          id: member._id.toString(),
          name: member.name,
          email: member.email,
          role: member.role,
          department: member.department,
          avatar: member.avatar,
          status: member.status,
          skills: member.skills || [],
          experience: member.experience || 0,
          projectTasks: memberTasks,
          projectMetrics: {
            completedTasks,
            inProgressTasks,
            overdueTasks,
            totalTasks: memberTasks.length,
            completionRate: memberTasks.length > 0 ? (completedTasks / memberTasks.length) * 100 : 0,
            projectWorkload: Math.round(projectWorkload),
            lastContribution,
          },
          performance: performance?.score || 0,
          performanceBreakdown: performance?.breakdown || {},
        };
      } catch (error) {
        console.error(`Error analyzing member ${member._id} for project ${id}:`, error);
        return {
          id: member._id.toString(),
          name: member.name,
          email: member.email,
          role: member.role,
          department: member.department,
          status: member.status,
          projectTasks: [],
          projectMetrics: {
            completedTasks: 0,
            inProgressTasks: 0,
            overdueTasks: 0,
            totalTasks: 0,
            completionRate: 0,
            projectWorkload: 0,
            lastContribution: null,
          },
          performance: 0,
          performanceBreakdown: {},
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }));

    // Filter out members with critical errors
    const validAnalysis = projectTeamAnalysis.filter(member => !member.error);

    // Calculate project team stats
    const projectTeamStats = {
      totalTeamMembers: validAnalysis.length,
      activeMembers: validAnalysis.filter(m => m.status === 'active').length,
      averagePerformance: validAnalysis.length > 0 
        ? Math.round(validAnalysis.reduce((sum, m) => sum + m.performance, 0) / validAnalysis.length)
        : 0,
      totalCompletedTasks: validAnalysis.reduce((sum, m) => sum + m.projectMetrics.completedTasks, 0),
      totalInProgressTasks: validAnalysis.reduce((sum, m) => sum + m.projectMetrics.inProgressTasks, 0),
      totalOverdueTasks: validAnalysis.reduce((sum, m) => sum + m.projectMetrics.overdueTasks, 0),
      averageCompletionRate: validAnalysis.length > 0 
        ? Math.round(validAnalysis.reduce((sum, m) => sum + m.projectMetrics.completionRate, 0) / validAnalysis.length)
        : 0,
      workloadDistribution: validAnalysis.map(m => ({
        name: m.name,
        workload: m.projectMetrics.projectWorkload,
        tasks: m.projectMetrics.totalTasks,
        completionRate: m.projectMetrics.completionRate,
      })),
    };

    // Get recommended team members for this project
    const recommendedMembers = await getRecommendedMembersForProject(id, decoded.userId);

    return NextResponse.json({
      success: true,
      data: {
        project: {
          id: project._id,
          name: project.name,
          description: project.description,
          status: project.status,
          category: project.category,
          progress: project.progress,
          startDate: project.startDate,
          deadline: project.deadline,
          clientName: project.clientName,
          totalTasks: project.totalTasks || 0,
          completedTasks: project.completedTasks || 0,
          inProgressTasks: project.inProgressTasks || 0,
        },
        teamAnalysis: validAnalysis,
        teamStats: projectTeamStats,
        recommendedMembers: recommendedMembers.map(member => ({
          id: member._id,
          name: member.name,
          email: member.email,
          role: member.role,
          department: member.department,
          recommendationScore: member.recommendationScore,
          skills: member.skills || [],
          experience: member.experience,
          currentWorkload: member.currentWorkload || 0,
          performanceScore: member.performanceScore,
          categoryMatch: member.categoryMatch,
          workloadScore: member.workloadScore,
        })),
      },
      message: `Found ${validAnalysis.length} team members involved in this project`,
    });

  } catch (error: any) {
    console.error('Get project team error:', error);
    
    // Handle specific errors
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: 'Data validation error', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// POST: Assign team members to a project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' }, 
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get project
    const project = await Project.findOne({
      _id: id,
      userId: decoded.userId,
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { teamMemberIds, action = 'assign' } = body;

    if (!teamMemberIds || !Array.isArray(teamMemberIds) || teamMemberIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Team member IDs array is required' },
        { status: 400 }
      );
    }

    // Validate team members exist and belong to user
    const teamMembers = await TeamMember.find({
      _id: { $in: teamMemberIds },
      userId: decoded.userId,
    });

    if (teamMembers.length !== teamMemberIds.length) {
      const foundIds = teamMembers.map(m => m._id.toString());
      const missingIds = teamMemberIds.filter(id => !foundIds.includes(id));
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Some team members not found or inaccessible',
          missingIds 
        },
        { status: 404 }
      );
    }

    let updatedProject;
    let message = '';

    if (action === 'assign') {
      // Add team members to project
      updatedProject = await Project.findByIdAndUpdate(
        id,
        {
          $addToSet: { teamMembers: { $each: teamMemberIds } },
          updatedAt: new Date(),
        },
        { new: true }
      );

      // Add project to team members' project list
      await TeamMember.updateMany(
        { _id: { $in: teamMemberIds } },
        {
          $addToSet: { teamProjects: id },
          lastActive: new Date(),
        }
      );

      message = `Successfully assigned ${teamMemberIds.length} team members to project`;

    } else if (action === 'remove') {
      // Remove team members from project
      updatedProject = await Project.findByIdAndUpdate(
        id,
        {
          $pull: { teamMembers: { $in: teamMemberIds } },
          updatedAt: new Date(),
        },
        { new: true }
      );

      // Remove project from team members' project list
      await TeamMember.updateMany(
        { _id: { $in: teamMemberIds } },
        {
          $pull: { teamProjects: id },
        }
      );

      message = `Successfully removed ${teamMemberIds.length} team members from project`;

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Use "assign" or "remove"' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        project: updatedProject,
        affectedTeamMembers: teamMemberIds.length,
        action,
      },
      message,
    });

  } catch (error: any) {
    console.error('Project team assignment error:', error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// PUT: Update team member's role in a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' }, 
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { teamMemberId, role, responsibilities, isLead = false } = body;

    if (!teamMemberId || !role) {
      return NextResponse.json(
        { success: false, error: 'Team member ID and role are required' },
        { status: 400 }
      );
    }

    // Verify project exists and belongs to user
    const project = await Project.findOne({
      _id: id,
      userId: decoded.userId,
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Verify team member exists and belongs to user
    const teamMember = await TeamMember.findOne({
      _id: teamMemberId,
      userId: decoded.userId,
    });

    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Verify team member is assigned to this project
    if (!project.teamMembers?.includes(teamMemberId)) {
      return NextResponse.json(
        { success: false, error: 'Team member is not assigned to this project' },
        { status: 400 }
      );
    }

    // Update project team member details
    // This would require extending the Project model to store team member roles per project
    // For now, we'll update the TeamMember's project-specific info
    const updatedTeamMember = await TeamMember.findByIdAndUpdate(
      teamMemberId,
      {
        $set: {
          'projectRoles.projectId': id,
          'projectRoles.role': role,
          'projectRoles.responsibilities': responsibilities || '',
          'projectRoles.isLead': isLead,
          'projectRoles.updatedAt': new Date(),
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        project: {
          id: project._id,
          name: project.name,
        },
        teamMember: {
          id: updatedTeamMember._id,
          name: updatedTeamMember.name,
          role: role,
          responsibilities: responsibilities || '',
          isLead,
        },
      },
      message: `Updated ${teamMember.name}'s role in project "${project.name}"`,
    });

  } catch (error: any) {
    console.error('Update project team role error:', error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}