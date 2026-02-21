// app/api/admin/users/stats/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    
    const totalUsers = await User.countDocuments();
    
    return NextResponse.json({
      success: true,
      totalUsers
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      totalUsers: 0
    });
  }
}