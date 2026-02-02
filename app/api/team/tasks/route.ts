import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TeamTask from '@/models/TeamTask';
import { verifyToken } from '@/lib/jwt';

// GET - Get all team tasks for the user
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
      const status = searchParams.get('status') || '';
      const limit = parseInt(searchParams.get('limit') || '50');

      const filter: any = { userId: decoded.userId };
      
      if (status) {
        filter.status = { $in: status.split(',') };
      }

      const tasks = await TeamTask.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return NextResponse.json({
        success: true,
        tasks,
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Get team tasks error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new team task
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
      
      if (!body.title) {
        return NextResponse.json(
          { error: 'Task title is required' },
          { status: 400 }
        );
      }

      const task = new TeamTask({
        ...body,
        userId: decoded.userId,
        progress: 0,
        actualHours: 0,
      });

      await task.save();

      return NextResponse.json({
        success: true,
        task,
      }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Create team task error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}