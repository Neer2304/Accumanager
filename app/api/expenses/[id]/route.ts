import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Expense from '@/models/Expense';
import { verifyToken } from '@/lib/jwt';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PUT Expense API called for ID:', params.id);
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('No auth token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    console.log('User ID:', decoded.userId);
    
    await connectToDatabase();
    console.log('Connected to database');

    const expenseId = params.id;
    const updateData = await request.json();
    
    console.log('Update data:', JSON.stringify(updateData, null, 2));

    // Find expense and verify ownership
    const expense = await Expense.findOne({ 
      _id: expenseId, 
      userId: decoded.userId 
    });

    if (!expense) {
      console.log('Expense not found or not owned by user');
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Clean update data
    const cleanedUpdateData: any = { ...updateData };
    
    // Handle recurrence based on isRecurring
    if (cleanedUpdateData.isRecurring !== undefined) {
      if (cleanedUpdateData.isRecurring) {
        cleanedUpdateData.recurrence = cleanedUpdateData.recurrence || 'monthly';
      } else {
        cleanedUpdateData.recurrence = null;
      }
    }
    
    // Handle vendor data
    if (cleanedUpdateData.isBusinessExpense && cleanedUpdateData.vendor) {
      cleanedUpdateData.vendor = {
        name: cleanedUpdateData.vendor.name?.trim() || '',
        gstin: cleanedUpdateData.vendor.gstin?.trim() || '',
        contact: cleanedUpdateData.vendor.contact?.trim() || ''
      };
    } else if (!cleanedUpdateData.isBusinessExpense) {
      cleanedUpdateData.vendor = undefined;
    }
    
    // Convert date if present
    if (cleanedUpdateData.date) {
      cleanedUpdateData.date = new Date(cleanedUpdateData.date);
    }

    // Update expense
    Object.assign(expense, cleanedUpdateData);
    await expense.save();

    console.log('Expense updated successfully');

    return NextResponse.json({
      ...expense.toObject(),
      _id: expense._id.toString()
    });

  } catch (error: any) {
    console.error('Update expense error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      console.error('Validation errors:', errors);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    console.error('Server error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to update expense' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('DELETE Expense API called for ID:', params.id);
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('No auth token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    console.log('User ID:', decoded.userId);
    
    await connectToDatabase();
    console.log('Connected to database');

    const expenseId = params.id;

    const expense = await Expense.findOneAndDelete({ 
      _id: expenseId, 
      userId: decoded.userId 
    });

    if (!expense) {
      console.log('Expense not found or not owned by user');
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    console.log('Expense deleted successfully');
    
    return NextResponse.json({ 
      message: 'Expense deleted successfully',
      deletedExpense: {
        ...expense.toObject(),
        _id: expense._id.toString()
      }
    });

  } catch (error: any) {
    console.error('Delete expense error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete expense' },
      { status: 500 }
    );
  }
}