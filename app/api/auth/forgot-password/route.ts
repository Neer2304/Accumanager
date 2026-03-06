// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';
import { createOTP } from '@/lib/otp';
import { sendPasswordResetOTP } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { email } = await request.json();

    if (!email?.trim()) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    // Always return success even if user not found (prevents email enumeration)
    if (!user) {
      return NextResponse.json({
        message: 'If an account with that email exists, a password reset code has been sent.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({
        message: 'This account has been deactivated. Please contact support.'
      }, { status: 403 });
    }

    // Create and send OTP
    try {
      const otp = await createOTP(user._id.toString(), user.email, 'password_reset');
      await sendPasswordResetOTP(user.email, user.name, otp);
    } catch (err: any) {
      // Rate limit error
      if (err.message?.includes('wait')) {
        return NextResponse.json({ message: err.message }, { status: 429 });
      }
      throw err;
    }

    return NextResponse.json({
      message: 'If an account with that email exists, a password reset code has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}