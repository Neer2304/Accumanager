import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import UserCompany from '@/models/UserCompany';
import Company from '@/models/Company';

type tParams = Promise<{ id: string }>

// ✅ GET /api/companies/[id]/members - Get all members
export async function GET(
  request: NextRequest,
  { params }: { params: tParams }
) {
  try {
    const { id: companyId } = await params;
    console.log(`🔄 GET /api/companies/${companyId}/members - Fetching members...`);

    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    // Check if user has active membership
    const userAccess = await UserCompany.findOne({
      userId: decoded.userId,
      companyId: companyId,
      status: 'active'
    }).lean();

    if (!userAccess) {
      // Check if they have ANY membership (inactive)
      const anyMembership = await UserCompany.findOne({
        userId: decoded.userId,
        companyId: companyId
      }).lean();

      if (anyMembership) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Your membership is ${anyMembership.status}`,
            status: anyMembership.status
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'You do not have access to this company' },
        { status: 403 }
      );
    }

    // Get ALL members
    const members = await UserCompany.find({ companyId })
      .populate('userId', 'name email avatar')
      .populate('invitedBy', 'name')
      .lean();

    console.log(`📊 Found ${members.length} total members`);

    // Format members
    const formattedMembers = members.map(member => {
      const user = member.userId as any;

      if (!user || !user._id) {
        return {
          ...member,
          user: {
            _id: member.userId || 'unknown',
            name: member.jobTitle || 'Team Member',
            email: member.invitedByName || 'No email',
            avatar: null
          },
          isCurrentUser: false,
          userId: member.userId
        };
      }

      return {
        ...member,
        user: {
          _id: user._id,
          name: user.name || 'Unknown',
          email: user.email || 'No email',
          avatar: user.avatar
        },
        isCurrentUser: user._id?.toString() === decoded.userId,
        userId: user._id
      };
    });

    // Sort: admins first, then by status, then joined date
    formattedMembers.sort((a, b) => {
      const roleOrder = { admin: 1, manager: 2, member: 3, viewer: 4 };
      const statusOrder = { active: 1, pending: 2, inactive: 3, suspended: 4 };
      
      if (roleOrder[a.role] !== roleOrder[b.role]) {
        return roleOrder[a.role] - roleOrder[b.role];
      }
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
    });

    return NextResponse.json({
      success: true,
      members: formattedMembers,
      count: formattedMembers.length
    });

  } catch (error: any) {
    console.error('❌ Get members error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ DELETE /api/companies/[id]/members?userId=xxx - Remove member
export async function DELETE(
  request: NextRequest,
  { params }: { params: tParams }
) {
  try {
    const { id: companyId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

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

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    // Check if requester is admin
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
        { success: false, error: 'You cannot remove yourself' },
        { status: 400 }
      );
    }

    const targetMember = await UserCompany.findOne({ userId, companyId });

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

    await UserCompany.findOneAndDelete({ userId, companyId });

    if (targetMember.status === 'active') {
      await Company.findByIdAndUpdate(companyId, {
        $inc: { 'subscription.usedSeats': -1 }
      });
    }

    return NextResponse.json({
      success: true,
      message: targetMember.status === 'pending' 
        ? 'Invitation cancelled' 
        : 'Member removed'
    });

  } catch (error: any) {
    console.error('❌ Remove member error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ PATCH /api/companies/[id]/members?userId=xxx - Update role
export async function PATCH(
  request: NextRequest,
  { params }: { params: tParams }
) {
  try {
    const { id: companyId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const { role } = await request.json();

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

    const decoded = verifyToken(authToken);
    await connectToDatabase();

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

    const targetMember = await UserCompany.findOne({ userId, companyId });

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

  } catch (error: any) {
    console.error('❌ Update role error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}