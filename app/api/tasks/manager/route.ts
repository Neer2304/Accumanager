// app/api/tasks/manager/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import EmployeeTask from '@/models/EmployeeTask';
import Employee from '@/models/Employee';
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

      // Get all employees for this user
      const employees = await Employee.find({
        userId: decoded.userId,
        isActive: true
      });

      // Get all tasks for these employees
      const tasks = await EmployeeTask.find({
        userId: decoded.userId
      })
      .sort({ dueDate: 1, priority: -1 })
      .lean();

      // Group tasks by employee
      const tasksByEmployee = employees.map(employee => {
        const employeeTasks = tasks.filter(t => t.assignedTo.toString() === employee._id.toString());
        
        const stats = {
          total: employeeTasks.length,
          completed: employeeTasks.filter(t => t.status === 'completed').length,
          inProgress: employeeTasks.filter(t => t.status === 'in_progress').length,
          pending: employeeTasks.filter(t => t.status === 'assigned').length,
          overdue: employeeTasks.filter(t => 
            t.status !== 'completed' && 
            new Date(t.dueDate) < new Date()
          ).length
        };

        return {
          employee: {
            _id: employee._id.toString(),
            name: employee.name,
            role: employee.role,
            department: employee.department
          },
          stats,
          recentTasks: employeeTasks.slice(0, 5).map(t => ({
            _id: t._id.toString(),
            title: t.title,
            status: t.status,
            progress: t.progress,
            dueDate: t.dueDate,
            priority: t.priority
          }))
        };
      });

      // Overall stats
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const overdueTasks = tasks.filter(t => 
        t.status !== 'completed' && 
        new Date(t.dueDate) < new Date()
      ).length;

      return NextResponse.json({
        summary: {
          totalEmployees: employees.length,
          totalTasks,
          completedTasks,
          overdueTasks,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        },
        employees: tasksByEmployee,
        recentActivities: tasks.slice(0, 10).map(t => ({
          _id: t._id.toString(),
          title: t.title,
          employeeName: t.assignedToName,
          status: t.status,
          progress: t.progress,
          updatedAt: t.updatedAt
        }))
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get manager tasks error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}