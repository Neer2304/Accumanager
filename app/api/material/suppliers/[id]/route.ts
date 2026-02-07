import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Material from '@/models/Material';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

// GET - Get single supplier details
export async function GET(
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
    const { id: supplierName } = await params;
    
    // Decode URL parameter
    const decodedSupplierName = decodeURIComponent(supplierName);
    
    // Find all materials from this supplier
    const materials = await Material.find({
      userId,
      supplierName: { $regex: new RegExp(`^${decodedSupplierName}$`, 'i') }
    });
    
    if (materials.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Supplier not found' },
        { status: 404 }
      );
    }
    
    // Calculate supplier statistics
    const supplierData: any = {
      _id: `supplier_${Date.now()}`,
      name: materials[0].supplierName,
      contactPerson: materials[0].supplierContact || 'Not specified',
      email: '',
      phone: materials[0].supplierContact || 'Not specified',
      address: 'Not specified',
      website: '',
      status: 'active',
      rating: 4.5,
      totalOrders: 0,
      totalSpent: 0,
      leadTime: materials[0].leadTime || 0,
      paymentTerms: 'Net 30',
      materialsSupplied: [] as string[],
      notes: 'Automatically generated from material data',
      lastOrderDate: new Date(),
      createdAt: materials[0].createdAt,
      updatedAt: materials[0].updatedAt,
      supplierCode: materials[0].supplierCode || '',
      averageMonthlyUsage: 0,
      lowStockAlert: true,
      batchNumber: materials[0].batchNumber || '',
      storageLocation: materials[0].storageLocation || '',
      shelf: materials[0].shelf || '',
      bin: materials[0].bin || '',
      currentStock: 0,
      totalValue: 0,
      description: '',
      category: '',
      sku: '',
      totalQuantityUsed: 0,
      unitCost: 0,
      // Detailed material list
      materials: [] as any[],
      // Performance metrics
      performance: {
        onTimeDelivery: 95,
        qualityScore: 4.2,
        responseTime: 2.5,
      }
    };
    
    // Calculate statistics from all materials
    materials.forEach((material: any) => {
      // Add to materials supplied list
      if (material.sku) {
        supplierData.materialsSupplied.push(material.sku);
      }
      
      // Calculate totals
      supplierData.currentStock += material.currentStock || 0;
      supplierData.totalValue += material.totalValue || 0;
      supplierData.totalSpent += (material.totalQuantityAdded || 0) * (material.unitCost || 0);
      supplierData.totalOrders += material.restockHistory?.length || 0;
      supplierData.totalQuantityUsed += material.totalQuantityUsed || 0;
      supplierData.averageMonthlyUsage += material.averageMonthlyUsage || 0;
      
      // Add to detailed materials list
      supplierData.materials.push({
        _id: material._id,
        name: material.name,
        sku: material.sku,
        category: material.category,
        currentStock: material.currentStock,
        unit: material.unit,
        unitCost: material.unitCost,
        totalValue: material.totalValue,
        status: material.status,
        minimumStock: material.minimumStock,
        reorderPoint: material.reorderPoint,
        lastRestocked: material.lastRestocked,
        lastUsed: material.lastUsed,
      });
      
      // Update last order date
      if (material.restockHistory && material.restockHistory.length > 0) {
        const lastRestock = material.restockHistory[material.restockHistory.length - 1];
        if (lastRestock.restockedAt) {
          const restockDate = new Date(lastRestock.restockedAt);
          if (!supplierData.lastOrderDate || restockDate > new Date(supplierData.lastOrderDate)) {
            supplierData.lastOrderDate = restockDate;
          }
        }
      }
    });
    
    // Calculate average values
    if (materials.length > 0) {
      supplierData.averageMonthlyUsage = Math.round(supplierData.averageMonthlyUsage / materials.length);
    }
    
    return NextResponse.json({
      success: true,
      data: supplierData,
    });
    
  } catch (error: any) {
    console.error('Get supplier error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete supplier (removes supplier info from all materials)
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
    const { id: supplierName } = await params;
    
    // Decode URL parameter
    const decodedSupplierName = decodeURIComponent(supplierName);
    
    // Remove supplier info from all materials
    const result = await Material.updateMany(
      {
        userId,
        supplierName: { $regex: new RegExp(`^${decodedSupplierName}$`, 'i') }
      },
      {
        $unset: {
          supplierName: "",
          supplierCode: "",
          supplierContact: "",
          leadTime: "",
        }
      }
    );
    
    return NextResponse.json({
      success: true,
      data: {
        message: `Supplier removed from ${result.modifiedCount} materials`,
        modifiedCount: result.modifiedCount,
      },
    });
    
  } catch (error: any) {
    console.error('Delete supplier error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}