import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Your personal master keys
const MASTER_KEYS = [
  process.env.MASTER_SETUP_KEY_1 || 'YOUR-PERSONAL-MASTER-KEY-123',
  process.env.MASTER_SETUP_KEY_2 || 'ACCUMANAGE-SETUP-2024',
];

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Check if ANY user exists
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      // Check if admin already exists
      const adminCount = await User.countDocuments({ 
        role: { $in: ['superadmin', 'admin'] } 
      });
      
      if (adminCount > 0) {
        return NextResponse.json(
          { message: 'System already initialized. Admin exists.' },
          { status: 400 }
        );
      }
    }

    const { name, email, password, masterKey } = await request.json();

    // Validate master key
    if (!masterKey || !MASTER_KEYS.includes(masterKey)) {
      return NextResponse.json(
        { message: 'Invalid master key' },
        { status: 403 }
      );
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if email exists
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

    console.log('🚀 SYSTEM INITIALIZED: Super admin created');

    return NextResponse.json({ 
      success: true,
      message: 'System initialized successfully',
      admin: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role
      }
    });
  } catch (error: any) {
    console.error('Init setup error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}