// app/api/projects/[id]/tasks/[taskId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/models/Project';
import ProjectTask from '@/models/ProjectTask';
import ProjectUpdate from '@/models/ProjectUpdate';
import { verifyToken } from '@/lib/jwt';

// GET single project task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId } = await params;
    
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
      
      // Get the project task
      const task = await ProjectTask.findOne({
        _id: taskId,
        projectId: id,
        userId: decoded.userId,
      }).lean();
      
      if (!task) {
        return NextResponse.json({ 
          success: false,
          error: 'Task not found' 
        }, { status: 404 });
      }
      
      return NextResponse.json({ 
        success: true,
        task
      });

    } catch (authError) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get single task error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// UPDATE project task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId } = await params;
    
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
      
      const updateData = await request.json();
      
      // Get current task
      const currentTask = await ProjectTask.findOne({
        _id: taskId,
        projectId: id,
        userId: decoded.userId,
      });
      
      if (!currentTask) {
        return NextResponse.json({ 
          success: false,
          error: 'Task not found' 
        }, { status: 404 });
      }
      
      // Track changes for activity log
      const changes: any = {};
      Object.keys(updateData).forEach(key => {
        if (JSON.stringify(currentTask[key]) !== JSON.stringify(updateData[key])) {
          changes[key] = {
            from: currentTask[key],
            to: updateData[key],
          };
        }
      });
      
      // Update the task
      const updatedTask = await ProjectTask.findOneAndUpdate(
        { _id: taskId, projectId: id, userId: decoded.userId },
        {
          ...updateData,
          updatedAt: new Date(),
          $push: {
            activityLog: {
              userId: decoded.userId,
              userName: 'User', // Fetch actual user name
              action: 'updated',
              details: changes,
              timestamp: new Date(),
            },
          },
        },
        { new: true }
      );
      
      // Create project update if status changed
      if (updateData.status && updateData.status !== currentTask.status) {
        const projectUpdate = new ProjectUpdate({
          projectId: id,
          projectName: project.name,
          type: 'task_status_change',
          description: `Task "${currentTask.title}" status changed from ${currentTask.status} to ${updateData.status}`,
          userId: decoded.userId,
          user: 'User', // Fetch actual user name
          metadata: {
            taskId: taskId,
            taskTitle: currentTask.title,
            oldStatus: currentTask.status,
            newStatus: updateData.status,
          },
        });
        
        await projectUpdate.save();
      }
      
      return NextResponse.json({ 
        success: true,
        task: updatedTask
      });

    } catch (authError) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Update task error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// DELETE project task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId } = await params;
    
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
      
      // Soft delete - mark as archived
      const result = await ProjectTask.findOneAndUpdate(
        { _id: taskId, projectId: id, userId: decoded.userId },
        { 
          isArchived: true,
          updatedAt: new Date(),
        }
      );
      
      if (!result) {
        return NextResponse.json({ 
          success: false,
          error: 'Task not found' 
        }, { status: 404 });
      }
      
      // Create project update
      const projectUpdate = new ProjectUpdate({
        projectId: id,
        projectName: project.name,
        type: 'task_deleted',
        description: `Task "${result.title}" was deleted`,
        userId: decoded.userId,
        user: 'User', // Fetch actual user name
        metadata: {
          taskId: taskId,
          taskTitle: result.title,
        },
      });
      
      await projectUpdate.save();
      
      return NextResponse.json({ 
        success: true,
        message: 'Task deleted successfully'
      });

    } catch (authError) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Delete task error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}