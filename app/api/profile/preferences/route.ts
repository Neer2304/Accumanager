// app/api/profile/preferences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const cookieStore = cookies();
    const authToken = (await cookieStore).get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    
    // Update user preferences in database
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { 
        $set: {
          'preferences.emailNotifications': body.emailNotifications,
          'preferences.smsNotifications': body.smsNotifications,
          'preferences.lowStockAlerts': body.lowStockAlerts,
          'preferences.monthlyReports': body.monthlyReports,
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userProfile = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      businessName: updatedUser.businessName,
      preferences: updatedUser.preferences,
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Preferences update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}