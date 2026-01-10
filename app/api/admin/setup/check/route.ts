import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const adminCount = await User.countDocuments({ 
      role: { $in: ['superadmin', 'admin'] },
      isActive: true
    });

    console.log('Admin check:', {
      adminCount,
      canSetup: adminCount === 0
    });

    return NextResponse.json({ 
      adminExists: adminCount > 0,
      adminCount,
      canSetup: adminCount === 0
    });
  } catch (error: any) {
    console.error('Check admin error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}