// app/api/tasks/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import EmployeeTask from '@/models/EmployeeTask';
import { verifyToken } from '@/lib/jwt';

export async function PUT(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      const body = await request.json();
      const {
        taskId,
        progress,
        hoursWorked,
        description,
        status,
        attachments = []
      } = body;

      if (!taskId) {
        return NextResponse.json(
          { error: 'Task ID is required' },
          { status: 400 }
        );
      }

      // Find the task
      const task = await EmployeeTask.findOne({
        _id: taskId,
        assignedTo: decoded.userId // Employee can only update their own tasks
      });

      if (!task) {
        return NextResponse.json(
          { error: 'Task not found or access denied' },
          { status: 404 }
        );
      }

      // Create update record
      const update = {
        employeeId: decoded.userId,
        employeeName: decoded.name || 'Employee',
        description: description || `Progress updated to ${progress}%`,
        hoursWorked: hoursWorked || 0,
        progress: progress || task.progress,
        attachments: attachments,
        createdAt: new Date()
      };

      // Add to updates array
      task.updates.push(update);

      // Update task fields
      if (progress !== undefined) {
        task.progress = Math.min(100, Math.max(0, progress));
        if (task.progress >= 100) {
          task.status = 'completed';
        } else if (task.progress > 0) {
          task.status = 'in_progress';
        }
      }

      if (status) {
        task.status = status;
      }

      if (hoursWorked) {
        task.actualHours = (task.actualHours || 0) + hoursWorked;
      }

      await task.save();

      return NextResponse.json({
        success: true,
        message: 'Task updated successfully',
        task: {
          _id: task._id.toString(),
          title: task.title,
          status: task.status,
          progress: task.progress,
          actualHours: task.actualHours,
          lastUpdate: update.createdAt
        }
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Update task error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}