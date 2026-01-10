// app/api/debug/db/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose from 'mongoose'

export async function GET() {
  try {
    await connectToDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      connectionState: mongoose.connection.readyState,
      dbName: mongoose.connection.db?.databaseName,
      models: Object.keys(mongoose.models)
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    }, { status: 500 });
  }
}