// app/api/attendance/debug/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔍 DEBUG: Checking employee with ID:', id);
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      console.log('👤 DEBUG: User ID from token:', decoded.userId);
      
      await connectToDatabase();
      
      // Try to find employee without user filter first
      const allEmployees = await Employee.find({}).limit(5);
      console.log('📊 DEBUG: First 5 employees in DB:', allEmployees.map(e => ({
        id: e._id,
        name: e.name,
        userId: e.userId,
        isActive: e.isActive
      })));
      
      // Convert ID to ObjectId
      let employeeObjectId;
      try {
        employeeObjectId = new mongoose.Types.ObjectId(id);
        console.log('✅ DEBUG: Converted to ObjectId:', employeeObjectId);
      } catch (error) {
        console.log('❌ DEBUG: Invalid ObjectId format:', id);
        employeeObjectId = id;
      }
      
      // Check if employee exists at all
      const anyEmployee = await Employee.findOne({ _id: employeeObjectId });
      console.log('🔍 DEBUG: Employee found (any user):', anyEmployee);
      
      // Check with user filter
      const userEmployee = await Employee.findOne({ 
        _id: employeeObjectId, 
        userId: decoded.userId 
      });
      console.log('👤 DEBUG: Employee found (with user filter):', userEmployee);
      
      // Check with user ID as string (if ObjectId fails)
      const userEmployeeString = await Employee.findOne({ 
        _id: id, 
        userId: decoded.userId 
      });
      console.log('📝 DEBUG: Employee found (string ID):', userEmployeeString);
      
      if (!userEmployee && !userEmployeeString) {
        return NextResponse.json({
          debug: {
            requestedId: id,
            userIdFromToken: decoded.userId,
            objectIdAttempt: employeeObjectId.toString(),
            employeeExists: !!anyEmployee,
            employeeUserId: anyEmployee?.userId?.toString(),
            allEmployeesCount: await Employee.countDocuments(),
            userEmployeesCount: await Employee.countDocuments({ userId: decoded.userId })
          },
          error: 'Employee not found for this user'
        });
      }
      
      const foundEmployee = userEmployee || userEmployeeString;
      
      return NextResponse.json({
        success: true,
        employee: {
          _id: foundEmployee._id.toString(),
          name: foundEmployee.name,
          userId: foundEmployee.userId.toString(),
          isActive: foundEmployee.isActive,
          phone: foundEmployee.phone,
          email: foundEmployee.email,
          role: foundEmployee.role
        }
      });
      
    } catch (authError) {
      console.error('❌ DEBUG: Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ DEBUG: Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}