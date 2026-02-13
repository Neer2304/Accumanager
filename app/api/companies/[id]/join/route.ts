import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Company from '@/models/Company';
import UserCompany from '@/models/UserCompany';
import mongoose from 'mongoose';

type tParams = Promise<{ id: string }>

// ✅ POST /api/companies/[id]/join - Allow creator to join as admin
export async function POST(
  request: NextRequest,
  { params }: { params: tParams }
) {
  try {
    const { id } = await params;
    const companyId = id;
    
    console.log('🔥 JOIN API HIT!');
    console.log('📌 Company ID:', companyId);

    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    // Find company
    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Check if user is the creator/owner
    const isCreator = company.createdBy.toString() === decoded.userId;
    const isOwner = company.userId.toString() === decoded.userId;
    
    if (!isCreator && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Only the company creator/owner can join via this endpoint' },
        { status: 403 }
      );
    }

    // Check if already a member
    const existing = await UserCompany.findOne({
      userId: decoded.userId,
      companyId: company._id
    });

    if (existing) {
      console.log(`📌 Found existing membership: ${existing._id}, status: ${existing.status}`);
      
      // Activate the membership
      existing.status = 'active';
      existing.role = 'admin';
      existing.joinedAt = new Date();
      await existing.save();
      
      // Only increment seats if it wasn't active before
      if (existing.status !== 'active') {
        await Company.findByIdAndUpdate(company._id, {
          $inc: { 'subscription.usedSeats': 1 }
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Membership activated successfully! You are now an admin.',
        wasExisting: true
      });
    }

    // Add as new admin member
    const userCompany = new UserCompany({
      userId: new mongoose.Types.ObjectId(decoded.userId),
      companyId: company._id,
      role: 'admin',
      status: 'active',
      joinedAt: new Date(),
      isDefault: false,
      invitedBy: new mongoose.Types.ObjectId(decoded.userId),
      invitedByName: decoded.name || 'Creator',
      department: '',
      jobTitle: 'Owner',
      permissions: []
    });

    await userCompany.save();

    // Update seats
    await Company.findByIdAndUpdate(company._id, {
      $inc: { 'subscription.usedSeats': 1 }
    });

    // If this is the first active company, set as default
    const activeCount = await UserCompany.countDocuments({
      userId: decoded.userId,
      status: 'active'
    });

    if (activeCount === 1) {
      userCompany.isDefault = true;
      await userCompany.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully joined as admin',
      wasNew: true
    }, { status: 201 });

  } catch (error: any) {
    console.error('Join error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: tParams }
) {
  const { id } = await params;
  return NextResponse.json({ 
    success: true, 
    message: 'Join API route is working!',
    companyId: id 
  });
}