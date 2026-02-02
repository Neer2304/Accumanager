import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TeamProject from '@/models/TeamProject';
import { verifyToken } from '@/lib/jwt';

// GET - Get all team projects for the user
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      const { searchParams } = new URL(request.url);
      const status = searchParams.get('status') || 'active';
      const limit = parseInt(searchParams.get('limit') || '50');

      const filter: any = { userId: decoded.userId };
      
      if (status && status !== 'all') {
        filter.status = status;
      }

      const projects = await TeamProject.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return NextResponse.json({
        success: true,
        projects,
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Get team projects error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new team project
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
      
      if (!body.name) {
        return NextResponse.json(
          { error: 'Project name is required' },
          { status: 400 }
        );
      }

      const project = new TeamProject({
        ...body,
        userId: decoded.userId,
        progress: 0,
        hoursSpent: 0,
      });

      await project.save();

      return NextResponse.json({
        success: true,
        project,
      }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Create team project error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}