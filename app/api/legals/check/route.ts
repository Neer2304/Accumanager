// app/api/legal/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ 
        accepted: false,
        authenticated: false,
        message: 'Not authenticated'
      });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch {
      return NextResponse.json({ 
        accepted: false,
        authenticated: false,
        message: 'Invalid token'
      });
    }

    await connectToDatabase();
    const user = await User.findById(decoded.userId)
      .select('legal name email role')
      .lean();

    if (!user) {
      return NextResponse.json({ 
        accepted: false,
        authenticated: false,
        message: 'User not found'
      });
    }

    const accepted = user.legal?.accepted || false;
    const acceptedVersion = user.legal?.acceptedVersion;
    const acceptedAt = user.legal?.acceptedAt;
    const lastAccepted = user.legal?.lastAccepted;

    return NextResponse.json({
      accepted,
      authenticated: true,
      version: acceptedVersion,
      acceptedAt,
      lastAccepted,
      requiresUpdate: acceptedVersion !== '2.0.0', // Check if needs to accept new version
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error: any) {
    console.error('Check disclaimer error:', error);
    return NextResponse.json(
      { 
        accepted: false,
        authenticated: false,
        error: 'Server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}