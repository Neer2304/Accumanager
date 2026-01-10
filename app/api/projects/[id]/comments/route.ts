// app/api/projects/[id]/comments/route.ts - UPDATED with real data
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Project from '@/models/Project';
import { verifyToken } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔍 GET /api/projects/[id]/comments - Project ID:', id);
    
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
      
      // Verify the project belongs to the user
      const project = await Project.findOne({
        _id: id,
        userId: decoded.userId,
      });
      
      if (!project) {
        return NextResponse.json({ 
          success: false,
          error: 'Project not found or access denied' 
        }, { status: 404 });
      }
      
      // Get all comments for this project
      const comments = await Comment.find({
        projectId: id,
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .lean();
      
      console.log(`✅ Found ${comments.length} comments for project ${id}`);
      
      return NextResponse.json({ 
        success: true,
        comments
      });

    } catch (authError) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get comments error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('💬 POST /api/projects/[id]/comments - Project ID:', id);
    
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
      
      // Verify the project belongs to the user
      const project = await Project.findOne({
        _id: id,
        userId: decoded.userId,
      });
      
      if (!project) {
        return NextResponse.json({ 
          success: false,
          error: 'Project not found or access denied' 
        }, { status: 404 });
      }
      
      const { text, type, taskId, attachments } = await request.json();
      
      if (!text || !text.trim()) {
        return NextResponse.json({ 
          success: false,
          error: 'Comment text is required' 
        }, { status: 400 });
      }
      
      // TODO: Get actual user name from database
      // For now, use a placeholder
      const userResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/user`, {
        headers: {
          Cookie: `auth_token=${authToken}`,
        },
      });
      
      let userName = 'You';
      let userAvatar = '';
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        userName = userData.name || userData.email?.split('@')[0] || 'User';
        userAvatar = userData.avatar || '';
      }
      
      // Create new comment
      const comment = new Comment({
        text: text.trim(),
        type: type || 'comment',
        userId: decoded.userId,
        userName,
        userAvatar,
        projectId: id,
        taskId: taskId || null,
        attachments: attachments || [],
      });
      
      await comment.save();
      
      console.log('✅ Comment created:', comment._id);
      
      // Add comment to project's comments array
      await Project.findByIdAndUpdate(id, {
        $addToSet: { comments: comment._id }
      });
      
      return NextResponse.json({ 
        success: true,
        comment
      }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create comment error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}