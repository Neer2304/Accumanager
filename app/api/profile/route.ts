// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
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

    // Fetch actual user from database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userProfile = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      businessName: user.businessName,
      gstNumber: user.gstNumber,
      businessAddress: user.businessAddress,
      createdAt: user.createdAt,
      isActive: user.isActive,
      preferences: user.preferences,
      subscription: user.subscription,
      usage: user.usage
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    
    // Update user in database with only the provided fields
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { 
        $set: {
          ...(body.name && { name: body.name }),
          ...(body.email && { email: body.email }),
          ...(body.phone && { phone: body.phone }),
          ...(body.businessName && { businessName: body.businessName }),
          ...(body.gstNumber !== undefined && { gstNumber: body.gstNumber }),
          ...(body.businessAddress !== undefined && { businessAddress: body.businessAddress }),
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
      gstNumber: updatedUser.gstNumber,
      businessAddress: updatedUser.businessAddress,
      createdAt: updatedUser.createdAt,
      isActive: updatedUser.isActive,
      preferences: updatedUser.preferences,
      subscription: updatedUser.subscription,
      usage: updatedUser.usage
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}