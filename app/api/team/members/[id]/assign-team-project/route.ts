import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
import TeamProject from '@/models/TeamProject';
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
      
      const { teamProjectId } = await request.json();
      
      if (!teamProjectId) {
        return NextResponse.json(
          { error: 'Team Project ID is required' },
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

      // Verify team project exists and belongs to user
      const teamProject = await TeamProject.findOne({
        _id: teamProjectId,
        userId: decoded.userId,
      });

      if (!teamProject) {
        return NextResponse.json(
          { error: 'Team project not found' },
          { status: 404 }
        );
      }

      // Check if already assigned
      if (teamMember.teamProjects?.includes(teamProjectId)) {
        return NextResponse.json(
          { error: 'Team project already assigned to this team member' },
          { status: 400 }
        );
      }

      // Update team member - add team project assignment
      const updatedMember = await TeamMember.findByIdAndUpdate(
        memberId,
        {
          $addToSet: { teamProjects: teamProjectId },
          lastActive: new Date(),
        },
        { new: true }
      );

      // Update team project - add team member
      const updatedProject = await TeamProject.findByIdAndUpdate(
        teamProjectId,
        {
          $addToSet: { assignedTeamMembers: memberId },
        },
        { new: true }
      );

      // Create notification
      try {
        await NotificationService.createNotification(
          decoded.userId,
          'Team Project Assignment 📋',
          `${teamMember.name} has been assigned to team project "${teamProject.name}".`,
          'info',
          {
            actionUrl: `/team/members/${memberId}`,
            metadata: {
              teamMemberId: teamMember._id.toString(),
              teamMemberName: teamMember.name,
              teamProjectId: teamProject._id.toString(),
              teamProjectName: teamProject.name,
              event: 'team_project_assigned',
            },
          }
        );
      } catch (notifError) {
        console.error('Failed to create notification:', notifError);
      }

      // Log team activity
      try {
        await TeamActivityHooks.onTeamProjectAssigned(
          teamProject,
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
          teamProject: updatedProject,
        },
        message: 'Team project assigned successfully',
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Assign team project error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}