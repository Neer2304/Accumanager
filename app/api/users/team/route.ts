// app/api/users/team/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User'; // Your existing user model
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Get all users in the same organization (simplified)
      const teamMembers = await User.find({ 
        _id: { $ne: decoded.userId } // Exclude current user
      })
      .select('name email avatar role createdAt lastLogin')
      .sort({ name: 1 })
      .lean();

      // Transform data
      const transformedMembers = teamMembers.map(member => ({
        _id: member._id.toString(),
        name: member.name,
        email: member.email,
        avatar: member.avatar,
        role: member.role || 'Team Member',
        status: member.lastLogin && 
                new Date(member.lastLogin).getTime() > Date.now() - 30 * 60 * 1000 
                ? 'active' : 'offline',
        lastActive: member.lastLogin || member.createdAt,
        currentProjects: [] // You can populate this from projects API
      }));

      return NextResponse.json({ teamMembers: transformedMembers });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get team members error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}