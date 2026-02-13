import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Company from '@/models/Company';
import CompanyMember from '@/models/CompanyMember';
import { verifyToken } from '@/lib/jwt';
import { CompanyLimitService } from '@/lib/companyLimits';
import mongoose from 'mongoose';

// ✅ GET /api/companies/detail?id=xxx - Get single company
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
      const companyId = searchParams.get('id');
      
      if (!companyId) {
        return NextResponse.json({ 
          success: false, 
          error: 'Company ID is required' 
        }, { status: 400 });
      }

      await connectToDatabase();

      // Check if user has access
      const company = await Company.findOne({
        _id: companyId,
        $or: [
          { createdBy: decoded.userId },
          { _id: { $in: await getUsersCompanyIds(decoded.userId) } }
        ],
        isActive: true,
        deletedAt: null
      }).lean();

      if (!company) {
        return NextResponse.json({ 
          success: false, 
          error: 'Company not found' 
        }, { status: 404 });
      }

      // Get user's role
      const membership = await CompanyMember.findOne({
        companyId,
        memberId: decoded.userId
      }).lean();

      const role = company.createdBy.toString() === decoded.userId 
        ? 'admin' 
        : membership?.role || 'viewer';

      return NextResponse.json({
        success: true,
        company: {
          ...company,
          id: company._id.toString(),
          userRole: role
        }
      });

    } catch (authError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get company error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// ✅ PUT /api/companies/detail?id=xxx - Update company
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
      const companyId = searchParams.get('id');
      
      if (!companyId) {
        return NextResponse.json({ 
          success: false, 
          error: 'Company ID is required' 
        }, { status: 400 });
      }

      await connectToDatabase();
      const updateData = await request.json();

      // Only admin can update
      const company = await Company.findOne({
        _id: companyId,
        createdBy: decoded.userId,
        isActive: true,
        deletedAt: null
      });

      if (!company) {
        return NextResponse.json({ 
          success: false, 
          error: 'Company not found or you do not have permission' 
        }, { status: 404 });
      }

      // Don't allow updating sensitive fields
      delete updateData._id;
      delete updateData.createdBy;
      delete updateData.memberCount;
      delete updateData.plan;

      const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).lean();

      return NextResponse.json({
        success: true,
        company: {
          ...updatedCompany,
          id: updatedCompany._id.toString()
        }
      });

    } catch (authError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Update company error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: errors 
        },
        { status: 400 }
      );
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

// ✅ DELETE /api/companies/detail?id=xxx - Soft delete company
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
      const companyId = searchParams.get('id');
      
      if (!companyId) {
        return NextResponse.json({ 
          success: false, 
          error: 'Company ID is required' 
        }, { status: 400 });
      }

      await connectToDatabase();

      // Only admin can delete
      const company = await Company.findOne({
        _id: companyId,
        createdBy: decoded.userId,
        isActive: true,
        deletedAt: null
      });

      if (!company) {
        return NextResponse.json({ 
          success: false, 
          error: 'Company not found or you do not have permission' 
        }, { status: 404 });
      }

      // Soft delete
      await Company.findByIdAndUpdate(companyId, {
        isActive: false,
        deletedAt: new Date()
      });

      // Mark all members as removed
      await CompanyMember.updateMany(
        { companyId },
        { status: 'removed' }
      );

      return NextResponse.json({ 
        success: true, 
        message: 'Company deleted successfully' 
      });

    } catch (authError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Delete company error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Helper function
async function getUsersCompanyIds(userId: string) {
  const memberships = await CompanyMember.find({ 
    memberId: userId,
    status: 'active'
  }).lean();
  return memberships.map(m => m.companyId);
}