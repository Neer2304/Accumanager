// app/api/notifications/generate/route.ts
import { NextResponse } from 'next/server';
import { NotificationService } from '@/services/notificationService';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/models/Project';
import Sale from '@/models/Order';
import Employee from '@/models/Employee';

// This endpoint can be called by a cron job or triggered manually
export async function GET(request) {
  try {
    await connectToDatabase();
    
    // 1. Check for delayed projects
    const delayedProjects = await Project.find({
      deadline: { $lt: new Date() },
      status: { $in: ['active', 'planning'] }
    });

    for (const project of delayedProjects) {
      await NotificationService.notifyProjectDelayed(project, project.userId);
    }

    // 2. Check for today's work anniversaries
    const today = new Date();
    const employees = await Employee.find({
      joiningDate: { 
        $ne: null,
        $lt: new Date()
      }
    });

    for (const employee of employees) {
      const joinDate = new Date(employee.joiningDate);
      const years = today.getFullYear() - joinDate.getFullYear();
      
      if (today.getMonth() === joinDate.getMonth() && 
          today.getDate() === joinDate.getDate()) {
        await NotificationService.notifyEmployeeAnniversary(employee, years);
      }
    }

    // 3. Generate daily summary notification
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const dailySales = await Sale.countDocuments({
      createdAt: { $gte: yesterday }
    });

    const totalAmount = await Sale.aggregate([
      {
        $match: { createdAt: { $gte: yesterday } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Create summary notification for all active users
    // You'll need to get all active user IDs here

    return NextResponse.json({
      success: true,
      message: `Generated notifications: ${delayedProjects.length} delayed projects, ${employees.length} employees checked`,
      data: {
        delayedProjects: delayedProjects.length,
        employeesChecked: employees.length,
        dailySales,
        totalAmount: totalAmount[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('❌ Error generating notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate notifications' },
      { status: 500 }
    );
  }
}