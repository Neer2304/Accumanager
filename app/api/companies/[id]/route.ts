import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Company from '@/models/Company';
import UserCompany from '@/models/UserCompany';

type tParams = Promise<{ id: string }>

// ✅ GET /api/companies/[id] - Get company details
export async function GET(
  request: NextRequest,
  { params }: { params: tParams }
) {
  try {
    const { id } = await params;
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    // Check if user has access to this company
    const access = await UserCompany.findOne({
      userId: decoded.userId,
      companyId: id,
      status: 'active'
    });

    const company = await Company.findById(id);
    
    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      company,
      hasAccess: !!access,
      isCreator: company.createdBy.toString() === decoded.userId,
      isOwner: company.userId.toString() === decoded.userId
    });

  } catch (error: any) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}