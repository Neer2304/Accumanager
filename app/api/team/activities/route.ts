// app/api/team/activities/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TeamActivity from '@/models/TeamActivity';
import TeamMember from '@/models/TeamMember';
import { verifyToken } from '@/lib/jwt';

// GET - Get team activities with filters
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Parse query parameters
      const { searchParams } = new URL(request.url);
      const type = searchParams.get('type') || '';
      const teamMemberId = searchParams.get('teamMemberId') || '';
      const projectId = searchParams.get('projectId') || '';
      const startDate = searchParams.get('startDate') || '';
      const endDate = searchParams.get('endDate') || '';
      const isImportant = searchParams.get('isImportant');
      const sortBy = searchParams.get('sortBy') || 'createdAt';
      const sortOrder = searchParams.get('sortOrder') || 'desc';
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '50');

      // Build filter
      const filter: any = { userId: decoded.userId };
      
      if (type && type !== 'all') {
        filter.type = type;
      }
      
      if (teamMemberId) {
        filter.teamMemberId = teamMemberId;
      }
      
      if (projectId) {
        filter.projectId = projectId;
      }
      
      if (isImportant && isImportant !== 'all') {
        filter.isImportant = isImportant === 'true';
      }
      
      // Date range filter
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
          filter.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          filter.createdAt.$lte = new Date(endDate);
        }
      }

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Get total count
      const total = await TeamActivity.countDocuments(filter);

      // Get activities with pagination
      const activities = await TeamActivity.find(filter)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .populate('teamMemberId', 'name email role avatar')
        .lean();

      // Get activity statistics
      const activityStats = await TeamActivity.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalPoints: { $sum: '$metadata.points' },
          },
        },
      ]);

      // Get recent active team members
      const activeTeamMembers = await TeamMember.find({
        userId: decoded.userId,
        status: 'active',
        lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
      })
      .sort({ lastActive: -1 })
      .limit(5)
      .lean();

      return NextResponse.json({
        success: true,
        data: {
          activities,
          statistics: {
            totalActivities: total,
            activityStats,
            activeTeamMembers: activeTeamMembers.length,
          },
          activeTeamMembers,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Get team activities error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create team activity (usually called from other services)
export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      const body = await request.json();
      
      // Validate required fields
      if (!body.type || !body.action || !body.description) {
        return NextResponse.json(
          { error: 'Type, action, and description are required' },
          { status: 400 }
        );
      }

      // Create new activity
      const activity = new TeamActivity({
        ...body,
        userId: decoded.userId,
        metadata: {
          points: body.points || 0,
          priority: body.priority || 'medium',
          tags: body.tags || [],
          ...body.metadata,
        },
      });

      await activity.save();

      // If activity is associated with a team member, update their lastActive
      if (body.teamMemberId) {
        await TeamMember.findByIdAndUpdate(body.teamMemberId, {
          lastActive: new Date(),
        });
      }

      return NextResponse.json({
        success: true,
        data: activity,
      }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Create team activity error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}