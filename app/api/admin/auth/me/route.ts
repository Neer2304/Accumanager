import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 ADMIN ME - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('❌ No auth token found');
      return NextResponse.json({ 
        message: 'Unauthorized - No token' 
      }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
      console.log('✅ Token verified successfully');
      console.log('   User ID:', decoded.userId);
      console.log('   User Role:', decoded.role);
      console.log('   User Email:', decoded.email);
    } catch (authError) {
      console.log('❌ Invalid token:', authError);
      return NextResponse.json({ 
        message: 'Invalid token' 
      }, { status: 401 });
    }

    // Check if user is admin - FIXED: Check decoded role first
    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      console.log('❌ User role not admin:', decoded.role);
      console.log('   Available roles in token:', Object.keys(decoded));
      
      // Let's check the database anyway to be sure
      await connectToDatabase();
      const user = await User.findById(decoded.userId).select('role email');
      
      if (user) {
        console.log('   Database user role:', user.role);
        console.log('   Database user email:', user.email);
        
        if (['admin', 'superadmin'].includes(user.role)) {
          // User is admin in DB but token doesn't have role
          // Return success with user info
          return NextResponse.json({
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              shopName: user.shopName,
              createdAt: user.createdAt
            }
          });
        }
      }
      
      return NextResponse.json({ 
        message: 'Insufficient permissions. User role: ' + (decoded.role || 'none') 
      }, { status: 403 });
    }

    await connectToDatabase();

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      console.log('❌ User not found in database');
      return NextResponse.json({ 
        message: 'User not found' 
      }, { status: 404 });
    }

    console.log('✅ Admin profile fetched:', user.email, 'Role:', user.role);

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopName: user.shopName,
        createdAt: user.createdAt
      }
    });

  } catch (error: any) {
    console.error('❌ Get admin profile error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}