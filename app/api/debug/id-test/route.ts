// app/api/debug/id-test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const db = mongoose.connection.db;
    const materialsCollection = db.collection('materials');
    
    // Get your material
    const material = await materialsCollection.findOne({ 
      _id: "6969cc97ceb35bbe3eb5fce6" 
    });
    
    if (!material) {
      return NextResponse.json({
        success: false,
        message: 'Material not found'
      });
    }
    
    // Analyze the _id
    const idAnalysis = {
      _id: material._id,
      _idType: typeof material._id,
      _idConstructor: material._id?.constructor?.name,
      _idToString: material._id?.toString(),
      _idJSON: JSON.stringify(material._id),
      isObjectId: material._id instanceof mongoose.Types.ObjectId,
      isString: typeof material._id === 'string',
      isNumber: typeof material._id === 'number',
      _idValueOf: material._id?.valueOf?.(),
      _idHexString: material._id?.toHexString?.() || 'No toHexString method'
    };
    
    // Also check userId
    const userIdAnalysis = {
      userId: material.userId,
      userIdType: typeof material.userId,
      userIdConstructor: material.userId?.constructor?.name,
      userIdToString: material.userId?.toString()
    };
    
    return NextResponse.json({
      success: true,
      data: {
        material: {
          _id: material._id,
          name: material.name,
          sku: material.sku
        },
        idAnalysis,
        userIdAnalysis
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message
    });
  }
}