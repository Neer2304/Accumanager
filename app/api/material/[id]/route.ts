import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Material from '@/models/Material';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

// GET - Get single material
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Get user ID from token
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(authToken);
    const userId = decoded.userId;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid material ID' },
        { status: 400 }
      );
    }
    
    const material = await Material.findOne({
      _id: params.id,
      userId
    }).lean();
    
    if (!material) {
      return NextResponse.json(
        { success: false, message: 'Material not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: material
    });
    
  } catch (error: any) {
    console.error('Get material error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update material
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Get user ID from token
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(authToken);
    const userId = decoded.userId;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid material ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Check if SKU is being changed and if it already exists
    if (body.sku) {
      body.sku = body.sku.toUpperCase();
      const existing = await Material.findOne({
        sku: body.sku,
        userId,
        _id: { $ne: params.id }
      });
      
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'SKU already exists' },
          { status: 400 }
        );
      }
    }
    
    // Update material
    const material = await Material.findOneAndUpdate(
      { _id: params.id, userId },
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!material) {
      return NextResponse.json(
        { success: false, message: 'Material not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: material,
      message: 'Material updated successfully'
    });
    
  } catch (error: any) {
    console.error('Update material error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'SKU already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete material
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Get user ID from token
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(authToken);
    const userId = decoded.userId;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid material ID' },
        { status: 400 }
      );
    }
    
    // Delete material
    const material = await Material.findOneAndDelete({
      _id: params.id,
      userId
    });
    
    if (!material) {
      return NextResponse.json(
        { success: false, message: 'Material not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully'
    });
    
  } catch (error: any) {
    console.error('Delete material error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}