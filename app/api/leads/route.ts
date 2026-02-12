import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Lead from '@/models/Lead';
import UserCompany from '@/models/UserCompany';

// ✅ GET ALL LEADS - FIXED
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/leads - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    
    await connectToDatabase();

    // Get user's companies (all active companies)
    const userCompanies = await UserCompany.find({
      userId: decoded.userId,
      status: 'active'
    });

    if (!userCompanies || userCompanies.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No active company found' },
        { status: 403 }
      );
    }

    const companyIds = userCompanies.map(uc => uc.companyId);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const companyId = searchParams.get('companyId');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query
    let query: any = { 
      companyId: { $in: companyIds }  // Leads from any company user has access to
    };

    // Filter by specific company if selected
    if (companyId && companyId !== 'all') {
      query.companyId = companyId;
    }

    // Add access control - user can see leads they created, assigned to, or shared with
    query.$or = [
      { userId: decoded.userId },
      { assignedTo: decoded.userId },
      { 'sharedWith.userId': decoded.userId }
    ];

    if (status && status !== 'all') {
      query.status = status;
    }

    if (source && source !== 'all') {
      query.source = source;
    }

    if (search) {
      query.$and = [
        { $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } }
        ]}
      ];
    }

    console.log('🔍 Query:', JSON.stringify(query));

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get stats by company
    const stats = await Lead.aggregate([
      { $match: { companyId: { $in: companyIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log(`✅ Found ${leads.length} leads`);
    
    return NextResponse.json({ 
      success: true,
      leads,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('❌ Get leads error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}

// ✅ CREATE LEAD - FIXED
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/leads - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    
    await connectToDatabase();

    const leadData = await request.json();

    // Validate required fields
    if (!leadData.firstName || !leadData.lastName) {
      return NextResponse.json(
        { success: false, error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    if (!leadData.source) {
      return NextResponse.json(
        { success: false, error: 'Source is required' },
        { status: 400 }
      );
    }

    if (!leadData.companyId) {
      return NextResponse.json(
        { success: false, error: 'Company selection is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this company
    const userCompany = await UserCompany.findOne({
      userId: decoded.userId,
      companyId: leadData.companyId,
      status: 'active'
    });

    if (!userCompany) {
      return NextResponse.json(
        { success: false, error: 'You do not have access to this company' },
        { status: 403 }
      );
    }

    // Check for duplicate email within company
    if (leadData.email) {
      const existingLead = await Lead.findOne({
        companyId: leadData.companyId,
        email: leadData.email
      });

      if (existingLead) {
        return NextResponse.json(
          { success: false, error: 'Lead with this email already exists in this company' },
          { status: 409 }
        );
      }
    }

    const lead = new Lead({
      ...leadData,
      companyId: leadData.companyId,
      userId: decoded.userId,
      createdBy: decoded.userId,
      createdByName: decoded.name || 'System',
      score: leadData.score || 0,
      followUpCount: 0,
      fullName: `${leadData.firstName} ${leadData.lastName}`.trim()
    });

    if (leadData.assignedTo) {
      lead.assignedTo = leadData.assignedTo;
      lead.assignedToName = leadData.assignedToName;
      lead.assignedAt = new Date();
    }

    await lead.save();

    // Update company used seats if needed (optional)
    if (userCompany) {
      // You might want to track lead count per company
    }

    console.log('✅ Lead created:', lead._id);
    
    return NextResponse.json({ 
      success: true, 
      lead 
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Create lead error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}