// app/api/legal/accept/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 LEGAL DISCLAIMER ACCEPTANCE - Processing...');
    
    // Verify authentication
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      acceptVersion,
      userAgent,
      timestamp,
      ipAddress,
      platform,
      screenResolution,
    } = body;

    await connectToDatabase();

    // Create acceptance record
    const acceptanceRecord = {
      timestamp: new Date(timestamp),
      version: acceptVersion,
      ipAddress,
      userAgent,
      platform,
      screenResolution,
      method: 'web_form',
      acceptedAt: new Date(),
    };

    // Update user's legal acceptance status
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        $set: {
          'legal.accepted': true,
          'legal.acceptedAt': new Date(),
          'legal.acceptedVersion': acceptVersion,
          'legal.lastAccepted': acceptanceRecord,
          updatedAt: new Date(),
        },
        $push: {
          'legal.acceptanceHistory': {
            $each: [acceptanceRecord],
            $slice: -10, // Keep only last 10 entries
          },
        },
      },
      { new: true, runValidators: true }
    ).select('name email role legal');

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Legal disclaimer accepted by user: ${updatedUser.email}`);

    // Set cookies
    const response = NextResponse.json({
      success: true,
      message: 'Legal disclaimer accepted successfully',
      data: {
        userId: decoded.userId,
        acceptedAt: new Date().toISOString(),
        version: acceptVersion,
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      },
    });

    // Set acceptance cookies
    response.cookies.set('legal_disclaimer_accepted', 'true', {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    response.cookies.set('disclaimer_version', acceptVersion, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response;

  } catch (error: any) {
    console.error('❌ Legal acceptance error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process acceptance',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
