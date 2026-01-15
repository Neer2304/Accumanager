import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Material from '@/models/Material';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
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
    
    // Parse request body
    const body = await request.json();
    const { materialId, quantity, supplier, purchaseOrder, unitCost, note } = body;
    
    // Validate input
    if (!materialId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, message: 'Material ID and valid quantity are required' },
        { status: 400 }
      );
    }
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(materialId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid material ID' },
        { status: 400 }
      );
    }
    
    // Find material
    const material = await Material.findOne({
      _id: materialId,
      userId
    });
    
    if (!material) {
      return NextResponse.json(
        { success: false, message: 'Material not found' },
        { status: 404 }
      );
    }
    
    // Use provided unit cost or existing
    const restockUnitCost = unitCost || material.unitCost;
    const totalCost = quantity * restockUnitCost;
    
    // Update material
    material.currentStock += quantity;
    material.totalQuantityAdded += quantity;
    material.unitCost = restockUnitCost; // Update unit cost if provided
    material.lastRestocked = new Date();
    
    // Add to restock history
    material.restockHistory.push({
      quantity,
      supplier,
      purchaseOrder,
      unitCost: restockUnitCost,
      totalCost,
      note,
      restockedAt: new Date()
    });
    
    await material.save();
    
    return NextResponse.json({
      success: true,
      data: material,
      message: `Restocked ${quantity} ${material.unit} of ${material.name}`
    });
    
  } catch (error: any) {
    console.error('Restock material error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}