import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Company from '@/models/Company';
import CompanyMember from '@/models/CompanyMember';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { CompanyLimitService, getDefaultPermissions } from '@/lib/companyLimits';

// ✅ GET /api/companies/members?companyId=xxx - Get all members
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      const { searchParams } = new URL(request.url);
      const companyId = searchParams.get('companyId');
      
      if (!companyId) {
        return NextResponse.json({ 
          success: false, 
          error: 'Company ID is required' 
        }, { status: 400 });
      }

      await connectToDatabase();

      // Check if user has access to this company
      const role = await CompanyLimitService.getUserRoleInCompany(decoded.userId, companyId);
      if (!role) {
        return NextResponse.json({ 
          success: false, 
          error: 'Access denied' 
        }, { status: 403 });
      }

      const members = await CompanyMember.find({ 
        companyId,
        status: { $ne: 'removed' }
      })
      .sort({ role: 1, createdAt: -1 })
      .lean();

      // Transform for frontend
      const formattedMembers = members.map(member => ({
        ...member,
        id: member._id.toString(),
        memberId: member.memberId.toString(),
        companyId: member.companyId.toString()
      }));

      return NextResponse.json({
        success: true,
        members: formattedMembers,
        total: formattedMembers.length
      });

    } catch (authError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get members error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// ✅ POST /api/companies/members?companyId=xxx - Add member
export async function POST(request: NextRequest) {
  try {
    console.log('👥 POST /api/companies/members - Adding member');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      const { searchParams } = new URL(request.url);
      const companyId = searchParams.get('companyId');
      
      if (!companyId) {
        return NextResponse.json({ 
          success: false, 
          error: 'Company ID is required' 
        }, { status: 400 });
      }

      await connectToDatabase();
      const { email, name, role = 'member' } = await request.json();

      if (!email) {
        return NextResponse.json({ 
          success: false, 
          error: 'Email is required' 
        }, { status: 400 });
      }

      // Check if user can manage members
      const canManage = await CompanyLimitService.canManageMembers(decoded.userId, companyId);
      if (!canManage) {
        return NextResponse.json({ 
          success: false, 
          error: 'You do not have permission to add members' 
        }, { status: 403 });
      }

      // Get company details
      const company = await Company.findOne({
        _id: companyId,
        isActive: true,
        deletedAt: null
      });

      if (!company) {
        return NextResponse.json({ 
          success: false, 
          error: 'Company not found' 
        }, { status: 404 });
      }

      // 🔥 CHECK MEMBER LIMIT
      const limitCheck = await CompanyLimitService.checkMemberLimit(companyId);
      if (!limitCheck.canAdd) {
        return NextResponse.json({
          success: false,
          error: 'Member limit reached',
          message: `This company can have maximum ${limitCheck.max} members.`,
          limit: limitCheck.max,
          current: limitCheck.current
        }, { status: 403 });
      }

      // Find or create user
      let memberUser = await User.findOne({ email }).lean();
      let memberId, memberName;

      if (!memberUser) {
        // Create minimal user
        const newUser = new User({
          email,
          name: name || email.split('@')[0],
          password: Math.random().toString(36).slice(-8), // Random password
          role: 'user',
          isActive: true
        });
        await newUser.save();
        memberId = newUser._id;
        memberName = newUser.name;
      } else {
        memberId = memberUser._id;
        memberName = memberUser.name;
      }

      // Check if already a member
      const existingMember = await CompanyMember.findOne({
        companyId,
        memberId
      });

      if (existingMember) {
        if (existingMember.status === 'removed') {
          // Reactivate
          existingMember.status = 'active';
          existingMember.role = role;
          existingMember.permissions = getDefaultPermissions(role);
          await existingMember.save();
          
          // Update company member count
          await Company.findByIdAndUpdate(companyId, {
            $inc: { memberCount: 1 }
          });
          
          return NextResponse.json({
            success: true,
            member: {
              ...existingMember.toObject(),
              id: existingMember._id.toString()
            }
          });
        } else {
          return NextResponse.json({ 
            success: false, 
            error: 'User is already a member of this company' 
          }, { status: 400 });
        }
      }

      // Create new member
      const member = new CompanyMember({
        companyId,
        companyName: company.name,
        memberId,
        memberEmail: email,
        memberName: name || memberName,
        role,
        addedBy: decoded.userId,
        addedByName: decoded.name || 'Admin',
        status: 'active',
        joinedAt: new Date(),
        permissions: getDefaultPermissions(role)
      });

      await member.save();

      // Update company member count
      await Company.findByIdAndUpdate(companyId, {
        $inc: { memberCount: 1 }
      });

      console.log('✅ Member added:', member._id);
      
      return NextResponse.json({
        success: true,
        member: {
          ...member.toObject(),
          id: member._id.toString()
        }
      }, { status: 201 });

    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Add member error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({ 
        success: false, 
        error: 'User is already a member' 
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// ✅ PUT /api/companies/members?companyId=xxx&memberId=xxx - Update member role
export async function PUT(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      const { searchParams } = new URL(request.url);
      const companyId = searchParams.get('companyId');
      const memberId = searchParams.get('memberId');
      
      if (!companyId || !memberId) {
        return NextResponse.json({ 
          success: false, 
          error: 'Company ID and Member ID are required' 
        }, { status: 400 });
      }

      await connectToDatabase();
      const { role } = await request.json();

      // Check if user can manage members
      const canManage = await CompanyLimitService.canManageMembers(decoded.userId, companyId);
      if (!canManage) {
        return NextResponse.json({ 
          success: false, 
          error: 'You do not have permission to update member roles' 
        }, { status: 403 });
      }

      const member = await CompanyMember.findOne({
        companyId,
        memberId
      });

      if (!member) {
        return NextResponse.json({ 
          success: false, 
          error: 'Member not found' 
        }, { status: 404 });
      }

      // Can't change admin's role
      if (member.role === 'admin') {
        return NextResponse.json({ 
          success: false, 
          error: 'Cannot change admin role' 
        }, { status: 400 });
      }

      member.role = role;
      member.permissions = getDefaultPermissions(role);
      await member.save();

      return NextResponse.json({
        success: true,
        member: {
          ...member.toObject(),
          id: member._id.toString()
        }
      });

    } catch (authError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Update member error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// ✅ DELETE /api/companies/members?companyId=xxx&memberId=xxx - Remove member
export async function DELETE(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      const { searchParams } = new URL(request.url);
      const companyId = searchParams.get('companyId');
      const memberId = searchParams.get('memberId');
      
      if (!companyId || !memberId) {
        return NextResponse.json({ 
          success: false, 
          error: 'Company ID and Member ID are required' 
        }, { status: 400 });
      }

      await connectToDatabase();

      // Check if user can manage members
      const canManage = await CompanyLimitService.canManageMembers(decoded.userId, companyId);
      if (!canManage) {
        return NextResponse.json({ 
          success: false, 
          error: 'You do not have permission to remove members' 
        }, { status: 403 });
      }

      const member = await CompanyMember.findOne({
        companyId,
        memberId
      });

      if (!member) {
        return NextResponse.json({ 
          success: false, 
          error: 'Member not found' 
        }, { status: 404 });
      }

      // Can't remove admin
      if (member.role === 'admin') {
        return NextResponse.json({ 
          success: false, 
          error: 'Cannot remove the company admin' 
        }, { status: 400 });
      }

      // Soft remove
      member.status = 'removed';
      await member.save();

      // Update company member count
      await Company.findByIdAndUpdate(companyId, {
        $inc: { memberCount: -1 }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Member removed successfully' 
      });

    } catch (authError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Remove member error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}