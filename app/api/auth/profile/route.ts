// app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET USER PROFILE - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('❌ No auth token found');
      return NextResponse.json({ 
        message: 'Authentication required' 
      }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
      console.log('✅ Token verified successfully');
      console.log('   User ID:', decoded.userId);
      console.log('   User Role:', decoded.role);
    } catch (authError) {
      console.log('❌ Invalid token:', authError);
      return NextResponse.json({ 
        message: 'Invalid or expired token' 
      }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById(decoded.userId)
      .select('-password')
      .lean();
    
    if (!user) {
      console.log('❌ User not found in database');
      return NextResponse.json({ 
        message: 'User not found' 
      }, { status: 404 });
    }

    console.log('✅ User profile fetched:', user.email, 'Role:', user.role);

    // Return user data based on role
    const responseData: any = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopName: user.shopName,
        isActive: user.isActive,
        createdAt: user.createdAt,
        subscription: {
          plan: user.subscription?.plan || 'trial',
          status: user.subscription?.status || 'trial',
          trialEndsAt: user.subscription?.trialEndsAt,
          currentPeriodEnd: user.subscription?.currentPeriodEnd,
          autoRenew: user.subscription?.autoRenew || true
        }
      }
    };

    // Add admin-specific data
    if (['admin', 'superadmin'].includes(user.role)) {
      responseData.user.usage = user.usage;
      responseData.user.screenTime = user.screenTime;
      
      // For superadmin only
      if (user.role === 'superadmin') {
        responseData.user.activityLogs = user.activityLogs?.slice(-10); // Last 10 activities
      }
    }

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('❌ Get user profile error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}