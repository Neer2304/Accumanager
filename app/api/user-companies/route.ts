import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import UserCompany from '@/models/UserCompany';
import User from '@/models/User';
import Company from '@/models/Company';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// ✅ POST /api/user-companies - Add member to company
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/user-companies - Adding member...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    const { 
      companyId, 
      email, 
      role = 'member', 
      name, 
      department, 
      position 
    } = await request.json();

    if (!companyId || !email) {
      return NextResponse.json(
        { success: false, error: 'Company ID and email are required' },
        { status: 400 }
      );
    }

    // Check if user has permission (admin or manager)
    const permission = await UserCompany.findOne({
      userId: decoded.userId,
      companyId,
      role: { $in: ['admin', 'manager'] },
      status: 'active'
    });

    if (!permission) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to add members' },
        { status: 403 }
      );
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });
    let isNewUser = false;
    let tempPassword = null;

    if (!user) {
      tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      user = new User({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        password: hashedPassword,
        isActive: true,
        isEmailVerified: true
      });
      
      await user.save();
      isNewUser = true;
    }

    // Check if already in company
    const existing = await UserCompany.findOne({
      userId: user._id,
      companyId
    });

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { success: false, error: 'User is already an active member' },
          { status: 409 }
        );
      } else {
        // Reactivate
        existing.status = 'active';
        existing.role = role;
        existing.joinedAt = new Date();
        existing.department = department || existing.department;
        existing.jobTitle = position || existing.jobTitle;
        await existing.save();
        
        await Company.findByIdAndUpdate(companyId, {
          $inc: { 'subscription.usedSeats': 1 }
        });

        const populated = await UserCompany.findById(existing._id)
          .populate('userId', 'name email avatar')
          .lean();

        return NextResponse.json({ 
          success: true,
          message: 'Member reactivated',
          member: populated,
          isNewUser: false
        });
      }
    }

    // Add new member
    const userCompany = new UserCompany({
      userId: user._id,
      companyId: new mongoose.Types.ObjectId(companyId),
      role,
      status: 'active',
      joinedAt: new Date(),
      isDefault: false,
      invitedBy: new mongoose.Types.ObjectId(decoded.userId),
      invitedByName: decoded.name || 'Admin',
      department: department || '',
      jobTitle: position || '',
      permissions: []
    });

    await userCompany.save();

    // Update company seats
    await Company.findByIdAndUpdate(companyId, {
      $inc: { 'subscription.usedSeats': 1 }
    });

    const populated = await UserCompany.findById(userCompany._id)
      .populate('userId', 'name email avatar')
      .lean();

    return NextResponse.json({ 
      success: true,
      message: isNewUser ? 'User created and added' : 'Member added',
      member: populated,
      isNewUser,
      tempPassword: isNewUser ? tempPassword : undefined
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Add member error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ GET /api/user-companies - Get user's companies
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    const userCompanies = await UserCompany.find({ 
      userId: decoded.userId,
      status: 'active'
    })
      .populate('companyId')
      .lean();

    const valid = userCompanies.filter(uc => 
      uc.companyId && typeof uc.companyId === 'object' && '_id' in uc.companyId
    );

    return NextResponse.json({ 
      success: true,
      userCompanies: valid,
      defaultCompany: valid.find(uc => uc.isDefault) || valid[0] || null
    });

  } catch (error: any) {
    console.error('❌ Get user companies error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ PUT /api/user-companies - Set default company
export async function PUT(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    const { companyId } = await request.json();

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      );
    }

    await UserCompany.updateMany(
      { userId: decoded.userId },
      { isDefault: false }
    );

    const updated = await UserCompany.findOneAndUpdate(
      { userId: decoded.userId, companyId },
      { isDefault: true },
      { new: true }
    ).populate('companyId');

    return NextResponse.json({ 
      success: true,
      defaultCompany: updated
    });

  } catch (error: any) {
    console.error('❌ Set default error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}