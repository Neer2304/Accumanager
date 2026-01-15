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
    const userName = decoded.name || 'System';
    
    // Parse request body
    const body = await request.json();
    const { materialId, quantity, project, note } = body;
    
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
    
    // Check if enough stock
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
    material.lastUsed = new Date();
    
    // Add to usage history
    material.usageHistory.push({
      quantity,
      usedBy: userName,
      project,
      note,
      usedAt: new Date(),
      cost
    });
    
    // Recalculate average monthly usage (simplified)
    const daysSinceFirstUse = (material.usageHistory.length > 1) 
      ? (new Date().getTime() - new Date(material.usageHistory[0].usedAt).getTime()) / (1000 * 60 * 60 * 24)
      : 30;
    
    if (daysSinceFirstUse > 0) {
      material.averageMonthlyUsage = (material.totalQuantityUsed / daysSinceFirstUse) * 30;
    }
    
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