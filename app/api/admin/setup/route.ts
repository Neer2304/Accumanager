import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Secret key that only you know
const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY || 'default-setup-key-change-this';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Check if admin already exists
    const adminCount = await User.countDocuments({ 
      role: { $in: ['superadmin', 'admin'] } 
    });

    if (adminCount > 0) {
      return NextResponse.json(
        { message: 'Admin already exists. Please login instead.' },
        { status: 400 }
      );
    }

    const { name, email, password, shopName, setupKey } = await request.json();

    // Validate setup key
    if (!setupKey || setupKey !== ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { message: 'Invalid setup key. Contact system administrator.' },
        { status: 403 }
      );
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const superAdmin = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'superadmin',
      shopName: shopName || '',
      isActive: true,
      subscription: {
        plan: 'yearly',
        status: 'active',
        trialEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        autoRenew: true,
        features: ['all']
      }
    });

    await superAdmin.save();

    console.log('✅ Super admin created by setup key:', superAdmin.email);

    return NextResponse.json({ 
      message: 'Super admin created successfully',
      admin: {
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role
      }
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}