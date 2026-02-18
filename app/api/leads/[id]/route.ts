// app/api/leads/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Lead from '@/models/Lead';
import CompanyMember from '@/models/CompanyMember';
import { Types } from 'mongoose';

// Helper to check user access to lead
async function checkLeadAccess(leadId: string, userId: string) {
  if (!Types.ObjectId.isValid(leadId)) {
    return { hasAccess: false, lead: null, error: 'Invalid lead ID' };
  }

  const lead = await Lead.findById(leadId);
  if (!lead) {
    return { hasAccess: false, lead: null, error: 'Lead not found' };
  }

  // Check if user is an active member of the lead's company
  const membership = await CompanyMember.findOne({
    memberId: userId,
    companyId: lead.companyId,
    status: 'active'
  });

  if (!membership) {
    return { hasAccess: false, lead: null, error: 'Access denied' };
  }

  return { hasAccess: true, lead, membership };
}

// ✅ GET /api/leads/[id] - Get single lead
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 GET /api/leads/${params.id}`);
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const { hasAccess, lead, error } = await checkLeadAccess(params.id, decoded.userId);
    
    if (!hasAccess) {
      return NextResponse.json({ success: false, error }, { status: error === 'Lead not found' ? 404 : 403 });
    }

    // Convert ObjectIds to strings
    const formattedLead = {
      ...lead!.toObject(),
      _id: lead!._id.toString(),
      companyId: lead!.companyId.toString(),
      userId: lead!.userId.toString(),
      assignedTo: lead!.assignedTo?.toString(),
      createdBy: lead!.createdBy.toString(),
      updatedBy: lead!.updatedBy?.toString(),
      convertedToContact: lead!.convertedToContact?.toString(),
      convertedToDeal: lead!.convertedToDeal?.toString()
    };

    return NextResponse.json({ 
      success: true,
      lead: formattedLead
    });

  } catch (error: any) {
    console.error('❌ Get lead error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ PUT /api/leads/[id] - Update lead
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 PUT /api/leads/${params.id}`);
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const { hasAccess, lead, error } = await checkLeadAccess(params.id, decoded.userId);
    
    if (!hasAccess) {
      return NextResponse.json({ success: false, error }, { status: error === 'Lead not found' ? 404 : 403 });
    }

    const updateData = await request.json();
    const oldStatus = lead!.status;
    const oldAssignedTo = lead!.assignedTo?.toString();

    // Prepare update object
    const update: any = {
      updatedBy: decoded.userId,
      updatedByName: decoded.name || 'User',
      updatedAt: new Date()
    };

    // Update fields if provided
    const allowedFields = [
      'firstName', 'lastName', 'email', 'phone', 'source', 'status',
      'companyName', 'position', 'budget', 'currency', 'interestLevel',
      'tags', 'notes', 'lastContactedAt', 'nextFollowUp', 'score'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        if (field === 'email' && updateData.email) {
          update[field] = updateData.email.toLowerCase().trim();
        } else if (field === 'tags' && updateData.tags) {
          update[field] = Array.isArray(updateData.tags) ? updateData.tags : 
                         updateData.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        } else if (field === 'budget' && updateData.budget) {
          update[field] = parseFloat(updateData.budget);
        } else if (typeof updateData[field] === 'string') {
          update[field] = updateData[field].trim();
        } else {
          update[field] = updateData[field];
        }
      }
    });

    // Handle assignment
    if (updateData.assignedTo !== undefined) {
      if (updateData.assignedTo) {
        // Verify assigned user is an active member of the company
        const assignedMember = await CompanyMember.findOne({
          memberId: updateData.assignedTo,
          companyId: lead!.companyId,
          status: 'active'
        });

        if (assignedMember) {
          update.assignedTo = updateData.assignedTo;
          update.assignedToName = updateData.assignedToName || assignedMember.memberName;
          update.assignedAt = new Date();
        }
      } else {
        // Unassign
        update.assignedTo = null;
        update.assignedToName = null;
      }
    }

    // Check for duplicate email if email is being changed
    if (updateData.email && updateData.email !== lead!.email) {
      const existingLead = await Lead.findOne({
        companyId: lead!.companyId,
        email: updateData.email.toLowerCase().trim(),
        _id: { $ne: params.id }
      });

      if (existingLead) {
        return NextResponse.json({
          success: false,
          error: 'A lead with this email already exists in this company'
        }, { status: 409 });
      }
    }

    // Update lead
    const updatedLead = await Lead.findByIdAndUpdate(
      params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    console.log('✅ Lead updated:', params.id);

    // Format response
    const formattedLead = {
      ...updatedLead.toObject(),
      _id: updatedLead._id.toString(),
      companyId: updatedLead.companyId.toString(),
      userId: updatedLead.userId.toString(),
      assignedTo: updatedLead.assignedTo?.toString(),
      createdBy: updatedLead.createdBy.toString(),
      updatedBy: updatedLead.updatedBy?.toString()
    };

    return NextResponse.json({ 
      success: true, 
      lead: formattedLead
    });

  } catch (error: any) {
    console.error('❌ Update lead error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).reduce((acc: any, err: any) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      
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

// ✅ DELETE /api/leads/[id] - Delete lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 DELETE /api/leads/${params.id}`);
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const { hasAccess, lead, error } = await checkLeadAccess(params.id, decoded.userId);
    
    if (!hasAccess) {
      return NextResponse.json({ success: false, error }, { status: error === 'Lead not found' ? 404 : 403 });
    }

    // Delete the lead
    await Lead.findByIdAndDelete(params.id);

    console.log('✅ Lead deleted:', params.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Lead deleted successfully' 
    });

  } catch (error: any) {
    console.error('❌ Delete lead error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ POST /api/leads/[id]/convert - Convert lead to contact and deal
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 POST /api/leads/${params.id}/convert - Converting lead`);
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const { hasAccess, lead, error } = await checkLeadAccess(params.id, decoded.userId);
    
    if (!hasAccess) {
      return NextResponse.json({ success: false, error }, { status: error === 'Lead not found' ? 404 : 403 });
    }

    if (lead!.convertedToContact) {
      return NextResponse.json(
        { success: false, error: 'Lead already converted' },
        { status: 400 }
      );
    }

    // Dynamically import models to avoid circular dependencies
    const Contact = (await import('@/models/Contact')).default;
    const Deal = (await import('@/models/Deal')).default;

    // Create contact from lead
    const contact = new Contact({
      companyId: lead!.companyId,
      userId: lead!.userId,
      firstName: lead!.firstName,
      lastName: lead!.lastName,
      email: lead!.email,
      phone: lead!.phone,
      position: lead!.position,
      companyName: lead!.companyName,
      source: 'lead_conversion',
      lifecycleStage: 'customer',
      createdBy: decoded.userId,
      createdByName: decoded.name || 'User',
      ownerId: lead!.assignedTo || lead!.userId,
      ownerName: lead!.assignedToName || decoded.name,
      emails: lead!.email ? [{
        email: lead!.email,
        type: 'work',
        isPrimary: true,
        isVerified: false
      }] : [],
      phones: lead!.phone ? [{
        number: lead!.phone,
        type: 'mobile',
        isPrimary: true,
        isWhatsApp: false
      }] : []
    });

    await contact.save();

    // Create deal from lead
    const deal = new Deal({
      companyId: lead!.companyId,
      userId: lead!.userId,
      name: `${lead!.fullName} - ${lead!.companyName || 'New Deal'}`,
      accountName: lead!.companyName,
      contactId: contact._id,
      contactName: contact.fullName,
      leadId: lead!._id,
      dealValue: lead!.budget || 0,
      currency: lead!.currency || 'USD',
      probability: 50,
      expectedClosingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      pipelineStage: 'qualification',
      assignedTo: lead!.assignedTo || lead!.userId,
      assignedToName: lead!.assignedToName || decoded.name,
      createdBy: decoded.userId,
      createdByName: decoded.name || 'User',
      status: 'open'
    });

    await deal.save();

    // Update lead with conversion info
    lead!.status = 'converted';
    lead!.convertedToContact = contact._id;
    lead!.convertedToDeal = deal._id;
    lead!.convertedAt = new Date();
    lead!.updatedBy = decoded.userId;
    lead!.updatedByName = decoded.name;
    await lead!.save();

    console.log('✅ Lead converted:', params.id);

    return NextResponse.json({ 
      success: true,
      message: 'Lead converted successfully',
      contact: {
        ...contact.toObject(),
        _id: contact._id.toString(),
        companyId: contact.companyId.toString(),
        userId: contact.userId.toString(),
        ownerId: contact.ownerId?.toString(),
        createdBy: contact.createdBy.toString()
      },
      deal: {
        ...deal.toObject(),
        _id: deal._id.toString(),
        companyId: deal.companyId.toString(),
        userId: deal.userId.toString(),
        contactId: deal.contactId.toString(),
        leadId: deal.leadId.toString(),
        assignedTo: deal.assignedTo?.toString(),
        createdBy: deal.createdBy.toString()
      }
    });

  } catch (error: any) {
    console.error('❌ Convert lead error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}