import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import { CompanyLimitService, COMPANY_LIMITS } from '@/lib/companyLimits';

// ✅ GET /api/companies/limits - Check company creation limits
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
      await connectToDatabase();

      const limits = await CompanyLimitService.canCreateCompany(decoded.userId);

      return NextResponse.json({
        success: true,
        limits: {
          maxCompanies: limits.max,
          currentCompanies: limits.current,
          remaining: limits.remaining,
          canCreate: limits.canCreate
        }
      });

    } catch (authError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Check limits error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}