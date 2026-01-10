// app/api/tasks/employee/current/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import EmployeeTask from '@/models/EmployeeTask';
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

      // Assuming the user ID is the same as employee ID for simplicity
      // In real app, you'd have a relationship between User and Employee
      const tasks = await EmployeeTask.find({
        assignedTo: decoded.userId
      })
      .sort({ dueDate: 1, priority: -1 })
      .lean();

      return NextResponse.json({
        tasks: tasks.map(task => ({
          _id: task._id.toString(),
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          estimatedHours: task.estimatedHours,
          actualHours: task.actualHours,
          progress: task.progress,
          category: task.category,
          projectName: task.projectName,
          assignedAt: task.createdAt,
          updates: task.updates || []
        }))
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get current employee tasks error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}