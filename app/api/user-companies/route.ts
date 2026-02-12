// app/api/user-companies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import UserCompany from '@/models/UserCompany';
import Company from '@/models/Company';
import User from '@/models/User';
import { NotificationService } from '@/services/notificationService';

// ✅ GET USER COMPANIES
// app/api/user-companies/route.ts - FIXED

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/user-companies - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      // ✅ FIX: Properly populate and handle data
      const userCompanies = await UserCompany.find({ 
        userId: decoded.userId,
        status: 'active'
      })
        .populate('companyId')
        .lean();

      // ✅ FIX: Filter out invalid companies
      const validUserCompanies = userCompanies.filter(uc => 
        uc.companyId && typeof uc.companyId === 'object' && '_id' in uc.companyId
      );

      // Get default company
      const defaultCompany = validUserCompanies.find(uc => uc.isDefault);

      return NextResponse.json({ 
        success: true,
        userCompanies: validUserCompanies,
        defaultCompany: defaultCompany || validUserCompanies[0] || null,
        count: validUserCompanies.length
      });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get user companies error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ SWITCH COMPANY / SET DEFAULT
export async function PUT(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const { companyId } = await request.json();

      if (!companyId) {
        return NextResponse.json(
          { success: false, error: 'Company ID is required' },
          { status: 400 }
        );
      }

      // Remove default from all user's companies
      await UserCompany.updateMany(
        { userId: decoded.userId },
        { isDefault: false }
      );

      // Set new default
      const updated = await UserCompany.findOneAndUpdate(
        { userId: decoded.userId, companyId },
        { isDefault: true },
        { new: true }
      ).populate('companyId');

      if (!updated) {
        return NextResponse.json(
          { success: false, error: 'Company not found or access denied' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true,
        defaultCompany: updated
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Switch company error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ INVITE USER TO COMPANY
export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const { companyId, email, role = 'member' } = await request.json();

      if (!companyId || !email) {
        return NextResponse.json(
          { success: false, error: 'Company ID and email are required' },
          { status: 400 }
        );
      }

      // Check if user has permission to invite (must be admin or manager)
      const inviter = await UserCompany.findOne({
        userId: decoded.userId,
        companyId,
        role: { $in: ['admin', 'manager'] },
        status: 'active'
      });

      if (!inviter) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to invite users' },
          { status: 403 }
        );
      }

      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found. Please ask them to register first.' },
          { status: 404 }
        );
      }

      // Check if already in company
      const existing = await UserCompany.findOne({
        userId: user._id,
        companyId
      });

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'User is already a member of this company' },
          { status: 409 }
        );
      }

      // Create invitation
      const userCompany = new UserCompany({
        userId: user._id,
        companyId,
        role,
        status: 'pending',
        invitedBy: decoded.userId,
        invitedByName: decoded.name || 'Unknown',
        joinedAt: null
      });

      await userCompany.save();

      // Get company details
      const company = await Company.findById(companyId);

      // Send notification
      try {
        await NotificationService.notifyUserInvited(user, company, decoded.userId);
      } catch (notifError) {
        console.error('⚠️ Failed to send invitation notification:', notifError);
      }

      return NextResponse.json({ 
        success: true,
        message: 'Invitation sent successfully',
        invitation: userCompany
      }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Invite user error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ ACCEPT/REJECT INVITATION
export async function PATCH(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const { invitationId, action } = await request.json();

      if (!invitationId || !action) {
        return NextResponse.json(
          { success: false, error: 'Invitation ID and action are required' },
          { status: 400 }
        );
      }

      const invitation = await UserCompany.findById(invitationId);

      if (!invitation) {
        return NextResponse.json(
          { success: false, error: 'Invitation not found' },
          { status: 404 }
        );
      }

      if (invitation.userId.toString() !== decoded.userId) {
        return NextResponse.json(
          { success: false, error: 'This invitation is not for you' },
          { status: 403 }
        );
      }

      if (invitation.status !== 'pending') {
        return NextResponse.json(
          { success: false, error: 'This invitation has already been processed' },
          { status: 400 }
        );
      }

      if (action === 'accept') {
        invitation.status = 'active';
        invitation.joinedAt = new Date();
        await invitation.save();

        // If this is first company, set as default
        const count = await UserCompany.countDocuments({ 
          userId: decoded.userId, 
          status: 'active' 
        });
        
        if (count === 1) {
          invitation.isDefault = true;
          await invitation.save();
        }

        return NextResponse.json({ 
          success: true,
          message: 'Invitation accepted successfully'
        });
      } else if (action === 'reject') {
        invitation.status = 'inactive';
        await invitation.save();

        return NextResponse.json({ 
          success: true,
          message: 'Invitation rejected'
        });
      }

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Process invitation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}