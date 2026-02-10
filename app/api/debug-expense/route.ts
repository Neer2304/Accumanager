import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG ENDPOINT CALLED ===');
    
    await connectToDatabase();
    
    // List ALL collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Try to find the exact expense
    const expenseId = '698ae975d01c96ec08b02feb';
    
    // Check in SimpleExpense collection
    const SimpleExpense = mongoose.models.SimpleExpense || 
      mongoose.model('SimpleExpense', new mongoose.Schema({}, { strict: false }));
    
    const expense = await SimpleExpense.findById(expenseId).lean();
    
    console.log('Expense found:', expense);
    
    if (expense) {
      console.log('Expense details:');
      console.log('  _id:', expense._id);
      console.log('  _id type:', typeof expense._id);
      console.log('  _id constructor:', expense._id?.constructor?.name);
      console.log('  userId:', expense.userId);
      console.log('  userId type:', typeof expense.userId);
    } else {
      // Check all collections
      for (const collection of collections) {
        const col = mongoose.connection.collection(collection.name);
        const doc = await col.findOne({ _id: new mongoose.Types.ObjectId(expenseId) });
        if (doc) {
          console.log(`Found in collection ${collection.name}:`, doc);
          break;
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      expense: expense || null,
      message: expense ? 'Expense found' : 'Expense not found in any collection'
    });
    
  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('=== DEBUG DELETE ===');
    
    await connectToDatabase();
    
    const expenseId = '698ae975d01c96ec08b02feb';
    
    // Try direct MongoDB query
    const db = mongoose.connection.db;
    const result = await db.collection('simpleexpenses').deleteOne({ 
      _id: new mongoose.Types.ObjectId(expenseId) 
    });
    
    console.log('Direct MongoDB delete result:', result);
    
    return NextResponse.json({
      success: result.deletedCount > 0,
      deletedCount: result.deletedCount,
      message: result.deletedCount > 0 ? 'Deleted' : 'Not found'
    });
    
  } catch (error: any) {
    console.error('Debug delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}