import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Get master key from environment variable
const VALID_MASTER_KEY = process.env.SETUP_MASTER_KEY;

// Development fallback (only for local development)
const DEV_MASTER_KEYS = [
  'DEV-SETUP-MASTER-KEY-2024',
  'LOCAL-DEVELOPMENT-KEY',
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
          { 
            success: false,
            message: 'System is already initialized. An admin account already exists.',
            code: 'SYSTEM_ALREADY_INITIALIZED'
          },
          { status: 400 }
        );
      }
    }

    const { name, email, password, masterKey } = await request.json();

    // Validate master key
    if (!masterKey) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Master key is required',
          code: 'MASTER_KEY_REQUIRED'
        },
        { status: 400 }
      );
    }

    // Validate against environment variable or development keys
    const isValidMasterKey = 
      (VALID_MASTER_KEY && masterKey === VALID_MASTER_KEY) ||
      (process.env.NODE_ENV === 'development' && DEV_MASTER_KEYS.includes(masterKey));

    if (!isValidMasterKey) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid master key. Please check your .env.local file.',
          code: 'INVALID_MASTER_KEY'
        },
        { status: 403 }
      );
    }

    // Validate inputs
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { 
          success: false,
          message: 'All fields are required',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Please enter a valid email address',
          code: 'INVALID_EMAIL'
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Password must be at least 8 characters long',
          code: 'WEAK_PASSWORD_LENGTH'
        },
        { status: 400 }
      );
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Password must contain uppercase, lowercase letters and numbers',
          code: 'WEAK_PASSWORD_COMPLEXITY'
        },
        { status: 400 }
      );
    }

    // Check if email exists (case insensitive)
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          message: 'An account already exists with this email address',
          code: 'EMAIL_ALREADY_EXISTS'
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create super admin user
    const superAdmin = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'superadmin',
      isActive: true,
      emailVerified: true,
      subscription: {
        plan: 'premium',
        status: 'active',
        trialEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        autoRenew: true,
        features: ['all'],
        limits: {
          users: -1, // Unlimited
          products: -1,
          storage: -1
        }
      },
      permissions: [
        'admin:all',
        'user:all', 
        'product:all',
        'order:all',
        'analytics:all',
        'settings:all'
      ],
      metadata: {
        isFirstAdmin: true,
        initializedBy: 'system_setup',
        initializedAt: new Date(),
        setupComplete: true
      }
    });

    await superAdmin.save();

    console.log('🚀 SYSTEM INITIALIZED: Super admin created successfully');
    console.log('👤 Admin Details:', {
      id: superAdmin._id,
      name: superAdmin.name,
      email: superAdmin.email,
      role: superAdmin.role
    });

    // Create system configuration record if needed
    // You can add additional system setup here

    return NextResponse.json({ 
      success: true,
      message: 'System initialized successfully! Super admin account created.',
      code: 'SETUP_SUCCESS',
      admin: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
        createdAt: superAdmin.createdAt
      },
      system: {
        initialized: true,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    });
    
  } catch (error: any) {
    console.error('❌ Init setup error:', error);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Validation error: ' + Object.values(error.errors).map((e: any) => e.message).join(', '),
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Duplicate entry detected',
          code: 'DUPLICATE_ENTRY'
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check system status
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ 
      role: { $in: ['superadmin', 'admin'] } 
    });
    
    const isInitialized = adminCount > 0;
    const canInitialize = userCount === 0;

    return NextResponse.json({
      success: true,
      system: {
        isInitialized,
        canInitialize,
        userCount,
        adminCount,
        requiresSetup: !isInitialized && canInitialize,
        environment: process.env.NODE_ENV,
        masterKeyConfigured: !!process.env.SETUP_MASTER_KEY
      }
    });
    
  } catch (error: any) {
    console.error('System status check error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}