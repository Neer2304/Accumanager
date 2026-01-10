// app/api/attendance/[id]/route.ts - UPDATED FOR NEXT.JS 15
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Employee from '@/models/Employee';
import Attendance from '@/models/Attendance';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🔍 GET /api/attendance/[id] - Starting...');
    
    // Extract params using await (Next.js 15 requires this)
    const { id } = await params;
    console.log('🎯 Requested employee ID:', id);
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('⚠️ No auth token found in request cookies');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      console.log('👤 Decoded user:', decoded.userId);
      
      await connectToDatabase();
      console.log('✅ Database connected');

      // Convert string ID to ObjectId for proper comparison
      let employeeObjectId;
      try {
        employeeObjectId = new mongoose.Types.ObjectId(id);
        console.log('✅ Converted to ObjectId:', employeeObjectId);
      } catch (error) {
        console.log('⚠️ Invalid ObjectId format, using string comparison');
        employeeObjectId = id;
      }

      // Get employee details with user validation
      const employee = await Employee.findOne({ 
        _id: employeeObjectId, 
        userId: decoded.userId 
      });

      if (!employee) {
        console.log('❌ Employee not found. Searching with:', {
          _id: employeeObjectId,
          userId: decoded.userId
        });
        
        // Debug: Check if employee exists at all
        const anyEmployee = await Employee.findOne({ _id: employeeObjectId });
        console.log('🔍 Employee exists at all:', anyEmployee ? 'Yes' : 'No');
        if (anyEmployee) {
          console.log('⚠️ Employee belongs to user:', anyEmployee.userId.toString());
        }
        
        return NextResponse.json(
          { 
            error: 'Employee not found',
            debug: {
              requestedId: id,
              userId: decoded.userId,
              objectId: employeeObjectId.toString(),
              employeeExists: !!anyEmployee,
              employeeUserId: anyEmployee?.userId?.toString()
            }
          },
          { status: 404 }
        );
      }

      console.log('✅ Employee found:', employee.name);

      // Get current month attendance
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const monthString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

      const attendanceRecords = await Attendance.find({
        employeeId: employee._id,
        userId: decoded.userId,
        date: { $regex: `^${monthString}` }
      }).sort({ date: 1 });

      console.log(`📅 Found ${attendanceRecords.length} attendance records`);

      // Generate all dates for current month
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const monthDates = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(currentYear, currentMonth, i + 1);
        return date.toISOString().split('T')[0];
      });

      // Create days array with attendance data
      const days = monthDates.map(date => {
        const existingRecord = attendanceRecords.find(record => record.date === date);
        if (existingRecord) {
          return {
            date: existingRecord.date,
            status: existingRecord.status === 'present' ? 'Present' : 'Absent',
            checkIn: existingRecord.checkIn,
            checkOut: existingRecord.checkOut,
            workHours: existingRecord.workHours,
            overtime: existingRecord.overtime,
            notes: existingRecord.notes,
            lateReason: existingRecord.lateReason
          };
        }
        
        return {
          date,
          status: 'Absent' as const,
          checkIn: '',
          checkOut: '',
          workHours: 0,
          overtime: 0,
          notes: '',
          lateReason: ''
        };
      });

      const employeeData = {
        _id: employee._id.toString(),
        name: employee.name,
        phone: employee.phone,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        salary: employee.salary,
        salaryType: employee.salaryType,
        joiningDate: employee.joiningDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        address: employee.address,
        emergencyContact: employee.emergencyContact,
        bankDetails: employee.bankDetails,
        documents: employee.documents,
        leaveBalance: employee.leaveBalance,
        isActive: employee.isActive,
        days
      };

      console.log('✅ Successfully fetched employee details');
      return NextResponse.json(employeeData);

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get employee details error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also add other methods if needed (PUT, DELETE, etc.)