// app/api/attendance/debug/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/attendance/debug - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      console.log('👤 Decoded user:', decoded.userId);
      
      await connectToDatabase();
      console.log('✅ Database connected');

      // Get all employees for this user
      const employees = await Employee.find({ userId: decoded.userId });
      
      console.log(`📊 Found ${employees.length} employees total`);
      
      const employeesData = employees.map(emp => ({
        _id: emp._id.toString(),
        _idType: typeof emp._id,
        name: emp.name,
        userId: emp.userId?.toString(),
        userIdType: typeof emp.userId,
        isObjectId: emp._id instanceof mongoose.Types.ObjectId,
        isString: typeof emp._id === 'string'
      }));

      return NextResponse.json({
        totalEmployees: employees.length,
        employees: employeesData,
        userFromToken: decoded.userId,
        userFromTokenType: typeof decoded.userId
      });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Debug error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}