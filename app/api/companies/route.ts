// app/api/companies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Company from '@/models/Company';
import UserCompany from '@/models/UserCompany';
import { NotificationService } from '@/services/notificationService';

// ✅ GET ALL COMPANIES (Admin only)
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/companies - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '50');
      const page = parseInt(searchParams.get('page') || '1');
      const skip = (page - 1) * limit;

      // Get companies where user is a member
      const userCompanies = await UserCompany.find({ 
        userId: decoded.userId,
        status: 'active'
      }).populate('companyId');

      const companies = userCompanies.map(uc => uc.companyId);

      return NextResponse.json({ 
        success: true,
        companies,
        pagination: {
          page,
          limit,
          total: companies.length
        }
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get companies error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ CREATE COMPANY
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/companies - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const companyData = await request.json();

      // Validate required fields
      if (!companyData.name || !companyData.email) {
        return NextResponse.json(
          { success: false, error: 'Company name and email are required' },
          { status: 400 }
        );
      }

      // Check if company email already exists
      const existingCompany = await Company.findOne({ email: companyData.email });
      if (existingCompany) {
        return NextResponse.json(
          { success: false, error: 'Company with this email already exists' },
          { status: 409 }
        );
      }

      const company = new Company({
        ...companyData,
        createdBy: decoded.userId
      });

      await company.save();

      // Create user-company association as admin
      const userCompany = new UserCompany({
        userId: decoded.userId,
        companyId: company._id,
        role: 'admin',
        status: 'active',
        joinedAt: new Date(),
        isDefault: true,
        invitedBy: decoded.userId,
        invitedByName: decoded.name || 'System'
      });

      await userCompany.save();

      // Create notification
      try {
        await NotificationService.notifyCompanyCreated(company, decoded.userId);
      } catch (notifError) {
        console.error('⚠️ Failed to create notification:', notifError);
      }

      console.log('✅ Company created:', company._id);
      return NextResponse.json({ success: true, company }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create company error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ UPDATE COMPANY
export async function PUT(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const updateData = await request.json();
      const { companyId, ...updateFields } = updateData;

      if (!companyId) {
        return NextResponse.json({ success: false, error: 'Company ID is required' }, { status: 400 });
      }

      // Check if user is admin of this company
      const userCompany = await UserCompany.findOne({
        userId: decoded.userId,
        companyId,
        role: 'admin',
        status: 'active'
      });

      if (!userCompany) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to update this company' },
          { status: 403 }
        );
      }

      const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        { ...updateFields, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!updatedCompany) {
        return NextResponse.json(
          { success: false, error: 'Company not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, company: updatedCompany });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Update company error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ DELETE COMPANY
export async function DELETE(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const { searchParams } = new URL(request.url);
      const companyId = searchParams.get('id');

      if (!companyId) {
        return NextResponse.json({ success: false, error: 'Company ID is required' }, { status: 400 });
      }

      // Check if user is admin of this company
      const userCompany = await UserCompany.findOne({
        userId: decoded.userId,
        companyId,
        role: 'admin',
        status: 'active'
      });

      if (!userCompany) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to delete this company' },
          { status: 403 }
        );
      }

      // Soft delete - just deactivate
      await Company.findByIdAndUpdate(companyId, { 
        isActive: false,
        'subscription.status': 'cancelled'
      });

      // Deactivate all user associations
      await UserCompany.updateMany(
        { companyId },
        { status: 'inactive' }
      );

      return NextResponse.json({ 
        success: true, 
        message: 'Company deactivated successfully' 
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Delete company error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}