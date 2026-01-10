// app/api/attendance/route.ts - UPDATED WITH PAYMENT SERVICE
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Employee from '@/models/Employee';
import Attendance from '@/models/Attendance';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';
import { PaymentService } from '@/services/paymentService';

// Helper to generate dates for current month
function generateMonthDates(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return date.toISOString().split('T')[0];
  });
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/attendance - Starting...');
    
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

      // Check subscription limits
      const subscription = await PaymentService.checkSubscription(decoded.userId);
      console.log('📊 Subscription status:', subscription);

      if (!subscription.isActive) {
        return NextResponse.json(
          { error: 'Please upgrade your subscription to access employee management' },
          { status: 402 }
        );
      }

      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const monthString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

      // Get all active employees for this user
      const employees = await Employee.find({ 
        userId: decoded.userId, 
        isActive: true 
      }).sort({ name: 1 });

      console.log(`📊 Found ${employees.length} employees for user ${decoded.userId}`);

      // Check employee limit
      if (employees.length >= subscription.limits.employees) {
        return NextResponse.json(
          { error: `Employee limit reached. Please upgrade to add more employees. Current limit: ${subscription.limits.employees}` },
          { status: 402 }
        );
      }

      // For each employee, get or create attendance for current month
      const employeesWithAttendance = await Promise.all(
        employees.map(async (employee) => {
          console.log(`👤 Processing employee: ${employee.name} (${employee._id})`);
          
          // Get existing attendance records for this month
          const attendanceRecords = await Attendance.find({
            employeeId: employee._id,
            userId: decoded.userId,
            date: { $regex: `^${monthString}` }
          }).sort({ date: 1 });

          console.log(`📅 Found ${attendanceRecords.length} attendance records for ${employee.name}`);

          // Generate all dates for current month
          const monthDates = generateMonthDates(currentYear, currentMonth);
          
          // Create attendance data for each date
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
            
            // Default to absent if no record exists
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

          console.log(`✅ Processed ${employee.name} with ${days.length} days`);
          return employeeData;
        })
      );

      console.log('🎉 Successfully fetched all employee data for user:', decoded.userId);
      return NextResponse.json(employeesWithAttendance);

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get attendance error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/attendance - Starting...');
    
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

      // Check subscription before creating employee
      const subscription = await PaymentService.checkSubscription(decoded.userId);
      
      if (!subscription.isActive) {
        return NextResponse.json(
          { error: 'Please upgrade your subscription to add employees' },
          { status: 402 }
        );
      }

      // Check employee count against limit
      const employeeCount = await Employee.countDocuments({ userId: decoded.userId });
      if (employeeCount >= subscription.limits.employees) {
        return NextResponse.json(
          { error: `Employee limit reached (${subscription.limits.employees}). Please upgrade your plan.` },
          { status: 402 }
        );
      }

      const { 
        name, 
        phone, 
        email, 
        role, 
        department, 
        salary, 
        salaryType,
        joiningDate,
        address,
        emergencyContact,
        bankDetails,
        documents
      } = await request.json();

      console.log('📝 Creating new employee for user:', decoded.userId);

      if (!name || !phone) {
        return NextResponse.json(
          { error: 'Name and phone are required' },
          { status: 400 }
        );
      }

      // Validate phone number format
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        return NextResponse.json(
          { error: 'Please enter a valid 10-digit phone number' },
          { status: 400 }
        );
      }

      // Validate email if provided
      if (email && !/\S+@\S+\.\S+/.test(email)) {
        return NextResponse.json(
          { error: 'Please enter a valid email address' },
          { status: 400 }
        );
      }

      // Check if employee with same phone already exists for this user
      const existingEmployee = await Employee.findOne({ phone, userId: decoded.userId });
      if (existingEmployee) {
        return NextResponse.json(
          { error: 'Employee with this phone number already exists' },
          { status: 400 }
        );
      }

      // Create new employee
      const employee = new Employee({
        name,
        phone,
        email,
        role: role || 'Employee',
        department,
        salary: salary || 0,
        salaryType: salaryType || 'monthly',
        joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
        address,
        emergencyContact,
        bankDetails,
        documents,
        leaveBalance: 12,
        userId: decoded.userId
      });

      await employee.save();
      console.log('✅ Employee created successfully for user:', decoded.userId);

      // Return the employee data
      return NextResponse.json({
        _id: employee._id.toString(),
        name: employee.name,
        phone: employee.phone,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        salary: employee.salary,
        salaryType: employee.salaryType,
        joiningDate: employee.joiningDate.toISOString().split('T')[0],
        address: employee.address,
        emergencyContact: employee.emergencyContact,
        bankDetails: employee.bankDetails,
        documents: employee.documents,
        leaveBalance: employee.leaveBalance,
        isActive: employee.isActive,
        days: [] // Will be populated when fetched via GET
      });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create employee error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 PUT /api/attendance - Starting...');
    
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

      // Check subscription for attendance tracking
      const subscription = await PaymentService.checkSubscription(decoded.userId);
      if (!subscription.isActive) {
        return NextResponse.json(
          { error: 'Please upgrade your subscription to track attendance' },
          { status: 402 }
        );
      }

      // Parse request body
      let body;
      try {
        body = await request.json();
        console.log('📦 Request body:', JSON.stringify(body, null, 2));
      } catch (parseError) {
        console.error('❌ Error parsing request body:', parseError);
        return NextResponse.json(
          { error: 'Invalid JSON in request body' },
          { status: 400 }
        );
      }

      const { employeeId, date, status, checkIn, checkOut, notes, lateReason } = body;

      console.log('🔄 Processing attendance update:', { employeeId, date, status });

      // Validate required fields
      if (!employeeId || !date || !status) {
        console.log('❌ Missing required fields:', { employeeId, date, status });
        return NextResponse.json(
          { error: 'Employee ID, date, and status are required' },
          { status: 400 }
        );
      }

      // Convert string ID to ObjectId for proper comparison
      let employeeObjectId;
      try {
        employeeObjectId = new mongoose.Types.ObjectId(employeeId);
        console.log('✅ Converted employeeId to ObjectId:', employeeObjectId);
      } catch (error) {
        console.log('⚠️ Using employeeId as string:', employeeId);
        employeeObjectId = employeeId;
      }

      // Get employee details with user validation
      const employee = await Employee.findOne({ 
        _id: employeeObjectId, 
        userId: decoded.userId 
      });
      
      if (!employee) {
        console.log('❌ Employee not found. employeeId:', employeeId, 'userId:', decoded.userId);
        return NextResponse.json(
          { error: 'Employee not found' },
          { status: 404 }
        );
      }

      console.log('✅ Employee found:', employee.name);

      // For simple present/absent toggle, set default times if not provided
      let finalCheckIn = checkIn;
      let finalCheckOut = checkOut;
      
      if (status === 'Present' && !checkIn) {
        finalCheckIn = '09:00';
        finalCheckOut = '18:00';
        console.log('🕒 Using default times for Present status');
      }

      // Calculate work hours if times are provided
      let workHours = 0;
      let overtime = 0;
      
      if (finalCheckIn && finalCheckOut) {
        try {
          const [inHours, inMinutes] = finalCheckIn.split(':').map(Number);
          const [outHours, outMinutes] = finalCheckOut.split(':').map(Number);
          
          const checkInTime = inHours + inMinutes / 60;
          const checkOutTime = outHours + outMinutes / 60;
          
          workHours = Math.max(0, checkOutTime - checkInTime);
          
          if (workHours > 8) {
            overtime = workHours - 8;
          }
          
          console.log('⏰ Calculated work hours:', { workHours, overtime });
        } catch (timeError) {
          console.error('❌ Error calculating work hours:', timeError);
          workHours = 0;
          overtime = 0;
        }
      }

      // Prepare attendance data
      const attendanceData = {
        employeeId: employee._id,
        employeeName: employee.name,
        date,
        checkIn: finalCheckIn,
        checkOut: finalCheckOut,
        status: status === 'Present' ? 'present' : 'absent',
        workHours,
        overtime,
        notes: notes || '',
        lateReason: lateReason || '',
        userId: decoded.userId
      };

      console.log('💾 Saving attendance data:', attendanceData);

      // Update or create attendance record
      const attendance = await Attendance.findOneAndUpdate(
        { 
          employeeId: employee._id, 
          date, 
          userId: decoded.userId 
        },
        attendanceData,
        { 
          upsert: true, 
          new: true,
          runValidators: true 
        }
      );

      console.log('✅ Attendance record saved/updated:', attendance._id);

      return NextResponse.json({ 
        success: true,
        message: 'Attendance updated successfully',
        attendance: {
          date: attendance.date,
          status: attendance.status,
          checkIn: attendance.checkIn,
          checkOut: attendance.checkOut,
          workHours: attendance.workHours,
          overtime: attendance.overtime,
          notes: attendance.notes,
          lateReason: attendance.lateReason
        }
      });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Update attendance error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}