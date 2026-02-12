import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import UserCompany from '@/models/UserCompany';
import User from '@/models/User';
import Company from '@/models/Company';

interface RouteParams {
  params: {
    id: string;
  };
}

// ✅ GET /api/companies/[id]/members - Get all members of a company
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: companyId } = params;
    console.log(`🔄 GET /api/companies/${companyId}/members - Fetching members...`);

    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Check if user has access to this company
      const userAccess = await UserCompany.findOne({
        userId: decoded.userId,
        companyId,
        status: 'active'
      });

      if (!userAccess) {
        return NextResponse.json(
          { success: false, error: 'You do not have access to this company' },
          { status: 403 }
        );
      }

      // Get all members of the company
      const members = await UserCompany.find({
        companyId,
        status: { $in: ['active', 'pending', 'inactive', 'suspended'] }
      })
        .populate('userId', 'name email avatar')
        .populate('invitedBy', 'name')
        .lean()
        .sort({ 
          role: -1, // Admins first
          status: 1, // Active first
          joinedAt: -1 
        });

      // Format members data
      const formattedMembers = members.map(member => {
        const user = member.userId as any;
        return {
          ...member,
          user: {
            _id: user._id,
            name: user.name || 'Unknown',
            email: user.email,
            avatar: user.avatar
          },
          isCurrentUser: user._id.toString() === decoded.userId,
          userId: user._id
        };
      });

      return NextResponse.json({
        success: true,
        members: formattedMembers,
        count: formattedMembers.length
      });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('❌ Get members error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ DELETE /api/companies/[id]/members?userId=xxx - Remove a member
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: companyId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log(`🔄 DELETE /api/companies/${companyId}/members - Removing user ${userId}`);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Check if user is admin of this company
      const adminCheck = await UserCompany.findOne({
        userId: decoded.userId,
        companyId,
        role: 'admin',
        status: 'active'
      });

      if (!adminCheck) {
        return NextResponse.json(
          { success: false, error: 'Only admins can remove members' },
          { status: 403 }
        );
      }

      // Cannot remove yourself
      if (userId === decoded.userId) {
        return NextResponse.json(
          { success: false, error: 'You cannot remove yourself. Use "Leave Company" instead.' },
          { status: 400 }
        );
      }

      // Get member to check if they are admin
      const targetMember = await UserCompany.findOne({
        userId,
        companyId
      });

      if (!targetMember) {
        return NextResponse.json(
          { success: false, error: 'Member not found' },
          { status: 404 }
        );
      }

      // Cannot remove another admin
      if (targetMember.role === 'admin') {
        return NextResponse.json(
          { success: false, error: 'Cannot remove another admin' },
          { status: 403 }
        );
      }

      // Remove member
      await UserCompany.findOneAndDelete({
        userId,
        companyId
      });

      // Update company used seats
      if (targetMember.status === 'active') {
        await Company.findByIdAndUpdate(companyId, {
          $inc: { 'subscription.usedSeats': -1 }
        });
      }

      return NextResponse.json({
        success: true,
        message: targetMember.status === 'pending' 
          ? 'Invitation cancelled successfully' 
          : 'Member removed successfully'
      });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('❌ Remove member error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ PATCH /api/companies/[id]/members?userId=xxx - Update member role
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: companyId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const { role } = await request.json();

    console.log(`🔄 PATCH /api/companies/${companyId}/members - Updating user ${userId} to ${role}`);

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Check if user is admin of this company
      const adminCheck = await UserCompany.findOne({
        userId: decoded.userId,
        companyId,
        role: 'admin',
        status: 'active'
      });

      if (!adminCheck) {
        return NextResponse.json(
          { success: false, error: 'Only admins can update roles' },
          { status: 403 }
        );
      }

      // Cannot change role of another admin
      const targetMember = await UserCompany.findOne({
        userId,
        companyId
      });

      if (!targetMember) {
        return NextResponse.json(
          { success: false, error: 'Member not found' },
          { status: 404 }
        );
      }

      if (targetMember.role === 'admin' && userId !== decoded.userId) {
        return NextResponse.json(
          { success: false, error: 'Cannot change role of another admin' },
          { status: 403 }
        );
      }

      // Update role
      const updated = await UserCompany.findOneAndUpdate(
        { userId, companyId },
        { role },
        { new: true }
      ).populate('userId', 'name email');

      return NextResponse.json({
        success: true,
        member: updated,
        message: 'Role updated successfully'
      });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('❌ Update role error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}