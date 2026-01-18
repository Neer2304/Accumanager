// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { smsService } from '@/lib/sms';
import { generateOTP } from '@/lib/otp-generator';

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();
    
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile.replace('+91', ''))) {
      return NextResponse.json(
        { success: false, message: 'Invalid mobile number' },
        { status: 400 }
      );
    }

    // Generate OTP (6 digits)
    const otp = generateOTP(6);
    
    // Store OTP in database (with expiry)
    // await storeOTP(mobile, otp);
    
    // Send SMS via MSG91
    const sent = await smsService.sendOTP(`+91${mobile}`, otp);
    
    if (!sent) {
      return NextResponse.json(
        { success: false, message: 'Failed to send OTP' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // In development, you might want to return the OTP
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });

  } catch (error: any) {
    console.error('Send OTP Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}