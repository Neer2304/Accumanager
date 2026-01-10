// app/api/activities/team/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/models/Project';
import Task from '@/models/Task';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Get recent project updates
      const recentProjects = await Project.find({ userId: decoded.userId })
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean();

      // Transform into activities
      const activities = recentProjects.map(project => ({
        _id: project._id.toString(),
        userId: project.userId,
        userName: 'You', // Or get actual user name
        type: 'project_update' as const,
        description: `Updated project: ${project.name}`,
        projectId: project._id.toString(),
        projectName: project.name,
        timestamp: project.updatedAt,
        metadata: {
          progress: project.progress,
          status: project.status
        }
      }));

      return NextResponse.json({ activities });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get team activities error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}