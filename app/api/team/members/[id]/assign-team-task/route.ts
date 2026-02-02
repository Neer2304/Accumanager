import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
import TeamTask from '@/models/TeamTask';
import { verifyToken } from '@/lib/jwt';
import { NotificationService } from '@/services/notificationService';
import { TeamActivityHooks } from '@/hooks/teamActivityHooks';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: memberId } = await params;
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();
      
      const { teamTaskId } = await request.json();
      
      if (!teamTaskId) {
        return NextResponse.json(
          { error: 'Team Task ID is required' },
          { status: 400 }
        );
      }

      // Verify team member exists and belongs to user
      const teamMember = await TeamMember.findOne({
        _id: memberId,
        userId: decoded.userId,
      });

      if (!teamMember) {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        );
      }

      // Verify team task exists and belongs to user
      const teamTask = await TeamTask.findOne({
        _id: teamTaskId,
        userId: decoded.userId,
      });

      if (!teamTask) {
        return NextResponse.json(
          { error: 'Team task not found' },
          { status: 404 }
        );
      }

      // Check if already assigned
      if (teamMember.teamTasks?.includes(teamTaskId)) {
        return NextResponse.json(
          { error: 'Team task already assigned to this team member' },
          { status: 400 }
        );
      }

      // Update team member - add team task assignment
      const updatedMember = await TeamMember.findByIdAndUpdate(
        memberId,
        {
          $addToSet: { teamTasks: teamTaskId },
          lastActive: new Date(),
        },
        { new: true }
      );

      // Update team task - assign to team member
      const updatedTask = await TeamTask.findByIdAndUpdate(
        teamTaskId,
        {
          assignedToId: memberId,
          assignedToName: teamMember.name,
        },
        { new: true }
      );

      // Create notification
      try {
        await NotificationService.createNotification(
          decoded.userId,
          'Team Task Assignment 📝',
          `${teamMember.name} has been assigned to team task "${teamTask.title}".`,
          'info',
          {
            actionUrl: `/team/members/${memberId}`,
            metadata: {
              teamMemberId: teamMember._id.toString(),
              teamMemberName: teamMember.name,
              teamTaskId: teamTask._id.toString(),
              teamTaskTitle: teamTask.title,
              event: 'team_task_assigned',
            },
          }
        );
      } catch (notifError) {
        console.error('Failed to create notification:', notifError);
      }

      // Log team activity
      try {
        await TeamActivityHooks.onTeamTaskAssigned(
          teamTask,
          teamMember,
          decoded.userId
        );
      } catch (activityError) {
        console.error('Failed to log team activity:', activityError);
      }

      return NextResponse.json({
        success: true,
        data: {
          teamMember: updatedMember,
          teamTask: updatedTask,
        },
        message: 'Team task assigned successfully',
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Assign team task error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}