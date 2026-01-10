// app/api/tasks/assign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import EmployeeTask from '@/models/EmployeeTask';
import Employee from '@/models/Employee';
import { verifyToken } from '@/lib/jwt';
import { PaymentService } from '@/services/paymentService';

export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Check subscription
      const subscription = await PaymentService.checkSubscription(decoded.userId);
      if (!subscription.isActive) {
        return NextResponse.json(
          { error: 'Please upgrade your subscription to assign tasks' },
          { status: 402 }
        );
      }

      const body = await request.json();
      const {
        title,
        description,
        assignedTo,
        dueDate,
        estimatedHours,
        priority,
        projectId,
        projectName,
        category
      } = body;

      // Validate required fields
      if (!title || !assignedTo || !dueDate) {
        return NextResponse.json(
          { error: 'Title, assigned employee, and due date are required' },
          { status: 400 }
        );
      }

      // Check if employee exists and belongs to user
      const employee = await Employee.findOne({
        _id: assignedTo,
        userId: decoded.userId
      });

      if (!employee) {
        return NextResponse.json(
          { error: 'Employee not found or access denied' },
          { status: 404 }
        );
      }

      // Create task
      const task = new EmployeeTask({
        title,
        description: description || '',
        assignedTo,
        assignedToName: employee.name,
        assignedBy: decoded.userId,
        assignedByName: decoded.name || 'Manager',
        userId: decoded.userId,
        dueDate: new Date(dueDate),
        estimatedHours: estimatedHours || 0,
        priority: priority || 'medium',
        projectId: projectId || null,
        projectName: projectName || '',
        category: category || 'daily',
        status: 'assigned',
        progress: 0,
        actualHours: 0
      });

      await task.save();

      return NextResponse.json({
        success: true,
        message: 'Task assigned successfully',
        task: {
          _id: task._id.toString(),
          title: task.title,
          assignedToName: task.assignedToName,
          dueDate: task.dueDate,
          status: task.status,
          priority: task.priority
        }
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Assign task error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}