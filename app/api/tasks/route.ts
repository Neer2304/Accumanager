// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Task from '@/models/Task';
import Project from '@/models/Project';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose'; // ADD THIS IMPORT

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/tasks - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const { searchParams } = new URL(request.url);
      const projectId = searchParams.get('projectId');
      const status = searchParams.get('status');
      const assignedTo = searchParams.get('assignedTo');
      
      let query: any = { userId: decoded.userId };
      
      if (projectId) {
        query.projectId = projectId;
      }
      
      if (status && status !== 'all') {
        query.status = status;
      }
      
      if (assignedTo) {
        query.assignedTo = assignedTo;
      }

      const tasks = await Task.find(query)
        .sort({ dueDate: 1, priority: -1, createdAt: -1 })
        .lean();

      console.log(`✅ Found ${tasks.length} tasks for user ${decoded.userId}`);
      return NextResponse.json({ tasks });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get tasks error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/tasks - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const taskData = await request.json();

      // Validate required fields
      if (!taskData.title || !taskData.projectId) {
        return NextResponse.json(
          { error: 'Task title and project ID are required' },
          { status: 400 }
        );
      }

      // Get project details
      const project = await Project.findOne({ 
        _id: taskData.projectId, 
        userId: decoded.userId 
      });

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }

      const task = new Task({
        ...taskData,
        projectName: project.name,
        createdBy: decoded.userId,
        createdByName: decoded.name || 'You',
        userId: decoded.userId,
      });

      await task.save();

      // Update project task counts
      await updateProjectTaskCounts(taskData.projectId);

      console.log('✅ Task created:', task._id);
      return NextResponse.json(task, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create task error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const updateData = await request.json();
      const { taskId, ...updateFields } = updateData;

      if (!taskId) {
        return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
      }

      // Verify the task belongs to the user
      const existingTask = await Task.findOne({ 
        _id: taskId, 
        userId: decoded.userId 
      });

      if (!existingTask) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }

      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { ...updateFields, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      // Update project task counts if status changed
      if (updateFields.status) {
        await updateProjectTaskCounts(existingTask.projectId);
      }

      return NextResponse.json(updatedTask);

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Update task error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const { searchParams } = new URL(request.url);
      const taskId = searchParams.get('id');

      if (!taskId) {
        return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
      }

      // Verify the task belongs to the user
      const existingTask = await Task.findOne({ 
        _id: taskId, 
        userId: decoded.userId 
      });

      if (!existingTask) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }

      await Task.findByIdAndDelete(taskId);

      // Update project task counts
      await updateProjectTaskCounts(existingTask.projectId);

      return NextResponse.json({ 
        success: true, 
        message: 'Task deleted successfully' 
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Delete task error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update project task counts
async function updateProjectTaskCounts(projectId: string) {
  try {
    const taskCounts = await Task.aggregate([
      { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const counts = {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      blockedTasks: 0
    };

    taskCounts.forEach(item => {
      counts.totalTasks += item.count;
      if (item._id === 'completed') counts.completedTasks = item.count;
      if (item._id === 'in_progress') counts.inProgressTasks = item.count;
      if (item._id === 'blocked') counts.blockedTasks = item.count;
    });

    // Calculate progress percentage
    const progress = counts.totalTasks > 0 ? (counts.completedTasks / counts.totalTasks) * 100 : 0;

    await Project.findByIdAndUpdate(projectId, {
      ...counts,
      progress: Math.round(progress)
    });
  } catch (error) {
    console.error('Error updating project task counts:', error);
  }
}