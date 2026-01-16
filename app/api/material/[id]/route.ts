import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Material, { IMaterial } from '@/models/Material';
import { verifyToken } from '@/lib/jwt';
import mongoose, { Types } from 'mongoose';

// GET - Get single material
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    console.log('🔍 GET /api/material/[id] - Starting...');
    
    // Get user ID from token
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      console.log('⚠️ No auth token found');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(authToken);
    const userId = decoded.userId;
    const { id: materialId } = await params;
    
    console.log('👤 User ID:', userId);
    console.log('🎯 Material ID:', materialId);
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(materialId)) {
      console.log('❌ Invalid ObjectId format:', materialId);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid material ID format',
          debug: { materialId, userId }
        },
        { status: 400 }
      );
    }
    
    // Try to find the material using Mongoose
    console.log('📊 Querying database...');
    
    // Method 1: Using Mongoose findOne with proper ObjectId
    const material = await Material.findOne({
      _id: new mongoose.Types.ObjectId(materialId),
      userId: userId
    });
    
    // If not found, try alternative methods
    if (!material) {
      console.log('❌ Material not found with direct query');
      
      // Method 2: Try with string comparison
      const allMaterials = await Material.find({ userId: userId });
      console.log(`📦 Found ${allMaterials.length} materials for user`);
      
      const foundMaterial = allMaterials.find(mat => 
        String(mat._id) === String(materialId) ||
        mat._id.equals(new mongoose.Types.ObjectId(materialId))
      );
      
      if (foundMaterial) {
        console.log('✅ Material found using alternative method');
        return NextResponse.json({
          success: true,
          data: foundMaterial
        });
      }
      
      // Method 3: Debug - Log all material IDs for this user
      console.log('📋 User material IDs:');
      allMaterials.forEach((mat, index) => {
        console.log(`  ${index + 1}. ${mat._id} (${mat.name})`);
      });
      
      console.log('❌ Material not found in user collection');
      return NextResponse.json({
        success: false,
        message: 'Material not found',
        debug: {
          materialId,
          userId,
          note: 'Material ID exists but user ID might not match',
          userMaterialCount: allMaterials.length,
          searchedId: materialId
        }
      }, { status: 404 });
    }
    
    console.log(`✅ Found material: ${material.name}`);
    
    return NextResponse.json({
      success: true,
      data: material
    });
    
  } catch (error: any) {
    console.error('❌ Get material error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update material
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id: materialId } = await params;
    
    const body = await request.json();
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(materialId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid material ID format' },
        { status: 400 }
      );
    }
    
    // Check if SKU is being changed and if it already exists
    if (body.sku) {
      body.sku = body.sku.toUpperCase();
      const existing = await Material.findOne({
        sku: body.sku,
        userId,
        _id: { $ne: new mongoose.Types.ObjectId(materialId) }
      });
      
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'SKU already exists' },
          { status: 400 }
        );
      }
    }
    
    // Update material
    const updatedMaterial = await Material.findOneAndUpdate(
      { 
        _id: new mongoose.Types.ObjectId(materialId), 
        userId 
      },
      { $set: body },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );
    
    if (!updatedMaterial) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Material not found or access denied',
          debug: { materialId, userId }
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedMaterial,
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
  { params }: { params: Promise<{ id: string }> }
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
    const { id: materialId } = await params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(materialId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid material ID format' },
        { status: 400 }
      );
    }
    
    // Delete material
    const deletedMaterial = await Material.findOneAndDelete({ 
      _id: new mongoose.Types.ObjectId(materialId), 
      userId 
    });
    
    if (!deletedMaterial) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Material not found or access denied',
          debug: { materialId, userId }
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully',
      data: { id: materialId }
    });
    
  } catch (error: any) {
    console.error('Delete material error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}