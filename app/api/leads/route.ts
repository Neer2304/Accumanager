// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Lead from '@/models/Lead';
import CompanyMember from '@/models/CompanyMember';
import { Types } from 'mongoose';

// ✅ GET /api/leads - Get all leads for user's companies
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/leads - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }

    await connectToDatabase();

    // Get all companies where user is an active member
    const memberships = await CompanyMember.find({
      memberId: decoded.userId,
      status: 'active'
    }).lean();

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({
        success: true,
        leads: [],
        stats: [],
        message: 'No companies found'
      });
    }

    const companyIds = memberships.map(m => m.companyId);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const companyId = searchParams.get('companyId');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};

    // Filter by specific company if provided
    if (companyId && companyId !== 'all' && companyId !== 'undefined' && companyId !== '') {
      // Verify user has access to this specific company
      const hasAccess = memberships.some(m => m.companyId.toString() === companyId);
      if (!hasAccess) {
        return NextResponse.json({ 
          success: false, 
          error: 'Access denied to this company' 
        }, { status: 403 });
      }
      query.companyId = new Types.ObjectId(companyId);
    } else {
      // User can see leads from all their companies
      query.companyId = { $in: companyIds.map(id => new Types.ObjectId(id)) };
    }

    // Apply filters
    if (status && status !== 'all' && status !== 'undefined' && status !== '') {
      query.status = status;
    }

    if (source && source !== 'all' && source !== 'undefined' && source !== '') {
      query.source = source;
    }

    // Search functionality
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { companyName: searchRegex },
        { fullName: searchRegex },
        { position: searchRegex }
      ];
    }

    console.log('🔍 Query:', JSON.stringify(query, null, 2));

    // Get total count
    const total = await Lead.countDocuments(query);

    // Get leads with sorting
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get stats by status for all user's companies
    const stats = await Lead.aggregate([
      { 
        $match: { 
          companyId: { $in: companyIds.map(id => new Types.ObjectId(id)) } 
        } 
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log(`✅ Found ${leads.length} leads (total: ${total})`);
    
    // Format response with string IDs
    const formattedLeads = leads.map(lead => ({
      ...lead,
      _id: lead._id.toString(),
      companyId: lead.companyId.toString(),
      userId: lead.userId.toString(),
      assignedTo: lead.assignedTo?.toString(),
      createdBy: lead.createdBy.toString(),
      updatedBy: lead.updatedBy?.toString(),
      convertedToContact: lead.convertedToContact?.toString(),
      convertedToDeal: lead.convertedToDeal?.toString()
    }));

    return NextResponse.json({ 
      success: true,
      leads: formattedLeads,
      stats: stats.map(s => ({ status: s._id, count: s.count })),
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
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// ✅ POST /api/leads - Create new lead
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/leads - Creating lead');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }

    await connectToDatabase();

    const leadData = await request.json();

    // Validate required fields
    const errors: Record<string, string> = {};
    
    if (!leadData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!leadData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!leadData.source) {
      errors.source = 'Source is required';
    }
    
    if (!leadData.companyId) {
      errors.companyId = 'Company is required';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: errors
      }, { status: 400 });
    }

    // Verify user is an active member of this company
    const membership = await CompanyMember.findOne({
      memberId: decoded.userId,
      companyId: leadData.companyId,
      status: 'active'
    });

    if (!membership) {
      return NextResponse.json({ 
        success: false, 
        error: 'You do not have access to this company' 
      }, { status: 403 });
    }

    // Check for duplicate email within same company
    if (leadData.email) {
      const existingLead = await Lead.findOne({
        companyId: leadData.companyId,
        email: leadData.email.toLowerCase().trim()
      });

      if (existingLead) {
        return NextResponse.json({
          success: false,
          error: 'A lead with this email already exists in this company'
        }, { status: 409 });
      }
    }

    // Prepare lead data
    const lead = new Lead({
      companyId: leadData.companyId,
      userId: decoded.userId,
      firstName: leadData.firstName.trim(),
      lastName: leadData.lastName.trim(),
      email: leadData.email?.toLowerCase().trim(),
      phone: leadData.phone?.trim(),
      source: leadData.source,
      status: leadData.status || 'new',
      score: leadData.score || 0,
      companyName: leadData.companyName?.trim(),
      position: leadData.position?.trim(),
      budget: leadData.budget ? parseFloat(leadData.budget) : undefined,
      currency: leadData.currency || 'USD',
      interestLevel: leadData.interestLevel || 'medium',
      tags: leadData.tags ? (Array.isArray(leadData.tags) ? leadData.tags : 
             leadData.tags.split(',').map((t: string) => t.trim()).filter(Boolean)) : [],
      notes: leadData.notes?.trim(),
      createdBy: decoded.userId,
      createdByName: decoded.name || 'User',
      followUpCount: 0
    });

    // Handle assignment
    if (leadData.assignedTo) {
      // Verify assigned user is an active member of the company
      const assignedMember = await CompanyMember.findOne({
        memberId: leadData.assignedTo,
        companyId: leadData.companyId,
        status: 'active'
      });

      if (assignedMember) {
        lead.assignedTo = leadData.assignedTo;
        lead.assignedToName = leadData.assignedToName || assignedMember.memberName;
        lead.assignedAt = new Date();
      }
    }

    await lead.save();

    console.log('✅ Lead created:', lead._id);
    
    // Return created lead with string IDs
    const savedLead = lead.toObject();
    return NextResponse.json({ 
      success: true, 
      lead: {
        ...savedLead,
        _id: savedLead._id.toString(),
        companyId: savedLead.companyId.toString(),
        userId: savedLead.userId.toString(),
        assignedTo: savedLead.assignedTo?.toString(),
        createdBy: savedLead.createdBy.toString()
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Create lead error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field.includes('email')) {
        return NextResponse.json({
          success: false,
          error: 'A lead with this email already exists'
        }, { status: 409 });
      }
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).reduce((acc: any, err: any) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: errors
      }, { status: 400 });
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