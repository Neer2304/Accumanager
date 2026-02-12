// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Lead from '@/models/Lead';
import UserCompany from '@/models/UserCompany';
import { NotificationService } from '@/services/notificationService';
import mongoose from 'mongoose';

// ✅ GET ALL LEADS
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/leads - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      // Get user's default company
      const userCompany = await UserCompany.findOne({
        userId: decoded.userId,
        isDefault: true,
        status: 'active'
      });

      if (!userCompany) {
        return NextResponse.json(
          { success: false, error: 'No active company found' },
          { status: 403 }
        );
      }

      const { searchParams } = new URL(request.url);
      const status = searchParams.get('status');
      const source = searchParams.get('source');
      const assignedTo = searchParams.get('assignedTo');
      const search = searchParams.get('search');
      const limit = parseInt(searchParams.get('limit') || '50');
      const page = parseInt(searchParams.get('page') || '1');
      const skip = (page - 1) * limit;

      let query: any = { 
        companyId: userCompany.companyId,
        $or: [
          { userId: decoded.userId },
          { assignedTo: decoded.userId },
          { 'sharedWith.userId': decoded.userId }
        ]
      };

      if (status && status !== 'all') {
        query.status = status;
      }

      if (source && source !== 'all') {
        query.source = source;
      }

      if (assignedTo) {
        query.assignedTo = assignedTo;
      }

      if (search) {
        query.$or = [
          ...query.$or,
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } }
        ];
      }

      const total = await Lead.countDocuments(query);
      const leads = await Lead.find(query)
        .sort({ createdAt: -1, priority: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get stats
      const stats = await Lead.aggregate([
        { $match: { companyId: userCompany.companyId } },
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

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get leads error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ CREATE LEAD
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/leads - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      // Get user's default company
      const userCompany = await UserCompany.findOne({
        userId: decoded.userId,
        isDefault: true,
        status: 'active'
      });

      if (!userCompany) {
        return NextResponse.json(
          { success: false, error: 'No active company found' },
          { status: 403 }
        );
      }

      const leadData = await request.json();

      // Validate required fields
      if (!leadData.firstName || !leadData.lastName || !leadData.source) {
        return NextResponse.json(
          { success: false, error: 'First name, last name, and source are required' },
          { status: 400 }
        );
      }

      // Check for duplicate email within company
      if (leadData.email) {
        const existingLead = await Lead.findOne({
          companyId: userCompany.companyId,
          email: leadData.email
        });

        if (existingLead) {
          return NextResponse.json(
            { success: false, error: 'Lead with this email already exists' },
            { status: 409 }
          );
        }
      }

      const lead = new Lead({
        ...leadData,
        companyId: userCompany.companyId,
        userId: decoded.userId,
        createdBy: decoded.userId,
        createdByName: decoded.name || 'Unknown',
        assignedToName: leadData.assignedTo ? decoded.name : null,
        score: leadData.score || 0,
        followUpCount: 0
      });

      await lead.save();

      // Create notification
      try {
        await NotificationService.notifyLeadCreated(lead, decoded.userId);
      } catch (notifError) {
        console.error('⚠️ Failed to create notification:', notifError);
      }

      console.log('✅ Lead created:', lead._id);
      return NextResponse.json({ success: true, lead }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create lead error:', error);
    
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