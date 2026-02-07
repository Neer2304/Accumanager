import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Material from '@/models/Material';
import { verifyToken } from '@/lib/jwt';

// GET - Get all suppliers activity history
export async function GET(request: NextRequest) {
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
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const supplierName = searchParams.get('supplier') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build filter for materials
    const filter: any = { userId };
    
    if (supplierName) {
      filter.supplierName = { $regex: new RegExp(supplierName, 'i') };
    }
    
    // Get all materials with the filter
    const materials = await Material.find(filter).lean();
    
    // Collect all activity from restock history
    let allActivity: any[] = [];
    
    materials.forEach(material => {
      // Add restock activities
      if (material.restockHistory && Array.isArray(material.restockHistory)) {
        material.restockHistory.forEach((restock: any) => {
          allActivity.push({
            type: 'restock',
            id: `restock_${restock._id || Date.now()}_${material._id}`,
            date: restock.restockedAt,
            materialId: material._id,
            materialName: material.name,
            materialSku: material.sku,
            supplierName: material.supplierName || 'Unknown',
            supplierCode: material.supplierCode || '',
            quantity: restock.quantity,
            unit: material.unit,
            unitCost: restock.unitCost || 0,
            totalCost: restock.totalCost || 0,
            purchaseOrder: restock.purchaseOrder || 'N/A',
            note: restock.note || '',
            status: 'completed',
            icon: 'LocalShipping',
            color: '#34a853',
            details: `Restocked ${restock.quantity} ${material.unit} of ${material.name}`
          });
        });
      }
      
      // Add usage activities (optional - if you want to include usage)
      if (material.usageHistory && Array.isArray(material.usageHistory)) {
        material.usageHistory.forEach((usage: any) => {
          allActivity.push({
            type: 'usage',
            id: `usage_${usage._id || Date.now()}_${material._id}`,
            date: usage.usedAt,
            materialId: material._id,
            materialName: material.name,
            materialSku: material.sku,
            supplierName: material.supplierName || 'N/A',
            quantity: usage.quantity,
            unit: material.unit,
            user: usage.usedBy,
            project: usage.project || 'N/A',
            cost: usage.cost || 0,
            note: usage.note || '',
            status: 'completed',
            icon: 'Inventory',
            color: '#ea4335',
            details: `Used ${usage.quantity} ${material.unit} of ${material.name} for ${usage.project || 'project'}`
          });
        });
      }
    });
    
    // Sort by date (newest first)
    allActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Apply date filters
    if (startDate) {
      const start = new Date(startDate);
      allActivity = allActivity.filter(item => new Date(item.date) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      allActivity = allActivity.filter(item => new Date(item.date) <= end);
    }
    
    // Group by supplier for summary
    const supplierSummary: Record<string, any> = {};
    
    allActivity.forEach(activity => {
      if (activity.supplierName && activity.supplierName !== 'N/A') {
        if (!supplierSummary[activity.supplierName]) {
          supplierSummary[activity.supplierName] = {
            name: activity.supplierName,
            supplierCode: activity.supplierCode,
            totalRestocks: 0,
            totalQuantity: 0,
            totalCost: 0,
            lastActivity: activity.date,
            materialsSupplied: new Set<string>(),
          };
        }
        
        const supplier = supplierSummary[activity.supplierName];
        
        if (activity.type === 'restock') {
          supplier.totalRestocks += 1;
          supplier.totalQuantity += activity.quantity;
          supplier.totalCost += activity.totalCost;
        }
        
        supplier.materialsSupplied.add(activity.materialName);
        supplier.lastActivity = activity.date > supplier.lastActivity ? activity.date : supplier.lastActivity;
      }
    });
    
    // Convert Set to Array for JSON serialization
    Object.keys(supplierSummary).forEach(key => {
      supplierSummary[key].materialsSupplied = Array.from(supplierSummary[key].materialsSupplied);
    });
    
    // Apply limit
    const limitedActivity = allActivity.slice(0, limit);
    
    // Calculate overall statistics
    const totalRestocks = limitedActivity.filter(a => a.type === 'restock').length;
    const totalRestockQuantity = limitedActivity
      .filter(a => a.type === 'restock')
      .reduce((sum, a) => sum + a.quantity, 0);
    const totalRestockCost = limitedActivity
      .filter(a => a.type === 'restock')
      .reduce((sum, a) => sum + a.totalCost, 0);
    
    return NextResponse.json({
      success: true,
      data: {
        activity: limitedActivity,
        supplierSummary: Object.values(supplierSummary),
        statistics: {
          totalActivities: limitedActivity.length,
          totalRestocks,
          totalRestockQuantity,
          totalRestockCost,
          averageRestockCost: totalRestocks > 0 ? totalRestockCost / totalRestocks : 0,
          uniqueSuppliers: Object.keys(supplierSummary).length,
        },
        pagination: {
          limit,
          total: allActivity.length,
          page: 1,
          pages: Math.ceil(allActivity.length / limit),
        },
      },
    });
    
  } catch (error: any) {
    console.error('Get suppliers history error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}