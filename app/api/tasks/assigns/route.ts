// app/api/team/tasks/assign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TeamTask from '@/models/TeamTask';
import TeamMember from '@/models/TeamMember';
import { verifyToken } from '@/lib/jwt';
import { PerformanceService } from '@/services/performanceService';
import { TeamActivityService } from '@/services/teamActivityService';
import mongoose from 'mongoose';

// Helper function: Calculate skills match percentage
function calculateSkillsMatch(memberSkills: string[] = [], requiredSkills: string[] = []): number {
  if (!requiredSkills || requiredSkills.length === 0) return 100;
  if (!memberSkills || memberSkills.length === 0) return 0;
  
  const matched = requiredSkills.filter(skill => 
    memberSkills.some(memberSkill => 
      memberSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(memberSkill.toLowerCase())
    )
  );
  
  return (matched.length / requiredSkills.length) * 100;
}

// Helper function: Check if a team member can handle more workload
async function checkWorkloadCapacity(
  member: any, 
  task: any
): Promise<{
  canAssign: boolean;
  reason?: string;
  suggestions?: string[];
}> {
  const MAX_WORKLOAD = 100;
  const estimatedWorkloadIncrease = task.estimatedHours ? (task.estimatedHours / 40) * 100 : 15;
  
  // Check if adding this task would exceed capacity
  if (member.currentWorkload + estimatedWorkloadIncrease > MAX_WORKLOAD) {
    return {
      canAssign: false,
      reason: `Team member is at ${member.currentWorkload}% capacity. Adding this task would exceed 100%.`,
      suggestions: [
        'Consider reducing task complexity',
        'Extend deadline',
        'Assign to another team member',
        'Reassign some existing tasks',
      ],
    };
  }

  // Check if member is on leave
  if (member.status === 'on_leave') {
    return {
      canAssign: false,
      reason: 'Team member is currently on leave',
      suggestions: ['Assign to another available team member'],
    };
  }

  // Check if member is offline
  if (member.status === 'offline') {
    return {
      canAssign: false,
      reason: 'Team member is currently offline',
      suggestions: ['Wait for member to come online or assign to another member'],
    };
  }

  // Check skill compatibility
  if (task.skillsRequired && task.skillsRequired.length > 0 && member.skills) {
    const skillsMatch = calculateSkillsMatch(member.skills, task.skillsRequired);
    if (skillsMatch < 30) {
      return {
        canAssign: false,
        reason: `Low skill compatibility (${Math.round(skillsMatch)}%)`,
        suggestions: [
          'Provide training',
          'Assign to more suitable team member',
          'Break down task and assign parts to different members',
        ],
      };
    }
  }

  return { canAssign: true };
}

// Helper function: Find suitable team members for auto-assignment
async function findSuitableTeamMembers(
  task: any, 
  userId: string
): Promise<any[]> {
  const TeamMemberModel = mongoose.model('TeamMember');
  const TeamTaskModel = mongoose.model('TeamTask');
  
  // Get all active team members
  const teamMembers = await TeamMemberModel.find({
    userId: new mongoose.Types.ObjectId(userId),
    status: { $in: ['active', 'away'] }, // Consider both active and away members
    isActive: true,
  }).lean();

  // Score each member based on multiple factors
  const scoredMembers = await Promise.all(teamMembers.map(async (member) => {
    try {
      const [performance, recentTasks] = await Promise.all([
        PerformanceService.calculateTeamMemberPerformance(member._id.toString()),
        TeamTaskModel.countDocuments({
          assignedToId: member._id,
          status: 'completed',
          updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
        }),
      ]);

      // Skill matching (40% weight)
      const skillsMatch = task.skillsRequired 
        ? calculateSkillsMatch(member.skills || [], task.skillsRequired)
        : 50; // Default if no skills specified

      // Workload score (30% weight) - lower is better
      const workloadScore = Math.max(0, 100 - (member.currentWorkload || 0));

      // Performance score (20% weight)
      const performanceScore = performance?.score || 0;

      // Recent activity bonus (10% weight)
      const recentActivityBonus = Math.min(100, recentTasks * 10);

      // Calculate total suitability score
      const totalScore = 
        (skillsMatch * 0.4) + 
        (workloadScore * 0.3) + 
        (performanceScore * 0.2) + 
        (recentActivityBonus * 0.1);

      return {
        ...member,
        _id: member._id.toString(),
        suitabilityScore: Math.round(totalScore),
        skillsMatch: Math.round(skillsMatch),
        workloadScore: Math.round(workloadScore),
        performanceScore: Math.round(performanceScore),
        recentActivity: recentTasks,
        isAvailable: member.status === 'active',
      };
    } catch (error) {
      console.error(`Error scoring member ${member._id}:`, error);
      return {
        ...member,
        _id: member._id.toString(),
        suitabilityScore: 0,
        skillsMatch: 0,
        workloadScore: 0,
        performanceScore: 0,
        recentActivity: 0,
        isAvailable: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }));

  // Filter out members with errors and sort by suitability score (highest first)
  return scoredMembers
    .filter(member => !member.error && member.isAvailable)
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

// Helper function: Validate task assignment data
function validateAssignmentData(taskId: string, teamMemberId?: string, autoAssign?: boolean): {
  isValid: boolean;
  error?: string;
  status?: number;
} {
  if (!taskId || taskId.trim() === '') {
    return {
      isValid: false,
      error: 'Task ID is required',
      status: 400,
    };
  }

  if (!autoAssign && (!teamMemberId || teamMemberId.trim() === '')) {
    return {
      isValid: false,
      error: 'Team Member ID is required when not using auto-assign',
      status: 400,
    };
  }

  return { isValid: true };
}

export async function POST(request: NextRequest) {
  try {
    // Get authentication token
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized: No authentication token found' 
        }, 
        { status: 401 }
      );
    }

    // Verify token and get user ID
    let decoded: any;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid or expired authentication token' 
        }, 
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid JSON in request body' 
        }, 
        { status: 400 }
      );
    }

    const { taskId, teamMemberId, autoAssign = false } = body;

    // Validate input data
    const validation = validateAssignmentData(taskId, teamMemberId, autoAssign);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error 
        }, 
        { status: validation.status || 400 }
      );
    }

    // Get the task to assign
    const task = await TeamTask.findOne({
      _id: taskId,
      userId: decoded.userId,
    });

    if (!task) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task not found or you do not have permission to access it' 
        }, 
        { status: 404 }
      );
    }

    let assignedMemberId = teamMemberId;
    let assignmentType = 'manual';

    // Auto-assign based on performance and workload
    if (autoAssign && !teamMemberId) {
      assignmentType = 'auto';
      const suitableMembers = await findSuitableTeamMembers(task, decoded.userId);
      
      if (suitableMembers.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No suitable team members found for auto-assignment',
            suggestions: [
              'Check if team members are active',
              'Consider manual assignment',
              'Review skill requirements for the task',
            ],
          }, 
          { status: 404 }
        );
      }

      assignedMemberId = suitableMembers[0]._id;
      
      // Return auto-assignment suggestions if debug mode
      if (request.headers.get('x-debug-mode') === 'true') {
        return NextResponse.json({
          success: true,
          data: {
            task: task,
            suggestions: suitableMembers.slice(0, 3), // Top 3 suggestions
            selectedMember: suitableMembers[0],
          },
          message: 'Auto-assignment suggestions generated',
        });
      }
    }

    // Manual assignment validation
    if (!autoAssign && teamMemberId) {
      const teamMember = await TeamMember.findOne({
        _id: teamMemberId,
        userId: decoded.userId,
      });

      if (!teamMember) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Team member not found or you do not have permission to access them' 
          }, 
          { status: 404 }
        );
      }

      // Check if member can handle this task
      const workloadStatus = await checkWorkloadCapacity(teamMember, task);
      if (!workloadStatus.canAssign) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Cannot assign task to this team member',
            details: workloadStatus.reason,
            suggestions: workloadStatus.suggestions,
          }, 
          { status: 400 }
        );
      }
    }

    // Check if task is already assigned to this member
    if (task.assignedToId?.toString() === assignedMemberId?.toString()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task is already assigned to this team member' 
        }, 
        { status: 400 }
      );
    }

    // Get assigned member name for update
    let assignedMemberName = '';
    if (assignedMemberId) {
      const assignedMember = await TeamMember.findById(assignedMemberId);
      assignedMemberName = assignedMember?.name || 'Unknown Member';
    }

    // Update task assignment
    const updateData: any = {
      assignedToId: assignedMemberId || null,
      assignedToName: assignedMemberName,
      status: assignedMemberId ? 'todo' : task.status,
      updatedAt: new Date(),
    };

    // Add assignment metadata
    if (assignedMemberId) {
      updateData.assignmentHistory = [
        ...(task.assignmentHistory || []),
        {
          assignedTo: assignedMemberId,
          assignedByName: 'System', // You can fetch current user's name here
          assignedAt: new Date(),
          type: assignmentType,
        },
      ];
    }

    const updatedTask = await TeamTask.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true, runValidators: true }
    );

    // Handle team member updates
    if (assignedMemberId) {
      // Add task to new member's task list
      await TeamMember.findByIdAndUpdate(
        assignedMemberId,
        {
          $addToSet: { teamTasks: taskId },
          $inc: { 
            currentWorkload: task.estimatedHours ? (task.estimatedHours / 40) * 100 : 10 
          },
          lastActive: new Date(),
        }
      );

      // Log activity
      const assignedMember = await TeamMember.findById(assignedMemberId);
      if (assignedMember) {
        await TeamActivityService.logTeamTaskAssigned(
          updatedTask,
          assignedMember,
          decoded.userId
        );
      }
    }

    // Remove task from previous member if reassigning
    if (task.assignedToId && task.assignedToId.toString() !== assignedMemberId?.toString()) {
      await TeamMember.findByIdAndUpdate(
        task.assignedToId,
        {
          $pull: { teamTasks: taskId },
          $inc: { 
            currentWorkload: task.estimatedHours ? -(task.estimatedHours / 40) * 100 : -10 
          },
        }
      );
    }

    // Calculate performance for affected members
    if (assignedMemberId) {
      await PerformanceService.calculateTeamMemberPerformance(assignedMemberId.toString());
    }
    if (task.assignedToId) {
      await PerformanceService.calculateTeamMemberPerformance(task.assignedToId.toString());
    }

    return NextResponse.json({
      success: true,
      data: {
        task: updatedTask,
        assignmentType,
        assignedMember: assignedMemberId 
          ? {
              id: assignedMemberId,
              name: assignedMemberName,
            }
          : null,
        previousMember: task.assignedToId 
          ? {
              id: task.assignedToId,
              name: task.assignedToName,
            }
          : null,
      },
      message: assignedMemberId 
        ? `Task "${task.title}" assigned successfully to ${assignedMemberName}` 
        : 'Task unassigned successfully',
    });

  } catch (error: any) {
    console.error('Task assignment error:', error);
    
    // Handle specific Mongoose errors
    if (error.name === 'CastError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid ID format provided' 
        }, 
        { status: 400 }
      );
    }

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error', 
          details: error.message 
        }, 
        { status: 400 }
      );
    }

    // Return generic error
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error during task assignment' 
      }, 
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to get assignment suggestions
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task ID is required to get assignment suggestions' 
        }, 
        { status: 400 }
      );
    }

    // Get the task
    const task = await TeamTask.findOne({
      _id: taskId,
      userId: decoded.userId,
    });

    if (!task) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task not found' 
        }, 
        { status: 404 }
      );
    }

    // Get assignment suggestions
    const suggestions = await findSuitableTeamMembers(task, decoded.userId);

    return NextResponse.json({
      success: true,
      data: {
        task: {
          id: task._id,
          title: task.title,
          skillsRequired: task.skillsRequired || [],
          estimatedHours: task.estimatedHours,
          priority: task.priority,
        },
        suggestions: suggestions.map(member => ({
          id: member._id,
          name: member.name,
          email: member.email,
          role: member.role,
          department: member.department,
          suitabilityScore: member.suitabilityScore,
          skillsMatch: member.skillsMatch,
          workloadScore: member.workloadScore,
          performanceScore: member.performanceScore,
          currentWorkload: member.currentWorkload,
          recentActivity: member.recentActivity,
          status: member.status,
          skills: member.skills || [],
        })),
        recommendation: suggestions.length > 0 
          ? `Recommended: ${suggestions[0].name} (Score: ${suggestions[0].suitabilityScore}%)`
          : 'No recommendations available',
      },
      message: `Found ${suggestions.length} suitable team members`,
    });

  } catch (error: any) {
    console.error('Get assignment suggestions error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      }, 
      { status: 500 }
    );
  }
}

// Optional: DELETE endpoint to unassign a task
export async function DELETE(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task ID is required' 
        }, 
        { status: 400 }
      );
    }

    // Get the task
    const task = await TeamTask.findOne({
      _id: taskId,
      userId: decoded.userId,
    });

    if (!task) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task not found' 
        }, 
        { status: 404 }
      );
    }

    if (!task.assignedToId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task is not assigned to anyone' 
        }, 
        { status: 400 }
      );
    }

    // Get previous assigned member
    const previousMember = await TeamMember.findById(task.assignedToId);

    // Update task to remove assignment
    const updatedTask = await TeamTask.findByIdAndUpdate(
      taskId,
      {
        $unset: { assignedToId: "", assignedToName: "" },
        status: 'todo',
        updatedAt: new Date(),
      },
      { new: true }
    );

    // Update previous member's workload
    if (previousMember) {
      await TeamMember.findByIdAndUpdate(
        task.assignedToId,
        {
          $pull: { teamTasks: taskId },
          $inc: { 
            currentWorkload: task.estimatedHours ? -(task.estimatedHours / 40) * 100 : -10 
          },
        }
      );
    }

    // Log unassignment activity
    if (previousMember) {
      const TeamActivity = mongoose.model('TeamActivity');
      const activity = new TeamActivity({
        userId: new mongoose.Types.ObjectId(decoded.userId),
        teamMemberId: previousMember._id,
        type: 'team_task',
        action: 'unassigned',
        description: `Task "${task.title}" was unassigned from ${previousMember.name}`,
        teamTaskId: task._id,
        metadata: {
          points: 1,
          taskTitle: task.title,
          previousAssignee: previousMember.name,
        },
      });
      await activity.save();
    }

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: `Task "${task.title}" unassigned from ${previousMember?.name || 'previous assignee'}`,
    });

  } catch (error: any) {
    console.error('Unassign task error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      }, 
      { status: 500 }
    );
  }
}