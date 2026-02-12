import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import UserCompany from '@/models/UserCompany';
import Company from '@/models/Company';

export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    const { companyId } = await request.json();

    if (!companyId) {
      return NextResponse.json({ success: false, error: 'Company ID required' }, { status: 400 });
    }

    // Check if already a member
    const existing = await UserCompany.findOne({
      userId: decoded.userId,
      companyId
    });

    if (existing) {
      // Update to active if exists
      existing.status = 'active';
      existing.role = 'admin';
      await existing.save();
      
      return NextResponse.json({
        success: true,
        message: 'Already a member, updated to active',
        member: existing
      });
    }

    // Create new member
    const userCompany = new UserCompany({
      userId: decoded.userId,
      companyId,
      role: 'admin',
      status: 'active',
      joinedAt: new Date(),
      isDefault: true,
      invitedBy: decoded.userId,
      invitedByName: decoded.name || 'System',
    });

    await userCompany.save();

    // Update company used seats
    await Company.findByIdAndUpdate(companyId, {
      $inc: { 'subscription.usedSeats': 1 }
    });

    return NextResponse.json({
      success: true,
      message: 'Added as member successfully',
      member: userCompany
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}