// app/api/contacts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Contact from '@/models/Contacts';
import UserCompany from '@/models/UserCompany';
import { NotificationService } from '@/services/notificationService';

// ✅ GET ALL CONTACTS
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/contacts - Starting...');
    
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
      const accountId = searchParams.get('accountId');
      const lifecycleStage = searchParams.get('lifecycleStage');
      const search = searchParams.get('search');
      const limit = parseInt(searchParams.get('limit') || '50');
      const page = parseInt(searchParams.get('page') || '1');
      const skip = (page - 1) * limit;

      let query: any = { 
        companyId: userCompany.companyId,
        isActive: true,
        $or: [
          { userId: decoded.userId },
          { ownerId: decoded.userId },
          { 'sharedWith.userId': decoded.userId }
        ]
      };

      if (accountId) {
        query.accountId = accountId;
      }

      if (lifecycleStage && lifecycleStage !== 'all') {
        query.lifecycleStage = lifecycleStage;
      }

      if (search) {
        query.$or = [
          ...query.$or,
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } },
          { 'emails.email': { $regex: search, $options: 'i' } },
          { 'phones.number': { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } }
        ];
      }

      const total = await Contact.countDocuments(query);
      const contacts = await Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get lifecycle stats
      const stats = await Contact.aggregate([
        { $match: { companyId: userCompany.companyId, isActive: true } },
        {
          $group: {
            _id: '$lifecycleStage',
            count: { $sum: 1 }
          }
        }
      ]);

      console.log(`✅ Found ${contacts.length} contacts`);
      return NextResponse.json({ 
        success: true,
        contacts,
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
    console.error('❌ Get contacts error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ CREATE CONTACT
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/contacts - Starting...');
    
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

      const contactData = await request.json();

      // Validate required fields
      if (!contactData.firstName || !contactData.lastName) {
        return NextResponse.json(
          { success: false, error: 'First name and last name are required' },
          { status: 400 }
        );
      }

      // Check for duplicate email
      if (contactData.emails && contactData.emails.length > 0) {
        const primaryEmail = contactData.emails.find((e: any) => e.isPrimary)?.email;
        if (primaryEmail) {
          const existingContact = await Contact.findOne({
            companyId: userCompany.companyId,
            'emails.email': primaryEmail
          });

          if (existingContact) {
            return NextResponse.json(
              { success: false, error: 'Contact with this email already exists' },
              { status: 409 }
            );
          }
        }
      }

      const contact = new Contact({
        ...contactData,
        companyId: userCompany.companyId,
        userId: decoded.userId,
        createdBy: decoded.userId,
        createdByName: decoded.name || 'Unknown',
        ownerId: contactData.ownerId || decoded.userId,
        ownerName: contactData.ownerName || decoded.name,
        fullName: `${contactData.firstName} ${contactData.lastName}`.trim()
      });

      await contact.save();

      // If linked to account, update account stats
      if (contactData.accountId) {
        try {
          const Account = (await import('@/models/Account')).default;
          await Account.findByIdAndUpdate(contactData.accountId, {
            $inc: { 'stats.totalContacts': 1 },
            $set: { lastActivityAt: new Date() }
          });
        } catch (error) {
          console.error('⚠️ Failed to update account stats:', error);
        }
      }

      // Create notification
      try {
        await NotificationService.notifyContactCreated(contact, decoded.userId);
      } catch (notifError) {
        console.error('⚠️ Failed to create notification:', notifError);
      }

      console.log('✅ Contact created:', contact._id);
      return NextResponse.json({ success: true, contact }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create contact error:', error);
    
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