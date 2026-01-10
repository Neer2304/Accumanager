// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/models/Project';
import { verifyToken } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔍 GET /api/projects/[id] - Starting...', id);
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();
      
      const project = await Project.findOne({
        _id: id,
        userId: decoded.userId,
      }).lean();

      if (!project) {
        return NextResponse.json({ 
          success: false,
          error: 'Project not found' 
        }, { status: 404 });
      }

      console.log('✅ Project found:', project._id);
      
      return NextResponse.json({ 
        success: true,
        project 
      });

    } catch (authError) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get project error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}