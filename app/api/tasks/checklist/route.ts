import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Task from '@/models/Task';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      const body = await request.json();
      const { taskId, checklistItems } = body;

      if (!taskId || !checklistItems || !Array.isArray(checklistItems)) {
        return NextResponse.json(
          { error: 'Task ID and checklist items are required' },
          { status: 400 }
        );
      }

      // Find task
      const task = await Task.findOne({
        _id: taskId,
        userId: decoded.userId
      });

      if (!task) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }

      // Add checklist items
      const itemsWithIds = checklistItems.map((item, index) => ({
        _id: new mongoose.Types.ObjectId(),
        description: item.description,
        isCompleted: false,
        order: index
      }));

      task.checklist = itemsWithIds;
      await task.save();

      return NextResponse.json({
        success: true,
        message: 'Checklist added successfully',
        task: {
          _id: task._id,
          checklist: task.checklist,
          totalChecklistItems: task.totalChecklistItems,
          completedChecklistItems: task.completedChecklistItems,
          progress: task.progress,
          status: task.status
        }
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Checklist error:', error);
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

      const body = await request.json();
      const { taskId, itemId, isCompleted } = body;

      if (!taskId || !itemId || typeof isCompleted !== 'boolean') {
        return NextResponse.json(
          { error: 'Task ID, item ID, and completion status are required' },
          { status: 400 }
        );
      }

      // Find task
      const task = await Task.findOne({
        _id: taskId,
        userId: decoded.userId
      });

      if (!task) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }

      // Find and update checklist item
      const checklistItem = task.checklist.id(itemId);
      if (!checklistItem) {
        return NextResponse.json(
          { error: 'Checklist item not found' },
          { status: 404 }
        );
      }

      // Update item
      checklistItem.isCompleted = isCompleted;
      if (isCompleted) {
        checklistItem.completedBy = decoded.name || 'Employee';
        checklistItem.completedAt = new Date();
      } else {
        checklistItem.completedBy = undefined;
        checklistItem.completedAt = undefined;
      }

      await task.save();

      // Create update record
      const update = {
        employeeId: decoded.userId,
        employeeName: decoded.name || 'Employee',
        description: isCompleted 
          ? `Marked "${checklistItem.description}" as completed`
          : `Marked "${checklistItem.description}" as incomplete`,
        hoursWorked: 0,
        progress: task.progress,
        completedItems: [itemId],
        createdAt: new Date()
      };

      task.updates.push(update);
      await task.save();

      return NextResponse.json({
        success: true,
        message: isCompleted ? 'Item marked as completed' : 'Item marked as incomplete',
        task: {
          _id: task._id,
          checklist: task.checklist,
          totalChecklistItems: task.totalChecklistItems,
          completedChecklistItems: task.completedChecklistItems,
          progress: task.progress,
          status: task.status
        }
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Update checklist error:', error);
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
      const taskId = searchParams.get('taskId');
      const itemId = searchParams.get('itemId');

      if (!taskId || !itemId) {
        return NextResponse.json(
          { error: 'Task ID and item ID are required' },
          { status: 400 }
        );
      }

      // Find task
      const task = await Task.findOne({
        _id: taskId,
        userId: decoded.userId
      });

      if (!task) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }

      // Remove checklist item
      task.checklist = task.checklist.filter(item => item._id.toString() !== itemId);
      await task.save();

      return NextResponse.json({
        success: true,
        message: 'Checklist item removed',
        task: {
          _id: task._id,
          checklist: task.checklist
        }
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Delete checklist item error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}