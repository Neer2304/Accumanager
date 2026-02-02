import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
import TeamProject from '@/models/TeamProject';
import TeamTask from '@/models/TeamTask';
import { verifyToken } from '@/lib/jwt';

// GET - Get single team member with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Get team member
      const teamMember = await TeamMember.findOne({
        _id: id,
        userId: decoded.userId,
      });

      if (!teamMember) {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        );
      }

      // Get team projects
      const teamProjects = await TeamProject.find({
        _id: { $in: teamMember.teamProjects || [] },
      })
      .select('name description status priority progress startDate deadline category tags assignedTeamMembers')
      .lean();

      // Get team tasks
      const teamTasks = await TeamTask.find({
        _id: { $in: teamMember.teamTasks || [] },
      })
      .select('title description status priority dueDate estimatedHours actualHours progress teamProjectId assignedToId assignedToName')
      .lean();

      // Format response
      const response = {
        ...teamMember.toObject(),
        teamProjects,
        teamTasks,
      };

      return NextResponse.json({
        success: true,
        data: response,
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Get team member error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update team member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      const body = await request.json();

      // Find and update team member
      const teamMember = await TeamMember.findOneAndUpdate(
        { 
          _id: id,
          userId: decoded.userId 
        },
        { 
          ...body,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!teamMember) {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: teamMember,
        message: 'Team member updated successfully',
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Update team member error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Get team member first
      const teamMember = await TeamMember.findOne({
        _id: id,
        userId: decoded.userId,
      });

      if (!teamMember) {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        );
      }

      // Remove member from all team projects
      await TeamProject.updateMany(
        { 
          userId: decoded.userId, 
          assignedTeamMembers: id 
        },
        { $pull: { assignedTeamMembers: id } }
      );

      // Unassign all team tasks from this member
      await TeamTask.updateMany(
        { 
          userId: decoded.userId, 
          assignedToId: id 
        },
        { 
          $unset: { 
            assignedToId: "", 
            assignedToName: "" 
          } 
        }
      );

      // Delete the team member
      await TeamMember.findByIdAndDelete(id);

      return NextResponse.json({
        success: true,
        message: 'Team member removed successfully',
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Delete team member error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}