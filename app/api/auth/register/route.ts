// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';
import { connectToDatabase } from '@/lib/mongodb';
import { PaymentService } from '@/services/paymentService';

// Add CORS headers helper
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { name, email, password, shopName } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      const response = NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const response = NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 409 }
      );
      return addCorsHeaders(response);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      shopName: shopName || '',
    });

    await user.save();

    // Start free trial automatically
    await PaymentService.startFreeTrial(user._id.toString());

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Get updated user with subscription
    const userWithSubscription = await User.findById(user._id);
    
    // Return user data (without password)
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      shopName: user.shopName,
      isActive: user.isActive,
      subscription: userWithSubscription?.subscription,
      usage: userWithSubscription?.usage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response = NextResponse.json({
      user: userData,
      token,
    }, { status: 201 });
    
    return addCorsHeaders(response);
  } catch (error) {
    console.error('Registration error:', error);
    const response = NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}