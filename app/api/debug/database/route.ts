// app/api/debug/database/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DATABASE DEBUG START ===');
    
    // Connect to database
    await connectToDatabase();
    
    // Get database info
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    // Get materials collection stats
    let materialsCount = 0;
    let materialsSample = [];
    
    try {
      const materialsCollection = db.collection('materials');
      materialsCount = await materialsCollection.countDocuments();
      materialsSample = await materialsCollection.find({}).limit(5).toArray();
    } catch (error) {
      console.log('Materials collection error:', error);
    }
    
    console.log('=== DATABASE DEBUG INFO ===');
    console.log('Database name:', db.databaseName);
    console.log('Collections:', collections.map(c => c.name));
    console.log('Materials count:', materialsCount);
    console.log('Materials sample:', JSON.stringify(materialsSample, null, 2));
    
    return NextResponse.json({
      success: true,
      data: {
        database: db.databaseName,
        collections: collections.map(c => c.name),
        materialsCount,
        materialsSample: materialsSample.map(m => ({
          _id: m._id,
          name: m.name,
          userId: m.userId,
          sku: m.sku
        }))
      }
    });
    
  } catch (error: any) {
    console.error('Database debug error:', error);
    return NextResponse.json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
}