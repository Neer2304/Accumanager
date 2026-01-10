import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (!decoded.role || !['superadmin', 'admin'].includes(decoded.role)) {
      return NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 });
    }

    await connectToDatabase();

    const user = await User.findById(params.id).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (decoded.role !== 'superadmin') {
      return NextResponse.json({ message: 'Only superadmin can update users' }, { status: 403 });
    }

    await connectToDatabase();

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const data = await request.json();
    const { name, email, role, shopName, isActive, subscription } = data;

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (role && ['user', 'staff', 'admin'].includes(role)) user.role = role;
    if (shopName !== undefined) user.shopName = shopName;
    if (isActive !== undefined) user.isActive = isActive;
    if (subscription) {
      if (subscription.plan) user.subscription.plan = subscription.plan;
      if (subscription.status) user.subscription.status = subscription.status;
      if (subscription.currentPeriodEnd) user.subscription.currentPeriodEnd = new Date(subscription.currentPeriodEnd);
      if (subscription.features) user.subscription.features = subscription.features;
    }

    await user.save();

    return NextResponse.json({ 
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}