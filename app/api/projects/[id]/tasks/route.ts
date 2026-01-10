// app/api/projects/[id]/tasks/route.ts - WITH REAL ProjectTask model
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/models/Project';
import ProjectTask from '@/models/ProjectTask';
import ProjectUpdate from '@/models/ProjectUpdate';
import { verifyToken } from '@/lib/jwt';

// GET all project tasks
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔍 GET /api/projects/[id]/tasks - Project ID:', id);
    
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
      }).lean();
      
      if (!project) {
        return NextResponse.json({ 
          success: false,
          error: 'Project not found or access denied' 
        }, { status: 404 });
      }
      
      // Get query parameters
      const { searchParams } = new URL(request.url);
      const status = searchParams.get('status');
      const priority = searchParams.get('priority');
      const assignedTo = searchParams.get('assignedTo');
      const search = searchParams.get('search');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '50');
      const skip = (page - 1) * limit;
      
      // Build query
      const query: any = { 
        projectId: id, 
        userId: decoded.userId,
        isArchived: false,
      };
      
      if (status && status !== 'all') {
        query.status = status;
      }
      
      if (priority && priority !== 'all') {
        query.priority = priority;
      }
      
      if (assignedTo && assignedTo !== 'all') {
        query.assignedToId = assignedTo;
      }
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ];
      }
      
      // Get tasks with pagination
      const tasks = await ProjectTask.find(query)
        .sort({ priority: -1, dueDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      
      // Get total count for pagination
      const total = await ProjectTask.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      
      // Calculate statistics
      const statsQuery = { projectId: id, userId: decoded.userId, isArchived: false };
      const taskStats = {
        total: await ProjectTask.countDocuments(statsQuery),
        not_started: await ProjectTask.countDocuments({ ...statsQuery, status: 'not_started' }),
        in_progress: await ProjectTask.countDocuments({ ...statsQuery, status: 'in_progress' }),
        in_review: await ProjectTask.countDocuments({ ...statsQuery, status: 'in_review' }),
        completed: await ProjectTask.countDocuments({ ...statsQuery, status: 'completed' }),
        blocked: await ProjectTask.countDocuments({ ...statsQuery, status: 'blocked' }),
        cancelled: await ProjectTask.countDocuments({ ...statsQuery, status: 'cancelled' }),
      };
      
      // Update project with latest stats
      await Project.findByIdAndUpdate(id, {
        'projectTaskStats.total': taskStats.total,
        'projectTaskStats.not_started': taskStats.not_started,
        'projectTaskStats.in_progress': taskStats.in_progress,
        'projectTaskStats.in_review': taskStats.in_review,
        'projectTaskStats.completed': taskStats.completed,
        'projectTaskStats.blocked': taskStats.blocked,
        'projectTaskStats.cancelled': taskStats.cancelled,
      });
      
      console.log(`✅ Found ${tasks.length} project tasks for project ${id}`);
      
      return NextResponse.json({ 
        success: true,
        tasks,
        pagination: {
          currentPage: page,
          totalPages,
          totalTasks: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          limit,
        },
        statistics: taskStats,
      });

    } catch (authError) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get project tasks error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// CREATE new project task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔄 POST /api/projects/[id]/tasks - Creating project task');
    
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
      
      const taskData = await request.json();
      
      // Validate required fields
      if (!taskData.title?.trim()) {
        return NextResponse.json({ 
          success: false,
          error: 'Task title is required' 
        }, { status: 400 });
      }
      
      // Get user info (you may want to fetch from your User model)
      const userResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/user`, {
        headers: { Cookie: `auth_token=${authToken}` },
      });
      
      let userName = 'User';
      let userEmail = '';
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        userName = userData.name || userData.email?.split('@')[0] || 'User';
        userEmail = userData.email || '';
      }
      
      // Create the project task
      const projectTask = new ProjectTask({
        title: taskData.title.trim(),
        description: taskData.description?.trim() || '',
        status: taskData.status || 'not_started',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        estimatedHours: taskData.estimatedHours || 0,
        projectId: id,
        projectName: project.name,
        assignedToId: taskData.assignedToId || null,
        assignedToName: taskData.assignedToName || '',
        assignedToEmail: taskData.assignedToEmail || '',
        createdById: decoded.userId,
        createdByName: userName,
        userId: decoded.userId,
        taskType: taskData.taskType || 'feature',
        tags: taskData.tags || [],
        checkpoints: taskData.checkpoints || [],
      });
      
      await projectTask.save();
      console.log('✅ Project task created:', projectTask._id);
      
      // Add task to project's task array
      await Project.findByIdAndUpdate(id, {
        $addToSet: { projectTasks: projectTask._id }
      });
      
      // Create project update for task creation
      const projectUpdate = new ProjectUpdate({
        projectId: id,
        projectName: project.name,
        type: 'task_created',
        description: `New task "${projectTask.title}" was created`,
        userId: decoded.userId,
        user: userName,
        metadata: {
          taskId: projectTask._id,
          taskTitle: projectTask.title,
          taskStatus: projectTask.status,
        },
      });
      
      await projectUpdate.save();
      
      return NextResponse.json({ 
        success: true,
        task: projectTask
      }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create project task error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}