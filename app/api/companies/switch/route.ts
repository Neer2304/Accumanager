import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Company from '@/models/Company';
import { verifyToken } from '@/lib/jwt';
import { CompanyLimitService } from '@/lib/companyLimits';

// ✅ POST /api/companies/switch - Switch active company
export async function POST(request: NextRequest) {
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
      
      const { companyId } = await request.json();
      
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

      const company = await Company.findById(companyId)
        .select('_id name email logo')
        .lean();

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
    console.error('❌ Switch company error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}