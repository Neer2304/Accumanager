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
    const { materialId, quantity, project, note, usedBy } = body;
    
    // Validate input
    if (!materialId || !quantity || quantity <= 0 || !usedBy) {
      return NextResponse.json(
        { success: false, message: 'Material ID, quantity, and usedBy are required' },
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
    
    // Check if enough stock is available
    if (material.currentStock < quantity) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Insufficient stock. Available: ${material.currentStock} ${material.unit}` 
        },
        { status: 400 }
      );
    }
    
    // Calculate cost
    const cost = quantity * material.unitCost;
    
    // Update material
    material.currentStock -= quantity;
    material.totalQuantityUsed += quantity;
    material.totalValue = material.currentStock * material.unitCost;
    material.lastUsed = new Date();
    
    // Update status based on new stock level
    if (material.currentStock === 0) {
      material.status = 'out-of-stock';
    } else if (material.currentStock <= material.minimumStock) {
      material.status = 'low-stock';
    } else {
      material.status = 'in-stock';
    }
    
    // Calculate average monthly usage (simplified - in real app, track actual monthly usage)
    const daysSinceCreation = Math.max(1, (Date.now() - new Date(material.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    material.averageMonthlyUsage = (material.totalQuantityUsed / daysSinceCreation) * 30;
    
    // Add to usage history
    material.usageHistory.push({
      quantity,
      usedBy,
      project,
      note,
      usedAt: new Date(),
      cost,
    });
    
    await material.save();
    
    return NextResponse.json({
      success: true,
      data: material,
      message: `Used ${quantity} ${material.unit} of ${material.name}`
    });
    
  } catch (error: any) {
    console.error('Use material error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}