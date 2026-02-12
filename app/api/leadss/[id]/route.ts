// app/api/leads/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Lead from '@/models/Lead';
import UserCompany from '@/models/UserCompany';
import { NotificationService } from '@/services/notificationService';
import Activity from '@/models/Activity';

// ✅ GET SINGLE LEAD
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 GET /api/leads/${params.id} - Starting...`);
    
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

      const lead = await Lead.findOne({
        _id: params.id,
        companyId: userCompany.companyId,
        $or: [
          { userId: decoded.userId },
          { assignedTo: decoded.userId },
          { 'sharedWith.userId': decoded.userId }
        ]
      }).lean();

      if (!lead) {
        return NextResponse.json(
          { success: false, error: 'Lead not found' },
          { status: 404 }
        );
      }

      // Get related activities
      const activities = await Activity.find({
        companyId: userCompany.companyId,
        'relatedTo.id': lead._id,
        'relatedTo.model': 'Lead'
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      return NextResponse.json({ 
        success: true,
        lead,
        activities
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get lead error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ UPDATE LEAD
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

      // Get existing lead
      const existingLead = await Lead.findOne({
        _id: params.id,
        companyId: userCompany.companyId,
        $or: [
          { userId: decoded.userId },
          { assignedTo: decoded.userId },
          { 'sharedWith.userId': decoded.userId, 'sharedWith.permissions.write': true }
        ]
      });

      if (!existingLead) {
        return NextResponse.json(
          { success: false, error: 'Lead not found or no write permission' },
          { status: 404 }
        );
      }

      const updateData = await request.json();
      const oldStatus = existingLead.status;
      const oldAssignedTo = existingLead.assignedTo;

      // Update lead
      const updatedLead = await Lead.findByIdAndUpdate(
        params.id,
        {
          ...updateData,
          updatedBy: decoded.userId,
          updatedByName: decoded.name,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      // Create notifications for changes
      try {
        if (updateData.status && updateData.status !== oldStatus) {
          await NotificationService.notifyLeadStatusChanged(
            updatedLead,
            oldStatus,
            updateData.status,
            decoded.userId
          );
        }

        if (updateData.assignedTo && updateData.assignedTo !== oldAssignedTo?.toString()) {
          await NotificationService.notifyLeadAssigned(
            updatedLead,
            updateData.assignedTo,
            decoded.userId
          );
        }
      } catch (notifError) {
        console.error('⚠️ Failed to create notification:', notifError);
      }

      return NextResponse.json({ success: true, lead: updatedLead });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Update lead error:', error);
    
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

// ✅ DELETE LEAD
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

      const lead = await Lead.findOne({
        _id: params.id,
        companyId: userCompany.companyId,
        $or: [
          { userId: decoded.userId },
          { 'sharedWith.userId': decoded.userId, 'sharedWith.permissions.write': true }
        ]
      });

      if (!lead) {
        return NextResponse.json(
          { success: false, error: 'Lead not found or no delete permission' },
          { status: 404 }
        );
      }

      await Lead.findByIdAndDelete(params.id);

      // Delete related activities
      await Activity.deleteMany({
        companyId: userCompany.companyId,
        'relatedTo.id': lead._id,
        'relatedTo.model': 'Lead'
      });

      // Create notification
      try {
        await NotificationService.notifyLeadDeleted(lead, decoded.userId);
      } catch (notifError) {
        console.error('⚠️ Failed to create notification:', notifError);
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Lead deleted successfully' 
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Delete lead error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ CONVERT LEAD TO CONTACT & DEAL
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

      const lead = await Lead.findOne({
        _id: params.id,
        companyId: userCompany.companyId,
        userId: decoded.userId
      });

      if (!lead) {
        return NextResponse.json(
          { success: false, error: 'Lead not found' },
          { status: 404 }
        );
      }

      if (lead.convertedToContact) {
        return NextResponse.json(
          { success: false, error: 'Lead already converted' },
          { status: 400 }
        );
      }

      // Import models
      const Contact = (await import('@/models/Contact')).default;
      const Deal = (await import('@/models/Deal')).default;

      // Create contact from lead
      const contact = new Contact({
        companyId: lead.companyId,
        userId: lead.userId,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        position: lead.position,
        companyName: lead.companyName,
        source: 'lead_conversion',
        lifecycleStage: 'customer',
        createdBy: decoded.userId,
        createdByName: decoded.name,
        ownerId: lead.assignedTo || lead.userId,
        ownerName: lead.assignedToName || decoded.name,
        emails: lead.email ? [{
          email: lead.email,
          type: 'work',
          isPrimary: true,
          isVerified: false
        }] : [],
        phones: lead.phone ? [{
          number: lead.phone,
          type: 'mobile',
          isPrimary: true,
          isWhatsApp: false
        }] : []
      });

      await contact.save();

      // Create deal from lead
      const deal = new Deal({
        companyId: lead.companyId,
        userId: lead.userId,
        name: `${lead.fullName} - ${lead.companyName || 'New Deal'}`,
        accountName: lead.companyName,
        contactId: contact._id,
        contactName: contact.fullName,
        leadId: lead._id,
        dealValue: lead.budget || 0,
        currency: lead.currency || 'USD',
        probability: 50,
        expectedClosingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        pipelineStage: 'qualification',
        assignedTo: lead.assignedTo || lead.userId,
        assignedToName: lead.assignedToName || decoded.name,
        createdBy: decoded.userId,
        createdByName: decoded.name,
        status: 'open'
      });

      await deal.save();

      // Update lead with conversion info
      lead.status = 'converted';
      lead.convertedToContact = contact._id;
      lead.convertedToDeal = deal._id;
      lead.convertedAt = new Date();
      await lead.save();

      return NextResponse.json({ 
        success: true,
        message: 'Lead converted successfully',
        contact,
        deal
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Convert lead error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}