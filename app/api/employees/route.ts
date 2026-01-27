import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { verifyToken } from '@/lib/jwt';
import { PaymentService } from '@/services/paymentService';

// GET - Get all employees with filters
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Check subscription
      const subscription = await PaymentService.checkSubscription(decoded.userId);
      
      if (!subscription.isActive) {
        return NextResponse.json(
          { error: 'Please upgrade your subscription to access employee management' },
          { status: 402 }
        );
      }

      // Parse query parameters
      const { searchParams } = new URL(request.url);
      const search = searchParams.get('search') || '';
      const department = searchParams.get('department') || '';
      const role = searchParams.get('role') || '';
      const isActive = searchParams.get('isActive');
      const sortBy = searchParams.get('sortBy') || 'name';
      const sortOrder = searchParams.get('sortOrder') || 'asc';
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');

      // Build filter
      const filter: any = { userId: decoded.userId };
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }
      
      if (department) {
        filter.department = department;
      }
      
      if (role) {
        filter.role = role;
      }
      
      if (isActive && isActive !== 'all') {
        filter.isActive = isActive === 'true';
      }

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Get total count for pagination
      const total = await Employee.countDocuments(filter);

      // Get employees with pagination
      const employees = await Employee.find(filter)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Check employee limit
      if (employees.length >= subscription.limits.employees) {
        return NextResponse.json(
          { error: `Employee limit reached. Please upgrade to add more employees. Current limit: ${subscription.limits.employees}` },
          { status: 402 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          employees,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Get employees error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new employee
export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Check subscription
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

      const body = await request.json();
      
      // Validate required fields
      if (!body.name || !body.phone) {
        return NextResponse.json(
          { error: 'Name and phone are required' },
          { status: 400 }
        );
      }

      // Validate phone number
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(body.phone.replace(/\D/g, ''))) {
        return NextResponse.json(
          { error: 'Please enter a valid 10-digit phone number' },
          { status: 400 }
        );
      }

      // Validate email if provided
      if (body.email && !/\S+@\S+\.\S+/.test(body.email)) {
        return NextResponse.json(
          { error: 'Please enter a valid email address' },
          { status: 400 }
        );
      }

      // Check if employee with same phone already exists
      const existingEmployee = await Employee.findOne({ 
        phone: body.phone, 
        userId: decoded.userId 
      });
      
      if (existingEmployee) {
        return NextResponse.json(
          { error: 'Employee with this phone number already exists' },
          { status: 400 }
        );
      }

      // Create new employee
      const employee = new Employee({
        ...body,
        userId: decoded.userId,
        leaveBalance: 12, // Default leave balance
        isActive: true,
      });

      await employee.save();

      return NextResponse.json({
        success: true,
        data: employee,
        message: 'Employee created successfully',
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Create employee error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}