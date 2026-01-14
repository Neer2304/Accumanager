// app/api/legal/log-acceptance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 LEGAL DISCLAIMER ACCEPTANCE - Starting...');
    
    // Get user from token
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('❌ No auth token found');
      return NextResponse.json({ 
        message: 'Authentication required' 
      }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
      console.log('✅ Token verified:', decoded.userId, decoded.email);
    } catch (error) {
      console.log('❌ Invalid token');
      return NextResponse.json({ 
        message: 'Invalid token' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { acceptVersion = '1.0.0', userAgent, ipAddress } = body;

    await connectToDatabase();

    // Log acceptance in database
    const acceptanceRecord = {
      timestamp: new Date(),
      version: acceptVersion,
      ipAddress: ipAddress || request.ip || request.headers.get('x-forwarded-for'),
      userAgent: userAgent || request.headers.get('user-agent'),
      method: 'web_form'
    };

    // Update user record with disclaimer acceptance
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        $set: {
          'legal.accepted': true,
          'legal.acceptedAt': new Date(),
          'legal.acceptedVersion': acceptVersion,
          'legal.lastAccepted': acceptanceRecord
        },
        $push: {
          'legal.acceptanceHistory': acceptanceRecord
        }
      },
      { new: true }
    ).select('name email role legal');

    if (!updatedUser) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ Legal disclaimer accepted by:', updatedUser.email);
    console.log('   Version:', acceptVersion);
    console.log('   IP:', acceptanceRecord.ipAddress);

    // Set cookies for frontend
    const response = NextResponse.json({ 
      success: true,
      message: 'Legal disclaimer accepted successfully',
      data: {
        userId: decoded.userId,
        acceptedAt: new Date().toISOString(),
        version: acceptVersion
      }
    });

    // Set cookies for frontend verification
    response.cookies.set('legal_disclaimer_accepted', 'true', {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    response.cookies.set('disclaimer_version', acceptVersion, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      path: '/',
      httpOnly: false, // Allow frontend to read
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return response;

  } catch (error: any) {
    console.error('❌ Error logging disclaimer acceptance:', error);
    return NextResponse.json(
      { 
        error: 'Failed to log acceptance',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check disclaimer status
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ 
        accepted: false,
        message: 'Not authenticated'
      });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch {
      return NextResponse.json({ 
        accepted: false,
        message: 'Invalid token'
      });
    }

    await connectToDatabase();
    const user = await User.findById(decoded.userId)
      .select('legal name email')
      .lean();

    if (!user) {
      return NextResponse.json({ 
        accepted: false,
        message: 'User not found'
      });
    }

    const accepted = user.legal?.accepted || false;
    const acceptedVersion = user.legal?.acceptedVersion;
    const acceptedAt = user.legal?.acceptedAt;

    return NextResponse.json({
      accepted,
      version: acceptedVersion,
      acceptedAt,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Check disclaimer error:', error);
    return NextResponse.json(
      { accepted: false, error: 'Server error' },
      { status: 500 }
    );
  }
}