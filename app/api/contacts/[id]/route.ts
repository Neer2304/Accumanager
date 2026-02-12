// app/api/contacts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Contact from '@/models/Contacts';
import UserCompany from '@/models/UserCompany';
import { NotificationService } from '@/services/notificationService';
import Activity from '@/models/Activity';
import Deal from '@/models/Deal';

// ✅ GET SINGLE CONTACT
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 GET /api/contacts/${params.id} - Starting...`);
    
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

      const contact = await Contact.findOne({
        _id: params.id,
        companyId: userCompany.companyId,
        $or: [
          { userId: decoded.userId },
          { ownerId: decoded.userId },
          { 'sharedWith.userId': decoded.userId }
        ]
      }).lean();

      if (!contact) {
        return NextResponse.json(
          { success: false, error: 'Contact not found' },
          { status: 404 }
        );
      }

      // Get related deals
      const deals = await Deal.find({
        companyId: userCompany.companyId,
        contactId: contact._id
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      // Get related activities
      const activities = await Activity.find({
        companyId: userCompany.companyId,
        'relatedTo.id': contact._id,
        'relatedTo.model': 'Contact'
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      return NextResponse.json({ 
        success: true,
        contact,
        deals,
        activities
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get contact error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ UPDATE CONTACT
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

      const existingContact = await Contact.findOne({
        _id: params.id,
        companyId: userCompany.companyId,
        $or: [
          { userId: decoded.userId },
          { ownerId: decoded.userId },
          { 'sharedWith.userId': decoded.userId, 'sharedWith.permissions.write': true }
        ]
      });

      if (!existingContact) {
        return NextResponse.json(
          { success: false, error: 'Contact not found or no write permission' },
          { status: 404 }
        );
      }

      const updateData = await request.json();

      // Update full name if first/last name changed
      if (updateData.firstName || updateData.lastName) {
        updateData.fullName = `${updateData.firstName || existingContact.firstName} ${updateData.lastName || existingContact.lastName}`.trim();
      }

      const updatedContact = await Contact.findByIdAndUpdate(
        params.id,
        {
          ...updateData,
          updatedBy: decoded.userId,
          updatedByName: decoded.name,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      return NextResponse.json({ success: true, contact: updatedContact });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Update contact error:', error);
    
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

// ✅ DELETE CONTACT
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

      const contact = await Contact.findOne({
        _id: params.id,
        companyId: userCompany.companyId,
        $or: [
          { userId: decoded.userId },
          { 'sharedWith.userId': decoded.userId, 'sharedWith.permissions.write': true }
        ]
      });

      if (!contact) {
        return NextResponse.json(
          { success: false, error: 'Contact not found or no delete permission' },
          { status: 404 }
        );
      }

      // Soft delete
      await Contact.findByIdAndUpdate(params.id, {
        isActive: false,
        updatedBy: decoded.userId,
        updatedByName: decoded.name
      });

      // Update account stats if linked
      if (contact.accountId) {
        try {
          const Account = (await import('@/models/Account')).default;
          await Account.findByIdAndUpdate(contact.accountId, {
            $inc: { 'stats.totalContacts': -1 }
          });
        } catch (error) {
          console.error('⚠️ Failed to update account stats:', error);
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Contact deleted successfully' 
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Delete contact error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}