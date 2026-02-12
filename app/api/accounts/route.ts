// app/api/accounts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Account from '@/models/Account';
import UserCompany from '@/models/UserCompany';
import { NotificationService } from '@/services/notificationService';

// ✅ GET ALL ACCOUNTS
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/accounts - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

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
      const type = searchParams.get('type');
      const status = searchParams.get('status');
      const search = searchParams.get('search');
      const limit = parseInt(searchParams.get('limit') || '50');
      const page = parseInt(searchParams.get('page') || '1');
      const skip = (page - 1) * limit;

      let query: any = { 
        companyId: userCompany.companyId,
        $or: [
          { userId: decoded.userId },
          { ownerId: decoded.userId },
          { 'sharedWith.userId': decoded.userId }
        ]
      };

      if (type && type !== 'all') {
        query.type = type;
      }

      if (status && status !== 'all') {
        query.status = status;
      }

      if (search) {
        query.$or = [
          ...query.$or,
          { name: { $regex: search, $options: 'i' } },
          { legalName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { taxId: { $regex: search, $options: 'i' } }
        ];
      }

      const total = await Account.countDocuments(query);
      const accounts = await Account.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return NextResponse.json({ 
        success: true,
        accounts,
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
    console.error('❌ Get accounts error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ CREATE ACCOUNT
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/accounts - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

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

      const accountData = await request.json();

      if (!accountData.name) {
        return NextResponse.json(
          { success: false, error: 'Account name is required' },
          { status: 400 }
        );
      }

      const account = new Account({
        ...accountData,
        companyId: userCompany.companyId,
        userId: decoded.userId,
        createdBy: decoded.userId,
        createdByName: decoded.name || 'Unknown',
        ownerId: accountData.ownerId || decoded.userId,
        ownerName: accountData.ownerName || decoded.name,
        stats: {
          totalDeals: 0,
          wonDeals: 0,
          lostDeals: 0,
          totalDealValue: 0,
          averageDealSize: 0,
          totalContacts: 0,
          totalOpenDeals: 0,
          totalOrders: 0,
          totalRevenue: 0
        }
      });

      await account.save();

      console.log('✅ Account created:', account._id);
      return NextResponse.json({ success: true, account }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create account error:', error);
    
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