import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Company from '@/models/Company';
import CompanyMember from '@/models/CompanyMember';
import { verifyToken } from '@/lib/jwt';
import { CompanyLimitService, getDefaultPermissions } from '@/lib/companyLimits';

// ✅ GET /api/companies - Get all companies for current user
export async function GET(request: NextRequest) {
  try {
    console.log('🏢 GET /api/companies - Fetching companies');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Get all companies user has access to
      const companies = await CompanyLimitService.getUserAccessibleCompanies(decoded.userId);
      
      // Add role info for each company
      const companiesWithRole = await Promise.all(
        companies.map(async (company: any) => {
          const role = await CompanyLimitService.getUserRoleInCompany(
            decoded.userId, 
            company._id.toString()
          );
          
          return {
            ...company,
            userRole: role || 'viewer',
            id: company._id.toString()
          };
        })
      );

      return NextResponse.json({ 
        success: true,
        companies: companiesWithRole,
        total: companiesWithRole.length
      });

    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get companies error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// ✅ POST /api/companies - Create new company
export async function POST(request: NextRequest) {
  try {
    console.log('🏢 POST /api/companies - Creating company');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // 🔥 CHECK COMPANY LIMIT (MAX 2)
      const limitCheck = await CompanyLimitService.canCreateCompany(decoded.userId);
      
      if (!limitCheck.canCreate) {
        return NextResponse.json({
          success: false,
          error: 'Company limit reached',
          message: `You can only have ${limitCheck.max} active companies. Please delete one to create another.`,
          limit: limitCheck.max,
          current: limitCheck.current
        }, { status: 403 });
      }

      const companyData = await request.json();

      // Validate required fields
      if (!companyData.name || !companyData.email) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Company name and email are required' 
          },
          { status: 400 }
        );
      }

      // Check if company email already exists
      const existingCompany = await Company.findOne({ email: companyData.email });
      if (existingCompany) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Company with this email already exists' 
          },
          { status: 400 }
        );
      }

      // Create company
      const company = new Company({
        name: companyData.name,
        email: companyData.email,
        phone: companyData.phone || '',
        industry: companyData.industry || '',
        size: companyData.size || '1-10',
        address: companyData.address || {},
        website: companyData.website || '',
        createdBy: decoded.userId,
        createdByName: decoded.name || 'Admin',
        plan: 'free',
        maxMembers: 10,
        memberCount: 1,
      });

      await company.save();

      // Add creator as first member (ADMIN)
      const member = new CompanyMember({
        companyId: company._id,
        companyName: company.name,
        memberId: decoded.userId,
        memberEmail: decoded.email,
        memberName: decoded.name || 'Admin',
        role: 'admin',
        addedBy: decoded.userId,
        addedByName: decoded.name || 'Admin',
        status: 'active',
        joinedAt: new Date(),
        permissions: getDefaultPermissions('admin')
      });

      await member.save();

      console.log('✅ Company created:', company._id);
      
      return NextResponse.json({
        success: true,
        company: {
          ...company.toObject(),
          id: company._id.toString(),
          userRole: 'admin'
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
    console.error('❌ Create company error:', error);
    
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
    
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Company with this email already exists' 
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