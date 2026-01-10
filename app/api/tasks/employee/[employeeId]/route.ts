// app/api/tasks/employee/[employeeId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import EmployeeTask from '@/models/EmployeeTask';
import Employee from '@/models/Employee';
import { verifyToken } from '@/lib/jwt';

interface Params {
  params: {
    employeeId: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      const { employeeId } = params;

      // Verify employee belongs to user
      const employee = await Employee.findOne({
        _id: employeeId,
        userId: decoded.userId
      });

      if (!employee) {
        return NextResponse.json(
          { error: 'Employee not found or access denied' },
          { status: 404 }
        );
      }

      // Get tasks for this employee
      const tasks = await EmployeeTask.find({
        assignedTo: employeeId,
        userId: decoded.userId
      })
      .sort({ dueDate: 1, priority: -1 })
      .lean();

      // Calculate stats
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
      const pendingTasks = tasks.filter(t => t.status === 'assigned').length;

      // Format tasks
      const formattedTasks = tasks.map(task => ({
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
      }));

      return NextResponse.json({
        employee: {
          name: employee.name,
          role: employee.role,
          department: employee.department
        },
        stats: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          pendingTasks,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        },
        tasks: formattedTasks
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get employee tasks error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}