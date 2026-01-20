// app/api/setup/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ 
      role: { $in: ['superadmin', 'admin'] } 
    });
    
    return NextResponse.json({
      initialized: adminCount > 0,
      canInitialize: userCount === 0,
      stats: {
        totalUsers: userCount,
        adminUsers: adminCount,
        regularUsers: userCount - adminCount
      },
      system: {
        environment: process.env.NODE_ENV,
        masterKeyConfigured: !!process.env.SETUP_MASTER_KEY,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('Setup status error:', error);
    return NextResponse.json(
      { 
        initialized: false,
        error: error.message,
        canInitialize: false
      },
      { status: 500 }
    );
  }
}